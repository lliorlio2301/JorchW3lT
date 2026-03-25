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
    3.  **Deployment:** SSH-Login auf den VPS, Vorbereitung der `docker-compose.yml` (Ersetzung der Secrets) und Neustart via `podman-compose`.

---
## 5. VPS-Absicherung & Podman Besonderheiten

* **Fully Qualified Image Names:** Podman auf Debian 12 erfordert in der `docker-compose.yml` vollständige Namen (z. B. `docker.io/library/postgres:16-alpine`), da "Short Names" ohne Registry-Präfix standardmäßig nicht aufgelöst werden.
* **Isolierter User:** Alle Dienste laufen unter dem User `jorchadmin` ohne Root-Rechte.
* **Firewall (UFW):** Ports 22 (SSH), 80 (HTTP) und 443 (HTTPS) sind offen.
* **Reverse Proxy:** Nginx auf dem Host leitet Anfragen an den Frontend-Container (Port 3000) weiter.

---

## 6. Backup-Strategie (Geplant)

* **Datenbank:** SQL-Dumps der PostgreSQL-Volume via Cronjob.
* **Uploads:** Synchronisation des `uploads/`-Verzeichnisses.

---

> [!IMPORTANT]
> **Wichtiger Hinweis:** Durch die Umstellung auf `fetch = FetchType.EAGER` im `Resume-Model` wurde sichergestellt, dass der `Integration Test` nicht mehr an einer `LazyInitializationException` scheitert.
