# Auto Bildersuche 🚗

Eine Web-App, die **spezifische Bilder von einem konkreten Automodell** sucht und verschiedene Versionen anzeigt: Prototypen, erste Serienmodelle und Facelifts.

## Features

- 🔍 **Präzise Suche nach dem konkreten Modell** - Keine allgemeinen Markenbilder mehr!
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
   - Volkswagen Golf
   - BMW 3 Series
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

1. Gib ein **konkretes Automodell** in das Suchfeld ein
2. Klicke auf "Suchen" oder drücke Enter
3. Warte einen Moment, während die App Wikipedia durchsucht
4. Wechsle zwischen den Kategorien mit den Tabs

## Technische Details

- **API:** Wikipedia API (kostenlos, kein API-Key erforderlich)
- **Technologien:** HTML5, CSS3, Vanilla JavaScript
- **Design:** Modernes, responsives Design mit Inter Font
- **Browser-Unterstützung:** Alle modernen Browser

### Verbesserte Suchlogik

Die App nutzt jetzt eine **intelligente Suchstrategie**, um nur Bilder des konkreten Modells zu finden:

1. **Exakte Seiten-Suche:** Zuerst wird versucht, die genaue Wikipedia-Seite für das Modell zu finden
2. **Modellname-Mappings:** Automatische Umwandlung deutscher Modellnamen in englische (z.B. "BMW 3er" → "BMW 3 Series")
3. **Bildfilterung:** Nur Bilder, die den Modellnamen oder relevante Begriffe enthalten, werden angezeigt
4. **Kategoriespezifische Suche:** Jede Kategorie hat eigene Suchbegriffe für bessere Ergebnisse

## Tipps für beste Suchergebnisse

### ✅ Gute Suchbegriffe:
- **Volkswagen Golf** (nicht nur "VW" oder "Volkswagen")
- **BMW 3 Series** (nicht "BMW 3er" - wird aber automatisch umgewandelt)
- **Mercedes-Benz C-Class**
- **Porsche 911**
- **Ford Mustang**
- **Toyota Corolla**

### 🔧 Spezifische Modellbezeichnungen:
- **Volkswagen Golf Mk1** (für die erste Generation)
- **BMW E30** (für den 3er der 80er)
- **Mercedes-Benz W124** (für die E-Klasse Baureihe)
- **Porsche 993** (für den 911er der 90er)

### 🌐 Sprach-Tipps:
- **Englische Begriffe** funktionieren am besten auf Wikipedia
- Die App wandelt automatisch viele deutsche Begriffe um:
  - "BMW 3er" → "BMW 3 Series"
  - "Mercedes C-Klasse" → "Mercedes-Benz C-Class"
  - "VW Golf" → "Volkswagen Golf"

## Problembehebung

### Keine Ergebnisse gefunden?
- Versuchen Sie den **englischen Modellnamen**
- Geben Sie die **genaue Baureihenbezeichnung** ein (z.B. "BMW E30" statt "BMW 3er")
- Fügen Sie **Jahrgang** hinzu (z.B. "Volkswagen Golf 1974")

### Zu allgemeine Ergebnisse?
- Verwenden Sie **spezifischere Suchbegriffe**
- Die App filtert automatisch nach Bildern, die den Modellnamen enthalten

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
