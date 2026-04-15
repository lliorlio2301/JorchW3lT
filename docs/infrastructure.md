## 1. Podman-Infrastruktur (System-Einstellungen)

Um eine reibungslose Kommunikation zwischen Java (Testcontainers) und deiner Container-Engine zu gewährleisten, wurden folgende Einstellungen vorgenommen:

* **Symlink (podman.socket):** Aktiviert den Podman-Dienst auf User-Ebene über `systemd`. Dadurch ist der Socket unter `/run/user/1000/podman/podman.sock` permanent verfügbar.
* **Umgebungsvariablen:**
    * **`DOCKER_HOST`**: Sagt Testcontainers explizit, wo der "Docker"-Socket liegt.
    * **`TESTCONTAINERS_RYUK_DISABLED`**: Verhindert den Start des Hilfs-Containers "Ryuk" in Rootless/CI Umgebungen.

---

## 2. Übersicht der Test-Suite

* **Singleton Container Strategie:** In `AbstractIntegrationTest.java` wird ein statischer Container-Block genutzt. Dies stellt sicher, dass über den gesamten Testlauf hinweg nur **eine** PostgreSQL-Instanz gestartet wird, was Ressourcen schont und Race-Conditions auf dem Docker-Socket verhindert.

---

## 3. GraalVM Native Build (Optimierung)

Für die Produktionsumgebung wird ein Native Image (AOT - Ahead of Time Compilation) verwendet.

### Kritische Konfigurationen & Fixes:

* **JJWT Reflection & AOT:** 
    * **TypeReference:** In der AOT-Phase (`JjwtRuntimeHints.java`) muss `TypeReference.of("className")` statt `Class.forName()` verwendet werden, da JJWT-Implementierungen oft nur im `runtime`-Scope liegen und `Class.forName` zur Build-Zeit scheitern würde.
    * **Vollständigkeit:** Alle internen JJWT-Klassen (Parser, Builder, Encryption, Compression, Keys) müssen explizit inklusive ihrer öffentlichen Konstruktoren (`INVOKE_PUBLIC_CONSTRUCTORS`) registriert werden.
* **Reachability Metadata:** In der `pom.xml` ist das `metadataRepository` im `native-maven-plugin` aktiviert, um Community-gestützte Reflection-Konfigurationen automatisch zu beziehen.
* **Shared Libraries (.so):** Das `Dockerfile.native` kopiert explizit alle generierten `.so` Dateien, um AWT/Desktop-Abhängigkeiten zur Laufzeit zu bedienen.
---

## 4. CI/CD Pipeline (GitHub Actions)

Die Pipeline ist in zwei spezialisierte Workflows unterteilt, um Automatisierung mit gezielter Kontrolle zu verbinden.

### A. Quality Assurance (`ci-tests.yml`)
Dieser Workflow läuft **automatisch** bei jedem Push oder Pull-Request auf `master`.
*   **Zweck:** Sicherstellung der Code-Qualität vor jedem Merge.
*   **Jobs:** Ausführung aller Backend-, Frontend- und E2E-Tests.

### B. Modulares Deployment (`deploy.yml`)
Dieser Workflow wird **manuell** via `workflow_dispatch` im GitHub-Backend gestartet.
*   **Scope-Auswahl:** Beim Start kann gewählt werden, was deployt werden soll:
    *   `all`: Vollständiges Build & Deployment beider Komponenten.
    *   `backend`: Nur das Native Java Backend wird gebaut und deployt.
    *   `frontend`: Nur das React Frontend wird gebaut und deployt.
*   **Prozess:**
    1.  **Build:** Erstellung der Docker-Images (Native Backend & Vite Frontend) basierend auf dem gewählten Scope.
    2.  **Registry:** Push der Images in die GitHub Container Registry (GHCR).
    3.  **Deployment:** SSH-Login auf den VPS, automatische Synchronisierung der `docker-compose.yml` und des `scripts/`-Ordners via SCP, Vorbereitung der Secrets und Neustart via `podman-compose`.

---
## 5. VPS-Absicherung & Podman Besonderheiten

* **Fully Qualified Image Names:** Podman auf Debian 12 erfordert in der `docker-compose.yml` vollständige Namen (z. B. `docker.io/library/postgres:16-alpine`), da "Short Names" ohne Registry-Präfix standardmäßig nicht aufgelöst werden.
* **Isolierter User:** Alle Dienste laufen unter dem User `jorchadmin` ohne Root-Rechte.
* **Firewall (UFW):** Ports 22 (SSH), 80 (HTTP) und 443 (HTTPS) sind offen.
* **Reverse Proxy:** Nginx auf dem Host leitet Anfragen an den Frontend-Container (Port 3000) weiter.

## 6. Domain & SSL Setup (Certbot)

Die Erreichbarkeit von außen wird über eine Domain und ein kostenloses SSL-Zertifikat von Let's Encrypt sichergestellt.

### Voraussetzungen:
1. Eine registrierte Domain (z.B. `deine-domain.de`).
2. Ein DNS-Eintrag (A-Record), der auf die IP deines VPS zeigt.

### Einrichtungsschritte:
1. **Repository klonen:** Stelle sicher, dass die Skripte auf dem VPS aktuell sind.
2. **Setup-Skript ausführen:**
   ```bash
   cd scripts
   sudo chmod +x setup_ssl.sh
   sudo ./setup_ssl.sh
   ```
3. **Konfiguration:** Das Skript installiert Certbot, konfiguriert Nginx als Reverse Proxy und fragt nach deiner Domain, um das SSL-Zertifikat automatisch zu erstellen und einzubinden.

### Automatische Erneuerung:
Certbot richtet unter Debian 12 automatisch einen Systemd-Timer (`certbot.timer`) ein, der das Zertifikat alle 60 Tage erneuert. Ein manueller Eingriff ist nicht erforderlich.

## 7. Backup-Strategie

Die Datensicherheit wird durch automatisierte tägliche Backups der PostgreSQL-Datenbank gewährleistet.

### Funktionsweise:
*   **Technik:** Nutzt `pg_dump` innerhalb des Podman-Containers.
*   **Zeitplan:** Täglich um 03:00 Uhr morgens via Cronjob des Users `jorchadmin`.
*   **Speicherort:** `/home/jorchadmin/backups/db`.
*   **Rotation:** Es werden immer die Backups der letzten 7 Tage aufbewahrt; ältere Dateien werden automatisch gelöscht.
*   **Format:** Komprimierte SQL-Dumps (`.sql.gz`).

### Einrichtung auf dem VPS:
1.  **Repository synchronisieren:** Die neuen Skripte müssen auf dem VPS vorhanden sein (geschieht automatisch beim nächsten Deployment).
2.  **Setup ausführen:**
    ```bash
    cd ~/app/scripts
    chmod +x setup_backups.sh
    ./setup_backups.sh
    ```
3.  **Verifizierung:** Prüfe mit `crontab -l`, ob der Eintrag vorhanden ist, und schaue in `/home/jorchadmin/backups/db`, ob das Test-Backup erstellt wurde.

### Wiederherstellung (Restore):
Um ein Backup einzuspielen, kann folgender Befehl genutzt werden:
```bash
gunzip -c backup_datei.sql.gz | podman exec -i jorge-db psql -U jorchos_user -d jorchos_db
```
*(Hinweis: Dies überschreibt den aktuellen Stand der Datenbank!)*

---

## 8. Lean Observability Stack (Phase 13.5)

Für Monitoring und Log-Analyse läuft ein ressourcenschonender Stack direkt im bestehenden Podman-Compose:

- **VictoriaMetrics (Single Node):** Metrics Storage & Scraping
- **Grafana:** Dashboards für JVM, HTTP-Latenz, DB-Connections, Host-Ressourcen
- **Loki + Promtail:** Zentrale Container-Log-Aggregation
- **node-exporter:** CPU/RAM/Disk Metriken des VPS
- **postgres-exporter:** PostgreSQL Telemetrie

### Zugriff (Sicherheitsmodell)

Observability wird **nicht öffentlich** exponiert.

- Grafana ist nur an `127.0.0.1:3001` gebunden.
- Zugriff erfolgt per SSH-Tunnel:

```bash
ssh -L 3001:127.0.0.1:3001 jorchadmin@<VPS_IP>
```

Danach lokal öffnen: `http://localhost:3001`

### Betriebs-Hinweis

- Provisioning-Dateien liegen unter `scripts/observability/`.
- Dashboard-Provisioning erfolgt automatisch beim Start von Grafana.
- Standard-Retention:
  - VictoriaMetrics: `14d`
  - Loki: `168h` (7 Tage)

---

## 9. Upload Runtime Hardening (VPS / Native)

Für den Upload-Pfad wurden zusätzliche Stabilitätsmaßnahmen dokumentiert:

- **Dateinamen-Normalisierung:** Upload-Dateinamen werden serverseitig ASCII-sicher normalisiert (Diakritika entfernt), um Charset-Probleme im Native Runtime-Kontext zu vermeiden.
- **Native Fallback-Strategie:** In Produktion ist `APP_UPLOAD_WEBP_ENABLED=false` gesetzt. Uploads werden im Originalformat gespeichert, um `scrimage`/`ImmutableImage` Initialisierungsprobleme im Native Runtime-Pfad zu umgehen.
- **Explizite Multipart-Fehlerverträge:** Zu große Uploads liefern `413 Payload Too Large`; fehlerhafte Multipart-Requests liefern `400 Bad Request`.
- **Diagnosefähigkeit:** Unerwartete Server-Exceptions werden im `GlobalExceptionHandler` mit Stacktrace geloggt, damit 500-Fehler nicht mehr still bleiben.
- **Client-Guard:** Gallery-Admin nutzt denselben 5MB Upload-Check wie Blog/Projects, um unnötige Requests frühzeitig zu stoppen.

---

> [!IMPORTANT]
> **Wichtiger Hinweis:** Durch die Umstellung auf `fetch = FetchType.EAGER` im `Resume-Model` wurde sichergestellt, dass der `Integration Test` nicht mehr an einer `LazyInitializationException` scheitert.
