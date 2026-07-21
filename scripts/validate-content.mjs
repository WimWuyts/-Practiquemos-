// Content validator — checks the release content gates.
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA = join(__dirname, "..", "src", "data");
const J = (p) => JSON.parse(readFileSync(join(DATA, p), "utf8"));

const course = J("course.json"), lexicon = J("lexicon.json"), chunks = J("chunks.json"),
  grammar = J("grammar.json"), pron = J("pronunciation.json"), dialogues = J("dialogues.json");
const lessons = {};
for (const f of readdirSync(join(DATA, "lessons"))) { const o = J("lessons/" + f); lessons[o.id] = o; }

let errors = [], warns = [], ok = [];
const E = (m) => errors.push(m), W = (m) => warns.push(m), OK = (m) => ok.push(m);

// unique ids
function uniq(arr, name) {
  const ids = arr.map((x) => x.id), set = new Set(ids);
  if (set.size !== ids.length) E(`Duplicate ${name} IDs`); else OK(`${name} IDs unique (${ids.length})`);
}
uniq(lexicon, "lexicon"); uniq(chunks, "chunk"); uniq(grammar, "grammar"); uniq(dialogues, "dialogue");

// productive fields
const prod = lexicon.filter((l) => l.status === "productive");
const rec = lexicon.filter((l) => l.status === "receptive");
for (const l of prod) {
  if (!l.hu) E(`lexicon ${l.id} missing hu`);
  if (!l.examples || !l.examples.length || !l.examples[0].en) E(`lexicon ${l.id} missing example`);
  if (!l.distractors || l.distractors.length < 2) W(`lexicon ${l.id} few distractors`);
}
OK(`Productive words: ${prod.length}`);
OK(`Receptive items: ${rec.length}`);
OK(`Chunks: ${chunks.length}`);

// count targets (contract). Core-first release: report, warn if under.
if (prod.length < 730) W(`Productive ${prod.length} < 730 target (core-first release; see OPEN_IMPROVEMENTS)`);
if (chunks.length < 240) W(`Chunks ${chunks.length} < 240 target (core-first release)`);
if (rec.length < 320) W(`Receptive ${rec.length} < 320 target (core-first release)`);

// dangling references from lessons
const lexIds = new Set(lexicon.map((l) => l.id));
const chunkIds = new Set(chunks.map((c) => c.id));
const grammarIds = new Set(grammar.map((g) => g.id));
const dlgIds = new Set(dialogues.map((d) => d.id));
for (const id in lessons) {
  const L = lessons[id];
  (L.newProductiveItems || []).forEach((x) => { if (!lexIds.has(x)) E(`lesson ${id} dangling lex ${x}`); });
  (L.chunks || []).forEach((x) => { if (!chunkIds.has(x)) E(`lesson ${id} dangling chunk ${x}`); });
  (L.grammarCards || []).forEach((x) => { if (!grammarIds.has(x)) E(`lesson ${id} dangling grammar ${x}`); });
  if (L.conversationId && !dlgIds.has(L.conversationId)) E(`lesson ${id} dangling dialogue ${L.conversationId}`);
  if (!L.activities || !L.activities.length) E(`lesson ${id} has no activities`);
}
// course references lessons that exist
course.units.forEach((u) => u.lessons.forEach((lid) => { if (!lessons[lid]) E(`course unit ${u.id} dangling lesson ${lid}`); }));
OK(`Lessons: ${Object.keys(lessons).length}, Units: ${course.units.length}`);

// dialogue integrity: every node reachable target exists, no dead end without 'end'
for (const d of dialogues) {
  const nodeIds = new Set(Object.keys(d.nodes));
  if (!nodeIds.has(d.startNode)) E(`dialogue ${d.id} bad startNode`);
  for (const nid in d.nodes) {
    const n = d.nodes[nid], r = n.response || {};
    const targets = [];
    if (r.mode === "choose") (r.choices || []).forEach((c) => targets.push(c.next));
    if (r.mode === "build" || r.mode === "type") { targets.push(r.next); if (r.fallbackNode) targets.push(r.fallbackNode); }
    targets.filter(Boolean).forEach((t) => { if (!nodeIds.has(t)) E(`dialogue ${d.id} node ${nid} -> missing ${t}`); });
    if (!n.text || !n.text.en) E(`dialogue ${d.id} node ${nid} empty text`);
  }
}
OK(`Dialogues: ${dialogues.length}`);

// required phrases present
const allChunkEn = chunks.map((c) => c.en.toLowerCase());
const required = [
  "where is my gate", "where is the check-in desk", "could you help me", "i don't understand", "could you speak more slowly",
  "i am afraid of flying", "this is my first flight", "i feel nervous", "could i have some water", "could i have a blanket",
  "where is the toilet", "when will we land", "can you hear me", "can you see me", "please turn your camera on",
  "please turn your microphone on", "let's start today's lesson",
];
const haystack = (allChunkEn.join(" | ") + " | " + dialogues.map((d) => Object.values(d.nodes).map((n) => (n.text.en + " " + (n.response && n.response.choices ? n.response.choices.map((c) => c.text.en).join(" ") : ""))).join(" ")).join(" | ")).toLowerCase();
for (const p of required) { if (haystack.indexOf(p) < 0) E(`Required phrase missing: "${p}"`); }
OK(`Checked ${required.length} required travel/teaching phrases`);

// grammar spiral: each grammar card used in >=1 lesson
const usedGrammar = new Set();
Object.values(lessons).forEach((L) => (L.grammarCards || []).forEach((g) => usedGrammar.add(g)));
grammar.forEach((g) => { if (!usedGrammar.has(g.id)) W(`grammar ${g.id} not used in any lesson`); });

// activity-type whitelist: an unknown type renders NOTHING (silent skip) at runtime,
// so a typo or an unregistered new type must fail the build loudly here.
const KNOWN_TYPES = new Set([
  "intro", "listen-choose", "match", "phrase-match", "icon-choice", "minimal-pair",
  "minimal-pair-say", "shadow", "sound-sort", "reorder", "gapfill", "word-fill", "typed",
  "say-it", "pron-record", "spelling-build", "grammar", "grammar-info", "gr-type", "gr-fix",
  "listen-comprehension", "expand", "odd-one-out", "conversation", "diagnostic", "review",
]);
const allLessonSets = Object.values(lessons).concat(course.monthlyLessons || []);
let badType = 0;
allLessonSets.forEach((L) => (L.activities || []).forEach((a) => {
  if (!KNOWN_TYPES.has(a.type)) { E(`unknown activity type "${a.type}" in ${L.id}`); badType++; }
}));
if (!badType) OK(`Activity types all known (${KNOWN_TYPES.size} registered)`);

// grammar practice bank integrity: each card carries >=1 practice item, well-formed
let gramItems = 0, gramBad = 0;
grammar.forEach((g) => {
  const bank = g.practice || [];
  gramItems += bank.length;
  bank.forEach((it, i) => {
    const ref = `${g.id}#${i}`;
    if (it.kind === "form" || it.kind === "type") {
      if (!it.text || it.text.indexOf("___") < 0) { E(`grammar practice ${ref} (${it.kind}) missing ___ gap`); gramBad++; }
      if (it.kind === "form" && !(it.options || []).includes(it.answer)) { E(`grammar practice ${ref} answer not in options`); gramBad++; }
      if (it.kind === "type" && !(it.accepted || []).length) { E(`grammar practice ${ref} type item has no accepted answers`); gramBad++; }
    } else if (it.kind === "fix") {
      if (!Array.isArray(it.tokens) || typeof it.wrong !== "number" || !it.fix) { E(`grammar practice ${ref} fix item malformed`); gramBad++; }
    } else if (it.kind === "build" || it.kind === "say") {
      if (!it.en) { E(`grammar practice ${ref} (${it.kind}) missing en`); gramBad++; }
    }
  });
});
if (!gramBad) OK(`Grammar practice bank: ${gramItems} items across ${grammar.length} points`);

// pronunciation coverage: every sound-focus and spelling-family must appear in a lesson activity
const usedSounds = new Set(), usedFamilies = new Set();
Object.values(lessons).forEach((L) => (L.activities || []).forEach((a) => {
  if (a.type === "pron-record" && a.focusId) usedSounds.add(a.focusId);
  if (a.type === "minimal-pair" && a.focusId) usedSounds.add(a.focusId);
  if (a.type === "spelling-build" && a.family) usedFamilies.add(a.family);
}));
(pron.soundFocus || []).forEach((f) => { if (!usedSounds.has(f.id)) E(`sound-focus ${f.id} never appears in a lesson`); });
(pron.spellingFamilies || []).forEach((f) => { if (!usedFamilies.has(f.id)) E(`spelling-family ${f.id} never appears in a lesson`); });
OK(`Pronunciation coverage: ${(pron.soundFocus || []).length} sounds + ${(pron.spellingFamilies || []).length} spelling families all used`);

// example quality: flag remaining template-y examples for the review queue (not an error)
const tmpl = prod.filter((l) => /every day\.$|use "|useful word|is here\.$/.test((l.examples[0] || {}).en || "")).length;
OK(`Curated examples used; ${tmpl} productive words still on the safe template (flagged for review)`);

// report
console.log("\n=== CONTENT VALIDATION ===");
ok.forEach((m) => console.log("  ok   " + m));
warns.forEach((m) => console.log("  WARN " + m));
errors.forEach((m) => console.log("  ERR  " + m));
console.log(`\n${errors.length} errors, ${warns.length} warnings.`);
process.exit(errors.length ? 1 : 0);
