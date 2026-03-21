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

Die Datei `.github/workflows/deploy.yml` steuert den gesamten Deployment-Prozess:
1.  **Test:** Ausführung von Backend- (JUnit) und Frontend-Tests (Vitest, Playwright).
2.  **Build:** Erstellung der Docker-Images (Native Backend & Vite Frontend).
3.  **Registry:** Push der Images in die GitHub Container Registry (GHCR) unter Verwendung von Kleinschreibung für den Repository-Namen.
4.  **Deployment:** SSH-Login auf den VPS, Pull der neuen Images und Neustart via `podman-compose`.

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
