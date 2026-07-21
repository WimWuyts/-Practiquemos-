// Package the two release ZIPs:
//  - MARTA_ENGLISH_APP_LEARNER_v1.0.zip  (single HTML + short start guide)
//  - MARTA_ENGLISH_APP_SOURCE_v1.0.zip   (reproducible modular source)
import { execFileSync } from "node:child_process";
import { mkdirSync, copyFileSync, writeFileSync, rmSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const REL = join(ROOT, "releases");
const VER = "v1.6";
mkdirSync(REL, { recursive: true });

function zipDir(srcDir, outZip) {
  if (existsSync(outZip)) rmSync(outZip);
  execFileSync("zip", ["-r", "-q", outZip, "."], { cwd: srcDir });
}

// ---------- LEARNER ----------
const learnerDir = join(REL, "_learner");
rmSync(learnerDir, { recursive: true, force: true });
mkdirSync(learnerDir, { recursive: true });
copyFileSync(join(ROOT, "dist", "Marta_English.html"), join(learnerDir, "Marta_English.html"));
writeFileSync(join(learnerDir, "START_HERE_KEZDD_ITT.txt"),
`ENGLISH WITH MARTA  ·  ANGOL MARTÁVAL
=====================================

MAGYARUL
--------
1. Kattints kétszer a "Marta_English.html" fájlra. Chrome vagy Edge böngészőben nyílik meg.
2. Internet NEM kell. A gépeden fut, privát.
3. Az első indításnál egy barátságos kezdés segít megtalálni a jó kezdőpontot. Ez NEM vizsga.
4. A hanghoz kattints a "Meghallgatás" gombra. A "Felvétel" gombbal felveheted a saját hangod
   (a hangod a gépeden marad, sehova nem küldjük).
5. A haladásod a gépen mentődik. A Beállításokban a "Back-up készítése" gombbal mentést csinálhatsz.

IN ENGLISH
----------
1. Double-click "Marta_English.html". It opens in Chrome or Edge.
2. No internet needed. It runs on your computer and stays private.
3. On the first start, a friendly warm-up helps find a good place to begin. It is NOT a test.
4. Press "Listen" to hear the voice. Press "Record" to record your own voice
   (your voice stays on your computer and is never uploaded).
5. Your progress is saved on this computer. In Settings use "Make a backup" to keep a copy.

Enjoy, Marta!  ·  Jó tanulást, Marta!
`);
const learnerZip = join(REL, `MARTA_ENGLISH_APP_LEARNER_${VER}.zip`);
zipDir(learnerDir, learnerZip);

// ---------- SOURCE ----------
const srcStageDir = join(REL, "_source", "MARTA_ENGLISH_APP");
rmSync(join(REL, "_source"), { recursive: true, force: true });
mkdirSync(srcStageDir, { recursive: true });
// copy the project (excluding node_modules, releases, .git) via git archive if possible, else rsync-like copy
try {
  // use git to list tracked + untracked (respecting .gitignore) is complex; do explicit copy list
  const items = ["src", "scripts", "tests", "docs", "dist", "README.md", "PROJECT_STATE.md", "CHANGELOG.md", "package.json", ".gitignore"];
  for (const it of items) {
    const from = join(ROOT, it);
    if (!existsSync(from)) continue;
    execFileSync("cp", ["-r", from, srcStageDir]);
  }
} catch (e) { console.error(e); }
const sourceZip = join(REL, `MARTA_ENGLISH_APP_SOURCE_${VER}.zip`);
zipDir(join(REL, "_source"), sourceZip);

// cleanup staging
rmSync(learnerDir, { recursive: true, force: true });
rmSync(join(REL, "_source"), { recursive: true, force: true });

console.log("PACKAGED:");
console.log("  " + learnerZip);
console.log("  " + sourceZip);
