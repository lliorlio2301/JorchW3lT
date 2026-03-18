# Project Roadmap: Personal Portfolio & OS

## Phase 1: Foundation & Static Content (Low Complexity)
- [x] **Feature: Resume (CV)**
    - *Backend:* Create `Resume` Entity/DTO. Static data provider.
    - *Frontend:* Simple display components.
- [x] **Feature: Guitar Songbook (Metadata only)**
    - *Backend:* `Song` Entity (Title, Artist, YouTube-URL, Category).
    - *Frontend:* Link-List with YouTube Embeds.
- [x] **Tech:** Setup initial Dockerfile (JVM-based).

## Phase 1.5: Testing & Quality Assurance
- [x] **Feature: Security:** Implement **Environment Variables** for secrets (no hardcoded passwords).
- [x] **Unit Tests:** Basic JUnit 5 tests for Services & Mappers.
- [x] **Integration Tests:** Setup **Testcontainers** for PostgreSQL tests (Podman supported).
- [x] **Local Environment:** Create `docker-compose.yml` for local full-stack testing.

## Phase 2: Core Features & Persistence (Medium Complexity)
- [x] **Database:** Setup PostgreSQL Docker Container & **Flyway** migrations.
- [x] **Feature: Internationalization (i18n)**
    - *Technical:* Support for DE, EN, ES.
    - *Backend:* Localization of API responses via MapStruct.
- [x] **Feature: Project Portfolio**
    - *Backend:* `Project` Entity with MapStruct Mappers.
    - *Frontend:* Grid-Layout with filtering by Tech-Tags.
- [x] **Feature: Shopping/Checklist**
    - *Backend:* CRUD Endpoints for `ListItem`.
- [x] **Feature: UI Themes (Dark/Light Mode)**
    - *Technical:* Persistent theme selection (LocalStorage).
    - *Frontend:* Toggle-Switch in navigation, CSS Variable refinement.
    
## Phase 2.5a: Auth Infrastructure (The Gatekeeper)
- [x] **Backend: Security Foundation**
    - *Logic:* Implement **Spring Security** with **BCrypt** for secure password hashing.
    - *JWT:* Setup JWT Utility for token generation, validation, and extraction.
    - *API:* Create `AuthController` (`/api/auth/login`) to handle authentication requests.
- [x] **Frontend: Global Auth State**
    - *State:* Implement **AuthContext** (React Context API) to manage `user`, `token`, and `isAuthenticated` globally.
    - *Interceptor:* Setup an **Axios Interceptor** to automatically attach the Bearer Token to outgoing requests.
    - *UI:* Add a **"Login" / "Logout" Toggle** in the Navigation Bar.

## Phase 2.5b: Integrated CMS & Management (CRUD)
- [x] **Feature: Songbook Management UI**
    - *Backend:* Secure POST/PUT/DELETE endpoints with `@PreAuthorize("hasRole('ADMIN')")`.
    - *Frontend:* Create an Admin-only Form-Modal in `SongsPage.tsx`
- [x] **Feature: Project Portfolio Management**
    - *Backend:* Secure POST/PUT/DELETE endpoints and ProjectCreateDTO for multi-language support.
- [x] - *Frontend:* Multi-language edit form in `ProjectsPage.tsx`.
- [x] **Feature: Shopping/Checklist Management**
    - *Logic:* Secure CRUD endpoints for `ListItem`.
    
## Phase 2.5c: Personal Workspace & Privacy (NEU)
**Ziel:** Umwandlung der öffentlichen Liste in ein privates Tool & Ausbau der Notizen.

- [x] **Feature: Privatization of Personal Tools**
    - *Backend:* Endpunkte für `/api/list-items/**` auf `hasRole('ADMIN')` einschränken.
    - *Frontend:* Navigationselemente für die Einkaufsliste nur für authentifizierte Admins einblenden.
- [x] **Feature: Private Notes with Checklists (iOS Style)**
    - *Backend:* Neue Entities `Note` (Titel, Zeitstempel) und `NoteItem` (Text, Erledigt-Status).
    - *Backend:* `@OneToMany`-Beziehung zwischen `Note` und `NoteItems`; Absicherung via `ADMIN`-Rolle.
    - *Frontend:* Dynamischer Editor für Notizen, der das Hinzufügen von Checkbox-Zeilen erlaubt.

## Phase 3: Content Management (NEU)
**Ziel:** Verwandlung der Seite in eine lebendige Plattform.

- [x] **Feature: Simple Blog (Markdown support)**
    - *Backend:* `BlogPost` Entität mit Slug-Generierung.
    - *Frontend:* Minimalistische Listenansicht (zentriert) und `react-markdown` Rendering.
- [x] **Feature: Blog Image Support**
    - *Backend:* `/api/upload` Endpunkt für Bild-Hosting im Container.
    - *Frontend:* Integration von Bildern in Markdown und Cover-Images.
- [x] **Feature: Blog Management UI**
    - *Frontend:* Admin-Editor für Posts mit Live-Vorschau (geplant) und Edit/Delete-Funktionen.

## Phase 3.5: Mobile Experience & PWA (NEU)
**Ziel:** Optimierung für die Nutzung im Supermarkt und unterwegs.

- [x] **Feature: Progressive Web App (PWA)**
    - *Vite:* Integration von `vite-plugin-pwa` für "Add to Home Screen".
    - *Assets:* Icons und Manifest für App-Feeling auf iOS/Android erstellen.
- [x] **Feature: Granular Offline Strategy**
    - *Frontend:* Implementierung von **IndexedDB** (z.B. via Dexie.js) für die lokale Speicherung von Einkaufsliste und Notizen.
    - *Service Worker:* Selektives Caching – App-Logik und private Daten offline verfügbar machen; schwere Portfolio-Bilder (`/public/projects/`) vom Offline-Cache ausschließen, um die App "leicht" zu halten.
- [x] **UX Optimization:**
    - *Redirect:* Automatische Weiterleitung zur Einkaufsliste nach erfolgreichem Admin-Login.
    - *Mobile UI:* Optimierung der Buttons für einhändige Bedienung am Handy.

## Phase 4: Optimization (Hohe Komplexität)
- [x] **Optimization:** Setup Maven **Native Build Profile** (GraalVM)
    - *Backend:* Konfiguration des `native` Profils für Spring Boot.
    - *Infrastructure:* Anpassung des Dockerfiles für mehrstufige Native-Builds (Podman-kompatibel).
    - *Runtime-Fixes:* Implementierung von `JjwtRuntimeHints.java` und Integration von `.so`-Bibliotheken im Docker-Image zur Vermeidung von JJWT-Reflection-Fehlern.
    - *Benefit:* Massiv reduzierter RAM-Verbrauch und Startzeiten unter 100ms.

## Phase 5: Infrastructure & DevOps (Produktivsetzung)
- [ ] **Monitoring:** **Spring Boot Actuator**
- [ ] **CI/CD:** **GitHub Actions Pipeline** für Build & Deploy
- [ ] **Web:** **Nginx Proxy Manager** mit **Let's Encrypt SSL**

