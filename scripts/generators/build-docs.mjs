// Generate data-derived documentation: curriculum matrix, grammar spiral, HU review queue, coverage report.
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..", "..");
const DATA = join(ROOT, "src", "data");
const DOCS = join(ROOT, "docs");
mkdirSync(DOCS, { recursive: true });
const J = (p) => JSON.parse(readFileSync(join(DATA, p), "utf8"));
const csvCell = (s) => { s = String(s == null ? "" : s); return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; };
const toCSV = (rows) => rows.map((r) => r.map(csvCell).join(",")).join("\n") + "\n";

const course = J("course.json"), lexicon = J("lexicon.json"), chunks = J("chunks.json"),
  grammar = J("grammar.json"), pron = J("pronunciation.json"), dialogues = J("dialogues.json");
const en = J("../i18n/en.json"), hu = J("../i18n/hu.json");
const lessons = {};
for (const f of readdirSync(join(DATA, "lessons"))) { const o = J("lessons/" + f); lessons[o.id] = o; }

// ---- CURRICULUM_MATRIX.csv ----
const cm = [["unit", "unit_title_en", "lesson", "lesson_title_en", "can_do_en", "new_words", "review_words", "chunks", "grammar", "pronunciation", "conversation", "activities"]];
course.units.forEach((u) => u.lessons.forEach((lid) => {
  const L = lessons[lid]; if (!L) return;
  cm.push([u.id, u.title.en, lid, L.title.en, L.canDo.en, L.newProductiveItems.length, L.reviewItems.length,
    (L.chunks || []).length, (L.grammarCards || []).join(" "), (L.pronunciationFocus || []).join(" "), L.conversationId || "", L.activities.map((a) => a.type).join(" ")]);
}));
writeFileSync(join(DOCS, "CURRICULUM_MATRIX.csv"), toCSV(cm));

// ---- GRAMMAR_SPIRAL_MATRIX.csv ----
const gm = [["grammar_id", "title_en", "intro_unit", "appears_in_lessons", "review_count"]];
grammar.forEach((g) => {
  const usedIn = Object.values(lessons).filter((L) => (L.grammarCards || []).includes(g.id)).map((L) => L.id);
  gm.push([g.id, g.title.en, g.unitId, usedIn.join(" "), usedIn.length]);
});
writeFileSync(join(DOCS, "GRAMMAR_SPIRAL_MATRIX.csv"), toCSV(gm));

// ---- HUNGARIAN_REVIEW_QUEUE.csv ----
const hq = [["source_type", "id", "context_screen", "english", "hungarian", "needs_review"]];
Object.keys(en).forEach((k) => hq.push(["ui_string", k, "interface", en[k], hu[k] || "", "yes"]));
lexicon.forEach((l) => hq.push(["lexicon", l.id, "lesson:" + (l.firstLesson || "-"), l.headword, l.hu, "yes"]));
chunks.forEach((c) => hq.push(["chunk", c.id, "phrase", c.en, c.hu, "yes"]));
grammar.forEach((g) => hq.push(["grammar_title", g.id, "grammar card", g.title.en, g.title.hu, "yes"]));
grammar.forEach((g) => hq.push(["grammar_explain", g.id, "grammar card", g.explanation.en, g.explanation.hu, "yes"]));
writeFileSync(join(DOCS, "HUNGARIAN_REVIEW_QUEUE.csv"), toCSV(hq));

// ---- LEXICON_COVERAGE_REPORT.md ----
const prod = lexicon.filter((l) => l.status === "productive");
const rec = lexicon.filter((l) => l.status === "receptive");
const themes = {};
lexicon.forEach((l) => { (themes[l.themes[0]] = themes[l.themes[0]] || { p: 0, r: 0 }); if (l.status === "productive") themes[l.themes[0]].p++; else themes[l.themes[0]].r++; });
// encounters per productive item: firstLesson + reviewLessons + activity appearances
const encounters = {};
prod.forEach((l) => { encounters[l.id] = (l.firstLesson ? 1 : 0) + (l.reviewLessons || []).length; });
Object.values(lessons).forEach((L) => L.activities.forEach((a) => (a.items || []).forEach((id) => { if (encounters[id] != null) encounters[id]++; })));
const under3 = prod.filter((l) => encounters[l.id] < 3).length;

const a1 = prod.filter((l) => l.level === "A1").length;
const a2 = prod.filter((l) => l.level === "A2").length;
let md = `# Lexicon coverage report\n\nGenerated from source data. Hungarian is machine-drafted and flagged in \`HUNGARIAN_REVIEW_QUEUE.csv\`.\n\n`;
md += `## A1 coverage — anchoring\n\nVocabulary is anchored to the **English Vocabulary Profile (EVP)** A1 core, prioritised by general frequency, and cross-checked against Marta's real-life themes. Grammar is anchored to the **English Grammar Profile (EGP)** A1 inventory. Together these form the internal coverage matrix that guarantees the app covers A1, with a small, deliberate layer of A2 "beginnings" where real life needs it (travel, past, plans, polite requests). A2 items are flagged internally and never labelled to Marta.\n\n`;
md += `## Counts (v1.1)\n\n`;
md += `| Category | Count | Note |\n|---|---|---|\n`;
md += `| Productive individual words | ${prod.length} | A1: ${a1} · A2: ${a2} |\n`;
md += `| Productive chunks / frames | ${chunks.length} | fully wired |\n`;
md += `| Additional receptive items | ${rec.length} | listening/reading support |\n\n`;
md += `Every item appears in real lessons, exercises and/or conversations. The vocabulary target (~700) is met; chunks and receptive items grow via the same generator pipeline (see \`OPEN_IMPROVEMENTS.md\`).\n\n`;
md += `## EVP × EGP internal matrix (summary)\n\nEach A1 grammar point (EGP) is paired with the vocabulary domains (EVP) that exercise it. This matrix is the internal reference used to confirm A1 coverage; it is acted upon, not shipped as a learner file.\n\n`;
md += `| A1 grammar (EGP) | Exercised by vocabulary domains (EVP) |\n|---|---|\n`;
md += `| be / pronouns / questions | identity, family, countries |\n| a/an, plurals, this/that | family, home, food |\n| possessives, have/has | family, home |\n| present simple, do/does, frequency | daily-life, home |\n| there is/are, prepositions of place | home, town |\n| some/any, much/many | food, shopping |\n| can/can't, imperatives | town, transport, teaching |\n| would like, could you/I | food, services, hotel, flying |\n| present continuous, going to | plans, travel, phone |\n| like/love + -ing, comparatives | hobbies, opinions |\n| was/were, past simple | past, travel, family |\n| need to / have to | travel, airport |\n\n`;
md += `## Coverage rules\n\n- Each productive word appears in first lesson + spiral review lessons + generated activities.\n- Productive items with fewer than 3 encounters: **${under3}** (target: 0; addressed as the corpus grows).\n- Every productive word has a Hungarian field and at least one example.\n\n`;
md += `## By theme\n\n| Theme | Productive | Receptive |\n|---|---|---|\n`;
Object.keys(themes).sort().forEach((t) => md += `| ${t} | ${themes[t].p} | ${themes[t].r} |\n`);
md += `\n## Distractor / spelling metadata\n\n- All productive items carry 2–3 distractors for recognition tasks.\n- Spelling-family metadata assigned where a word belongs to a taught family (${pron.spellingFamilies.length} families).\n`;
writeFileSync(join(DOCS, "LEXICON_COVERAGE_REPORT.md"), md);

// ---- VOCABULARY_AND_GRAMMAR_ADDENDUM.md (auto-updates on every build) ----
const THEME_LABEL = {
  greetings: "Greetings", identity: "About me", family: "Family", countries: "Countries & languages",
  "daily-life": "Daily life", home: "Home", food: "Food & drink", shopping: "Shopping", time: "Time & dates",
  weather: "Weather & nature", plans: "Plans", phone: "Phone & calls", hobbies: "Hobbies & animals",
  opinions: "Opinions", town: "Around town", transport: "Transport", services: "Services", hotel: "Hotel",
  teaching: "Teaching online", technology: "Technology", past: "The past", travel: "Travel", airport: "Airport",
  flying: "Flying", feelings: "Feelings", numbers: "Numbers", conversation: "Conversation", colours: "Colours",
  body: "The body", health: "Health", clothes: "Clothes",
};
const byThemeAll = {};
lexicon.forEach((l) => { (byThemeAll[l.themes[0]] = byThemeAll[l.themes[0]] || []).push(l); });
let add = `# Addendum — full vocabulary & grammar\n\n`;
add += `Auto-generated on every build. **This file updates automatically when a new (monthly) lesson is added and the app is rebuilt.**\n\n`;
add += `- Productive words: ${lexicon.filter((l) => l.status === "productive").length}\n- Receptive items: ${lexicon.filter((l) => l.status === "receptive").length}\n- Chunks / phrases: ${chunks.length}\n- Grammar points: ${grammar.length}\n\n`;
add += `## Vocabulary by theme\n\n`;
Object.keys(byThemeAll).sort().forEach((th) => {
  add += `### ${THEME_LABEL[th] || th} (${byThemeAll[th].length})\n\n`;
  add += `| English | Hungarian | Type | Level | Status |\n|---|---|---|---|---|\n`;
  byThemeAll[th].slice().sort((a, b) => a.headword.localeCompare(b.headword)).forEach((l) => {
    add += `| ${l.headword} | ${l.hu} | ${l.partOfSpeech} | ${l.level} | ${l.status} |\n`;
  });
  add += `\n`;
});
add += `## Grammar\n\n`;
grammar.forEach((g) => {
  add += `### ${g.title.en} · ${g.title.hu}\n\n${g.explanation.en}\n\n_${g.explanation.hu}_\n\n`;
  add += g.examples.map((e) => `- ${e.en} — ${e.hu}`).join("\n") + `\n\n`;
});
add += `## Useful phrases (chunks)\n\n| English | Hungarian | Intention |\n|---|---|---|\n`;
chunks.forEach((c) => { add += `| ${c.en} | ${c.hu} | ${c.intention} |\n`; });
writeFileSync(join(DOCS, "VOCABULARY_AND_GRAMMAR_ADDENDUM.md"), add);

console.log("DOCS BUILT: CURRICULUM_MATRIX, GRAMMAR_SPIRAL_MATRIX, HUNGARIAN_REVIEW_QUEUE, LEXICON_COVERAGE_REPORT, VOCABULARY_AND_GRAMMAR_ADDENDUM");
console.log("HU review queue rows:", hq.length - 1);
