# CHRONICLE 24 — The Time-Travel Newsroom

Een interactieve klas-pagina voor de Engelse les. De klas is één nieuwsredactie
die **door de tijd** kan uitzenden. De tijdmachine is stuk, dus bronnen uit
verschillende eeuwen lopen door elkaar. Aflevering 1: **Titanic — The Final
Broadcast** (Londen, 1912).

Leerlingen ontvangen live binnenkomende berichten en moeten telkens twee vragen
uit elkaar houden:

1. **Is de informatie waar?**
2. **Kan de bron authentiek zijn?** (past de bron wel in 1912?)

## Kerngrammatica die geoefend wordt

Bewust beperkt tot drie tijden, gekoppeld aan zekerheid:

| Tijd | Wanneer | Voorbeeld |
|------|---------|-----------|
| **Present continuous** | live — wat er nú gebeurt | *Passengers **are entering** the lifeboats.* |
| **Simple past** | bevestigd, afgesloten feit | *The ship **struck** an iceberg at 23:40.* |
| **Simple present** | koppen, feiten én attributie (say/claim) | *The company **says** there **is** no danger.* |

De rode draad: *is sinking* (live) → *passengers say…* (bewering) → *sank*
(bevestigd). Dat kleine taalverschil bepaalt of een kop klopt.

## Beeld en geluid

Elk bericht krijgt bovenaan een **getekend beeld** (inline SVG/CSS, geen externe
bestanden) dat *laat zien* wat er binnenkomt: de ijsberg-aanvaring, de
overstromende gang met stijgend water, een zeekaart met CQD-coördinaten, de
reddingsboten op het dek, het kantelende, zinkende schip, en de twee "besmette"
beelden — een te moderne **radar-scope** en een **smartphonefoto**. Er zijn
**uitgesproken animaties** (regen, radarsweep, knipperende lichten, stijgend
water, het schip dat wegzakt).

Bij elk bericht klinkt een **gesynthetiseerd geluid** (Web Audio, ook volledig
in het bestand): morse voor CQD, scheepsgekreun + plons bij het zinken, en
bewust *foute* moderne geluiden bij de vallen (sonar-ping bij "radar", een
telefoontoon bij de smartphonefoto). Geluid start pas na de klik op
**"Take positions & go live"** (browserregel). Met de **🔊-knop** in de balk
zet je het geluid aan/uit.

## Grammar-boxes "just-in-time"

Zodra een kern-tijd voor het eerst op het scherm verschijnt, klapt er in dat
bericht een klein uitlegkaartje open (vorm + gebruik + voorbeeld). Zo krijgen
leerlingen de uitleg precies op het moment dat ze de tijd tegenkomen: **simple
past** (bericht 1), **present continuous** (bericht 2), **simple present**
(bericht 3). Elke tijd wordt maar één keer geïntroduceerd.

## Eindtaak — schrijven & inspreken

Via de knop **✍ Article** (licht op zodra de uitzending klaar is) opent de
studio waarin leerlingen hun nieuwsartikel of uitzend-script maken:

- **Schrijven** met kop + tekstvak;
- **Zin-starters** per tijd en een **newsroom phrasebook** (attributie &
  onzekerheid: *says that, claims that, reportedly, According to…*) die je met
  één klik invoegt;
- een **feitenoverzicht** van wat er tijdens de uitzending binnenkwam;
- een **zelf-checklist** vóór publiceren;
- **Inspreken**: neem je uitzending op met de microfoon (📖 teleprompter om van
  af te lezen), speel af en download als audiobestand;
- **Bewaar** (lokaal) en **Download .txt**. Opnemen werkt het betrouwbaarst
  wanneer je het bestand lokaal opent en microfoontoegang geeft.

## Actieve rollen, bronnencheck & nabespreking

- **Rollen met taken.** Op het tabblad *Roles* heeft elke rol nu een eigen
  missie met afvinkbare taken (de Interviewer typt bv. 3 vragen in), zodat elke
  leerling steeds iets te dóén heeft.
- **Twee-vragen-bronnencheck.** De 🚩-knop bij elk bericht opent twee vragen —
  *Kan de informatie waar zijn?* en *Kan de bron echt zijn in 1912?* — en geeft
  daarna feedback. Zo leren leerlingen het verschil tussen *anachronisme* (bron
  onmogelijk) en *manipulatie* (bron echt, maar liegt). De vragen staan op élk
  bericht, zodat niet verklapt wordt welke besmet zijn.
- **Nabespreking in de studio.** Onderin de eindtaak-studio zitten
  reflectievragen, een **beoordelingsrubric**, een **voorbeeldartikel** (pas
  openklappen als je klaar bent) en een **historische onthulling** (o.a. dat
  echte kranten in 1912 ook "iedereen gered" meldden).

## Uitleg voor leerlingen & uiterlijk

- **Instructiekaart (❓ How it works).** Een stap-voor-stap uitleg in eenvoudig
  Engels (9 stappen + de "gouden regel": *Is it true? / Can the source be real in
  1912?*). Bereikbaar via de knop op het startscherm én de **❓** in de balk; de
  stappen staan ook bovenaan het printbare werkblad.
- **Licht thema.** De interface is licht; de scene-beelden blijven donker en zien
  er zo uit als schermen/monitors in de redactie.

## Interview, woordenschat, print & niveau

- **🎤 Interview (geanimeerd).** Een geanimeerde tv-interview-mode voor twee
  leerlingen: reporter × ooggetuige, met bewegende avatars, animerende
  geluidsbalken, lower-third naambanners en een "speaking"-knop om beurten te
  wisselen. Kies uit vier personages (stoker, uitkijk, first-class passagier,
  officier), elk met een korte in-role achtergrond, en loop door acht
  interviewvragen (per tijd getagd). Opnemen kan ook.
- **Vocab (tabblad).** Een pre-teach woordbank met kernwoorden (iceberg,
  lifeboat, distress signal, wireless, casualty…). Tik op een woord voor de
  betekenis + een voorbeeldzin.
- **🖨 Print.** Maakt een net zwart-op-wit **werkblad** (premisse, rollen +
  taken, grammaticaoverzicht, phrasebook, de volledige tijdlijn, schrijfruimte
  en reflectievragen) met achteraan een **docentensleutel** met de anachronismen.
  Print of "Bewaar als PDF" via het printvenster van je browser.
- **Niveau-schuif.** *Beginner* toont alle hints en gaat rustiger; *Standard* is
  de standaard; *Advanced* verbergt de 💭-hints en de betrouwbaarheidssterren en
  laat de berichten sneller binnenkomen (bij Auto).

## Zo gebruik je het in de klas

1. **Open `index.html`** in een browser (dubbelklikken volstaat; werkt ook op
   het smartboard). Geen installatie, geen internet nodig.
2. Verdeel de **6 rollen** (tabblad *Roles*): News Anchor, Field Reporter,
   Interviewer, Fact-checker, Editor, Time Analyst.
3. Klik op **"Take positions & go live"**. De klok gaat lopen.
4. Klik telkens op **"Next update ▸"** om het volgende bericht binnen te laten
   komen. Lees het voor. Laat de redactie beslissen:
   - **✔ Publish** / **⏸ Hold** (de Editor beslist),
   - **🚩 Flag** (de Time Analyst denkt dat iets niet klopt). Na het flaggen
     verschijnt uitleg of het terecht was.
5. Wissel naar het tabblad **"Headline"** om de klas een kop te laten kiezen
   met de juiste zekerheid.
6. **Auto ⏱** laat elke 25 seconden vanzelf een bericht binnenkomen (spanning!).
   **Reset** begint opnieuw.

## De vallen (voor de docent)

Drie berichten zijn "besmet". Laat leerlingen ze zelf ontdekken:

- **00:12 — "radar"**: radar bestond nog niet in 1912 → *anachronisme*.
- **01:20 — smartphonefoto**: het beeld kán kloppen, maar de bron kan onmogelijk
  echt zijn → de grote twist (waar ≠ authentiek).
- **08:30 — "everyone is safe"**: historisch echt gebeurd in de eerste kranten;
  spreekt het eigen ooggetuigeverslag van 02:20 tegen → *manipulatie*.

De overige berichten zijn tijd-echt. Onterecht flaggen kost ook iets: de app
legt uit dat je daarmee een waar verhaal kunt onderdrukken.

## Alles in één bestand

Alle inhoud, opmaak en logica zit in `index.html`. Je kunt de berichten,
rollen, grammatica en koppen aanpassen in de `UPDATES`, `ROLES`, `GRAMMAR` en
`SCENARIOS` bovenaan het `<script>`-blok.
