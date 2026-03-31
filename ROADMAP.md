# Project Roadmap: Personal Portfolio & OS

## Phase 1: Foundation & QA (Completed)
- [x] **Feature: Resume, Songs, Docker Setup**
- [x] **QA:** JUnit 5, Testcontainers, Singleton Container Strategy.

## Phase 2: Core & Auth (Completed)
- [x] **Database:** PostgreSQL & Flyway.
- [x] **Auth:** Spring Security, JWT, BCrypt, AuthContext, Axios Interceptor.

## Phase 3: Content & PWA (Completed)
- [x] **Feature:** Blog (Markdown), Image Support, Notes (Checklists).
- [x] **Mobile:** PWA (Vite PWA), IndexedDB (Dexie), Offline Banner.

## Phase 3.6: Frontend QA (Completed)
- [x] **Technical:** Setup **Vitest** & **React Testing Library**.
- [x] **Unit Tests:** Tests für kritische Komponenten (z.B. `LoginPage`, `BlogService`).
- [x] **Integration:** Mocking von Axios-Requests via `axios-mock-adapter`.
- [x] **E2E:** **Playwright** User Journeys (Login & Note Creation) inkl. API-Mocking.

## Phase 4: Native Optimization (Completed)
- [x] **Optimization:** Maven **Native Build Profile** (GraalVM).
- [x] **Fixes:** 
    - Implementation von `JjwtRuntimeHints.java` (TypeReference, Full Reflection Package).
    - Maven Metadata Repository für Reachability Metadaten aktiviert.
    - .so Bibliotheken Integration in Docker Image.

## Phase 5: Infrastructure & DevOps (Completed)
- [x] **Monitoring:** **Spring Boot Actuator** (ADMIN secured).
- [x] **Deployment:** Full **GitHub Actions Pipeline**.
    - Cloud Build (Native & Vite), GHCR Push, SSH Deployment.
- [x] **VPS:** Debian 12, Rootless Podman, Nginx Reverse Proxy.

## Phase 6: Evolution & UX Refinement (Completed)
- [x] **UI Polish:** 
    - Login-Karte: Zentrierung der Eingabefelder (Padding-Fix).
    - Blog: Bilder vollständig anzeigen (kein Cropping).
    - Homepage: Modulares, vertikales One-Page Layout mit Retro-Inspiration.
- [x] **Project Redesign:** 
    - Umstellung der Ansicht auf eine Liste (ähnlich Blog-Stil) auf der Homepage.
- [x] **Branding:** Ersetzen des Vite-Icons durch das "Bär"-Asset als offizielles Favicon.
- [x] **DevOps:** Automatische SSL-Zertifikate via Let's Encrypt (Certbot).

## Phase 7: Account & Assets (Completed)
- [x] **Account Management:** Endpunkte und UI zum Ändern von Benutzername und Passwort.
- [x] **Project Management:** Implementierung von echtem Image-Upload (analog zum Blog) statt Pfadangabe.
- [x] **Model-Anpassung:** Entfernung von drei Sprachen in Projekten. Normale Felder einbauen.

## Phase 8: Future Ideas (Completed)
- [x] **Content:** Blog-Live-Vorschau im Admin-Bereich.
- [x] **Backup:** Automatisierte SQL-Dumps auf externen Speicher.

## Phase 9: Content Expansion & Visuals (Completed)
- [x] **Bild des Monats:** Homepage-Feature mit intelligenter Hintergrund-Erkennung und Dark-Mode Optimierung.
- [x] **Galerie-Archiv:** Übersicht aller vergangenen Monats-Highlights.
- [x] **Short Stories:** Neues Modul für Kurzgeschichten mit Fokus auf Typografie und Reader-View.
- [x] **Blog-Tags:** Kategorisierung und Filterung von Blog-Beiträgen.

## Phase 10: AI Song Engine (Completed)
- [x] **Modell-Erweiterung:** Unterstützung für Akkorde, Tuning, Capo und Tonarten.
- [x] **Responsive Viewer:** Sidebar-Layout mit dediziertem Chord-Viewer für alle Endgeräte.
- [x] **AI Workflow:** Prompt-Templates zur schnellen Umwandlung von Song-Quellen (lokal).

## Phase 11: Advanced Filtering & Content Refinement (Completed)
- [x] **Multi-Tag Filtering:** Unterstützung für Mehrfachauswahl von Tags bei Projekten, Blogs und Kurzgeschichten.
- [x] **Story Tags:** Backend- und Frontend-Support für Tags im Kurzgeschichten-Modul.
- [x] **UI Polish:** Optimierung der Filterleisten für bessere Benutzerführung.
