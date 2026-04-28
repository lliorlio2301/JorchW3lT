# JorchOS - Personal Portfolio & Workspace

Willkommen zu meinem persönlichen Portfolio und digitalen Workspace! Dieses Projekt kombiniert eine moderne Web-Präsenz mit nützlichen Alltagswerkzeugen wie einer Einkaufsliste und einem privaten Notizsystem.

## 🚀 Key Features

- **Multilingual Portfolio:** Zeigt Lebenslauf, Projekte und Songbuch in DE, EN und ES.
- **Blog-System:** Minimalistischer Blog mit Markdown-Support, Image-Upload und **Tag-Filterung**.
- **Bild des Monats (Galerie):** Highlight-Feature auf der Homepage mit intelligentem Framing und Archiv-Ansicht.
- **Short Stories:** Dediziertes Modul für Kurzgeschichten mit Fokus auf Typografie und Reader-Modus.
- **AI Song Engine:** Erweitertes Songbuch mit Support für Akkorde, Tuning und Metadaten (optimiert für Gitarre).
- **Progressive Web App (PWA):** Vollständig offline-fähig für die Nutzung im Supermarkt oder unterwegs.
- **Modern Security:** Abgesichert mit JWT, Spring Security und BCrypt.
- **Optimized Performance:** Native Build via GraalVM für Startzeiten unter 1s und minimalen RAM-Verbrauch.

## 🛠 Tech Stack

- **Backend:** Spring Boot 3 (Java 21), Spring Data JPA, PostgreSQL, Flyway, MapStruct.
- **Frontend:** React 19 (Vite), TypeScript, Vitest, Playwright, Dexie.js (IndexedDB).
- **Infrastruktur:** Podman (Rootless), GitHub Actions (CI/CD), Nginx Reverse Proxy.

## 📦 Deployment & Entwicklung

Das Projekt wird automatisch via GitHub Actions auf einen Debian 12 VPS deployt.

### Lokale Entwicklung

1. **Backend (Dev-Profil):** `cd backend && ./mvnw spring-boot:run -Dspring-boot.run.profiles=dev`
2. **Frontend:** `cd frontend && npm install && npm run dev`
3. **Full-Stack via Podman Compose:** `podman-compose up -d` (alternativ: `docker compose up -d`, falls Docker lokal genutzt wird)

### Dokumentation

Detaillierte Informationen findest du in den spezialisierten Guides:
- [Infrastruktur & VPS](./docs/infrastructure.md)
- [Testing & QA](./docs/testing.md)
- [PWA & Offline-Strategie](./docs/pwa-offline.md)
- [Security & Auth Hardening](./docs/security-auth-hardening.md)
- [Projekt-Roadmap](./ROADMAP.md)

## 📄 Lizenz

Dieses Projekt ist für den persönlichen Gebrauch bestimmt. Alle Inhalte unterliegen dem Urheberrecht.
