# Auto Bildersuche 🚗

Eine Web-App, die Bilder von Autos nach Modell sucht und verschiedene Versionen anzeigt: Prototypen, erste Serienmodelle und Facelifts.

## Features

- 🔍 Suche nach jedem Automodell
- 📸 Bis zu 10 Bilder pro Kategorie
- 🏷️ Drei Kategorien:
  - Prototypen (Konzeptfahrzeuge)
  - Erste Serienmodelle (Originalversionen)
  - Facelifts (Modellpflegen)
- 🎨 Aufgehübschtes, sachliches Design
- 📱 Responsive für alle Geräte
- 🌍 **Bilder von Wikipedia** - Hochwertige, historische Autofotos

## Schnellstart

1. **Lokal verwenden:**
   - Einfach die `index.html` in einem Browser öffnen
   - Die App funktioniert sofort mit der Wikipedia API (kein API-Key erforderlich!)

2. **Beispiel-Suchen:**
   - BMW 3 Series
   - Volkswagen Golf
   - Mercedes-Benz C-Class
   - Porsche 911
   - Ford Mustang

## Dateistruktur

```
auto-bildersuche/
├── index.html      # Haupt-HTML-Datei
├── styles.css      # CSS-Stile
├── app.js          # JavaScript-Logik
└── README.md       # Diese Datei
```

## Verwendung

1. Gib ein Automodell in das Suchfeld ein (z.B. "BMW 3 Series", "Volkswagen Golf")
2. Klicke auf "Suchen" oder drücke Enter
3. Warte einen Moment, während die App Wikipedia durchsucht
4. Wechsle zwischen den Kategorien mit den Tabs

## Technische Details

- **API:** Wikipedia API (kostenlos, kein API-Key erforderlich)
- **Technologien:** HTML5, CSS3, Vanilla JavaScript
- **Design:** Modernes, responsives Design mit Inter Font
- **Browser-Unterstützung:** Alle modernen Browser

### Wikipedia API Details

Die App nutzt folgende Wikipedia API-Endpunkte:
- `action=query&list=search` - Suche nach relevanten Wikipedia-Seiten
- `action=query&prop=images` - Hole Bilder von einer Seite
- `action=query&prop=imageinfo` - Hole Metadaten zu Bildern

## Tipps für bessere Suchergebnisse

1. **Englische Begriffe verwenden:** Die Wikipedia-Suche funktioniert am besten mit englischen Begriffen
   - ❌ "Volkswagen Golf"
   - ✅ "Volkswagen Golf" oder "Golf Mk1"

2. **Spezifische Modellbezeichnungen:**
   - "BMW E30" statt nur "BMW 3er"
   - "Mercedes-Benz W124"
   - "Porsche 993"

3. **Jahrgang angeben:**
   - "Ford Mustang 1965"
   - "Toyota Corolla 1980"

## Lizenz

Diese App ist Open Source und kann frei verwendet werden. Die Bilder stammen von Wikipedia und unterliegen deren Lizenzbedingungen (meist Creative Commons oder Public Domain).

## Beitragen

1. Repository forken
2. Feature-Branch erstellen (`git checkout -b feature/amazing-feature`)
3. Änderungen commiten (`git commit -m 'Add amazing feature'`)
4. Pushen (`git push origin feature/amazing-feature`)
5. Pull Request öffnen

---

Erstellt mit ❤️ für Autoliebhaber | Daten von [Wikipedia](https://wikipedia.org)
