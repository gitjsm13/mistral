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

## Schnellstart

1. **Lokal verwenden:**
   - Einfach die `index.html` in einem Browser öffnen
   - Die App funktioniert sofort im Demo-Modus

2. **Mit echter Unsplash API:**
   - Registriere dich bei [Unsplash Developer](https://unsplash.com/developers)
   - Erstelle eine neue Anwendung
   - Erhalte deinen API-Key
   - Ersetze `YOUR_UNSPLASH_ACCESS_KEY` in `app.js` mit deinem Key

## Dateistruktur

```
auto-bildersuche/
├── index.html      # Haupt-HTML-Datei
├── styles.css      # CSS-Stile
├── app.js          # JavaScript-Logik
└── README.md       # Diese Datei
```

## Verwendung

1. Gib ein Automodell in das Suchfeld ein (z.B. "BMW 3er", "Volkswagen Golf", "Porsche 911")
2. Klicke auf "Suchen" oder drücke Enter
3. Warte einen Moment, während die App Bilder sucht
4. Wechsle zwischen den Kategorien mit den Tabs

## Technische Details

- **API:** Unsplash API (kostenlos, Registrierung erforderlich für volle Funktionalität)
- **Technologien:** HTML5, CSS3, Vanilla JavaScript
- **Design:** Modernes, responsives Design mit Inter Font
- **Browser-Unterstützung:** Alle modernen Browser

## Demo-Modus

Ohne API-Key läuft die App im Demo-Modus mit Platzhalterbildern. Für echte Suchergebnisse ist ein Unsplash API-Key erforderlich.

## Lizenz

Diese App ist Open Source und kann frei verwendet werden. Die Bilder stammen von Unsplash und unterliegen deren Lizenzbedingungen.

## Beitragen

1. Repository forken
2. Feature-Branch erstellen (`git checkout -b feature/amazing-feature`)
3. Änderungen commiten (`git commit -m 'Add amazing feature'`)
4. Pushen (`git push origin feature/amazing-feature`)
5. Pull Request öffnen

---

Erstellt mit ❤️ für Autoliebhaber
