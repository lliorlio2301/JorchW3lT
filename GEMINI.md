# Gemini Interaktions-Richtlinien (Projekt: Personal Portfolio)

## 1. Kommunikation & Stil
* **Sprache:** Erklärungen und Konzepte standardmäßig auf **Deutsch**.
* **Technischer Kontext:** Code-Beispiele, API-Definitionen, Fehlermeldungen und technisches Feedback konsequent auf **Englisch**.
* **Stil:** Präzise, lösungsorientiert und direkt (Senior Software Engineer Level).
* **Git-Workflow:** Nach jeder größeren Änderung am Code muss dieser in **kleinen, sinnvollen und logischen Gruppen** committet und gepusht werden. Jede Änderungseinheit sollte in sich abgeschlossen sein (z.B. Backend-Security und Frontend-Service Anpassung getrennt von UI-Änderungen).

## 2. Tech-Stack & Architektur
* **Architektur:** Streng entkoppelter Stack. Kommunikation via REST-API.
* **Backend:** Spring Boot 3 (Java 21, Maven), Spring Data JPA, H2 (Local Dev) / PostgreSQL (Test/Prod), Flyway Migrations, MapStruct, Lombok.
* **Frontend:** React 19 (Vite), TypeScript, Axios, i18next.
* **Design-System:** "Playful Chaos" / "Neo-Dada" – Handschriftliche Typografie für Headlines, warme Canvas-Farben im Light Mode, unregelmäßige Formen und absichtliche Imperfektion (Drehungen).

## 3. Infrastruktur & Lokale Umgebung (Kritisch)
* **Container:** Es wird **Podman** (Rootless) statt Docker verwendet.
* **Testcontainers:** Damit Integrationstests laufen, müssen folgende Umgebungsvariablen gesetzt sein:
    * `DOCKER_HOST=unix:///run/user/1000/podman/podman.sock`
    * `TESTCONTAINERS_RYUK_DISABLED=true`
    * `TESTCONTAINERS_DOCKER_SOCKET_OVERRIDE=/run/user/1000/podman/podman.sock`

## 4. Backend-Konventionen & Fixes
* **Flyway vs JPA:** `spring.jpa.defer-datasource-initialization=false` ist zwingend erforderlich, um Circular Dependencies beim Start zu verhindern.
* **i18n:** Lokalisierung erfolgt im Mapper via `@Context String locale`. Die Sprache wird vom Frontend im `Accept-Language` Header geliefert.
* **JPA Fetching:** Relationen in Kern-Entitäten (z. B. `Resume`) nutzen `FetchType.EAGER`, um `LazyInitializationException` beim DTO-Mapping außerhalb von Transaktionen zu vermeiden.
* **Testing-Mandat:** Für alle **relevanten und wichtigen Code-Teile** müssen automatisierte Tests erstellt werden. Dazu gehören insbesondere:
    * **Security-Logik:** Verifizierung von Zugriffsbeschränkungen (`@PreAuthorize`).
    * **Komplexe Datenmodelle:** Mapping und Persistierung von Parent-Child-Beziehungen (z.B. `Note` -> `NoteItems`).
    * **Zentrale Services:** Kritische API-Logik oder Berechnungen.

## 5. Frontend-Konventionen
* **Styles:** CSS-Variablen aus `index.css`. Haupt-Font für UI: "Zen Loop" (1.4rem base). Headlines: "Covered By Your Grace".
* **Layout:** Minimalistische Listen für Content (Blog), Chaos-Cards für UI-Elemente.
* **PWA & Offline:** Die App nutzt `vite-plugin-pwa` und `Dexie.js`. Daten (Einkaufsliste, Notizen) werden lokal gepuffert und bei Online-Status synchronisiert.
* **Assets:** Projekt-Bilder liegen in `frontend/public/projects/`. Blog-Bilder werden via `/api/upload` hochgeladen und unter `/uploads/` serviert.

## 6. Content-Konventionen (Blog)
* **Markdown:** Artikel werden in Markdown verfasst und via `react-markdown` gerendert.
* **Sprache:** Blog-Inhalte sind flexibel (DE, EN, ES), basierend auf der Wahl des Autors (keine strikte i18n-Pflicht für Content).
* **Bilder:** Bilder im Blog nutzen relative Pfade (`/uploads/...`) für maximale Portabilität.

## 7. Dokumentations-Hygiene & Knowledge-Management
* **Aktualität:** Wichtige technische Entscheidungen, Fixes oder neue Architektur-Muster werden zeitnah in den entsprechenden `.md`-Dateien (z.B. `infrastructure.md` oder `ROADMAP.md`) dokumentiert.
* **Bereinigung:** Veraltete Informationen, überholte Pläne oder nicht mehr relevante Workarounds werden proaktiv gelöscht oder als "Deprecated" markiert, um die Dokumentation als "Single Source of Truth" sauber und effizient zu halten.

## 8. Git-Workflow (Branch-Strategie)
* **Feature-Isolierung:** Jede neue Entwicklung (Feature, Bugfix, Infrastruktur) startet grundsätzlich in einem eigenen **Feature-Branch** (z. B. `feature/vps-deployment`).
* **Synchronisation:** Vor dem Abschluss einer Entwicklung muss der Feature-Branch mit dem aktuellen Stand von `master` (oder `main`) synchronisiert werden (`git pull origin master`), um Konflikte frühzeitig zu lösen.
* **Pull Requests:** Der Merge in den Haupt-Branch erfolgt ausschließlich über **Pull Requests**, um Code-Qualität und Test-Abdeckung sicherzustellen.

## 9. Coding Standards & Qualität
* **TypeScript:** Die Verwendung von `any` ist streng untersagt. Jede Datenstruktur muss über passende Interfaces oder Types in `frontend/src/types/` definiert sein.
* **Commits:** Wir folgen dem **Conventional Commits** Standard (z. B. `feat: ...`, `fix: ...`, `docs: ...`, `refactor: ...`).
* **Sicherheit:** Secrets (API-Keys, Passwörter) dürfen unter keinen Umständen in den Code oder in `.md`-Dateien geschrieben werden. Sie werden ausschließlich über `.env` (lokal) oder **GitHub Secrets** (Produktion) verwaltet.

## 10. Deployment-Sicherheit
* **Automatisierung:** Deployments auf den VPS erfolgen ausschließlich über die automatisierte CI/CD-Pipeline. Manuelle Änderungen am Code auf dem Server sind zu vermeiden.
* **Rootless:** Alle Container laufen im Rootless-Modus unter dem User `jorchadmin`, um die Angriffsfläche des Host-Systems zu minimieren.
