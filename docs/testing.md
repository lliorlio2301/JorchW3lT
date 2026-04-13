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

### B. Unit Tests (Mapper & Logik)
*   **`ResumeMapperTest.java` & `NoteMapperTest.java`**
    *   **Ziel:** Validierung der Datenumwandlung (MapStruct) und Parent-Child-Beziehungen.

### C. Integration Tests (End-to-End Backend)
*   **`ResumeIntegrationTest.java` & `NoteIntegrationTest.java`**
    *   **Ziel:** Vollständiger Pfad (Controller -> Service -> Repository -> DB).
*   **`ProjectServiceIntegrationTest.java`**
    *   **Ziel:** Validierung des vereinfachten Projektmodells und der CRUD-Operationen.
*   **`GalleryImageIntegrationTest.java`**
    *   **Ziel:** Test der monatlichen Highlights, Bild-Metadaten (hasBackground) und Persistenz.
*   **`ShortStoryIntegrationTest.java`**
    *   **Ziel:** Verifizierung der Kurzgeschichten-Speicherung und Markdown-Integrität.
*   **`UserServiceIntegrationTest.java`**
    *   **Ziel:** Test der sicheren Account-Verwaltung (Username/Passwort-Update mit Encoding).

---

## 3. Frontend Test-Abdeckung

### A. Component Tests
*   **`LoginPage.test.tsx`**
    *   **Ziel:** Validierung des Login-Formulars.
*   **`AccountPage.test.tsx`**
    *   **Ziel:** Test der Account-Verwaltung mit Test-ID-basierten Selektoren und i18n-Mocking.

### B. Service- & Sync-Tests
*   **Offline-Logik (Dexie.js):**
    *   **Ziel:** Testen der IndexedDB-Operationen.
*   **Axios Interceptor:**
    *   **Ziel:** Verifizierung der JWT-Token Übertragung.

---

## 4. End-to-End (E2E) & User Journeys (Playwright)

### A. Critical Path: Admin Login & Content Management
*   **Datei:** `admin-journey.spec.ts`
*   **Szenario:** Login -> Notiz-Erstellung -> Verifizierung der UI.

### B. Account Security
*   **Datei:** `account-journey.spec.ts`
*   **Szenario:** Login -> Benutzernamen ändern -> Passwort ändern -> Verifizierung der Erfolgsmeldungen.

---

## 5. CI/CD Integration (GitHub Actions)

Die Qualitätssicherung ist fest in die CI/CD-Pipeline integriert.

### A. Automatisierte CI-Tests (`ci-tests.yml`)
Bei jedem **Push** auf den `master`-Branch wird automatisch der QA-Workflow gestartet. Dieser Workflow muss erfolgreich abgeschlossen werden ("Green Build"), bevor ein manuelles Deployment gestartet werden kann.

---

## 6. Ausführung der Tests (Lokal)

### Backend
```bash
cd backend && ./mvnw test
```

### Frontend
```bash
cd frontend && npm test
```
