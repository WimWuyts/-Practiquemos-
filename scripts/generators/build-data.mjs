// Master data generator for "Mirella tante".
// Reads curated source modules, emits schema-complete JSON into src/data and src/i18n.
// Run: node scripts/generators/build-data.mjs
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { PRODUCTIVE, RECEPTIVE } from "./lexicon-source.mjs";
import { CHUNKS } from "./chunks-source.mjs";
import { GRAMMAR } from "./grammar-source.mjs";
import { SPELLING_FAMILIES, SOUND_FOCUS } from "./pronunciation-source.mjs";
import { DIALOGUES } from "./dialogues-source.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA = join(__dirname, "..", "..", "src", "data");
const I18N = join(__dirname, "..", "..", "src", "i18n");
mkdirSync(DATA, { recursive: true });
mkdirSync(I18N, { recursive: true });
const write = (p, obj) => writeFileSync(p, JSON.stringify(obj, null, 2) + "\n", "utf8");
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");

// ---------- Spelling families lookup ----------
const familyOf = {};
for (const [id, , , , , items] of SPELLING_FAMILIES) for (const [, , word] of items) familyOf[word] = id;

// ---------- Simple example generator (English natural-ish; HU flagged for review) ----------
function exampleFor(head, hu, pos, theme) {
  const w = head;
  let en;
  switch (pos) {
    case "noun": en = /^[A-Z]/.test(w) ? `I like ${w}.` : `This is a ${w}.`; break;
    case "verb": en = `I can ${w}.`; break;
    case "adjective": en = `It is ${w}.`; break;
    case "adverb": en = `I do it ${w}.`; break;
    case "number": en = `I have ${w} friends.`; break;
    case "phrase": en = `${w[0].toUpperCase()}${w.slice(1)}.`; break;
    default: en = `${w[0].toUpperCase()}${w.slice(1)}.`;
  }
  return { en, hu: `(${hu})`, needsReview: true };
}

// ---------- Lexicon ----------
const lexicon = [];
const byThemePos = {};
const usedIds = new Set();
function pushLex(head, hu, pos, theme, firstLesson, forms, status) {
  let id = "lex_" + slug(head);
  if (usedIds.has(id)) id = id + "_" + slug(pos);
  while (usedIds.has(id)) id = id + "_x";
  usedIds.add(id);
  const key = pos + "|" + theme;
  (byThemePos[key] = byThemePos[key] || []).push(head);
  lexicon.push({
    id, headword: head, hu, partOfSpeech: pos, status, level: "A1",
    themes: [theme], firstLesson: firstLesson || null, reviewLessons: [],
    examples: [exampleFor(head, hu, pos, theme)],
    tts: head, pronunciationGroup: pos === "number" ? "numbers" : theme,
    spellingFamily: familyOf[head] || null,
    acceptedForms: forms || [head], distractors: [], notes: "",
  });
}
for (const [h, hu, pos, theme, fl, forms] of PRODUCTIVE) pushLex(h, hu, pos, theme, fl, forms, "productive");
for (const [h, hu, pos, theme] of RECEPTIVE) pushLex(h, hu, pos, theme, null, null, "receptive");

// distractors: same POS, prefer same theme, else any POS
const byId = Object.fromEntries(lexicon.map((l) => [l.id, l]));
for (const l of lexicon) {
  const sameThemePos = (byThemePos[l.partOfSpeech + "|" + l.themes[0]] || []).filter((h) => h !== l.headword);
  const samePos = lexicon.filter((x) => x.partOfSpeech === l.partOfSpeech && x.headword !== l.headword).map((x) => x.headword);
  const pool = (sameThemePos.length >= 3 ? sameThemePos : [...new Set([...sameThemePos, ...samePos])]);
  l.distractors = pool.slice(0, 3);
  if (l.distractors.length < 2) l.distractors = lexicon.filter((x) => x.headword !== l.headword).slice(0, 3).map((x) => x.headword);
}

// review lessons: spiral into later units
const unitNum = (lessonId) => parseInt((lessonId || "u00").slice(1, 3), 10);
for (const l of lexicon) {
  if (!l.firstLesson) continue;
  const n = unitNum(l.firstLesson);
  const rev = [];
  for (const d of [1, 3]) { const u = String(n + d).padStart(2, "0"); if (n + d <= 16) rev.push(`u${u}-l01`); }
  l.reviewLessons = rev;
}
write(join(DATA, "lexicon.json"), lexicon);

// ---------- Chunks ----------
const chunks = CHUNKS.map(([id, intention, en, hu, register, firstLesson, variants, slots]) => ({
  id: "chunk_" + id, intention, en, hu, register, firstLesson,
  variants: variants || [], slots: slots || [], acceptedForms: [en, ...(variants || [])],
  dialoguePlacements: [], needsReview: true,
}));
write(join(DATA, "chunks.json"), chunks);

// ---------- Grammar ----------
const grammar = GRAMMAR.map(([id, unit, tEn, tHu, purpose, exEn, exHu, examples, useWhen, checkQ, checkA]) => ({
  id, unitId: unit, title: { en: tEn, hu: tHu }, purpose: { en: purpose },
  explanation: { en: exEn, hu: exHu },
  examples: examples.map(([en, hu]) => ({ en, hu })),
  useWhen: { en: useWhen }, check: { question: checkQ, answer: checkA },
  appearsIn: [], needsReview: true,
}));
write(join(DATA, "grammar.json"), grammar);

// ---------- Pronunciation ----------
const pronunciation = {
  spellingFamilies: SPELLING_FAMILIES.map(([id, label, labelHu, note, noteHu, items]) => ({
    id, label: { en: label, hu: labelHu }, note: { en: note, hu: noteHu },
    items: items.map(([onset, rime, word]) => ({ onset, rime, word, tts: word })),
  })),
  soundFocus: SOUND_FOCUS.map(([id, f, fHu, tip, tipHu, examples, pairs]) => ({
    id, focus: { en: f, hu: fHu }, tip: { en: tip, hu: tipHu },
    examples, minimalPairs: (pairs || []).map(([a, b]) => ({ a, b })),
  })),
};
write(join(DATA, "pronunciation.json"), pronunciation);

// ---------- Dialogues ----------
write(join(DATA, "dialogues.json"), DIALOGUES);

// ---------- Units & lessons config ----------
const U = (id, en, hu, cdEn, cdHu) => ({ id, title: { en, hu }, canDo: { en: cdEn, hu: cdHu } });
const UNITS = [
  U("u00", "Welcome & first steps", "Üdvözlünk & első lépések", "Set up sound, voice and help; find your start", "Hang, hang és segítség beállítása; kezdőpont keresése"),
  U("u01", "Hello, I'm Marta", "Szia, Marta vagyok", "Greet, introduce yourself, ask simple questions", "Köszönés, bemutatkozás, egyszerű kérdések"),
  U("u02", "My family", "A családom", "Talk about family and who is who", "Beszélj a családról, ki kicsoda"),
  U("u03", "People, countries & languages", "Emberek, országok, nyelvek", "Say where people are from and describe them", "Honnan jönnek az emberek, milyenek"),
  U("u04", "My day & my home", "A napom és az otthonom", "Describe your routine and your home", "A napirended és az otthonod"),
  U("u05", "Food, cooking & shopping", "Étel, főzés, vásárlás", "Talk about food and buy simple things", "Ételről beszélni, egyszerű vásárlás"),
  U("u06", "Time, weather & plans", "Idő, időjárás, tervek", "Say times, weather and make plans", "Időpontok, időjárás, tervek"),
  U("u07", "Phone & video calls", "Telefon és videóhívás", "Start a call, check sound, ask to repeat", "Hívás indítása, hang ellenőrzése, ismétléskérés"),
  U("u08", "Hobbies, books & opinions", "Hobbik, könyvek, vélemények", "Talk about hobbies and give an opinion", "Hobbikról beszélni, véleményt mondani"),
  U("u09", "Around town: directions", "A városban: útbaigazítás", "Ask where places are and use transport", "Merre van, közlekedés"),
  U("u10", "Restaurant, hotel & services", "Étterem, szálloda, szolgáltatások", "Order, check in, ask for help", "Rendelés, bejelentkezés, segítségkérés"),
  U("u11", "Teaching Hungarian online", "Magyartanítás online", "Run an online lesson in English", "Online óra angolul"),
  U("u12", "Yesterday & past experiences", "Tegnap és a múlt", "Talk about the past", "A múltról beszélni"),
  U("u13", "Visits & future travel", "Látogatások, jövőbeli utazás", "Plan a visit and a trip", "Látogatás és utazás tervezése"),
  U("u14", "Airport confidence", "Magabiztosság a reptéren", "Manage the airport calmly", "A reptér nyugodt kezelése"),
  U("u15", "On the plane & arrival", "A repülőn és érkezés", "Ask for help and stay calm on the plane", "Segítségkérés és nyugalom a repülőn"),
  U("u16", "Family occasions", "Családi alkalmak", "Join a family conversation", "Bekapcsolódni a családi beszélgetésbe"),
];

// Lesson config: [id, order, titleEn, titleHu, cdEn, cdHu, grammarIds[], pronIds[], dialogueId?]
const L = (id, order, tEn, tHu, cdEn, cdHu, gr = [], pr = [], dlg = null) =>
  ({ id, unitId: id.slice(0, 3), order, title: { en: tEn, hu: tHu }, canDo: { en: cdEn, hu: cdHu }, grammar: gr, pronunciation: pr, dialogue: dlg });

const LESSONS = [
  L("u00-l01", 1, "Welcome, sound & your start", "Üdvözlünk, hang és a kezdésed", "Test sound and find your starting point", "Hang tesztelése, kezdőpont", [], ["pf_stress"], null),

  L("u01-l01", 1, "Hello, Endika", "Szia, Endika", "Greet and say your name and country", "Köszönés, név, ország", ["gr_be", "gr_questions_wh", "gr_articles"], ["pf_stress"], "dlg_endika_first"),
  L("u01-l02", 2, "He, she & numbers", "Ő és a számok", "Talk about other people and count", "Másokról beszélni, számolni", ["gr_pronouns"], ["pf_question"], null),

  L("u02-l01", 1, "This is my family", "Ez a családom", "Name family members", "Családtagok megnevezése", ["gr_possadj", "gr_poss_s", "gr_plural"], ["pf_finals"], null),
  L("u02-l02", 2, "Meeting Marlene", "Marlene megismerése", "Ask about family, meet someone new", "Kérdezni a családról, új ismerős", ["gr_have"], ["pf_finals"], "dlg_marlene_first"),

  L("u03-l01", 1, "Countries & languages", "Országok és nyelvek", "Say where people are from", "Honnan jönnek az emberek", ["gr_conjunctions"], ["pf_wv"], null),
  L("u03-l02", 2, "Describing people", "Emberek leírása", "Give a simple description", "Egyszerű leírás", [], ["pf_stress"], null),

  L("u04-l01", 1, "My daily routine", "A napirendem", "Describe your day", "A napod leírása", ["gr_presentsimple", "gr_dodoes", "gr_frequency"], ["pf_ed"], null),
  L("u04-l02", 2, "My home", "Az otthonom", "Describe your home", "Az otthonod leírása", ["gr_thereis"], ["pf_finals"], null),

  L("u05-l01", 1, "Food I like", "Ételek, amiket szeretek", "Talk about food you like", "Kedvenc ételek", ["gr_someany"], ["pf_ea"], null),
  L("u05-l02", 2, "Cooking & shopping", "Főzés és vásárlás", "Buy and cook simple things", "Vásárlás, főzés", ["gr_wouldlike"], ["pf_ea"], null),

  L("u06-l01", 1, "Days, times & numbers", "Napok, idő, számok", "Say days and times", "Napok, időpontok", ["gr_prepositions_time"], ["pf_question"], null),
  L("u06-l02", 2, "Weather & plans", "Időjárás és tervek", "Talk about weather and make plans", "Időjárás, tervek", ["gr_can", "gr_goingto", "gr_presentcont"], ["pf_stress"], null),

  L("u07-l01", 1, "Phone call with Kira", "Telefon Kirával", "Start a call and check sound", "Hívás, hangellenőrzés", ["gr_object_pronouns"], ["pf_question"], "dlg_kira_phone"),
  L("u07-l02", 2, "Video calls", "Videóhívás", "Check picture and give an update", "Kép ellenőrzése, hírek", [], ["pf_th"], null),

  L("u08-l01", 1, "Hobbies with Peter", "Hobbik Peterrel", "Talk about hobbies", "Hobbikról beszélni", ["gr_likeing"], ["pf_stress"], "dlg_peter_dinner"),
  L("u08-l02", 2, "Books & opinions with Emma", "Könyvek és vélemények Emmával", "Give a simple opinion", "Véleményt mondani", [], ["pf_th"], "dlg_emma_books"),

  L("u09-l01", 1, "Where is it?", "Merre van?", "Ask for and give directions", "Útbaigazítás", ["gr_imperatives"], ["pf_th"], null),
  L("u09-l02", 2, "Buses & trains", "Buszok és vonatok", "Use transport words", "Közlekedési szavak", [], ["pf_finals"], null),

  L("u10-l01", 1, "At the restaurant", "Az étteremben", "Order food and ask for the bill", "Rendelés, számla", ["gr_could_requests"], ["pf_stress"], "dlg_restaurant"),
  L("u10-l02", 2, "Hotel check-in", "Bejelentkezés a szállodában", "Check in and explain a problem", "Bejelentkezés, probléma", [], ["pf_stress"], "dlg_hotel"),

  L("u11-l01", 1, "Starting an online lesson", "Online óra indítása", "Start a lesson, fix sound, praise", "Óra indítása, hang, dicséret", ["gr_imperatives"], ["pf_stress"], "dlg_student_mic"),
  L("u11-l02", 2, "Talking with a parent", "Beszélgetés a szülővel", "Ask for a parent and speak with them", "Szülő hívása, beszélgetés", ["gr_can"], ["pf_question"], "dlg_student_parent"),

  L("u12-l01", 1, "Where were you?", "Hol voltál?", "Say where you were", "Hol voltál", ["gr_waswere"], ["pf_ed"], null),
  L("u12-l02", 2, "My weekend story", "A hétvégém története", "Tell a short past story", "Rövid múlt idejű történet", ["gr_pastsimple"], ["pf_ed"], "dlg_endika_followup"),

  L("u13-l01", 1, "Planning a visit", "Látogatás tervezése", "Plan a visit and a trip", "Látogatás, utazás", ["gr_needhaveto"], ["pf_stress"], "dlg_mirella_travel"),
  L("u13-l02", 2, "Packing & documents", "Csomagolás és iratok", "Talk about luggage and documents", "Poggyász, iratok", [], ["pf_finals"], null),

  L("u14-l01", 1, "At the airport", "A reptéren", "Find check-in and your gate", "Check-in és kapu", ["gr_could_requests"], ["pf_question"], "dlg_airport"),
  L("u14-l02", 2, "Security & gates", "Biztonsági ellenőrzés, kapuk", "Understand gate and time information", "Kapu- és időinformáció", [], ["pf_stress"], null),

  L("u15-l01", 1, "On the plane", "A repülőn", "Ask for help and stay calm", "Segítségkérés, nyugalom", ["gr_could_requests"], ["pf_stress"], "dlg_plane_help"),
  L("u15-l02", 2, "Arrival", "Érkezés", "Manage a simple arrival", "Egyszerű érkezés", [], ["pf_question"], null),

  L("u16-l01", 1, "Family party at Lake Balaton", "Családi buli a Balatonnál", "Join a family conversation", "Családi beszélgetés", [], ["pf_stress"], "dlg_balaton"),
];

// ---------- Activity generation ----------
const lexByLesson = {};
for (const l of lexicon) if (l.firstLesson) (lexByLesson[l.firstLesson] = lexByLesson[l.firstLesson] || []).push(l);
const chunkByLesson = {};
for (const ch of chunks) (chunkByLesson[ch.firstLesson] = chunkByLesson[ch.firstLesson] || []).push(ch);

let actSeq = 0;
const A = (type, extra) => ({ id: "act_" + (++actSeq), type, ...extra });

function activitiesFor(lesson) {
  const acts = [];
  const newLex = (lexByLesson[lesson.id] || []).filter((l) => l.status === "productive");
  const newChunks = chunkByLesson[lesson.id] || [];

  if (lesson.id === "u00-l01") {
    acts.push(A("diagnostic", {}));
    return acts;
  }
  // 1. See & hear meaning (intro carousel)
  if (newLex.length) acts.push(A("intro", { items: newLex.slice(0, 8).map((l) => l.id) }));
  // 2. Listen and choose
  if (newLex.length >= 2) acts.push(A("listen-choose", { items: newLex.slice(0, 6).map((l) => l.id) }));
  // 3. Word-to-meaning match
  if (newLex.length >= 3) acts.push(A("match", { items: newLex.slice(0, 6).map((l) => l.id) }));
  // 4. Spelling-family builder (if any new word belongs to a family)
  const famWord = newLex.find((l) => l.spellingFamily);
  if (famWord) acts.push(A("spelling-build", { family: famWord.spellingFamily, word: famWord.headword }));
  // 5. Grammar card(s)
  for (const g of lesson.grammar) acts.push(A("grammar", { grammarId: g }));
  // 6. Chunk / phrase-to-situation
  if (newChunks.length) acts.push(A("phrase-match", { items: newChunks.slice(0, 6).map((c) => c.id) }));
  // 7. Missing word / typed
  if (newLex.length) acts.push(A("typed", { items: newLex.slice(0, 4).map((l) => l.id) }));
  // 8. Pronunciation listen-record
  for (const p of lesson.pronunciation) acts.push(A("pron-record", { focusId: p }));
  // 9. Conversation
  if (lesson.dialogue) acts.push(A("conversation", { dialogueId: lesson.dialogue }));
  // 10. Gentle review round (earlier productive items reviewed here)
  const reviewItems = lexicon.filter((l) => l.status === "productive" && (l.reviewLessons || []).includes(lesson.id));
  if (reviewItems.length) acts.push(A("review", { items: reviewItems.slice(0, 6).map((l) => l.id) }));
  return acts;
}

const lessonObjs = LESSONS.map((l) => {
  const newLex = (lexByLesson[l.id] || []).filter((x) => x.status === "productive").map((x) => x.id);
  const reviewIds = lexicon.filter((x) => x.status === "productive" && (x.reviewLessons || []).includes(l.id)).map((x) => x.id);
  return {
    id: l.id, unitId: l.unitId, order: l.order, title: l.title, canDo: l.canDo,
    estimatedMinutes: 17, newProductiveItems: newLex, reviewItems: reviewIds,
    chunks: (chunkByLesson[l.id] || []).map((c) => c.id), grammarCards: l.grammar,
    pronunciationFocus: l.pronunciation, conversationId: l.dialogue,
    activities: activitiesFor(l), completionRule: { minActivities: 1 },
  };
});
for (const lo of lessonObjs) write(join(DATA, "lessons", lo.id + ".json"), lo);

// ---------- Course ----------
const course = {
  id: "marta_english", version: "1.0.0", schemaVersion: 1,
  title: { en: "English with Marta", hu: "Angol Martával" },
  units: UNITS.map((u) => ({
    ...u, recommended: true,
    lessons: lessonObjs.filter((l) => l.unitId === u.id).map((l) => l.id),
  })),
  monthlyLessons: Array.from({ length: 12 }, (_, i) => `month-${String(i + 1).padStart(2, "0")}`),
};
write(join(DATA, "course.json"), course);

// ---------- Counts report data ----------
const counts = {
  productive: lexicon.filter((l) => l.status === "productive").length,
  receptive: lexicon.filter((l) => l.status === "receptive").length,
  chunks: chunks.length, grammar: grammar.length, dialogues: DIALOGUES.length,
  lessons: lessonObjs.length, units: UNITS.length,
  spellingFamilies: pronunciation.spellingFamilies.length, soundFocus: pronunciation.soundFocus.length,
};
write(join(DATA, "_counts.json"), counts);
console.log("DATA BUILT:", JSON.stringify(counts));
