# Gemini Interaktions-Richtlinien (Projekt: Personal Portfolio)

## 1. Kommunikation & Stil
* **Sprache:** Erklärungen und Konzepte standardmäßig auf **Deutsch**.
* **Technischer Kontext:** Code-Beispiele, API-Definitionen, Fehlermeldungen und technisches Feedback konsequent auf **Englisch**.
* **Stil:** Präzise, lösungsorientiert und direkt (Senior Software Engineer Level).
* **Git-Workflow:** Nach jeder größeren Änderung am Code muss dieser in **kleinen, sinnvollen und logischen Gruppen** committet und gepusht werden. Jede Änderungseinheit sollte in sich abgeschlossen sein.

## 2. Tech-Stack & Architektur
* **Architektur:** Streng entkoppelter Stack. Kommunikation via REST-API.
* **Backend:** Spring Boot 3 (Java 21, Maven), Spring Data JPA, H2 (Local Dev) / PostgreSQL (Test/Prod), Flyway Migrations, MapStruct, Lombok.
* **Frontend:** React 19 (Vite), TypeScript, Axios, i18next.
* **Design-System:** "Playful Chaos" / "Neo-Dada" – Handschriftliche Typografie für Headlines, warme Canvas-Farben im Light Mode, unregelmäßige Formen und absichtliche Imperfektion (Drehungen).

## 3. Infrastruktur & Lokale Umgebung (Kritisch)
* **Container:** Es wird **Podman** (Rootless) statt Docker verwendet.
* **Testcontainers:** Singleton Container Strategie in `AbstractIntegrationTest`.
* **Umgebungsvariablen:** `DOCKER_HOST`, `TESTCONTAINERS_RYUK_DISABLED`.

## 4. Backend-Konventionen & Fixes
* **Flyway vs JPA:** `spring.jpa.defer-datasource-initialization=false` ist zwingend erforderlich.
* **i18n:** Lokalisierung erfolgt im Mapper via `@Context String locale`.
* **JPA Fetching:** Kern-Entitäten nutzen `FetchType.EAGER`.
* **Testing-Mandat:** Automatisierte Tests für Security, Datenmodelle und Services.

## 5. Frontend-Konventionen
* **Styles:** CSS-Variablen aus `index.css`. Font: "Zen Loop" (base), "Covered By Your Grace" (headlines).
* **PWA & Offline:** Die App nutzt `vite-plugin-pwa` und `Dexie.js`. Daten werden lokal gepuffert und synchronisiert.
* **Assets:** Projekt-Bilder in `frontend/public/projects/`. Blog-Bilder unter `/uploads/`.

## 6. Content-Konventionen (Blog)
* **Markdown:** Artikel via `react-markdown` gerendert.
* **Sprache:** Blog-Inhalte sind flexibel (DE, EN, ES).
* **Bilder:** Relative Pfade (`/uploads/...`) nutzen.

## 7. Dokumentations-Hygiene & Knowledge-Management
* **Aktualität:** Technische Entscheidungen zeitnah in `.md`-Dateien dokumentieren.
* **Bereinigung:** Veraltete Informationen proaktiv löscht oder als "Deprecated" markieren.

## 8. Git-Workflow (Branch-Strategie)
* **Feature-Isolierung:** Jede neue Entwicklung startet in einem eigenen **Feature-Branch**.
* **Synchronisation:** Branch mit `master` synchronisieren (`git pull origin master`) vor Abschluss.
* **Pull Requests:** Merge ausschließlich über Pull Requests.

## 9. Coding Standards & Qualität
* **TypeScript:** Die Verwendung von `any` ist streng untersagt.
* **Commits:** Conventional Commits Standard (z. B. `feat: ...`, `fix: ...`).
* **Sicherheit:** Secrets ausschließlich über `.env` (lokal) oder **GitHub Secrets** (Produktion).

## 10. Deployment-Sicherheit
* **Automatisierung:** Deployments ausschließlich über die CI/CD-Pipeline.
* **Rootless:** Container laufen unter dem User `jorchadmin`.

## 11. Native Image Best Practices (GraalVM)
* **AOT-Safety:** Vermeide stille Fehler in RuntimeHints. Nutze `TypeReference` für Runtime-Abhängigkeiten.
* **Vollständigkeit:** Reflection-Klassen (z.B. für JJWT) müssen präzise und vollständig registriert werden.
