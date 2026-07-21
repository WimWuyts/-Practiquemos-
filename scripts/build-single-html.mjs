// Build the single-file learner release: dist/Marta_English.html
// Inlines all CSS, data (JSON) and JS. No external requests, no ES modules, no fetch.
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SRC = join(ROOT, "src");
const DATA = join(SRC, "data");
const read = (p) => readFileSync(p, "utf8");
const readJSON = (p) => JSON.parse(read(p));

// ---- styles (order matters) ----
const STYLE_FILES = ["styles/base.css", "styles/components.css", "styles/responsive.css"];
const css = STYLE_FILES.map((f) => read(join(SRC, f))).join("\n");

// ---- data bundle ----
const lessons = {};
for (const f of readdirSync(join(DATA, "lessons")).filter((x) => x.endsWith(".json"))) {
  const obj = readJSON(join(DATA, "lessons", f));
  lessons[obj.id] = obj;
}
// monthly lessons authored under data/monthly-lessons are merged as runnable lessons
const monthlyAvailable = [];
try {
  for (const f of readdirSync(join(DATA, "monthly-lessons")).filter((x) => x.endsWith(".json"))) {
    const obj = readJSON(join(DATA, "monthly-lessons", f));
    lessons[obj.id] = obj; monthlyAvailable.push({ id: obj.id, title: obj.title, month: obj.month });
  }
} catch (e) { /* none yet */ }
const bundle = {
  course: readJSON(join(DATA, "course.json")),
  lexicon: readJSON(join(DATA, "lexicon.json")),
  chunks: readJSON(join(DATA, "chunks.json")),
  grammar: readJSON(join(DATA, "grammar.json")),
  pronunciation: readJSON(join(DATA, "pronunciation.json")),
  dialogues: readJSON(join(DATA, "dialogues.json")),
  lessons,
  monthlyAvailable,
  avatarSvg: read(join(SRC, "assets", "marta-avatar.svg")),
};
const i18n = {
  en: readJSON(join(SRC, "i18n", "en.json")),
  hu: readJSON(join(SRC, "i18n", "hu.json")),
};
// Guard against </script> breaking the inline script tag.
const safe = (obj) => JSON.stringify(obj).replace(/<\//g, "<\\/");
const dataScript =
  "window.MARTA_DATA = " + safe(bundle) + ";\n" +
  "window.MARTA_I18N = " + safe(i18n) + ";";

// ---- scripts (concatenation order == dependency order) ----
const SCRIPT_FILES = [
  "assets/icons.js",
  "assets/avatars.js",
  "app/dom.js",
  "app/store.js",
  "app/i18n.js",
  "app/capabilities.js",
  "engines/review.js",
  "engines/audio.js",
  "app/backup.js",
  "app/diagnostic.js",
  "engines/exercise.js",
  "engines/conversation.js",
  "app/ui.js",
  "app/router.js",
  "app/main.js",
];
const js = SCRIPT_FILES.map((f) => "/* ===== " + f + " ===== */\n" + read(join(SRC, f))).join("\n\n");

// ---- assemble ----
let html = read(join(SRC, "index.template.html"));
html = html.replace("/* @@STYLES@@ */", () => css);
html = html.replace("/* @@DATA@@ */", () => dataScript);
html = html.replace("/* @@SCRIPTS@@ */", () => js);

mkdirSync(join(ROOT, "dist"), { recursive: true });
const out = join(ROOT, "dist", "Marta_English.html");
writeFileSync(out, html, "utf8");
const kb = (Buffer.byteLength(html, "utf8") / 1024).toFixed(0);
console.log("BUILT", out, kb + " KB");
