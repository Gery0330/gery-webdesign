# Gery Webdesign: Design-System

Redesign der Portfolio-Website. Inhalte, Texte, Seitenstruktur und Sprache bleiben unverändert.
Grundlage ist **ui-ux-pro-max v2.15.0**. Die Rohausgabe der Suche steht im [Anhang](#anhang-rohausgabe).
Sicherungskopie vor dem Redesign: `../gery-webdesign-backup/` (52 Dateien, Stand vor jeder Änderung).

```
search.py "freelance web designer portfolio small business premium" --design-system --variance 4 --motion 4 --density 4 -p "Gery Webdesign"
search.py "luxury premium dark gold elegant" --domain style
search.py "luxury premium gold black" --domain color
search.py "premium modern professional elegant" --domain typography
search.py "contrast focus keyboard form error" --domain ux
```

## 1. Entscheidungen

| Bereich | Vorschlag des Tools | Umgesetzt | Begründung |
|---|---|---|---|
| Muster | Scroll-Triggered Storytelling | **Übernommen, dezent** | Die vorhandene Kapitelfolge (01 Leistungen bis 07 Kontakt) ist bereits so aufgebaut: ein Mini-CTA pro Kapitel, Abschluss im Kontakt. Bei reduzierter Bewegung ist sofort alles sichtbar. |
| Stil | Liquid Glass („Best for: navigation, controls“) | **Nur für Header und Mobile-Menü**, sonst ruhige Flächen mit feinen Linien | Das Tool empfiehlt den Stil selbst nur für Bedienleisten; großflächiges Glas kostet Performance und Kontrast. |
| Farbe | Luxury/Premium Brand: Schwarz `#1C1917`, Gold `#A16207`, Grund `#FAFAF9` | **Übernommen**, abgestimmt auf das bestehende Logo-Gold | Das Logo ist bereits schwarz und gold. `#A16207` erreicht auf Flächen nur 4,36:1 und dient deshalb nur dekorativ; Text in Gold verwendet `#854D0E`. |
| Schrift | Cormorant + Montserrat (Mode, Schmuck) | **„Classic Elegant“: Inter + Playfair Display** (ebenfalls Vorschlag des Tools) | Inter war bereits lokal eingebunden. Playfair Display Italic schmückt nur die goldenen Hervorhebungen (`<em>` in den Überschriften). Cormorant wirkt für Handwerk und KMU zu modisch. |
| Schrift-Hosting | Google Fonts | **Lokal, `woff2`** | Keine Datenübertragung an Google (DSGVO). Die Originale (`woff`) liegen weiter im Ordner. |
| Regler | variance 4 · motion 4 · density 4 | **Übernommen** | Ausgewogen, mit Standard-Bewegung und luftiger Dichte |

## 2. Design-Token

### Farben (WCAG gemessen)
| Token | Dunkel | Hell | Kontrast (schlechtester Grund) |
|---|---|---|---|
| `--bg` | `#0C0D10` | `#FAFAF9` | n/a |
| `--bg-2` (Wechselabschnitte) | `#121317` | `#F3F1EC` | n/a |
| `--card` | `#17181D` | `#FFFFFF` | n/a |
| `--fg` | `#F4F2EE` | `#0C0A09` | 15,85 / 17,50 |
| `--muted` | `#A9AAAE` | `#57534E` | 7,64 / 6,76 |
| `--muted-2` | `#8F9096` | `#6B655F` | 5,57 / 5,09 |
| `--gold-text` | `#E2C48D` | `#854D0E` | 10,56 / 6,07 |
| `--gold` (Deko, Linien) | `#C9A76E` | `#A16207` | nur nicht-textlich |
| `--field` (Eingaberahmen) | `#70727B` | `#8A847D` | mindestens 3:1 (Bedienelement) |
| Button Gold | Verlauf `#E6C88F` → `#C9A76E`, Text `#17130C` | gleich | 8,14 bis 11,48 |

### Abstände, Radien, Schatten
- Abstände: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 px; Abschnitte `clamp(72px, 8vw, 120px)`
- Radien: `--r-sm` 8 px · `--r` 12 px · `--r-lg` 18 px · `--r-pill` 999 px
- Schatten: `--shadow-sm`, `--shadow`, `--shadow-lg`, je Modus abgestimmt (im Dunkelmodus tief, im Hellmodus warm getönt)
- Übergänge: 180 ms (Farbe) und 280 ms (Bewegung), Kurve `cubic-bezier(.2,.7,.2,1)`

### Typografie (fließend)
| Stufe | Wert |
|---|---|
| Fließtext | `clamp(16px, 15.4px + .2vw, 17px)`, Zeilenhöhe 1,7 |
| H1 | `clamp(40px, 4.6vw + 14px, 76px)`, Laufweite −0,03 em |
| H2 | `clamp(30px, 2.6vw + 16px, 50px)` |
| H3 | `clamp(19px, .5vw + 16px, 24px)` |
| Hervorhebung `<em>` | Playfair Display Italic 500, Gold |
| Eyebrow | 12 px, 600, Laufweite 0,16 em, Versalien |

## 3. Komponenten nach 21st.dev
Das Tageslimit für Code-Abrufe war erreicht, deshalb dienten die Vorschaubilder als Referenz. Alles ist in Vanilla HTML und CSS nachgebaut und an die Token angepasst.

| Bereich | Vorlage (21st.dev) | Übernommen |
|---|---|---|
| Navigation | **Header 1** (efferd) | klebender Glas-Header, der beim Scrollen dichter wird; Mobile-Menü als Panel mit Fokusfalle |
| Hero | **Hero with Dashboard Mockup** (felipemenezes098) | Serifen-Akzent in der Überschrift, Medienfeld, schwebendes Etikett innerhalb des Rahmens |
| Leistungs- und Konzeptkarten | **Feature Grid Spotlight Cards** (mohammadshehadeh) | feine Linien, Eckmarken, warmer Schein oben, Lichtkegel folgt dem Zeiger |
| Preise und Vergleich | **Pricing Section with Frequency Toggle** (efferd) | Karten mit Kopf, Trennlinie, Liste und Fuß; empfohlenes Paket mit Goldrahmen |
| Kontaktformular | **Contact Form** (kevingirelli) | zweispaltig: Kontaktdaten links, Formular-Karte rechts, Prüfung mit Zuständen |
| Footer | **Newsletter Footer** (meschacirung) | Marke mit Ort, drei Linkspalten, gepunktete Trennlinie (ohne Newsletter, da nicht im Inhalt) |

## 4. UX-Regeln (ui-ux-pro-max, Priorität 1 bis 3)
- Kontrast mindestens 4,5:1 für Text und 3:1 für Bedienelemente, in beiden Modi gemessen
- Sichtbarer Fokus: 2 px Goldring mit 3 px Abstand; `scroll-padding-top`, damit der klebende Header nichts verdeckt
- Tastatur: Mobile-Menü mit Fokusfalle, Esc und `inert`; FAQ mit nativem `<details>`; Theme-Schalter als Button mit wechselndem Label
- Formular: sichtbare Labels, Fehlermeldung direkt am Feld (`aria-invalid`, `aria-describedby`), Fokus auf das erste fehlerhafte Feld, Statusmeldung über `aria-live`
- Bedienelemente mindestens 44 × 44 px
- `prefers-reduced-motion`: keine Einblendungen, kein Lichtkegel, kein sanftes Scrollen
- Bilder: WebP, `loading="lazy"` außer im Hero, feste `width`/`height`, damit nichts springt
- SVG-Icons aus einem einheitlichen Strichsatz; keine Emojis

## 5. Checkliste vor der Auslieferung (Prüfprotokoll)
Geprüft in headless Edge mit axe-core 4.10 (WCAG 2.0 bis 2.2 A/AA und Best Practices), auf 7 Seiten in beiden Modi.

| Prüfpunkt | Ergebnis |
|---|---|
| axe auf allen 7 Seiten, hell und dunkel | **0 Verstöße** (vorher: Kontrast des Golds auf hellem Grund, falsche Überschriften-Hierarchie im Footer, weiße Schrift auf hellen Farbfeldern) |
| 375, 390, 844 × 390, 768, 1024, 1920 px sowie 200 % Schrift | kein horizontales Scrollen |
| Bedienelemente mindestens 44 px | bestanden |
| Tastatur | logische Reihenfolge, sichtbarer Fokus; das Mobile-Menü hält den Fokus (Fokusfalle, Esc, `inert`) |
| Formular | deutsche Fehler direkt am Feld, Fokus auf das erste fehlerhafte Feld, Statusmeldung |
| Hell/Dunkel | Wahl gespeichert (`gery-theme`) und auf allen Seiten übernommen |
| `prefers-reduced-motion` | keine Einblendungen und kein sanftes Scrollen; alles sofort sichtbar |
| Konsole | keine Fehler |

---

## Anhang: Rohausgabe

```markdown
## Design System: Gery Webdesign

### Design Dials
- **Variance:** 4/10 — Balanced / Modern
- **Motion:** 4/10 — Standard
- **Density:** 4/10 — Standard

### Pattern
- **Name:** Scroll-Triggered Storytelling
- **Conversion Focus:** Keep the narrative understandable without scroll-driven effects. Use progress indicator. Mobile: simplify animations. Keep DOM reading order complete; disable parallax and scroll-scrub under reduced motion. Pause scroll animation when offscreen or hidden and render each chapter in its final readable state under reduced motion.
- **CTA Placement:** End of each chapter (mini) + Final climax CTA
- **Color Strategy:** Progressive reveal. Each chapter has distinct color. Building intensity.
- **Sections:** Intro hook > Chapter 1 (problem) > Chapter 2 (journey) > Chapter 3 (solution) > Climax CTA

### Style
- **Name:** Liquid Glass
- **Mode Support:** Light supported | Dark supported
- **Keywords:** dynamic material, optical glass, translucency, lensing, refraction, fluid morphing, system navigation
- **Best For:** Apple-platform navigation, controls, and system-aligned app chrome
- **Performance:** cost:moderate|drivers:animation,blur | **Accessibility:** risk:conditional|requires:contrast-text-4.5,keyboard,visible-focus,reduced-motion

### Colors
| Role | Hex | CSS Variable |
|------|-----|--------------|
| Primary | `#1C1917` | `--color-primary` |
| On Primary | `#FFFFFF` | `--color-on-primary` |
| Secondary | `#44403C` | `--color-secondary` |
| On Secondary | `#FFFFFF` | `--color-on-secondary` |
| Accent/CTA | `#A16207` | `--color-accent` |
| On Accent/CTA | `#FFFFFF` | `--color-on-accent` |
| Background | `#FAFAF9` | `--color-background` |
| Foreground | `#0C0A09` | `--color-foreground` |
| Card | `#FFFFFF` | `--color-card` |
| Card Foreground | `#0C0A09` | `--color-card-foreground` |
| Muted | `#E8ECF0` | `--color-muted` |
| Muted Foreground | `#475569` | `--color-muted-foreground` |
| Border | `#D6D3D1` | `--color-border` |
| Destructive | `#DC2626` | `--color-destructive` |
| On Destructive | `#FFFFFF` | `--color-on-destructive` |
| Ring | `#1C1917` | `--color-ring` |

*Notes: Premium black + gold accent [Accent adjusted from #CA8A04]*

### Typography
- **Heading:** Cormorant
- **Body:** Montserrat
- **Mood:** luxury, high-end, fashion, elegant, refined, premium
- **Best For:** Fashion brands, luxury e-commerce, jewelry, high-end services
- **Google Fonts:** https://fonts.googleapis.com/css2?family=Cormorant:wght@400;500;600;700&family=Montserrat:wght@300;400;500;600;700&display=swap
- **CSS Import:**
```css
@import url('https://fonts.googleapis.com/css2?family=Cormorant:wght@400;500;600;700&family=Montserrat:wght@300;400;500;600;700&display=swap');
```

### Key Effects
Lensing and refraction, adaptive translucency, and fluid morph transitions aligned to Apple platform behavior

### Motion
**Stagger List** (Standard) — Trigger: load or scroll | Duration: 300-450ms | Easing: `back.out(1.4)`
```js
gsap.from('.grid-item', { opacity: 0, scale: 0.92, y: 16, duration: 0.4, stagger: { each: 0.06, from: 'start', grid: 'auto' }, ease: 'back.out(1.4)' });
```
*Framework notes: grid: 'auto' lets GSAP infer rows/columns from a CSS grid layout for a natural wave stagger; Use matchMedia('(prefers-reduced-motion: reduce)') to skip non-essential motion and render the final state immediately*
- ✅ Combine with from: 'center' for a bento-grid layout to draw the eye inward first
- ❌ Don't use back.out on dense data tables; the overshoot reads as sloppy on informational UI

### Avoid (Anti-patterns)
- Cheap visuals
- Fast animations

### Pre-Delivery Checklist
- [ ] No emojis as icons (use SVG: Heroicons/Lucide)
- [ ] cursor-pointer on all clickable elements
- [ ] Hover states with smooth transitions (150-300ms)
- [ ] Light mode: text contrast 4.5:1 minimum
- [ ] Focus states visible for keyboard nav
- [ ] prefers-reduced-motion respected
- [ ] Responsive: 375px, 768px, 1024px, 1440px

```
