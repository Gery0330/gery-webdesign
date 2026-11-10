# PULSEFIT Training Club – Business-Paket (5 Seiten)

Fiktives Fitnessstudio als Beispiel für das **Business-Paket (99 €/Monat)** von Gery Webdesign.

## Was das Business-Paket enthält – und wo es in der Demo zu sehen ist
| Leistung laut Preisliste | In der Demo |
|---|---|
| Bis zu fünf Unterseiten | `index.html`, `training.html`, `team.html`, `mitgliedschaft.html`, `kontakt.html` |
| Individuelles Design | Anthrazit + Limettengrün, Barlow Condensed, Ken-Burns-Hero, Marquee, Scroll-Animationen |
| Leistungen und Referenzen | Trainingsbereiche und Kursplan; Referenzen-Slider mit Mitgliederberichten (fiktiv) |
| Kontaktformular | `kontakt.html` mit Prüfung, Themenauswahl und Bestätigungsansicht |
| Grundlegende Suchmaschinenoptimierung | Seitentitel und Beschreibungen, Canonical, Open Graph, strukturierte Daten (ExerciseGym, FAQPage, BreadcrumbList), Brotkrumen, `sitemap.xml`, `robots.txt` |

Bewusst **nicht** enthalten (gehört zu Premium): Bildergalerie, Termin-/Buchungsfunktionen.

## Dateien
- `*.html` – die fünf Seiten
- `style.css`, `script.js` – Design und Funktionen (ohne Bibliotheken)
- `sitemap.xml`, `robots.txt` – SEO-Grundlagen

## Hinweise
- Die Formularanfrage wird **nicht** gesendet oder gespeichert. Für den Echtbetrieb braucht es einen Versanddienst oder ein Backend.
- `sitemap.xml`, Canonical-Links und `og:image` verwenden den Platzhalter `https://www.gery-webdesign.at/demo-fitness/`. Wenn die Demo nicht in Suchmaschinen auftauchen soll, `<meta name="robots" content="noindex">` ergänzen.
- Zwei Fotos stammen von Unsplash (Unsplash-Lizenz) und liegen lokal in `img/`; ohne Foto bleibt ein dunkler Verlauf als Fallback. Schriften liegen lokal in `fonts/`. Die Team-Porträts sind Platzhalter.
- Alle Namen, Preise, Zeiten und Aussagen sind fiktiv.
