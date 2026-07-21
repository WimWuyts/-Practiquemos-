// Store: settings, progress, review status. Local-first with graceful fallback.
window.M = window.M || {};
(function (M) {
  var NS = "martaEnglish";
  var KEYS = { settings: NS + ".appSettings", progress: NS + ".progress", review: NS + ".reviewQueue", monthly: NS + ".monthlyContent" };
  var SCHEMA = 1;
  var APP_VERSION = "1.9.1";

  var storageOK = true;
  function raw(k) { try { return localStorage.getItem(k); } catch (e) { storageOK = false; return null; } }
  function put(k, v) { try { localStorage.setItem(k, v); return true; } catch (e) { storageOK = false; return false; } }

  var defaults = {
    settings: {
      schemaVersion: SCHEMA, appVersion: APP_VERSION,
      helpLang: "hu",        // hu | en  (Hungarian help availability)
      helpMode: "menu",      // menu | panels | heavy
      voiceURI: null, textSize: "normal", reduceMotion: false,
      allowOpenConv: false, lastLocation: null, reviewer: false,
    },
    progress: {
      schemaVersion: SCHEMA, appVersion: APP_VERSION,
      completedLessons: {}, activityAttempts: {}, items: {}, // items[id] = {meaning,listening,written,spoken,seen,contexts,next}
      conversations: {}, diagnostic: null, monthly: {},
    },
  };

  function load(key) {
    var d = JSON.parse(JSON.stringify(defaults[key]));
    var stored = raw(KEYS[key]);
    if (!stored) return d;
    try {
      var parsed = JSON.parse(stored);
      parsed = M.migrate ? M.migrate(key, parsed) : parsed;
      return Object.assign(d, parsed);
    } catch (e) { return d; }
  }

  var state = { settings: load("settings"), progress: load("progress") };

  // Progress is written on every rep; serializing the whole (growing) blob each time is
  // costly. Coalesce writes and guarantee a flush when the page is hidden/closed.
  var progressDirty = false, progressTimer = null;
  function flushProgress() {
    if (!progressDirty) return;
    progressDirty = false; if (progressTimer) { clearTimeout(progressTimer); progressTimer = null; }
    state.progress.appVersion = APP_VERSION; put(KEYS.progress, JSON.stringify(state.progress));
  }
  if (typeof window !== "undefined" && window.addEventListener) {
    window.addEventListener("pagehide", flushProgress);
    window.addEventListener("visibilitychange", function () { if (document.visibilityState === "hidden") flushProgress(); });
  }

  M.store = {
    APP_VERSION: APP_VERSION, SCHEMA: SCHEMA, KEYS: KEYS,
    storageAvailable: function () { return storageOK; },
    settings: function () { return state.settings; },
    progress: function () { return state.progress; },
    saveSettings: function () { state.settings.appVersion = APP_VERSION; put(KEYS.settings, JSON.stringify(state.settings)); },
    // debounced: coalesce bursts of touchItem() into one write ~600ms later (or on hide)
    saveProgress: function () { progressDirty = true; if (!progressTimer) progressTimer = setTimeout(flushProgress, 600); },
    flushProgress: flushProgress,
    setSetting: function (k, v) { state.settings[k] = v; this.saveSettings(); },

    // ----- progress helpers -----
    isLessonDone: function (id) { return !!state.progress.completedLessons[id]; },
    completeLesson: function (id) {
      state.progress.completedLessons[id] = { at: Date.now() };
      state.settings.lastLocation = id; this.saveProgress(); this.flushProgress(); this.saveSettings();
    },
    recordAttempt: function (actId, ok) {
      var a = state.progress.activityAttempts[actId] || { tries: 0, ok: 0 };
      a.tries++; if (ok) a.ok++; state.progress.activityAttempts[actId] = a; this.saveProgress();
    },
    // update an item's skill dimension: meaning|listening|written|spoken.
    // Scheduling advances at most once per SESSION (so many reps in one sitting don't
    // rocket the interval to a month), and a failure DEMOTES the item to "due soon".
    touchItem: function (id, dim, success) {
      var now = Date.now();
      var it = state.progress.items[id] || { meaning: 0, listening: 0, written: 0, spoken: 0, seen: 0, contexts: 0, lapse: 0, last: 0, next: 0 };
      var newSession = (now - (it.last || 0)) > 12 * 60 * 60 * 1000;
      it.seen++; it.last = now;
      if (dim && success) {
        it[dim] = (it[dim] || 0) + 1; it.lapse = 0;
        // advance the spaced interval only on the first success of a new session
        if (newSession || !it.next) { it.contexts = (it.contexts || 0) + 1; it.next = M.review ? M.review.nextDue(it) : 0; }
      } else if (dim && !success) {
        // lapse: step back and make it due again very soon (next session)
        it.contexts = Math.max(0, (it.contexts || 0) - 2);
        it.lapse = (it.lapse || 0) + 1;
        it.next = now + 10 * 60 * 1000;
      } else {
        // exposure only (e.g. `intro`): register + schedule a first look, no credit
        if (!it.next) it.next = M.review ? M.review.nextDue(it) : 0;
      }
      state.progress.items[id] = it; this.saveProgress();
    },
    itemStatus: function (id) {
      var it = state.progress.items[id];
      if (!it) return "new";
      var prod = (it.written || 0) + (it.spoken || 0);
      var score = (it.meaning || 0) + (it.listening || 0) + prod;
      // "ready" and "familiar" require real PRODUCTION, not recognition alone
      if (score >= 6 && prod >= 2 && it.contexts >= 3) return "ready";
      if (score >= 3 && prod >= 1) return "familiar";
      if (score >= 1) return "practising";
      if (M.review && M.review.isDue(it)) return "review";
      return "practising";
    },
    setDiagnostic: function (rec) { state.progress.diagnostic = rec; this.saveProgress(); },
    markConversation: function (id) {
      var c = state.progress.conversations[id] || { count: 0 };
      c.count++; c.last = Date.now(); state.progress.conversations[id] = c; this.saveProgress();
    },
    // ----- overall progress % -----
    overall: function () {
      var total = (M.data.course.units || []).reduce(function (n, u) { return n + u.lessons.length; }, 0);
      var done = Object.keys(state.progress.completedLessons).length;
      return total ? Math.round((done / total) * 100) : 0;
    },
    replaceAll: function (settings, progress) {
      state.settings = Object.assign(JSON.parse(JSON.stringify(defaults.settings)), settings || {});
      state.progress = Object.assign(JSON.parse(JSON.stringify(defaults.progress)), progress || {});
      this.saveSettings(); this.saveProgress(); this.flushProgress();
    },
    resetAll: function () { this.replaceAll(null, null); },
  };

  // schema migration hook (kept for future versions)
  M.migrate = function (key, obj) {
    if (!obj || typeof obj.schemaVersion === "undefined") obj.schemaVersion = SCHEMA;
    // future: if (obj.schemaVersion < 2) { ... }
    return obj;
  };
})(window.M);
