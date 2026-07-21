// UI: screen renderers. All copy comes from i18n; no hard-coded learner strings here beyond keys.
window.M = window.M || {};
(function (M) {
  var el, dom;
  function init() { el = M.dom.el; dom = M.dom; }

  function avatar(cls) { return el("span", { class: "avatar " + (cls || ""), html: M.data.avatarSvg, role: "img", "aria-label": "Marta" }); }

  // ---------------- HOME ----------------
  function home(mount) {
    var s = M.store.settings();
    var last = s.lastLocation;
    var rec = pickRecommended();
    mount.appendChild(el("div", { class: "avatar-row" }, [
      avatar(""),
      el("div", {}, [
        el("h1", { text: M.i18n.t("home.welcome") }),
        el("p", { class: "muted", text: M.i18n.t("app.subtitle") + (M.i18n.helpAvailable() ? " · " + M.i18n.hu("app.subtitle") : "") }),
      ]),
    ]));
    var pct = M.store.overall();
    mount.appendChild(el("div", { class: "card" }, [
      el("h2", { text: M.i18n.label("home.progress") }),
      el("div", { class: "progress", role: "progressbar", "aria-valuenow": pct, "aria-valuemin": 0, "aria-valuemax": 100 }, [el("span", { style: "width:" + pct + "%" })]),
      el("p", { class: "muted", text: pct + "%" }),
    ]));
    var target = rec;
    mount.appendChild(el("div", { class: "card" }, [
      el("h2", { text: M.i18n.label("home.recommended") }),
      el("p", {}, [el("strong", { text: unitLessonTitle(target) })]),
      el("div", { class: "btn-row" }, [
        el("button", { class: "btn", onclick: function () { M.router.go("lesson/" + target); } }, [el("span", { html: dom.icon("book") }), " " + M.i18n.t("home.start")]),
        last ? el("button", { class: "btn secondary", onclick: function () { M.router.go("lesson/" + last); } }, [M.i18n.t("home.continue")]) : null,
      ]),
    ]));
    mount.appendChild(el("div", { class: "card" }, [
      el("h2", { text: M.i18n.label("home.conversations") }),
      el("p", { class: "muted", text: M.i18n.helpAvailable() ? M.i18n.hu("home.conversations") : "" }),
      el("div", { class: "btn-row" }, [
        el("button", { class: "btn secondary", onclick: function () { M.router.go("conversations"); } }, [el("span", { html: dom.icon("chat") }), " " + M.i18n.t("nav.conversations")]),
      ]),
    ]));
    mount.appendChild(el("div", { class: "card" }, [
      el("h2", { text: M.i18n.label("home.monthly") }),
      el("p", { class: "muted", text: M.i18n.t("home.monthly.note") + (M.i18n.helpAvailable() ? " · " + M.i18n.hu("home.monthly.note") : "") }),
    ]));
  }

  function pickRecommended() {
    var units = M.data.course.units;
    for (var u = 0; u < units.length; u++) {
      for (var l = 0; l < units[u].lessons.length; l++) {
        if (!M.store.isLessonDone(units[u].lessons[l])) return units[u].lessons[l];
      }
    }
    return units[0].lessons[0];
  }
  function unitLessonTitle(lessonId) {
    var lesson = M.get.lesson(lessonId); if (!lesson) return lessonId;
    var unit = M.get.unit(lesson.unitId);
    return (unit ? unit.title.en + " — " : "") + lesson.title.en;
  }

  // ---------------- LESSONS LIST ----------------
  function lessons(mount) {
    mount.appendChild(el("h1", { text: M.i18n.label("nav.lessons") }));
    var list = el("ul", { class: "unit-list" });
    M.data.course.units.forEach(function (unit, ui) {
      var open = ui === currentUnitIndex();
      var lessonsWrap = el("div", { class: "lessons" + (open ? "" : " hidden") });
      unit.lessons.forEach(function (lid) {
        var lesson = M.get.lesson(lid); if (!lesson) return;
        var doneMark = M.store.isLessonDone(lid);
        var b = el("button", { class: "lessonbtn", onclick: function () { M.router.go("lesson/" + lid); } }, [
          el("span", { html: dom.icon(doneMark ? "check" : "book") }),
          el("span", { style: "flex:1" }, [el("strong", { text: lesson.title.en }), M.i18n.helpAvailable() ? el("div", { class: "muted", text: lesson.title.hu }) : null]),
          doneMark ? el("span", { class: "done", text: M.i18n.t("btn.done") }) : el("span", { class: "badge-status", text: lesson.newProductiveItems.length + " " + M.i18n.t("lesson.new").toLowerCase() }),
        ]);
        lessonsWrap.appendChild(b);
      });
      var header = el("button", { "aria-expanded": String(open) }, [
        el("span", { html: dom.icon("book") }),
        el("span", { style: "flex:1" }, [unit.title.en, M.i18n.helpAvailable() ? el("span", { class: "muted", text: " · " + unit.title.hu }) : null]),
        el("span", { class: "pill", text: (ui) + "" }),
      ]);
      header.addEventListener("click", function () {
        var hidden = lessonsWrap.classList.toggle("hidden");
        header.setAttribute("aria-expanded", String(!hidden));
      });
      list.appendChild(el("li", { class: "unit" }, [header, lessonsWrap]));
    });
    mount.appendChild(list);
  }
  function currentUnitIndex() {
    var rec = pickRecommended(); var lesson = M.get.lesson(rec);
    return M.data.course.units.findIndex(function (u) { return u.id === (lesson ? lesson.unitId : "u00"); });
  }

  // ---------------- LESSON RUNNER ----------------
  function lessonRunner(mount, lessonId) {
    var lesson = M.get.lesson(lessonId);
    if (!lesson) { mount.appendChild(el("p", { text: "…" })); return; }
    var acts = lesson.activities, idx = 0;
    var head = el("div", {});
    var bar = el("div", { class: "progress" }, [el("span", {})]);
    var stage = el("div", { class: "stage card" });
    mount.appendChild(el("div", { class: "btn-row" }, [
      el("button", { class: "btn ghost small", onclick: function () { M.router.go("lessons"); } }, [el("span", { html: dom.icon("home") }), " " + M.i18n.t("nav.back")]),
    ]));
    mount.appendChild(head); mount.appendChild(bar); mount.appendChild(stage);
    function drawHead() {
      dom.clear(head);
      head.appendChild(el("h1", { text: lesson.title.en }));
      head.appendChild(el("p", { class: "muted", text: lesson.canDo.en + (M.i18n.helpAvailable() ? " · " + lesson.canDo.hu : "") }));
      bar.firstChild.style.width = Math.round((idx / acts.length) * 100) + "%";
    }
    function run() {
      drawHead();
      dom.clear(stage);
      if (idx >= acts.length) return complete();
      M.exercise.render(stage, acts[idx], function () {
        idx++;
        bar.firstChild.style.width = Math.round((idx / acts.length) * 100) + "%";
        run();
      });
    }
    function complete() {
      M.store.completeLesson(lessonId);
      dom.clear(stage);
      stage.appendChild(el("div", { class: "avatar-row" }, [avatar("small"), el("h2", { text: M.i18n.t("lesson.complete") })]));
      stage.appendChild(el("p", { text: M.i18n.t("lesson.complete.msg") }));
      if (M.i18n.helpAvailable()) stage.appendChild(el("p", { class: "muted", text: M.i18n.hu("lesson.complete.msg") }));
      var next = pickRecommended();
      stage.appendChild(el("div", { class: "btn-row" }, [
        el("button", { class: "btn", onclick: function () { M.router.go("lesson/" + next); } }, [M.i18n.t("home.continue")]),
        el("button", { class: "btn secondary", onclick: function () { M.router.go("home"); } }, [el("span", { html: dom.icon("home") }), " " + M.i18n.t("nav.home")]),
      ]));
    }
    run();
  }

  // ---------------- CONVERSATIONS ----------------
  function conversations(mount) {
    mount.appendChild(el("h1", { text: M.i18n.label("nav.conversations") }));
    mount.appendChild(el("p", { class: "muted", text: M.i18n.t("home.conversations") }));
    var grid = el("div", {});
    M.data.dialogues.forEach(function (d) {
      var count = (M.store.progress().conversations[d.id] || {}).count || 0;
      grid.appendChild(el("div", { class: "card" }, [
        el("div", { style: "display:flex;align-items:center;gap:.6rem" }, [
          el("span", { html: dom.icon("chat") }),
          el("strong", { text: d.scene.en }),
          count ? el("span", { class: "pill", text: "★ " + count }) : null,
        ]),
        M.i18n.helpAvailable() ? el("p", { class: "muted", text: d.scene.hu }) : null,
        el("div", { class: "btn-row" }, [
          el("button", { class: "btn", onclick: function () { M.router.go("talk/" + d.id); } }, [M.i18n.t("conv.start")]),
        ]),
      ]));
    });
    mount.appendChild(grid);
    // Open conversation area (gently gated)
    var s = M.store.settings();
    mount.appendChild(el("div", { class: "card" }, [
      el("h2", { text: "Open conversations" }),
      el("p", { class: "muted", text: M.i18n.t("conv.locked.note") + (M.i18n.helpAvailable() ? " · " + M.i18n.hu("conv.locked.note") : "") }),
      s.allowOpenConv ? el("p", {}, [M.i18n.t("settings.open_conv") + " ✓"]) : el("p", { class: "muted", text: M.i18n.t("settings.open_conv") + " — " + M.i18n.t("nav.settings") }),
    ]));
  }
  function talk(mount, dialogueId) {
    mount.appendChild(el("div", { class: "btn-row" }, [
      el("button", { class: "btn ghost small", onclick: function () { M.router.go("conversations"); } }, [el("span", { html: dom.icon("home") }), " " + M.i18n.t("nav.back")]),
    ]));
    var stage = el("div", { class: "card" });
    mount.appendChild(stage);
    M.conversation.render(stage, dialogueId, function () { M.router.go("conversations"); });
  }

  // ---------------- PRACTICE ----------------
  function practice(mount) {
    mount.appendChild(el("h1", { text: M.i18n.label("nav.practice") }));
    var due = M.review.dueItems(8);
    mount.appendChild(el("div", { class: "card" }, [
      el("h2", { text: M.i18n.t("lesson.review") }),
      due.length ? el("div", { class: "btn-row" }, [
        el("button", { class: "btn", onclick: function () { M.router.go("review"); } }, [el("span", { html: dom.icon("again") }), " " + M.i18n.t("lesson.review") + " (" + due.length + ")"]),
      ]) : el("p", { class: "muted", text: M.i18n.t("act.review.prompt") }),
    ]));
    // sounds / spelling families quick practice
    var famWrap = el("div", { class: "card" }, [el("h2", { text: M.i18n.label("lesson.pron") })]);
    M.data.pronunciation.spellingFamilies.forEach(function (f) {
      famWrap.appendChild(el("div", { class: "btn-row" }, [
        el("button", { class: "btn secondary small", onclick: function () { openSingle({ type: "spelling-build", id: "act_p", family: f.id }); } }, [f.label.en]),
      ]));
    });
    mount.appendChild(famWrap);
  }
  function reviewScreen(mount) {
    var due = M.review.dueItems(8);
    if (!due.length) { mount.appendChild(el("p", { class: "muted", text: M.i18n.t("act.review.prompt") })); return; }
    var stage = el("div", { class: "card stage" });
    mount.appendChild(el("h1", { text: M.i18n.t("lesson.review") }));
    mount.appendChild(stage);
    M.exercise.render(stage, { id: "act_review", type: "review", items: due }, function () {
      dom.clear(stage);
      stage.appendChild(el("p", { text: M.i18n.t("lesson.complete.msg") }));
      stage.appendChild(el("div", { class: "btn-row" }, [el("button", { class: "btn", onclick: function () { M.router.go("practice"); } }, [M.i18n.t("btn.continue")])]));
    });
  }
  function openSingle(act) {
    M.router.mountScreen(function (mount) {
      mount.appendChild(el("div", { class: "btn-row" }, [el("button", { class: "btn ghost small", onclick: function () { M.router.go("practice"); } }, [M.i18n.t("nav.back")])]));
      var stage = el("div", { class: "card stage" });
      mount.appendChild(stage);
      M.exercise.render(stage, act, function () { M.router.go("practice"); });
    });
  }

  // ---------------- SETTINGS ----------------
  function settings(mount) {
    var s = M.store.settings();
    mount.appendChild(el("h1", { text: M.i18n.label("settings.title") }));
    var card = el("div", { class: "card" });
    // help language
    card.appendChild(row(M.i18n.t("settings.help_mode"), select(
      [["hu", "Magyar segítség: be"], ["en", "English only"]], s.helpLang,
      function (v) { M.store.setSetting("helpLang", v); M.router.refresh(); })));
    card.appendChild(row(M.i18n.t("settings.language"), select(
      [["menu", M.i18n.t("settings.help.menu")], ["panels", M.i18n.t("settings.help.panels")], ["heavy", M.i18n.t("settings.help.heavy")]],
      s.helpMode, function (v) { M.store.setSetting("helpMode", v); M.router.refresh(); })));
    // voice
    var voiceSel = el("select", { "aria-label": M.i18n.t("settings.voice") });
    var vs = M.audio.voices();
    if (!vs.length) voiceSel.appendChild(el("option", { text: "…" }));
    vs.forEach(function (v) {
      var o = el("option", { value: v.voiceURI, text: v.name + " (" + v.lang + ")" });
      if (M.audio.currentVoice() && v.voiceURI === M.audio.currentVoice().voiceURI) o.selected = true;
      voiceSel.appendChild(o);
    });
    voiceSel.addEventListener("change", function () { M.audio.setVoice(voiceSel.value); });
    var voiceRow = row(M.i18n.t("settings.voice"), el("div", {}, [
      voiceSel,
      el("button", { class: "btn secondary small", onclick: function () { M.audio.speak("Hello Marta. This is your English voice."); } }, [el("span", { html: dom.icon("speaker") }), " " + M.i18n.t("settings.voice.test")]),
    ]));
    card.appendChild(voiceRow);
    if (!M.audio.hasBritish()) card.appendChild(el("p", { class: "muted", text: M.i18n.t("settings.voice.none") }));
    // text size
    card.appendChild(row(M.i18n.t("settings.text"), select(
      [["normal", "A"], ["large", "A+"], ["xlarge", "A++"]], s.textSize,
      function (v) { M.store.setSetting("textSize", v); document.body.dataset.textsize = v; })));
    // reduce motion
    card.appendChild(row(M.i18n.t("settings.motion"), toggle(s.reduceMotion, function (v) {
      M.store.setSetting("reduceMotion", v); document.body.dataset.motion = v ? "reduce" : "";
    })));
    // open conversations
    card.appendChild(row(M.i18n.t("settings.open_conv"), toggle(s.allowOpenConv, function (v) { M.store.setSetting("allowOpenConv", v); })));
    mount.appendChild(card);

    // capability report
    var capCard = el("div", { class: "card" }, [el("h2", { text: M.i18n.t("nav.help") })]);
    M.caps.report().forEach(function (r) {
      capCard.appendChild(el("p", {}, [el("span", { html: dom.icon(r.ok ? "check" : "help") }), " " + r.msg]));
    });
    mount.appendChild(capCard);

    // backup
    var back = el("div", { class: "card" }, [el("h2", { text: M.i18n.label("backup.title") })]);
    var fileIn = el("input", { type: "file", accept: "application/json,.json", class: "hidden" });
    fileIn.addEventListener("change", function () { if (fileIn.files[0]) M.backup.import(fileIn.files[0], function () { M.router.refresh(); }); });
    back.appendChild(el("div", { class: "btn-row" }, [
      el("button", { class: "btn", onclick: function () { M.backup.export(); } }, [el("span", { html: dom.icon("star") }), " " + M.i18n.t("backup.export")]),
      el("button", { class: "btn secondary", onclick: function () { fileIn.click(); } }, [M.i18n.t("backup.import")]),
    ]));
    back.appendChild(fileIn);
    back.appendChild(el("div", { class: "btn-row" }, [
      el("button", { class: "btn ghost small", onclick: function () {
        if (confirm(M.i18n.t("backup.reset.confirm") + (M.i18n.helpAvailable() ? "\n" + M.i18n.hu("backup.reset.confirm") : ""))) { M.store.resetAll(); document.body.dataset.textsize = "normal"; document.body.dataset.motion = ""; M.router.go("home"); }
      } }, [M.i18n.t("backup.reset")]),
    ]));
    if (!M.caps.storage) back.appendChild(el("p", { class: "muted", text: M.i18n.t("cap.storage.no") }));
    mount.appendChild(back);
  }
  function row(label, control) { return el("div", { class: "setrow" }, [el("label", { style: "flex:1;font-weight:600" }, [label]), control]); }
  function select(opts, val, onchange) {
    var s = el("select", {});
    opts.forEach(function (o) { var op = el("option", { value: o[0], text: o[1] }); if (o[0] === val) op.selected = true; s.appendChild(op); });
    s.addEventListener("change", function () { onchange(s.value); });
    return s;
  }
  function toggle(val, onchange) {
    var b = el("button", { class: "btn " + (val ? "" : "ghost") + " switch", "aria-pressed": String(!!val), text: val ? "✓ " + M.i18n.t("diag.yes") : M.i18n.t("diag.no") });
    b.addEventListener("click", function () { val = !val; b.setAttribute("aria-pressed", String(val)); b.className = "btn " + (val ? "" : "ghost") + " switch"; b.textContent = val ? "✓ " + M.i18n.t("diag.yes") : M.i18n.t("diag.no"); onchange(val); });
    return b;
  }

  // ---------------- HELP ----------------
  function help(mount) {
    mount.appendChild(el("h1", { text: M.i18n.label("help.title") }));
    ["help.audio", "help.record", "help.backup"].forEach(function (k) {
      mount.appendChild(el("div", { class: "card" }, [
        el("p", { text: M.i18n.t(k) }),
        M.i18n.helpAvailable() ? el("p", { class: "muted", text: M.i18n.hu(k) }) : null,
      ]));
    });
  }

  // ---------------- DIAGNOSTIC screen ----------------
  function diagnostic(mount) {
    var stage = el("div", { class: "card stage" });
    mount.appendChild(stage);
    M.diagnostic.render(stage, function () { M.router.go("home"); });
  }

  M.ui = {
    init: init,
    screens: {
      home: home, lessons: lessons, conversations: conversations, practice: practice,
      settings: settings, help: help, review: reviewScreen, diagnostic: diagnostic,
    },
    lessonRunner: lessonRunner, talk: talk,
    avatar: avatar,
  };
})(window.M);
