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
- [x] **Database Integrity:** Einsatz von Composite Primary Keys für Tag-Tabellen zur Vermeidung von Duplikaten.
- [x] **Flyway Best Practices:** Sicherstellung der Immutabilität von Migrationen durch Nutzung sequentieller Korrektur-Skripte.
- [x] **UI Polish:** Optimierung der Filterleisten mit robusten Sentinel-Werten (`null` statt Strings) zur Vermeidung von Namenskollisionen.

## Phase 12: Security & UX Foundations (Priorität: Hoch)

In dieser Phase werden kritische Sicherheitslücken in der User Experience geschlossen und das Notiz-System auf ein robustes Fundament gestellt.

### Security & Auth Evolution
- [x] **Persistent Auth (Refresh Tokens):**
    - Implementierung einer zweistufigen JWT-Strategie: Kurzlebige Access-Tokens kombiniert mit langlebigen Refresh-Tokens.
    - **Trust-Device Logic:** Einführung einer "Diesem Browser vertrauen"-Option im Login-Formular.
    - **Backend-Speicherung:** Refresh-Tokens werden in der Datenbank in der User-Entity gespeichert.
    - **Automatischer Refresh:** Der `Axios Interceptor` erkennt abgelaufene Access-Tokens und erneuert diese im Hintergrund.
    - **Session Cleanup:** Automatischer Logout und Bereinigung des Speichers, falls Tokens ungültig oder nicht mehr erneuerbar sind.
- [ ] **Refresh-Token Hardening (Follow-up):**
    - Gehashte Persistenz statt Klartextspeicherung in der Datenbank.
    - Rotierende Refresh-Tokens mit Invalidierung beim Reuse.
    - Einheitliche API-Fehlerantworten statt generischer Runtime-Exceptions.

### Notes System Refactoring (Markdown Document)
- [x] **Fundamental Model Refactoring:**
    - Umstellung von `NoteItem`-Listen auf ein einzelnes **Markdown-Dokument** pro Notiz.
    - **Vorteil:** Nahtlose Nutzung der bestehenden `react-markdown` Logik und einfache PWA-Synchronisation.
- [x] **Unified Content Editor:**
    - Integration eines Editors, der native Browser-Markierung und flüssiges Schreiben erlaubt (keine isolierten Input-Felder mehr).
- [x] **Mobile Touch-Targets:**
    - CSS-Anpassung der "Playful Chaos" Elemente: Vergrößerung der Klickflächen für mobile Geräte, ohne den chaotischen Look zu verlieren.
    - **Neu:** Mobile-spezifische Navigation zwischen Liste und Editor.

---

## Phase 12.5: Central Media & Asset Management (Priorität: Mittel)

Vermeidung von Redundanz durch Konsolidierung aller Upload-Logiken.

- [x] **Unified Upload Service:**
    - [x] Zentralisierung der Bildverarbeitung für Blogs, Projekte und Galerie (Backend-Service implementiert).
    - [x] Automatisches Löschen physischer Dateien bei Löschung von Einträgen.
- [x] **Image Optimization (WebP):**
    - [x] Automatische Konvertierung aller Uploads in das WebP-Format mittels Scrimage zur Reduzierung der PWA-Speicherlast.
- [ ] **Accessibility (Alt-Text):**
    - Nachrüsten von Alt-Text-Feldern in allen Admin-Modulen zur Verbesserung der Barrierefreiheit.

---

## Phase 12.8: Local Dev-Experience & Speedup (Abgeschlossen)

Maximale Beschleunigung des lokalen Workflows.

- [x] **Spring Boot DevTools:** Integration für automatische Restarts bei Codeänderungen.
- [x] **Spring Dev-Profile:**
    - [x] Trennung der Konfiguration: `application-dev.properties` für lokale Entwicklung.
    - [x] H2 In-Memory DB als Standard für ultraschnelle Startups.
    - [x] `spring.main.lazy-initialization=true` für Sekunden-Startup (Beans werden bei Bedarf geladen).
- [x] **JVM Speedup:** Konfiguration von Tiered Compilation (`-XX:TieredStopAtLevel=1`) im Maven-Plugin.
- [x] **Hibernate/Flyway Sync:** Flyway führt Migrationen aus, Hibernate validiert das Schema (sicherer und schneller).

---

## Phase 13: Dynamic Resume & Document Export (Priorität: Mittel)

Vollständige Unabhängigkeit von statischen Dateien und Mehrwert durch Export-Funktionen.

### Resume CRUD & Multilingual Editor
- [x] **Multilingual Admin-GUI:**
    - [x] Komplexes Formular zur parallelen Pflege von DE, EN und ES Inhalten.
    - [x] Backend-Support für bidirektionales Mapping aller Sprachen.
- [x] **Dynamic List Management:**
    - [x] Dynamisches Hinzufügen/Entfernen von Berufserfahrungen und Ausbildungsschreitten im UI.

### Document Export
- [ ] **PDF-Generator:**
    - Implementierung einer "Download as PDF" Funktion für den Lebenslauf, die das aktuelle "Playful Chaos" Design in ein druckoptimiertes Format überführt.

---

## Phase 14: AI Intelligence & Song Evolution (Priorität: Zukunft)

Intelligente Features zur Produktivitätssteigerung.

- [ ] **AI Assistant (Notes):**
    - Integration eines LLM-Dienstes (OpenAI oder lokal) zur Zusammenfassung und Stil-Optimierung von Notizen.
- [ ] **Song Engine Pro:**
    - Automatisierte Erkennung von Tonarten und Tuning-Vorschlägen basierend auf Songtexten.
- [ ] **Smart Undo:**
    - Snapshot-Mechanismus für KI-generierte Änderungen.
