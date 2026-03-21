## 1. Podman-Infrastruktur (System-Einstellungen)

Um eine reibungslose Kommunikation zwischen Java (Testcontainers) und deiner Container-Engine zu gewährleisten, wurden folgende Einstellungen vorgenommen:

* **Symlink (podman.socket):** Aktiviert den Podman-Dienst auf User-Ebene über `systemd`. Dadurch ist der Socket unter `/run/user/1000/podman/podman.sock` permanent verfügbar.
* **Umgebungsvariablen:**
* **`DOCKER_HOST`**: Sagt Testcontainers explizit, wo der "Docker"-Socket liegt (in diesem Fall der Pfad zum Podman-Socket).
* **`TESTCONTAINERS_RYUK_DISABLED`**: Verhindert den Start des Hilfs-Containers "Ryuk". Da Ryuk im Rootless-Modus oft keine Berechtigung zum Verwalten anderer Container hat, wird er deaktiviert, um Abstürze zu vermeiden.

---

## 2. Übersicht der Test-Suite

Die Tests sind in verschiedene Ebenen unterteilt, um sowohl Geschwindigkeit als auch Zuverlässigkeit zu garantieren.

### A. JorgeApplicationTests (Smoke Test)

* **Zweck:** Überprüft, ob das Spring Boot Projekt überhaupt startet. Es stellt sicher, dass alle Beans (Services, Repositories, Mapper) korrekt verdrahtet sind.
* **Konfiguration:**
* Nutzt `@SpringBootTest`.
* Verwendet die **H2 In-Memory Datenbank**, um eine extrem kurze Laufzeit zu erreichen.
* Führt keine Migrationen auf echten Datenbanken aus.



### B. ResumeMapperTest (Unit Test)

* **Zweck:** Testet die Logik der Datenumwandlung (**Mapping**). Prüft, ob der `ResumeMapper` (MapStruct) mehrsprachige Felder (DE, EN, ES) korrekt basierend auf der "Locale" übersetzt.
* **Konfiguration:**
* Reiner JUnit 5 Test **ohne Spring-Context** (sehr schnell).
* Instanziiert den Mapper direkt über `Mappers.getMapper()`.
* Keine Datenbank erforderlich.



### C. ResumeIntegrationTest (Integration Test)

* **Zweck:** Testet den kompletten End-to-End Durchlauf innerhalb des Backends (Controller -> Service -> Repository -> DB).
* **Konfiguration:**
* Erbt von `AbstractIntegrationTest`.
* Nutzt `@SpringBootTest` mit einem zufälligen Port (`RANDOM_PORT`).
* Verwendet `TestRestTemplate` für echte HTTP-Requests gegen das laufende Backend.



### D. AbstractIntegrationTest (Infrastruktur-Basis)

* **Zweck:** Zentrale Konfiguration für alle Tests, die eine echte Datenbank benötigen.
* **Konfiguration:**
* **Testcontainers:** Startet einen echten **PostgreSQL 16-alpine** Container in deiner Podman-Umgebung.
* **`@ServiceConnection`**: Ein modernes Spring Boot 3 Feature, das die Verbindungsdaten (JDBC-URL, User, PW) des Containers automatisch an Spring übergibt.



---

## Zusammenfassung der Test-Abdeckung

| Test-Typ | Tool | Ziel | Geschwindigkeit |
| --- | --- | --- | --- |
| **Context** | Spring Boot | Startfähigkeit | Mittel |
| **Unit** | JUnit 5 / MapStruct | Geschäftslogik (Mapping) | Sehr schnell |
| **Integration** | Testcontainers / Postgres | DB-Interaktion & API | Langsam (Container-Start) |

---

## 3. GraalVM Native Build (Optimierung)

Für die Produktionsumgebung wird ein Native Image (AOT - Ahead of Time Compilation) verwendet, um den Speicherverbrauch zu minimieren und die Startzeit auf unter 1s zu senken.

### Kritische Konfigurationen für den Native Build:

* **JJWT Reflection Hints:** JJWT lädt Klassen dynamisch via Reflection. Da GraalVM alle genutzten Klassen zur Build-Zeit kennen muss, wurde eine `JjwtRuntimeHints.java` Konfiguration hinzugefügt, die JJWT-interne Klassen (z. B. `DefaultJwtParserBuilder`) explizit registriert.
* **Shared Libraries (.so):** Der Native Build erzeugt neben dem Executable zusätzliche Bibliotheken (z. B. `libawt.so`), falls transitive Abhängigkeiten zu Java-UI-Modulen bestehen. Das `Dockerfile.native` muss diese Dateien explizit in das finale Image kopieren (`COPY --from=build /app/target/*.so ./`), um Laufzeitfehler zu vermeiden.

---

## 4. CI/CD Pipeline (GitHub Actions)

Die Datei `.github/workflows/deploy.yml` steuert den gesamten Deployment-Prozess:
1.  **Test:** Ausführung von Backend- (JUnit) und Frontend-Tests (Vitest, Playwright).
2.  **Build:** Erstellung der Docker-Images (Native Backend & Vite Frontend).
3.  **Registry:** Push der Images in die GitHub Container Registry (GHCR).
4.  **Deployment:** SSH-Login auf den VPS, Pull der neuen Images und Neustart via `podman-compose`.

## 5. VPS-Absicherung & Security

*   **Isolierter User:** Alle Dienste laufen unter dem User `jorchadmin` ohne Root-Rechte.
*   **Firewall (UFW):** Nur die Ports 22 (SSH), 80 (HTTP) und 443 (HTTPS) sind nach außen geöffnet.
*   **Reverse Proxy:** Nginx auf dem Host leitet Anfragen an den Frontend-Container (Port 3000) weiter und fungiert als SSL-Terminierung.

## 6. Backup-Strategie (Geplant)

*   **Datenbank:** Regelmäßige SQL-Dumps der PostgreSQL-Volume via Cronjob.
*   **Uploads:** Synchronisation des `uploads/`-Verzeichnisses mit einem externen Cloud-Speicher oder lokalem Backup-Server.

---

> [!IMPORTANT]
> **Wichtiger Hinweis:** Durch die Umstellung auf `fetch = FetchType.EAGER` im `Resume-Model` wurde sichergestellt, dass der `Integration Test` nicht mehr an einer `LazyInitializationException` scheitert.
