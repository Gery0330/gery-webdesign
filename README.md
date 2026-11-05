# Gery Webdesign – Portfolio

## Struktur
- `index.html` – Startseite (Hero, Leistungen, Preise, Projekte, Über mich, Ablauf, FAQ, Kontakt)
- `projekte/heizung|fitnessstudio|restaurant/index.html` – Projektseiten zu den drei Demos
- `impressum.html`, `datenschutz.html` – **Vorlagen mit Platzhaltern** (siehe unten)
- `404.html`, `robots.txt`
- `style.css`, `script.js` – gemeinsam für alle Hauptseiten
- `assets/` – `logo.png` (Original), daraus abgeleitet: `logo-full.png`, `logo-mark.png`, `logo-horizontal*.png`, Favicons, `og-image.jpg`; `fonts/` (Inter, SIL OFL, lokal); `images/` (`hero-webdesign.svg` ist eine eigene, urheberrechtsfreie Illustration)
- `demo-waermewerk/` (Starter), `demo-fitness/` (Business), `demo-restaurant/` (Premium) – eigenständige Demos, unverändert

## Lokal ansehen
`index.html` im Browser öffnen oder mit VS Code „Live Server“.

## Vor der Veröffentlichung
1. `gery.webdesign@gmail.com` in `index.html`, `script.js` (Konstante `CONTACT_MAIL`) und den Seiten prüfen/ersetzen.
2. `impressum.html` und `datenschutz.html` ausfüllen (markierte Platzhalter, Hoster, Datum), rechtlich prüfen lassen und den Hinweiskasten entfernen.
3. Sobald die Domain feststeht: `canonical`, `og:url` und absolute `og:image`-URL (`assets/og-image.jpg`) in die `<head>`-Bereiche ergänzen, ggf. `sitemap.xml` anlegen.
4. Demos sind fiktiv; jede Demo-Seite zeigt oben einen Hinweis, dass Telefonnummern, E-Mail-Adressen und Adressen erfunden sind, und tel:/mailto:-Links sind deaktiviert. Sie laden Google-Schriften bzw. Unsplash-Bilder von Drittanbietern – für den Echtbetrieb lokal einbinden oder in der Datenschutzerklärung erwähnen.
5. **Kontaktformular:** öffnet Gmail im neuen Tab mit vorausgefüllter Nachricht an `gery.webdesign@gmail.com` (kein Server nötig). Alle E-Mail-Links der Hauptseiten öffnen ebenfalls Gmail.
6. `404.html` setzt auf eigener Domain `<base href="/">`; auf einer github.io-Projektseite können tiefe Pfade ungestylt erscheinen.

## GitHub Pages
Repository erstellen, Dateien hochladen, Settings → Pages → Deploy from a branch → `main` → `/ (root)`.

## Pakete
Starter 299 € · Business 499–699 € · Premium (Business Plus) 899–1.299 € – jeweils einmalige Erstellungspauschalen.
