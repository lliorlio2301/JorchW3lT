# Security & Auth Hardening

Diese Dokumentation beschreibt die konkret umgesetzten Hardening-Maßnahmen für den Authentifizierungs-Flow (Refresh Tokens).

---

## 1. Ziele der Härtung

- Keine Klartextspeicherung von Refresh Tokens in der Datenbank.
- Schutz gegen Replay alter Refresh Tokens.
- Konsistentes und explizites Fehlerverhalten bei ungültigen Refresh-Anfragen.
- Kompatibles Verhalten im Frontend bei tokenbasierter Session-Erneuerung.

---

## 2. Umgesetzte Backend-Änderungen

### A. Gehashte Persistenz von Refresh Tokens

- Datei: `backend/src/main/java/Jorch/w3Lt/Jorge/service/AuthenticationService.java`
- Statt Klartext wird der Refresh Token mit `PasswordEncoder` (BCrypt) gehasht gespeichert.
- Verifikation erfolgt über `passwordEncoder.matches(...)`.

### B. Rotierende Refresh Tokens

- Bei erfolgreichem `POST /api/auth/refresh-token` wird ein neuer Refresh Token erzeugt.
- Der alte Token wird dadurch effektiv invalidiert, weil nur der neue Hash persistiert bleibt.
- Die Refresh-Expiration wird bei Rotation neu gesetzt.

### C. JTI für Refresh Tokens

- Datei: `backend/src/main/java/Jorch/w3Lt/Jorge/service/JwtService.java`
- Refresh Tokens erhalten einen eindeutigen `jti`-Claim (`UUID`), um Token-Instanzen sauber zu unterscheiden.

### D. Expliziter Fehlervertrag

- Neue Exception: `InvalidRefreshTokenException`
  - Datei: `backend/src/main/java/Jorch/w3Lt/Jorge/exception/InvalidRefreshTokenException.java`
- Mapping in `GlobalExceptionHandler` auf:
  - Status: `401 Unauthorized`
  - JSON-Felder: `timestamp`, `status`, `error`, `message`
- `AuthController` behandelt fehlendes `refreshToken`-Feld ebenfalls über diese Exception (statt leerer `400` Response).

---

## 3. Umgesetzte Frontend-Änderungen

### A. Interceptor unterstützt Token-Rotation

- Datei: `frontend/src/services/api.ts`
- Bei `401` + erfolgreichem Refresh werden jetzt gespeichert:
  - neuer Access Token (`token`)
  - neuer Refresh Token (`refreshToken`), falls vorhanden

### B. Tests für Refresh-Flow erweitert

- Datei: `frontend/src/services/api.test.ts`
- Abgedeckte Szenarien:
  - Erfolgreiche Rotation und Retry der Originalanfrage
  - Bereinigung von Local Storage bei fehlgeschlagenem Refresh

---

## 4. Datenmodell & Migrationen

- Bestehende Spalten werden weiterhin genutzt:
  - `users.refresh_token`
  - `users.refresh_token_expiration`
- Es war keine neue Flyway-Migration nötig, da nur das Speicherformat (Klartext -> Hash) in der Anwendungsschicht geändert wurde.

---

## 5. Infrastruktur-Konsistenz (lokal)

- Datei: `docker-compose.yml`
- PostgreSQL-Image ist jetzt fully-qualified:
  - `docker.io/library/postgres:16-alpine`
- Hintergrund: bessere Kompatibilität mit Podman (Short-Name-Auflösung vermeiden).

---

## 6. Validierung

Nach Umsetzung wurden die bestehenden Test-Suiten erfolgreich ausgeführt:

- Backend: `cd backend && ./mvnw test`
- Frontend: `cd frontend && npm test -- --run`

