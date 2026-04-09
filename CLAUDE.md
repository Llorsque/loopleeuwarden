# Regie — Claude instructies

## Over het project
Browsergebaseerde regietool voor evenementproductie. Gebouwd voor Loop Leeuwarden, bruikbaar voor elk event. Eén HTML-pagina zonder server of backend — alle data in localStorage.

## Bestandsstructuur
- `index.html` — alleen HTML-structuur, geen inline JS of CSS
- `style.css` — alle opmaak, CSS-variabelen en responsive regels
- `app.js` — alle logica, state, render-functies en event handlers
- `CLAUDE.md` — dit bestand

## Datamodel (in app.js)
```js
S = {
  event: { name, date },
  items: [],          // type: 'item' | 'sep' | 'cue'
  labels: [],         // { id, name, color }
  persons: [],        // string[]
  todos: { global: [], items: {} },
  entertainment: [],  // acts met financiën, rider, status
  huldigingen: [],    // prijsuitreikingen met benodigdheden
  vrijwilligers: [],  // naam, functie, locatie, bijzonderheden
  nextId: number
}
```

## Item types
- `item` — normaal onderdeel in regiepad (start, eind, wie, locatie, label, checklist, financiën)
- `sep` — sectieheader (alleen `name`)
- `cue` — voorbereidingsactie voor vrijwilligers (omschrijving, start, wie, bijzonderheden). Geen checklist, geen financiën

## Huisstijl
- Font: Inter (body) + JetBrains Mono (tijden, nummers)
- Sidebar: bijna-zwart `#161618`, accent oranje `var(--acc)` = `#f26522`
- Achtergrond: `#f4f4f2` (licht crème), kaarten: `#ffffff`
- CSS-variabelen staan bovenaan style.css in `:root`
- Geen inline styles toevoegen — gebruik bestaande CSS-klassen of voeg toe aan style.css

## Wat niet wijzigen
- De `localStorage`-sleutel `regie2` — data gaat anders verloren
- De conflictdetectie-logica in `conflicts()`
- De `initColResize()` functie en `COL_STORAGE_KEY`

## Taalgebruik
Alles in het **Nederlands**. Labels, knoppen, meldingen, comments in code.

## Bij twijfel
Voeg functies toe onderaan app.js. Voeg stijlen toe onderaan style.css. Raak de HTML-structuur van bestaande views zo min mogelijk aan.
