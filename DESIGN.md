# Design Guidelines - JorchOS

Dieses Dokument beschreibt die visuelle Identität und die Design-Philosophie von JorchOS.

## 1. Design-Philosophie: "Playful Chaos" / "Neo-Dada"

Das Design bricht bewusst mit den Regeln des sterilen, modernen Webdesigns. Es ist inspiriert von analogen Collagen, handgezeichneten Elementen und einer absichtlichen Imperfektion.

*   **Structure:** Vertikales One-Page Layout (Scrolling) für die Hauptnavigation.
*   **Imperfection:** Elemente dürfen leicht gedreht sein (`rotate(1.5deg)` oder `-1.2deg`), um den Effekt von "lose hingeworfenem Papier" zu erzeugen.
*   **Tactility:** Karten wirken wie aufgeklebte Papierstücke (Schatten, unregelmäßige `border-radius` Werte).

## 2. Farbpalette

*   **Background:** `#121212` (Dark) / `#fdf5e6` (Light - Warme Canvas-Farbe)
*   **Primary:** `#ff5cb8` (Pink / Akzentfarbe für Titel)
*   **Secondary:** `#98d8e7` (Light Blue)
*   **Text:** `#ffffff` (Dark Mode) / `#2f4f4f` (Light Mode)

## 3. Typografie

*   **Headlines:** `"Covered By Your Grace"`, cursive.
    *   Verströmt eine handgeschriebene, persönliche Note. Massive Größen (bis zu `8rem`) für Titel.
*   **UI / Body:** `"Space Grotesk"`, sans-serif.
    *   Basisgröße: `1.1rem`.
    *   Wird für Navigation, Buttons und Fließtext verwendet.

## 4. Komponenten-Stile

### "Project Cards" (Module Panel)
*   **Style:** Strukturierte Karten mit 8px Border-Radius.
*   **Shadow:** Subtile Schatten (`box-shadow: 0 4px 15px rgba(0,0,0,0.1)`).
*   **Layout:** Linksbündig ausgerichtet innerhalb des Containers.

### Blog-Stapel (Chaotic Pile)
*   **Konzept:** Karten werden wie physische Magazine auf einem Tisch "verstreut" präsentiert.
*   **Umsetzung:** Zufällige Rotationen (`rotate`) und Versätze (`translate`) innerhalb eines flexiblen Containers.
*   **Responsivität:** Auf großen Bildschirmen herrscht "kreatives Chaos"; auf mobilen Geräten (unter 1100px) wird automatisch in eine saubere, vertikale Liste umgeschaltet, um die Lesbarkeit zu garantieren.
*   **Interaktion:** Hover-Effekte heben Karten in den Vordergrund (`z-index`) und begradigen sie leicht.

### Retro-Buttons
*   Keine Skalierung beim Hovern, nur Rotation und Schatten-Verschiebung.
*   Nutzen die Headline-Schriftart für einen markanten Look.

## 5. Spezielle Features & Visuals

*   **Bild des Monats:** Monatliche Highlights werden prominent auf der Homepage präsentiert. 
    *   Bilder *mit* Hintergrund erhalten einen klassischen weißen Fotorahmen.
    *   Bilder *ohne* Hintergrund (transparent) stehen frei und erhalten im Dark Mode einen subtilen Glow für maximale Sichtbarkeit der schwarzen Linien.
*   **Reader-Modus (Short Stories):** Fokus auf ablenkungsfreie Typografie. Nutzung von `Space Grotesk` (oder ähnlichen sauberen Fonts) mit großzügigem Zeilenabstand für ein angenehmes Leseerlebnis.
### Modulare Sidebar (Songs):
*   Funktionale Trennung zwischen Navigation (Liste) und Inhalt (Viewer) für komplexe Daten wie Akkorde.

### Multi-Tag-Filterung
*   **Logik:** Erlaubt die Auswahl mehrerer Kategorien gleichzeitig.
*   **Verhalten:** Die Filterung arbeitet mit einer OR-Logik (Beiträge werden angezeigt, wenn sie mindestens einen der gewählten Tags besitzen).
*   **UI:** Filter-Buttons wechseln den Status beim Klicken; ein dedizierter "Alle"-Button setzt die gesamte Auswahl zurück.

## 6. Assets & Branding

*   **Logo/Favicon:** Basierend auf dem "Bär"-Design.
*   **Entry Point:** Die Homepage dient als zentrales Dashboard für alle Unterbereiche.
