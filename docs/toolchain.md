# Toolchain & Versionen — Inventar und Regelwerk

Ziel: **Jede Version hat genau eine Quelle.** Dieses Dokument ist die Landkarte dafür —
es sagt, *wo* welche Version gepflegt wird und *warum* sie nicht woanders hingehört.

Stand: 2026-10-24

## 1. Drei Schichten — was gehört wohin

| Schicht | Was | Quelle der Wahrheit | `.mise.toml`? |
|---|---|---|---|
| **L1 Toolchain** | Programme, mit denen *gebaut und getestet* wird (Node, npm, JDK, Maven) | `.mise.toml` (lokal) + `*-version-file` in CI | **ja** |
| **L2 App-Dependencies** | Bibliotheken im Code (Spring Boot, React, Vite, Playwright, Testcontainers) | `pom.xml`, `package.json` + Lockfiles | nein |
| **L3 Laufzeit-Infrastruktur** | Container-Images, Host-Dienste, Runner-Images | `Dockerfile`, `docker-compose*.yml`, Workflow-Labels | nein |

Faustregel: **Was du lokal aufrufst, gehört in L1. Was ein Container oder Host startet,
gehört in L3.** Docker/Podman ist ein Host-Dienst und damit L3 — nicht L1 (siehe §4).

## 2. L1 — Toolchain (`.mise.toml`)

```toml
[tools]
node = "22"
```

| Tool | Version | Gepflegt in | Status |
|---|---|---|---|
| Node.js | 22 (`22.23.3` installiert) | `.mise.toml` | OK — lokal *und* CI (seit `setup-node@v7` mit `node-version-file: .mise.toml`) |
| npm | folgt Node (lokal `10.9.9`) | implizit | OK, nicht separat pinnen |
| JDK | **Policy `>= 21`**, Ziel-Bytecode 21 | `pom.xml` (`<release>21</release>`), CI `java-version: 21` | bewusste Nicht-Pinnung, siehe §5/D2 |
| Maven | `3.9.12` | `backend/.mvn/wrapper/maven-wrapper.properties` | OK — Maven Wrapper *ist* der Pin, kein Eintrag in `.mise.toml` nötig |

Aktive lokale Defaults dieser Maschine (Omarchy, global via mise):
`node = "latest"` → `26.12.0`. Das Projekt überschreibt das bewusst mit `22`.
Priorität: system (`/etc/mise`) → global (`~/.config/mise`) → **lokal (Projekt)**.

## 3. L2 — App-Dependencies (nur Lockfile-Pflege, nicht mise)

| Bereich | Version | Quelle |
|---|---|---|
| Spring Boot | `3.4.3` | `backend/pom.xml` (Parent) |
| Lombok / MapStruct | `1.18.48` / `1.6.3` | `backend/pom.xml` Properties |
| JJWT | `0.12.6` | `backend/pom.xml` |
| Testcontainers | `1.21.4` | `backend/pom.xml` |
| Flyway | vom Spring-Boot-BOM verwaltet | `backend/pom.xml` |
| React / Vite / TypeScript | `19.2` / `8.0.0-beta.13` / `~5.9.3` | `frontend/package.json` |
| Playwright | `1.64.1` (Browser: Chromium 156 / rev 1248) | `frontend/package.json` + `package-lock.json` |

Regel: Upgrades laufen über `npm install` / `pom.xml`, **nie** über `.mise.toml`.
Playwright-Browser-Revisionen sind über das Lockfile gepinnt — `npm ci` reproduziert sie.

## 4. L3 — Laufzeit-Infrastruktur

### Container-Images

| Image | Tag | Datei | Status |
|---|---|---|---|
| `eclipse-temurin:21-jdk-jammy` | minor-fixiert | `backend/Dockerfile:2` | OK (drifting innerhalb 21) |
| `eclipse-temurin:21-jre-jammy` | minor-fixiert | `backend/Dockerfile:15` | OK |
| `graalvm/native-image-community:21-ol9` | minor-fixiert | `backend/Dockerfile.native:2` | OK |
| `oraclelinux:9-slim` | major-fixiert | `backend/Dockerfile.native:17` | OK |
| `postgres:16-alpine` (dev/prod) | major-fixiert | `docker-compose.yml:3`, `docker-compose.prod.yml:3` | OK, Patch driftet |
| `postgres:16-alpine` (Tests) | major-fixiert | `AbstractIntegrationTest.java:14` | OK, identisch zu dev/prod |
| `node:22-alpine` | major-fixiert | `frontend/Dockerfile:2` | OK — auf 22 korrigiert (war 20) |
| **`nginx:alpine`** | **gleitend (kein Versions-Tag)** | `frontend/Dockerfile:10` | **ungesteuert** (siehe D3) |
| `victoriametrics/victoria-metrics:v1.112.0` | exakt | `docker-compose.prod.yml:48` | OK |
| `victoriametrics/vmagent:v1.112.0` | exakt | `docker-compose.prod.yml:62` | OK |
| `grafana/loki:3.2.1`, `grafana/promtail:3.2.1` | exakt | `docker-compose.prod.yml:77,87` | OK |
| `prom/node-exporter:v1.8.2` | exakt | `docker-compose.prod.yml:102` | OK |
| `prometheuscommunity/postgres-exporter:v0.15.0` | exakt | `docker-compose.prod.yml:117` | OK |
| `grafana/grafana-oss:11.2.0` | exakt | `docker-compose.prod.yml:127` | OK |

### Host-Dienste (nicht im Repo pinnbar)

| Dienst | Version | Ort | Bewertung |
|---|---|---|---|
| Podman (lokal) | Host-Version (Omarchy/Arch) | System | **nicht** in `.mise.toml` pinnen (siehe unten) |
| Podman (Produktion) | Debian 12 Host-Paket | VPS | Host-Verantwortung |
| Runner-Image | `ubuntu-latest` | `ci-tests.yml`, `deploy.yml` | gleitend — GitHub-Rollout 24.04 → 26.04 (bis 2026-11-19) |

**Warum Docker/Podman nicht in `.mise.toml` gehört:** Podman ist ein rootless
Systemdienst (systemd-User-Socket, `podman.socket`, `journald`-Logging, UID-Mapping).
Eine zweite, mise-verwaltete Installation daneben würde gegen den System-Socket laufen
und Testcontainers/Compose unzuverlässig machen. Die Toolchain kann den Container-Stack
nicht sinnvoll ersetzen — sie kann ihn nur *voraussetzen*. Richtig ist:
Mindestversion dokumentieren + Preflight-Check, nicht pinnen.

## 5. Offene Entscheidungen

| # | Frage | Empfehlung |
|---|---|---|
| ~~**D1**~~ | `frontend/Dockerfile` baute mit Node 20 | **erledigt** → `node:22-alpine` |
| **D2** | JDK pinnen? | **Nein, Policy behalten** (`>= 21`, Bytecode 21). Wer Verstöße hart brechen will: `maven-enforcer-plugin` mit `requireJavaVersion [21,)` — nicht mise |
| **D3** | `nginx:alpine` ohne Version | **pinnen** → `nginx:1.30-alpine` (stable-Linie, Stand 2026-10: 1.30.6). `alpine` zeigt derzeit auf 1.31 (mainline) und springt künftig über Majors. Nur **eine** Stelle: `frontend/Dockerfile:10`. Host-Nginx (`scripts/`) ist davon unabhängig |
| **D4** | `ubuntu-latest` in CI | optional auf `ubuntu-26.04` pinnen, sobald das Label in der Runner-Gruppe verfügbar ist |
| **D5** | Patch-Tags der Postgres-/Temurin-Images | optional auf Digest pinnen (max. Reproduzierbarkeit, dafür manuelles Update) |

## 6. Bewusste Nicht-Entscheidungen

Diese Punkte wurden diskutiert und **verworfen** — bitte nicht ohne neue Fakten erneut aufrollen:

* **Kein `ARG NODE_VERSION`** im Dockerfile. Die `FROM`-Zeile bleibt lesbar und grep-bar
  (`node:22-alpine`). Node steht damit an genau zwei Stellen (`.mise.toml` für L1,
  `frontend/Dockerfile` für L3); dieses Inventar ist der Abgleich dafür.
* **Kein Prüfskript / pre-commit-Hook** für Versions-Drift. Bei einer aktiv gepflegten
  Version rechtfertigt der Aufwand kein eigenes Gate; Drift fällt beim nächsten Image-Build
  oder über diese Tabelle auf.
* **Kein Image-Bot** (Renovate/Dependabot) aktiviert — optional, siehe D3/D5.
* **Kein Docker-/Podman-Pin** in `.mise.toml`, siehe §4.
