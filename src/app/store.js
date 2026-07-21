// Store: settings, progress, review status. Local-first with graceful fallback.
window.M = window.M || {};
(function (M) {
  var NS = "martaEnglish";
  var KEYS = { settings: NS + ".appSettings", progress: NS + ".progress", review: NS + ".reviewQueue", monthly: NS + ".monthlyContent" };
  var SCHEMA = 1;
  var APP_VERSION = "1.8.0";

  var storageOK = true;
  function raw(k) { try { return localStorage.getItem(k); } catch (e) { storageOK = false; return null; } }
  function put(k, v) { try { localStorage.setItem(k, v); return true; } catch (e) { storageOK = false; return false; } }

  var defaults = {
    settings: {
      schemaVersion: SCHEMA, appVersion: APP_VERSION,
      helpLang: "hu",        // hu | en  (Hungarian help availability)
      helpMode: "menu",      // menu | panels | heavy
      voiceURI: null, textSize: "normal", reduceMotion: false,
      allowOpenConv: false, lastLocation: null,
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

  M.store = {
    APP_VERSION: APP_VERSION, SCHEMA: SCHEMA, KEYS: KEYS,
    storageAvailable: function () { return storageOK; },
    settings: function () { return state.settings; },
    progress: function () { return state.progress; },
    saveSettings: function () { state.settings.appVersion = APP_VERSION; put(KEYS.settings, JSON.stringify(state.settings)); },
    saveProgress: function () { state.progress.appVersion = APP_VERSION; put(KEYS.progress, JSON.stringify(state.progress)); },
    setSetting: function (k, v) { state.settings[k] = v; this.saveSettings(); },

    // ----- progress helpers -----
    isLessonDone: function (id) { return !!state.progress.completedLessons[id]; },
    completeLesson: function (id) {
      state.progress.completedLessons[id] = { at: Date.now() };
      state.settings.lastLocation = id; this.saveProgress(); this.saveSettings();
    },
    recordAttempt: function (actId, ok) {
      var a = state.progress.activityAttempts[actId] || { tries: 0, ok: 0 };
      a.tries++; if (ok) a.ok++; state.progress.activityAttempts[actId] = a; this.saveProgress();
    },
    // update an item's skill dimension: meaning|listening|written|spoken|confidence
    touchItem: function (id, dim, success) {
      var it = state.progress.items[id] || { meaning: 0, listening: 0, written: 0, spoken: 0, seen: 0, contexts: 0, last: 0, next: 0 };
      it.seen++; it.last = Date.now();
      if (dim && success) { it[dim] = (it[dim] || 0) + 1; it.contexts++; }
      it.next = M.review ? M.review.nextDue(it) : 0;
      state.progress.items[id] = it; this.saveProgress();
    },
    itemStatus: function (id) {
      var it = state.progress.items[id];
      if (!it) return "new";
      var score = (it.meaning + it.listening + it.written + it.spoken);
      if (score >= 6 && it.contexts >= 3) return "ready";
      if (score >= 3) return "familiar";
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
      this.saveSettings(); this.saveProgress();
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
