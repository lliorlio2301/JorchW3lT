# Frontend (React 19 + Vite + TypeScript)

Dieses Frontend ist die UI für das Personal-Portfolio mit Blog, Kurzgeschichten, Songbook, Galerie und Admin-Funktionen.

## Voraussetzungen

- Node.js 20+
- npm

## Lokale Entwicklung

```bash
npm install
npm run dev
```

Standardmäßig läuft die App mit Vite unter `http://localhost:5173`.

## Verfügbare Skripte

- `npm run dev` - Startet den lokalen Dev-Server.
- `npm run build` - TypeScript Build + Vite Production Build.
- `npm run lint` - Führt ESLint aus.
- `npm run test` - Führt Vitest Test-Suite aus.
- `npm run test:e2e` - Führt Playwright E2E-Tests aus.

## Architekturhinweise

- Internationalisierung mit `i18next`.
- API-Kommunikation über Axios inkl. Token-Handling via Interceptors.
- PWA/Offline-Strategie mit `vite-plugin-pwa` und lokaler Persistenz über Dexie.js.

## Weitere Doku

- Root README: `../README.md`
- Testing: `../docs/testing.md`
- PWA/Offline: `../docs/pwa-offline.md`
