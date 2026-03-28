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

## Phase 8: Future Ideas
- [x] **Content:** Blog-Live-Vorschau im Admin-Bereich.
- [x] **Backup:** Automatisierte SQL-Dumps auf externen Speicher.
