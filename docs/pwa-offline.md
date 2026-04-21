# PWA & Offline-Strategie (JorchOS)

Dieses Dokument beschreibt die Architektur der Offline-Fähigkeit und die Synchronisation zwischen dem Spring Boot Backend und der lokalen IndexedDB.

---

## 1. Übersicht der Komponenten

*   **Vite PWA Plugin:** Verwaltet den Service Worker, das Manifest und das Caching der statischen Assets (JS, CSS, HTML, Fonts).
*   **Dexie.js:** Ein Wrapper für **IndexedDB**, der als lokaler Puffer für dynamische Daten fungiert.
*   **Service-Layer:** Die Frontend-Services (`shoppingListService`, `noteService`) entscheiden intelligent zwischen Online- und Offline-Quelle.

---

## 2. Datenfluss & Synchronisation

Das Projekt nutzt eine **"Cache-first with Remote-Sync"** Strategie für Lese-Operationen:

1.  **GET-Anfragen:** 
    *   Der Service versucht, Daten vom Server zu laden.
    *   Bei Erfolg: Lokale DB wird geleert und mit den neuen Server-Daten befüllt (Single Source of Truth).
    *   Bei Fehler (Offline): Daten werden direkt aus der IndexedDB (Dexie) geladen.
2.  **Schreib-Operationen (POST/PUT/DELETE):**
    *   Daten werden primär an den Server gesendet.
    *   Nach erfolgreicher Bestätigung wird die lokale DB aktualisiert.
    *   *Zukunft:* Implementierung einer "Background-Sync" Queue für Offline-Schreibvorgänge.

---

## 3. Datenbank-Schema (IndexedDB)

Die lokale Datenbank `JorchOS_LocalDB` enthält folgende Tabellen:

*   `listItems`: `++id, name, completed`
*   `notes`: `++id, title, content, pinned, archived, createdAt, updatedAt`

Die Notes bleiben im Frontend und Backend weiterhin als **Markdown-String** gespeichert. Der neue Notes-Editor rendert formatiert, arbeitet intern aber kompatibel zum bestehenden `noteService`-Vertrag (`content: string`).

---

## 4. Offline-Indikator

In der `App.tsx` wird der globale Status `navigator.onLine` überwacht.
*   Ein **Offline-Banner** (orange) erscheint am oberen Bildschirmrand, sobald die Verbindung unterbrochen wird.
*   Benutzer werden informiert, dass gespeicherte Daten weiterhin verfügbar sind.

---

## 5. Caching-Regeln (Service Worker)

*   **Google Fonts:** CacheFirst (Laufzeit: 1 Jahr).
*   **App Logic:** StaleWhileRevalidate (schneller Start, Update im Hintergrund).
*   **Projekt-Bilder:** StaleWhileRevalidate (begrenzt auf 20 Bilder), um den Speicherplatz auf dem Gerät zu schonen.
