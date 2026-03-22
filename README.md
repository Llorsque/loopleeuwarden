# Regie — Event Regietool

Een lichtgewicht, browsergebaseerde regietool voor het plannen en beheren van sportevenementen en bedrijfsevents. Gebouwd voor Loop Leeuwarden, toepasbaar op elk event.

---

## 🚀 Snel starten

Geen installatie nodig. Open gewoon `index.html` in een moderne browser (Chrome, Firefox, Edge, Safari).

```
Dubbelklik op index.html
```

Alle data wordt lokaal opgeslagen in je browser via `localStorage`. Je kunt de tool offline gebruiken.

---

## 📋 Functionaliteiten

### Backoffice
Het centrale beheergedeelte waar je alles aanmaakt en beheert.

- **Onderdelen** toevoegen, bewerken en verwijderen
- **Secties** aanmaken voor overzichtelijke blokindeling (bijv. Ochtendprogramma, Middagprogramma)
- Per onderdeel invullen:
  - **Basis**: omschrijving, start/eindtijd, wie, locatie, label, fixed-markering, bijzonderheden
  - **Draaiboek**: script/spreektekst, technische instructies, DJ-instructies
  - **Checklist**: persoon gebrieft · script klaar · slide/video gereed · techniek getest
  - **Financieel**: bedrag (excl. btw) + kortingspercentage met live berekening
  - **To-do's**: gekoppelde actiepunten per onderdeel
- **Labels** aanmaken met eigen kleur
- **Personen** beheren voor autocomplete in "wie"-veld
- **Event naam & datum** aanpassen

### Regiepad
De read-only uitvoerweergave voor gebruik tijdens het event.

- Overzichtskaarten: aantal onderdelen, totale duur, gereedheidspercentage, conflicten
- Volledige tabel met secties, tijden, wie, locatie, label en gereed-status
- **Conflictdetectie**: tijdoverlap en dezelfde persoon op twee plekken
- **Fixed tijdstippen** worden gemarkeerd
- Klik een rij om het draaiboek uit te klappen
- Printfunctie (sidebar verdwijnt bij afdrukken)

### Financieel
Overzicht van alle kosten per onderdeel.

- Bedragen excl. btw
- Kortingspercentage wordt automatisch doorgerekend
- Overzicht per sectie
- Totaalrij met bruto, kortingen en nettobedrag
- Groen €-icoon in de lijst als kosten aanwezig zijn

### To-do's
- **Globale to-do's** voor het hele event
- **Per onderdeel** gekoppelde to-do's (beheerd via Backoffice → tab To-do's)
- Afvinken en verwijderen
- Badge in navigatie toont openstaande items

---

## 🆕 Nieuw event aanmaken

Klik op **"＋ Nieuw event"** onderaan de sidebar.

Je kunt:
- Een leeg nieuw event aanmaken met naam en datum
- Alle data wissen (volledig schoonvegen)
- Voorbeelddata laden (Loop Leeuwarden planning)

---

## 🖨 Printen

Klik op **"Print regiepad"** in de sidebar of de printknop in het Regiepad.  
De sidebar en knoppen verdwijnen automatisch. Alleen de regiepadtabel wordt afgedrukt.

---

## 💾 Data & opslag

- Alle data wordt opgeslagen in `localStorage` van je browser
- Sleutel: `regie_v3`
- Geen server, geen account, geen internet nodig na het eerste laden
- De Google Fonts worden wel online geladen (Barlow Condensed & Barlow)

> **Let op**: localStorage is persoonsgebonden en browsergebonden. Data is niet zichtbaar in andere browsers of op andere apparaten. Maak regelmatig een back-up via exportfunctie (toekomstige feature).

---

## 🗂 Bestandsstructuur

```
regie-app/
├── index.html      ← De volledige applicatie (één bestand)
└── README.md       ← Deze documentatie
```

De app is bewust als één HTML-bestand gebouwd voor maximale portabiliteit. Geen build-stap, geen dependencies, geen package manager.

---

## 🔮 Mogelijke uitbreidingen

- JSON export/import voor back-up en overdracht
- Meerdere events naast elkaar opslaan
- PDF-export per sectie of per persoon
- Versiehistorie (snapshots)
- Mobiele weergave voor gebruik op tablet tijdens event

---

## 🎨 Huisstijl

Gebaseerd op de huisstijl van [Loop Leeuwarden](https://loopleeuwarden.frl):
- Navy blauw (`#1e1c4a`) als primaire kleur
- Geel (`#ffd000`) als accentkleur
- Lettertype: Barlow Condensed (koppen) + Barlow (body)
- Licht crème achtergrond (`#f0efe9`) met witte kaarten

---

## 📝 Licentie

Intern gebruik — Loop Leeuwarden / Stichting Gezonde Stad.
