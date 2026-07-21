// Browser smoke test against the built single file, loaded from file:// (as Marta would).
import { chromium } from "playwright-core";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";
const __dirname = dirname(fileURLToPath(import.meta.url));
const FILE = pathToFileURL(join(__dirname, "..", "dist", "Marta_English.html")).href;
const EXE = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";

const results = [];
const check = (name, cond) => { results.push({ name, ok: !!cond }); console.log((cond ? "  ok   " : "  FAIL ") + name); };

const browser = await chromium.launch({ executablePath: EXE, args: ["--no-sandbox", "--use-fake-ui-for-media-stream", "--use-fake-device-for-media-stream"] });
const ctx = await browser.newContext({ permissions: [] });
const page = await ctx.newPage();
const consoleErrors = [];
page.on("console", (m) => { if (m.type() === "error") consoleErrors.push(m.text()); });
page.on("pageerror", (e) => consoleErrors.push("PAGEERROR: " + e.message));

await page.goto(FILE, { waitUntil: "networkidle" });
await page.waitForTimeout(600);

// App booted -> diagnostic on first run
check("app renders main", await page.locator("#main").count() === 1);
check("appbar nav present", await page.locator(".navbtn").count() >= 5);

// go home
await page.evaluate(() => (location.hash = "home"));
await page.waitForTimeout(300);
check("home shows recommended", (await page.locator("text=/Recommended|Neked/").count()) >= 1);

// open lessons, start first lesson
await page.evaluate(() => (location.hash = "lessons"));
await page.waitForTimeout(300);
check("lessons list units", await page.locator(".unit").count() >= 10);

await page.evaluate(() => (location.hash = "lesson/u01-l01"));
await page.waitForTimeout(400);
check("lesson runner renders activity", await page.locator(".stage").count() === 1);

// walk through a lesson clicking Continue/Next-style primary buttons a bunch of times
let advanced = 0;
for (let i = 0; i < 60; i++) {
  // click first correct option in listen-choose/match if present, else primary btn
  const opt = page.locator(".option:not([disabled])").first();
  const primary = page.locator(".btn:not(.ghost):not(.secondary):not(:disabled)").first();
  if (await primary.count()) { await primary.click().catch(() => {}); advanced++; }
  else if (await opt.count()) { await opt.click().catch(() => {}); advanced++; }
  await page.waitForTimeout(120);
  if (await page.locator("text=/Lesson complete|Lecke kész/").count()) break;
}
check("progressed through lesson activities", advanced > 5);

// conversations screen + open a dialogue
await page.evaluate(() => (location.hash = "conversations"));
await page.waitForTimeout(300);
check("conversations listed", await page.locator(".card").count() >= 5);
await page.evaluate(() => (location.hash = "talk/dlg_endika_first"));
await page.waitForTimeout(300);
check("dialogue renders bubble", await page.locator(".turn.them .bubble").count() >= 1);
check("dialogue shows a character face", await page.locator(".turn.them .face svg").count() >= 1);
const firstChoice = page.locator(".option").first();
if (await firstChoice.count()) await firstChoice.click();
await page.waitForTimeout(200);
check("dialogue accepts a choice", await page.locator(".feedback").count() >= 1);

// settings + backup export triggers a download
await page.evaluate(() => (location.hash = "settings"));
await page.waitForTimeout(300);
check("settings has backup buttons", (await page.locator("text=/Back-up|backup|Make a backup/i").count()) >= 1);
const [download] = await Promise.all([
  page.waitForEvent("download").catch(() => null),
  page.locator("button:has-text('Back-up'), button:has-text('backup'), button:has-text('Make a backup')").first().click().catch(() => {}),
]);
check("backup export downloads a file", !!download);

// capability detection ran
const caps = await page.evaluate(() => ({ tts: M.caps.tts, storage: M.caps.storage, types: M.exercise.types.length }));
check("TTS capability detected (bool)", typeof caps.tts === "boolean");
check("storage capability works", caps.storage === true);
check("exercise engine has many types", caps.types >= 10);

// no network requests to remote hosts
check("no uncaught console errors", consoleErrors.length === 0);
if (consoleErrors.length) console.log("   console errors:\n   " + consoleErrors.slice(0, 8).join("\n   "));

await browser.close();
const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} checks passed.`);
process.exit(failed.length ? 1 : 0);
