# Monthly lesson authoring guide

The app is architected for **twelve additional monthly lessons** (`month-01` … `month-12`) over the year, without redesigning the engine. In v1.0 these do **not** appear as twelve empty tiles — the Home screen shows a tasteful note that monthly lessons can be added. Create one and it plugs in.

## Workflow

1. Create a JSON file in `src/data/monthly-lessons/`, e.g. `month-01.json`.
2. Add any new words/chunks to the generator source lists (optional) and rebuild data.
3. Run `npm run validate`.
4. Run `npm run build` to rebuild `dist/Marta_English.html`.
5. Run `npm run package` to refresh the versioned ZIPs.
6. **Preserve the local-storage schema** (don't change the namespace).
7. **Remind Marta to make a backup** before replacing her HTML file.

## Copy-ready template

```json
{
  "id": "month-01",
  "title": { "en": "March: A spring visit to Kira", "hu": "Március: tavaszi látogatás Kiránál" },
  "month": "2026-03",
  "trigger": { "en": "Marta is planning a spring trip to Denmark.", "hu": "Marta tavaszi utat tervez Dániába." },
  "canDo": { "en": "Plan a spring visit and pack for the weather.", "hu": "Tavaszi látogatás tervezése, csomagolás az időjáráshoz." },
  "newVocabulary": ["lex_..."],
  "reviewVocabulary": ["lex_..."],
  "chunks": ["chunk_..."],
  "grammarSupport": ["gr_..."],
  "pronunciationFocus": ["pf_..."],
  "listening": { "en": "Kira leaves a short voice message about the weather.", "script": "Hi auntie! It is sunny here now..." },
  "conversation": "dlg_kira_phone",
  "finalTask": { "en": "Send Kira a short message with your plan.", "hu": "Küldj Kirának egy rövid üzenetet a terveddel." },
  "contentVersion": "1.0",
  "compatibilityVersion": "1.0"
}
```

## Field notes

- `newVocabulary` / `reviewVocabulary` / `chunks` / `grammarSupport` / `pronunciationFocus` reference existing IDs from the datasets (add new ones to the generator sources first if needed).
- `conversation` may reference an existing dialogue ID or a new one you author in `dialogues-source.mjs`.
- `contentVersion` / `compatibilityVersion` let the app decide whether a monthly package fits the installed engine.
- Keep the same warm, adult tone. Tie each month to a **real family event or life trigger** (a visit, a birthday, a trip, the Balaton party, Christmas at Aunt Eva's, the Agárd summer `szalonnasütő parti`).

## Validation

`npm run validate` checks IDs and references. Extend `scripts/validate-content.mjs` to include monthly files as the set grows.
