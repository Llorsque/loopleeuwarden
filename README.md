# Regie — Event Regietool

Een lichtgewicht, browsergebaseerde regietool voor het plannen en beheren van events. Gebouwd voor Loop Leeuwarden.

## 🚀 Snel starten

Geen installatie nodig. Open `index.html` direct in Chrome, Firefox of Edge.

Alle data wordt lokaal opgeslagen via `localStorage` (sleutel: `regie2`).

---

## ▶ Regiepad — navigatie & live volgen

### Toetsenbordnavigatie
- **↑ / ↓** — navigeer item voor item door het regiepad
- **Enter / Spatie** — open/sluit draaiboek van het geselecteerde item
- Geselecteerd item krijgt een blauwe markering links

### Auto-follow (Amsterdam tijd)
- Klik **Auto** knop (rechtsboven in regiepad toolbar) om live volgen in te schakelen
- De tool checkt de huidige tijd (tijdzone Europe/Amsterdam) en markeert het actieve onderdeel
- Actief onderdeel krijgt een **gele markering** links + **▶ nu** badge
- Tijd wordt elke 20 seconden ververst
- Klik opnieuw om Auto uit te zetten

### Tabelweergave vs Tijdlijn
- **Tabel** — klassieke regiepad-tabel, geschikt voor detail en print
- **Tijdlijn** — Gantt-balk per onderdeel op een tijdas
  - Elke balk toont omschrijving + wie er verantwoordelijk is
  - FIXED-onderdelen hebben een dubbele rand
  - Met Auto aan: rode verticale lijn markeert het huidige tijdstip
  - Klik een balk/rij om die te selecteren

---

## 📋 Backoffice

Per onderdeel:
- **Basis**: omschrijving, start/eind, wie, locatie, label, fixed-markering, bijzonderheden
- **Draaiboek**: script/spreektekst, technische instructies, DJ-instructies
- **Checklist**: persoon gebrieft · script klaar · slide/video gereed · techniek getest
- **Financieel**: bedrag excl. btw + kortingspercentage
- **To-do's**: gekoppelde actiepunten per onderdeel

Beheer ook: labels (met kleur), personen (autocomplete), event naam & datum

---

## 🆕 Nieuw event

Klik **＋ Nieuw event** onderaan de sidebar:
- Leeg nieuw event aanmaken (naam + datum)
- Voorbeelddata laden (Loop Leeuwarden 2026)
- Alles wissen (met bevestiging)

Labels en personen blijven bewaard als sjabloon bij nieuw event.

---

## 🖨 Printen

Sidebar en knoppen verdwijnen automatisch. Alleen de tabel wordt afgedrukt.

---

## 💾 Data & opslag

- `localStorage` in je browser — geen server nodig
- Werkt volledig offline (na eerste laden van Google Fonts)
- Sleutel: `regie2`

---

## 🗂 Bestanden

```
regie-app/
├── index.html   ← volledige app (één bestand)
└── README.md    ← deze documentatie
```

Intern gebruik — Loop Leeuwarden / Stichting Gezonde Stad.
