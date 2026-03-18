# Übersicht der Test-Suite (Personal Portfolio & OS)

Diese Dokumentation beschreibt alle automatisierten Tests, die zur Sicherstellung der Code-Qualität, Datenintegrität und Sicherheit implementiert wurden.

---

## 1. Test-Infrastruktur

Das Projekt nutzt eine moderne Test-Infrastruktur, die speziell auf **Podman (Rootless)** optimiert ist.

*   **JUnit 5 & AssertJ:** Frameworks für Test-Struktur und flüssige Assertions.
*   **Testcontainers (PostgreSQL 16-alpine):** Startet für jeden Integrationstest eine echte, isolierte Datenbank.
*   **AbstractIntegrationTest:** Basisklasse, welche die Container-Infrastruktur und `@ServiceConnection` für Spring Boot 3 bereitstellt.

---

## 2. Test-Klassen & Abdeckung

### A. Smoke Tests (Startfähigkeit)
*   **`JorgeApplicationTests.java`**
    *   **Ziel:** Überprüft, ob der Spring Boot Context ohne Fehler lädt.
    *   **Umfang:** Bean-Verdrahtung, Konfigurations-Validierung.

### B. Unit Tests (Mapper & Logik)
*   **`ResumeMapperTest.java`**
    *   **Ziel:** Validierung der mehrsprachigen Datenumwandlung (MapStruct).
    *   **Umfang:** Prüft, ob `summaryDe`, `summaryEn` etc. korrekt in das lokalisierte `summary`-Feld des DTOs gemappt werden.
*   **`NoteMapperTest.java`**
    *   **Ziel:** Verifizierung der komplexen Notiz-Struktur.
    *   **Umfang:** 
        *   Mapping von `Note` zu `NoteDTO`.
        *   Überprüfung des `isChecklist`-Flags.
        *   Sicherstellung der Parent-Referenz-Setzung (`note_id`) beim Mapping von DTO zu Entität.

### C. Integration Tests (End-to-End Backend)
*   **`ResumeIntegrationTest.java`**
    *   **Ziel:** Testet den vollständigen Pfad für den Lebenslauf.
    *   **Umfang:** Controller-Aufruf via `TestRestTemplate`, JPA-Persistierung und JSON-Mapping.
*   **`NoteIntegrationTest.java`**
    *   **Ziel:** Absicherung der Notiz-Funktion und der Security-Logik.
    *   **Umfang:**
        *   **Security:** Verifiziert, dass ein Zugriff auf `/api/notes` ohne gültigen JWT-Token mit `403 Forbidden` abgelehnt wird.
        *   **Persistenz:** Prüft die korrekte Speicherung von Notizen mit mehreren `NoteItems` in der PostgreSQL-Datenbank (inkl. Cascade-Delete und Schema-Validierung der Migrationen V3/V4).

---

## 3. Ausführung der Tests

Um die Tests lokal auszuführen, müssen die Podman-Umgebungsvariablen gesetzt sein:

```bash
export DOCKER_HOST=unix:///run/user/1000/podman/podman.sock
export TESTCONTAINERS_RYUK_DISABLED=true
./mvnw test
```

---

## 4. Zusammenfassung der Ergebnisse (Stand März 2026)

| Test-Kategorie | Status | Letzter Lauf |
| --- | --- | --- |
| Context Load | ✅ Pass | 18.03.2026 |
| Resume Mapping | ✅ Pass | 18.03.2026 |
| Note Mapping | ✅ Pass | 18.03.2026 |
| Note Persistence | ✅ Pass | 18.03.2026 |
| Blog Base Logic | ✅ Pass | 18.03.2026 |
| File Upload (API) | ✅ Pass | 18.03.2026 |
| Security (403 Check) | ✅ Pass | 18.03.2026 |
| Offline Fallback | ✅ Pass | 18.03.2026 |

---
**Neu hinzugefügt (März 2026):**
*   **Blog Schema:** Validierung der Slug-Generierung und Markdown-Inhalts-Speicherung.
*   **Upload-Integrität:** Sicherstellung, dass Bilder im Container-Volume `/uploads` korrekt abgelegt werden.
*   **IndexedDB Sync:** Manuelle Verifizierung des Offline-Modus via Browser DevTools (Application Tab).
