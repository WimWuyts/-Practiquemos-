// Master data generator for "Mirella tante".
// Reads curated source modules, emits schema-complete JSON into src/data and src/i18n.
// Run: node scripts/generators/build-data.mjs
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { PRODUCTIVE, RECEPTIVE } from "./lexicon-source.mjs";
import { EXTRA, EXTRA_RECEPTIVE } from "./lexicon-extra.mjs";
import { EXTRA2 } from "./lexicon-extra2.mjs";
import { RECEPTIVE_BIG } from "./receptive-extra.mjs";
import { CHUNKS } from "./chunks-source.mjs";
import { EXTRA_CHUNKS } from "./chunks-extra.mjs";
import { EXTRA_CHUNKS2 } from "./chunks-extra2.mjs";
import { GRAMMAR } from "./grammar-source.mjs";
import { SPELLING_FAMILIES, SOUND_FOCUS, PATH } from "./pronunciation-source.mjs";
import { DIALOGUES } from "./dialogues-source.mjs";
import { EXAMPLES } from "./examples-source.mjs";
import { LISTENINGS } from "./listening-source.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA = join(__dirname, "..", "..", "src", "data");
const I18N = join(__dirname, "..", "..", "src", "i18n");
mkdirSync(DATA, { recursive: true });
mkdirSync(I18N, { recursive: true });
const write = (p, obj) => writeFileSync(p, JSON.stringify(obj, null, 2) + "\n", "utf8");
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");

// ---------- Spelling families lookup ----------
const familyOf = {};
for (const [id, , , , , , items] of SPELLING_FAMILIES) for (const [, , word] of items) familyOf[word] = id;

// ---------- Vocabulary icons ----------
// theme -> icon fallback, plus concrete word overrides. Icon names live in assets/icons.js.
const THEME_ICON = {
  greetings: "hand", identity: "person", family: "family", countries: "globe", "daily-life": "sun",
  home: "home", food: "fork", shopping: "cart", time: "clock", weather: "cloud", plans: "calendar",
  phone: "phone", hobbies: "star", opinions: "heart", town: "map", transport: "bus", services: "bell",
  hotel: "bed", teaching: "book", technology: "laptop", past: "clockback", travel: "suitcase",
  airport: "plane", flying: "plane", feelings: "heart", numbers: "hash", conversation: "chat",
  colours: "palette",
};
const WORD_ICON = {
  coffee: "coffee", tea: "cup", water: "droplet", milk: "cup", apple: "apple", bread: "bread",
  fish: "fish", cake: "cake", egg: "egg", cheese: "cheese", soup: "bowl", fruit: "apple",
  vegetable: "leaf", meat: "bowl", car: "car", bus: "bus", train: "train", taxi: "car",
  plane: "plane", book: "book", phone: "phone", camera: "camera", computer: "laptop",
  microphone: "mic", screen: "laptop", hotel: "bed", passport: "passport", suitcase: "suitcase",
  luggage: "suitcase", ticket: "ticket", restaurant: "fork", menu: "book", key: "key",
  house: "home", home: "home", garden: "leaf", kitchen: "fork", horse: "star", music: "music",
  film: "film", sport: "star", money: "cart", price: "cart", airport: "plane", flight: "plane",
  gate: "door", blanket: "bed", toilet: "door", weekend: "calendar", family: "family",
  // animals & nature
  dog: "dog", cat: "cat", bird: "bird", duck: "bird", rabbit: "cat", cow: "dog",
  tree: "tree", flower: "flower", moon: "moon", rain: "rain", snow: "snow", sun: "sun",
  grass: "leaf", field: "leaf", star: "star",
  // home & objects
  chair: "chair", window: "window", door: "door", table: "list", clock: "clock", key: "key",
  bag: "bag", box: "list", mirror: "window", television: "laptop", fridge: "bed", lamp: "sun",
  // body
  hand: "hand", eye: "eye", foot: "shoes",
  // clothes
  shirt: "shirt", hat: "hat", shoes: "shoes", coat: "shirt", jacket: "shirt", dress: "shirt",
  // transport & misc
  boat: "boat", bicycle: "bus", umbrella: "umbrella", pen: "pen", pencil: "pen",
  game: "ball", sport: "ball", ball: "ball", country: "flag", flag: "flag",
  glass: "cup", bottle: "droplet", plate: "bowl", cup: "cup",
};
const iconFor = (head, theme) => WORD_ICON[head.toLowerCase()] || THEME_ICON[theme] || "dot";
// Only words whose icon *clearly depicts that exact word* may be used as a picture-choice
// TARGET. Words that merely borrow a near icon (rabbit->cat, cow->dog, tea->cup, hotel->bed…)
// keep the icon for decoration but are NOT "specific", so the picture is never misleading.
const ICON_EXACT = new Set([
  "coffee", "water", "apple", "bread", "fish", "cake", "egg", "cheese", "car", "bus", "train",
  "plane", "book", "phone", "camera", "computer", "microphone", "passport", "suitcase", "ticket",
  "key", "house", "home", "family", "music", "film", "dog", "cat", "bird", "tree", "flower",
  "moon", "rain", "snow", "sun", "star", "chair", "window", "door", "clock", "bag", "hand", "eye",
  "shirt", "hat", "shoes", "boat", "umbrella", "pen", "ball", "flag", "cup",
]);
const iconIsSpecific = (head) => ICON_EXACT.has(head.toLowerCase());

// ---------- Example generator: curated natural sentences + grammar-safe fallback ----------
const UNCOUNTABLE = new Set(["food", "water", "coffee", "tea", "milk", "bread", "cheese", "meat", "fish", "fruit",
  "rice", "sugar", "salt", "butter", "juice", "wine", "money", "cash", "news", "information", "homework",
  "music", "weather", "time", "help", "work", "hair", "snow", "rain", "wind", "grass", "furniture", "luggage", "clothes", "chocolate"]);
// verbs whose bare present is awkward with "I ___ every day."
const VERB_SKIP = new Set(["be", "can", "do", "will", "would", "could", "should", "may", "might", "must", "have", "get up", "wake up", "going to"]);
function safeTemplate(w, pos, theme) {
  const isProper = /^[A-Z]/.test(w);
  if (pos === "noun") {
    if (isProper) return `I like ${w}.`;
    if (UNCOUNTABLE.has(w.toLowerCase())) return `I like ${w}.`;
    if (/s$/.test(w)) return `The ${w} are here.`;
    return /^[aeiou]/i.test(w) ? `This is an ${w}.` : `This is a ${w}.`;
  }
  if (pos === "verb") {
    if (VERB_SKIP.has(w.toLowerCase())) return `We often use "${w}" in English.`;
    return `I ${w} every day.`;
  }
  if (pos === "adjective") return `It is very ${w}.`;
  if (pos === "adverb") return `I speak ${w}.`;
  if (pos === "number") return `I have ${w} friends.`;
  if (pos === "preposition" || pos === "determiner" || pos === "pronoun" || pos === "article") return `${w[0].toUpperCase()}${w.slice(1)} — a useful word.`;
  return `${w[0].toUpperCase()}${w.slice(1)}.`;
}
function exampleFor(head, hu, pos, theme) {
  const cur = EXAMPLES[head.toLowerCase()];
  if (cur) return { en: cur[0], hu: cur[1], needsReview: true };
  return { en: safeTemplate(head, pos, theme), hu: `(${hu})`, needsReview: true };
}

// ---------- Lexicon ----------
const lexicon = [];
const byThemePos = {};
const usedIds = new Set();
function pushLex(head, hu, pos, theme, firstLesson, forms, status, level) {
  let id = "lex_" + slug(head);
  if (usedIds.has(id)) id = id + "_" + slug(pos);
  while (usedIds.has(id)) id = id + "_x";
  usedIds.add(id);
  const key = pos + "|" + theme;
  (byThemePos[key] = byThemePos[key] || []).push(head);
  lexicon.push({
    id, headword: head, hu, partOfSpeech: pos, status, level: level || "A1",
    themes: [theme], firstLesson: firstLesson || null, reviewLessons: [],
    examples: [exampleFor(head, hu, pos, theme)],
    tts: head, pronunciationGroup: pos === "number" ? "numbers" : theme,
    spellingFamily: familyOf[head] || null, icon: iconFor(head, theme), iconSpecific: iconIsSpecific(head),
    acceptedForms: forms || [head], distractors: [], notes: "",
  });
}
const seenHead = new Set();
function addProductive(list) {
  for (const [h, hu, pos, theme, fl, forms, level] of list) {
    if (seenHead.has(h.toLowerCase())) continue; // skip duplicate headwords across source files
    seenHead.add(h.toLowerCase());
    pushLex(h, hu, pos, theme, fl, forms, "productive", level);
  }
}
addProductive(PRODUCTIVE);
addProductive(EXTRA);
addProductive(EXTRA2);
for (const [h, hu, pos, theme] of RECEPTIVE.concat(EXTRA_RECEPTIVE || [], RECEPTIVE_BIG || [])) {
  if (seenHead.has(h.toLowerCase())) continue; seenHead.add(h.toLowerCase());
  pushLex(h, hu, pos, theme, null, null, "receptive");
}

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
const seenChunkId = new Set();
const chunks = CHUNKS.concat(EXTRA_CHUNKS, EXTRA_CHUNKS2).map(([id, intention, en, hu, register, firstLesson, variants, slots]) => {
  let cid = "chunk_" + id;
  if (seenChunkId.has(cid)) return null; seenChunkId.add(cid);
  return {
    id: cid, intention, en, hu, register, firstLesson,
    variants: variants || [], slots: slots || [], acceptedForms: [en, ...(variants || [])],
    dialoguePlacements: [], needsReview: true,
  };
}).filter(Boolean);
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
  path: PATH,
  spellingFamilies: SPELLING_FAMILIES.map(([id, order, label, labelHu, note, noteHu, items, caution]) => ({
    id, stage: "stage-2", order: Number(order), label: { en: label, hu: labelHu }, note: { en: note, hu: noteHu },
    caution: caution || null,
    items: items.map(([onset, rime, word]) => ({ onset, rime, word, tts: word })),
  })),
  soundFocus: SOUND_FOCUS.map(([id, stage, order, f, fHu, tip, tipHu, examples, pairs]) => ({
    id, stage, order, focus: { en: f, hu: fHu }, tip: { en: tip, hu: tipHu },
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
  L("u00-l01", 1, "Welcome, sound & your start", "Üdvözlünk, hang és a kezdésed", "Test sound and find your starting point", "Hang tesztelése, kezdőpont", [], ["snd_short_vowels"], null),

  L("u01-l01", 1, "Hello, Endika", "Szia, Endika", "Greet and say your name and country", "Köszönés, név, ország", ["gr_be", "gr_questions_wh", "gr_articles"], ["snd_short_vowels"], "dlg_endika_first"),
  L("u01-l02", 2, "He, she & numbers", "Ő és a számok", "Talk about other people and count", "Másokról beszélni, számolni", ["gr_pronouns"], ["snd_long_vowels"], null),

  L("u02-l01", 1, "This is my family", "Ez a családom", "Name family members", "Családtagok megnevezése", ["gr_possadj", "gr_poss_s", "gr_plural"], ["snd_final_cons"], null),
  L("u02-l02", 2, "Meeting Marlene", "Marlene megismerése", "Ask about family, meet someone new", "Kérdezni a családról, új ismerős", ["gr_have"], ["snd_s_endings"], "dlg_marlene_first"),

  L("u03-l01", 1, "Countries & languages", "Országok és nyelvek", "Say where people are from", "Honnan jönnek az emberek", ["gr_conjunctions"], ["snd_wv"], null),
  L("u03-l02", 2, "Describing people", "Emberek leírása", "Give a simple description", "Egyszerű leírás", [], ["snd_h"], null),

  L("u04-l01", 1, "My daily routine", "A napirendem", "Describe your day", "A napod leírása", ["gr_presentsimple", "gr_dodoes", "gr_frequency"], ["snd_ed_endings"], null),
  L("u04-l02", 2, "My home", "Az otthonom", "Describe your home", "Az otthonod leírása", ["gr_thereis"], ["snd_ng"], null),

  L("u05-l01", 1, "Food I like", "Ételek, amiket szeretek", "Talk about food you like", "Kedvenc ételek", ["gr_someany"], ["snd_ee_i"], null),
  L("u05-l02", 2, "Cooking & shopping", "Főzés és vásárlás", "Buy and cook simple things", "Vásárlás, főzés", ["gr_wouldlike"], ["snd_shchj"], null),

  L("u06-l01", 1, "Days, times & numbers", "Napok, idő, számok", "Say days and times", "Napok, időpontok", ["gr_prepositions_time"], ["str_word"], null),
  L("u06-l02", 2, "Weather & plans", "Időjárás és tervek", "Talk about weather and make plans", "Időjárás, tervek", ["gr_can", "gr_goingto", "gr_presentcont"], ["str_question"], null),

  L("u07-l01", 1, "Phone call with Kira", "Telefon Kirával", "Start a call and check sound", "Hívás, hangellenőrzés", ["gr_object_pronouns"], ["str_question"], "dlg_kira_phone"),
  L("u07-l02", 2, "Video calls", "Videóhívás", "Check picture and give an update", "Kép ellenőrzése, hírek", [], ["snd_th"], null),

  L("u08-l01", 1, "Hobbies with Peter", "Hobbik Peterrel", "Talk about hobbies", "Hobbikról beszélni", ["gr_likeing"], ["snd_r"], "dlg_peter_dinner"),
  L("u08-l02", 2, "Books & opinions with Emma", "Könyvek és vélemények Emmával", "Give a simple opinion", "Véleményt mondani", ["gr_comparatives"], ["snd_th"], "dlg_emma_books"),

  L("u09-l01", 1, "Where is it?", "Merre van?", "Ask for and give directions", "Útbaigazítás", ["gr_imperatives"], ["snd_shchj"], null),
  L("u09-l02", 2, "Buses & trains", "Buszok és vonatok", "Use transport words", "Közlekedési szavak", [], ["snd_final_cons"], null),

  L("u10-l01", 1, "At the restaurant", "Az étteremben", "Order food and ask for the bill", "Rendelés, számla", ["gr_could_requests"], ["str_sentence"], "dlg_restaurant"),
  L("u10-l02", 2, "Hotel check-in", "Bejelentkezés a szállodában", "Check in and explain a problem", "Bejelentkezés, probléma", [], ["str_word"], "dlg_hotel"),

  L("u11-l01", 1, "Starting an online lesson", "Online óra indítása", "Start a lesson, fix sound, praise", "Óra indítása, hang, dicséret", ["gr_imperatives"], ["str_chunking"], "dlg_student_mic"),
  L("u11-l02", 2, "Talking with a parent", "Beszélgetés a szülővel", "Ask for a parent and speak with them", "Szülő hívása, beszélgetés", ["gr_can"], ["str_question"], "dlg_student_parent"),

  L("u12-l01", 1, "Where were you?", "Hol voltál?", "Say where you were", "Hol voltál", ["gr_waswere"], ["snd_ed_endings"], null),
  L("u12-l02", 2, "My weekend story", "A hétvégém története", "Tell a short past story", "Rövid múlt idejű történet", ["gr_pastsimple"], ["snd_ed_endings"], "dlg_endika_followup"),

  L("u13-l01", 1, "Planning a visit", "Látogatás tervezése", "Plan a visit and a trip", "Látogatás, utazás", ["gr_needhaveto"], ["str_word"], "dlg_mirella_travel"),
  L("u13-l02", 2, "Packing & documents", "Csomagolás és iratok", "Talk about luggage and documents", "Poggyász, iratok", [], ["snd_final_cons"], null),

  L("u14-l01", 1, "At the airport", "A reptéren", "Find check-in and your gate", "Check-in és kapu", ["gr_could_requests"], ["str_question"], "dlg_airport"),
  L("u14-l02", 2, "Security & gates", "Biztonsági ellenőrzés, kapuk", "Understand gate and time information", "Kapu- és időinformáció", [], ["str_word"], null),

  L("u15-l01", 1, "On the plane", "A repülőn", "Ask for help and stay calm", "Segítségkérés, nyugalom", ["gr_could_requests"], ["str_chunking"], "dlg_plane_help"),
  L("u15-l02", 2, "Arrival", "Érkezés", "Manage a simple arrival", "Egyszerű érkezés", [], ["str_question"], null),

  L("u16-l01", 1, "Family party at Lake Balaton", "Családi buli a Balatonnál", "Join a family conversation", "Családi beszélgetés", [], ["str_sentence"], "dlg_balaton"),
];

// ---------- Redistribute vocabulary into more micro-lessons (max ~8 new words each) ----------
// Keeps the hand-authored "anchor" lessons (grammar/pronunciation/dialogue) and adds
// auto-generated practice lessons per unit to absorb the expanded vocabulary.
const NEW_PER_LESSON = 8, CHUNKS_PER_LESSON = 4;
const pad2 = (n) => String(n).padStart(2, "0");
const EXPANDED = [];
for (const unit of UNITS) {
  const anchors = LESSONS.filter((l) => l.unitId === unit.id).sort((a, b) => a.order - b.order);
  if (unit.id === "u00") { EXPANDED.push(...anchors); continue; }
  const words = lexicon.filter((l) => l.status === "productive" && l.firstLesson && l.firstLesson.slice(0, 3) === unit.id);
  const uchunks = chunks.filter((c) => c.firstLesson && c.firstLesson.slice(0, 3) === unit.id);
  const need = Math.max(anchors.length, Math.ceil(words.length / NEW_PER_LESSON) || 1);
  const pronPool = [...new Set(anchors.flatMap((a) => a.pronunciation))];
  const slots = [];
  for (let i = 0; i < need; i++) {
    if (i < anchors.length) { slots.push({ ...anchors[i], pronunciation: anchors[i].pronunciation.slice(), grammar: anchors[i].grammar.slice() }); }
    else slots.push({
      id: unit.id + "-l" + pad2(i + 1), unitId: unit.id, order: i + 1,
      title: { en: unit.title.en + " · more (" + (i + 1) + ")", hu: unit.title.hu + " · több (" + (i + 1) + ")" },
      canDo: unit.canDo, grammar: [], pronunciation: pronPool.length ? [pronPool[i % pronPool.length]] : [], dialogue: null,
    });
  }
  words.forEach((w, j) => { w.firstLesson = slots[Math.min(Math.floor(j / NEW_PER_LESSON), need - 1)].id; });
  uchunks.forEach((c, k) => { c.firstLesson = slots[Math.min(Math.floor(k / CHUNKS_PER_LESSON), need - 1)].id; });
  EXPANDED.push(...slots);
}

// ---------- Activity generation ----------
const lexByLesson = {};
for (const l of lexicon) if (l.firstLesson) (lexByLesson[l.firstLesson] = lexByLesson[l.firstLesson] || []).push(l);
const chunkByLesson = {};
for (const ch of chunks) (chunkByLesson[ch.firstLesson] = chunkByLesson[ch.firstLesson] || []).push(ch);

let actSeq = 0;
const A = (type, extra) => ({ id: "act_" + (++actSeq), type, ...extra });

// hand-written "grow your answer" sets (from the source brief's expansion idea)
const EXPAND = {
  "u01-l01": { question: { en: "How are you?", hu: "Hogy vagy?" }, steps: [
    { en: "I'm good.", hu: "Jól vagyok." },
    { en: "I'm good. I'm at home.", hu: "Jól vagyok. Otthon vagyok." },
    { en: "I'm good. I'm at home, and I'm making coffee.", hu: "Jól vagyok. Otthon vagyok, és kávét készítek." },
  ] },
  "u12-l02": { question: { en: "What did you do at the weekend?", hu: "Mit csináltál a hétvégén?" }, steps: [
    { en: "I visited my sister.", hu: "Meglátogattam a nővéremet." },
    { en: "I visited my sister and we had coffee.", hu: "Meglátogattam a nővéremet, és ittunk egy kávét." },
    { en: "I visited my sister, we had coffee, and we talked about the family.", hu: "Meglátogattam a nővéremet, ittunk egy kávét, és a családról beszélgettünk." },
  ] },
  "u16-l01": { question: { en: "Tell me about your day.", hu: "Mesélj a napodról." }, steps: [
    { en: "It was nice.", hu: "Szép volt." },
    { en: "It was nice. I cooked lunch for the family.", hu: "Szép volt. Ebédet főztem a családnak." },
    { en: "It was nice. I cooked lunch for the family, and later we sat in the garden.", hu: "Szép volt. Ebédet főztem a családnak, és később a kertben ültünk." },
  ] },
};

function gapfillFrom(lx) {
  const ex = lx.examples && lx.examples[0] && lx.examples[0].en;
  if (!ex) return null;
  const re = new RegExp("\\b" + lx.headword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b", "i");
  if (!re.test(ex)) return null;
  const opts = [lx.headword].concat((lx.distractors || []).slice(0, 2));
  if (opts.length < 2) return null;
  return { text: ex.replace(re, "___"), answer: lx.headword, options: opts, hu: (lx.examples[0].hu || "") };
}

function activitiesFor(lesson) {
  const acts = [];
  const newLex = (lexByLesson[lesson.id] || []).filter((l) => l.status === "productive");
  const newChunks = chunkByLesson[lesson.id] || [];

  if (lesson.id === "u00-l01") { acts.push(A("diagnostic", {})); return acts; }

  // ---- PART 1: meet the material (receptive → recognition) ----
  // 1. See & hear meaning
  if (newLex.length) acts.push(A("intro", { items: newLex.slice(0, 8).map((l) => l.id) }));
  // 2. Listen and choose (quick recognition)
  if (newLex.length >= 2) acts.push(A("listen-choose", { items: newLex.slice(0, 6).map((l) => l.id) }));
  // 3. Icon → word — only words with a specific, unambiguous icon
  const iconable = newLex.filter((l) => l.iconSpecific);
  if (iconable.length >= 4) acts.push(A("icon-choice", { items: iconable.slice(0, 5).map((l) => l.id) }));
  // 4. Word-to-meaning match
  if (newLex.length >= 3) acts.push(A("match", { items: newLex.slice(0, 6).map((l) => l.id) }));
  // 5. Grammar card(s)
  for (const g of lesson.grammar) acts.push(A("grammar", { grammarId: g }));
  // 6. Spelling-family builder (sound & spelling)
  const famWord = newLex.find((l) => l.spellingFamily);
  if (famWord) acts.push(A("spelling-build", { family: famWord.spellingFamily, word: famWord.headword }));

  // ---- PART 2: produce it (write & SPEAK — the second half is production) ----
  // 7. Gap-fill (apply a word in a real sentence)
  const gaps = newLex.map(gapfillFrom).filter(Boolean).slice(0, 4);
  if (gaps.length >= 2) acts.push(A("gapfill", { items: gaps }));
  // 8. Reorder a useful sentence (from chunks) — build language
  const reord = newChunks.map((c) => ({ en: c.en, hu: c.hu })).filter((s) => { const n = s.en.replace(/[.?!]$/, "").split(" ").length; return n >= 3 && n <= 7; }).slice(0, 2);
  if (reord.length) acts.push(A("reorder", { sentences: reord }));
  // 9. Typed production (Hungarian prompt → type the English) — 5 items
  if (newLex.length) acts.push(A("typed", { items: newLex.slice(0, 5).map((l) => l.id) }));
  // 10. SAY IT — speak real phrases aloud (chunks first; else the words' example sentences)
  let sayPhrases = newChunks.slice(0, 4).map((c) => ({ en: c.en, hu: c.hu }));
  if (!sayPhrases.length) sayPhrases = newLex.slice(0, 3).map((l) => ({ en: l.examples[0].en, hu: l.examples[0].hu }));
  if (sayPhrases.length) acts.push(A("say-it", { phrases: sayPhrases }));
  // 11. Pronunciation: sounds (record) + one minimal-pair discrimination
  for (const p of lesson.pronunciation) {
    acts.push(A("pron-record", { focusId: p }));
    const f = pronunciation.soundFocus.find((x) => x.id === p);
    if (f && f.minimalPairs && f.minimalPairs.length) acts.push(A("minimal-pair", { focusId: p }));
  }
  // 12. Listening comprehension (short passage + question, with replay)
  LISTENINGS.filter((l) => l[0] === lesson.id).forEach(([, passage, question, options, answerIndex]) => {
    acts.push(A("listen-comprehension", { passage, question, options, answer: options[answerIndex] }));
  });
  // 13. Grow-your-answer, then say the whole answer aloud
  if (EXPAND[lesson.id]) acts.push(A("expand", EXPAND[lesson.id]));
  // 14. Conversation — spoken role-play (records on every turn)
  if (lesson.dialogue) acts.push(A("conversation", { dialogueId: lesson.dialogue }));
  // 15. Gentle review round
  const reviewItems = lexicon.filter((l) => l.status === "productive" && (l.reviewLessons || []).includes(lesson.id));
  if (reviewItems.length) acts.push(A("review", { items: reviewItems.slice(0, 6).map((l) => l.id) }));
  return acts;
}

const lessonObjs = EXPANDED.map((l) => {
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
// ---- guarantee every pronunciation element appears in at least one lesson ----
const coveredSounds = new Set(), coveredFamilies = new Set();
lessonObjs.forEach((L) => L.activities.forEach((a) => {
  if (a.type === "pron-record" && a.focusId) coveredSounds.add(a.focusId);
  if (a.type === "spelling-build" && a.family) coveredFamilies.add(a.family);
}));
const attachable = lessonObjs.filter((l) => l.id !== "u00-l01");
let attachIdx = 0;
pronunciation.soundFocus.map((f) => f.id).filter((id) => !coveredSounds.has(id)).forEach((id) => {
  const L = attachable[attachIdx++ % attachable.length];
  L.activities.push(A("pron-record", { focusId: id }));
  if (!L.pronunciationFocus.includes(id)) L.pronunciationFocus.push(id);
});
pronunciation.spellingFamilies.map((f) => f.id).filter((id) => !coveredFamilies.has(id)).forEach((id) => {
  const fam = pronunciation.spellingFamilies.find((f) => f.id === id);
  const L = attachable[attachIdx++ % attachable.length];
  L.activities.push(A("spelling-build", { family: id, word: fam.items[0].word }));
});
const pronCoverage = {
  sounds: pronunciation.soundFocus.length, families: pronunciation.spellingFamilies.length,
  allCovered: true,
};
for (const lo of lessonObjs) write(join(DATA, "lessons", lo.id + ".json"), lo);

// ---------- Course ----------
const course = {
  id: "marta_english", version: "1.7.0", schemaVersion: 1,
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
