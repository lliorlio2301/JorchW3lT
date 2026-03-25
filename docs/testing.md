# Übersicht der Test-Suite (Personal Portfolio & OS)

Diese Dokumentation beschreibt alle automatisierten Tests, die zur Sicherstellung der Code-Qualität, Datenintegrität und Sicherheit implementiert wurden oder geplant sind.

---

## 1. Test-Infrastruktur

Das Projekt nutzt eine moderne Test-Infrastruktur, die sowohl das Backend als auch das Frontend abdeckt.

### Backend (Java/Spring Boot)
*   **JUnit 5 & AssertJ:** Frameworks für Test-Struktur und flüssige Assertions.
*   **Testcontainers (PostgreSQL 16-alpine):** Startet für jeden Integrationstest eine echte, isolierte Datenbank.
*   **AbstractIntegrationTest:** Basisklasse für die Container-Infrastruktur und `@ServiceConnection`.

### Frontend (React/Vite)
*   **Vitest:** Schneller Test-Runner, der nativ mit Vite zusammenarbeitet.
*   **React Testing Library (RTL):** Fokus auf das Testen von Komponenten aus Benutzersicht.
*   **jsdom:** Browser-Umgebung für Node.js zur Simulation des DOM.

---

## 2. Backend Test-Abdeckung

### A. Smoke Tests (Startfähigkeit)
*   **`JorgeApplicationTests.java`**
    *   **Ziel:** Überprüft, ob der Spring Boot Context ohne Fehler lädt.
    *   **Umfang:** Bean-Verdrahtung, Konfigurations-Validierung.

### B. Unit Tests (Mapper & Logik)
*   **`ResumeMapperTest.java` & `NoteMapperTest.java`**
    *   **Ziel:** Validierung der Datenumwandlung (MapStruct) und Parent-Child-Beziehungen.
    *   **Umfang:** Mehrsprachigkeit (i18n), Checklist-Logik und Referenz-Mapping.

### C. Integration Tests (End-to-End Backend)
*   **`ResumeIntegrationTest.java` & `NoteIntegrationTest.java`**
    *   **Ziel:** Vollständiger Pfad (Controller -> Service -> Repository -> DB).
    *   **Umfang:** Security-Absicherung (JWT/403 Check), JPA-Persistierung und Schema-Validierung.

---

## 3. Frontend Test-Abdeckung (In Planung/Implementierung)

### A. Component Tests
*   **`LoginPage.test.tsx`**
    *   **Ziel:** Validierung des Login-Formulars und der Barrierefreiheit (Label-Input-Verknüpfung).
*   **Admin-UI Komponenten:**
    *   **Ziel:** Sicherstellung, dass sensitive UI-Elemente (Edit/Delete) nur für Admins sichtbar sind.

### B. Service- & Sync-Tests
*   **Offline-Logik (Dexie.js):**
    *   **Ziel:** Testen der IndexedDB-Operationen für Notizen und Einkaufsliste.
*   **Axios Interceptor:**
    *   **Ziel:** Verifizierung, dass der Bearer-Token korrekt an API-Requests angehängt wird.

### C. Internationalisierung (i18n)
*   **Sprachumschaltung:**
    *   **Ziel:** Prüfung, ob Komponenten nach einem Sprachwechsel die korrekten Übersetzungen laden.

---

## 4. End-to-End (E2E) & User Journeys

### A. Critical Path: Admin Login & Content Management
*   **Szenario:** User loggt sich ein -> Erstellt einen Blog-Post -> Lädt ein Bild hoch -> Verifiziert die Anzeige in der Liste.

### B. Resilience: Offline-Verhalten
*   **Szenario:** User öffnet die App -> Verbindung bricht ab -> Notiz wird lokal gespeichert -> Verbindung kehrt zurück -> Daten werden mit dem Server synchronisiert.

---

## 5. CI/CD Integration (GitHub Actions)

Die Qualitätssicherung ist fest in die CI/CD-Pipeline integriert, um Regressionen zu vermeiden.

### A. Automatisierte CI-Tests (`ci-tests.yml`)
Bei jedem **Push** oder **Pull Request** auf den `master`-Branch wird automatisch der QA-Workflow gestartet:
1.  **Backend:** JUnit 5 Tests mit Testcontainers (PostgreSQL).
2.  **Frontend:** Vitest Unit- und Komponenten-Tests.
3.  **End-to-End:** Playwright E2E-Tests gegen eine Mock-API.

Dieser Workflow muss erfolgreich abgeschlossen werden ("Green Build"), bevor ein manuelles Deployment gestartet werden sollte.

---

## 6. Ausführung der Tests (Lokal)

### Backend
```bash
./mvnw test
```

### Frontend
```bash
cd frontend && npm test
```
