# Helper guide — updates & backups (for Wim)

This is the practical guide for keeping Marta's app healthy and adding new content over the year.

## Giving Marta the app

Send her **one file**: `dist/Marta_English.html` (or the `MARTA_ENGLISH_APP_LEARNER_v1.0.zip`, which also contains a bilingual start guide). She double-clicks it in Chrome or Edge. Nothing to install.

## Making sure her progress is safe

Progress is stored in the browser's local storage for the exact file she opens. Two rules keep it safe:

1. **Keep the same file name and location** when you replace the HTML with a newer version — this keeps the storage namespace consistent.
2. **Always take a backup before replacing the file.** In the app: *Settings → Make a backup* (`Back-up készítése`). This downloads a small JSON file. After installing the new HTML, if needed use *Settings → Restore a backup* (`Biztonsági mentés visszaállítása`).

The storage namespace (`martaEnglish.*`) and a schema-version migration hook are stable across versions, so backups from v1.0 will restore into later versions.

## Rebuilding the app after you change content

```bash
npm install            # first time only (dev dependency: playwright-core)
npm run build          # regenerate data, validate, rebuild dist/Marta_English.html
npm run test           # headless browser smoke test (optional but recommended)
npm run package        # refresh the learner + source ZIPs in releases/
```

`npm run build` fails loudly if content is broken (duplicate IDs, dangling references, missing required phrases, empty lessons).

## Adding vocabulary or conversations

- Words: edit `scripts/generators/lexicon-source.mjs` (add `[headword, hu, pos, theme, firstLesson]`).
- Fixed phrases: edit `scripts/generators/chunks-source.mjs`.
- Grammar cards: `scripts/generators/grammar-source.mjs`.
- Conversations: `scripts/generators/dialogues-source.mjs` (helper builders `choose/build/type/end`).

Then `npm run build`. New words automatically get distractors, spelling-family tags, spiral review lessons, and generated activities.

## Adding a monthly lesson

See `MONTHLY_LESSON_AUTHORING_GUIDE.md`. Short version: drop a JSON file in `src/data/monthly-lessons/`, run validation, rebuild, re-package, and remind Marta to back up first.

## If something looks wrong

- **No voice:** ask her to open *Settings* and choose another voice; check speaker volume. Some computers have no British voice — the app automatically uses another English voice.
- **Recording doesn't work:** the browser may block the microphone; the app still teaches fully without it.
- **Progress seems lost:** restore her latest backup via *Settings → Restore a backup*.
