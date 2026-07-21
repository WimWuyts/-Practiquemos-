// UI: screen renderers. All copy comes from i18n; no hard-coded learner strings here beyond keys.
window.M = window.M || {};
(function (M) {
  var el, dom;
  function init() { el = M.dom.el; dom = M.dom; }

  function avatar(cls) { return el("span", { class: "avatar " + (cls || ""), html: M.data.avatarSvg, role: "img", "aria-label": "Marta" }); }

  // unit visual identity: icon + colour tint per unit
  var UNIT_VIS = {
    u00: ["star", "#eef1ee", "#5b615a"], u01: ["hand", "#eaf4f3", "#14746f"], u02: ["family", "#f3ecf0", "#9a5a86"],
    u03: ["globe", "#e9f0f4", "#2f6f9a"], u04: ["sun", "#f4efe6", "#a5772e"], u05: ["fork", "#eef4ec", "#4f8a4a"],
    u06: ["calendar", "#eef1f6", "#5a6aa0"], u07: ["phone", "#eaf4f3", "#14746f"], u08: ["star", "#f3eef6", "#7a5a9a"],
    u09: ["map", "#eef4ec", "#4f8a4a"], u10: ["bell", "#f4eee6", "#a5772e"], u11: ["laptop", "#e9f2f2", "#2f8a86"],
    u12: ["clockback", "#f0eeea", "#8a6a4a"], u13: ["suitcase", "#eef1f6", "#5a6aa0"], u14: ["plane", "#e9f0f4", "#2f6f9a"],
    u15: ["plane", "#eef4f3", "#14746f"], u16: ["heart", "#f5ecef", "#b06a80"],
  };
  function unitVis(id) { return UNIT_VIS[id] || ["book", "var(--accent-soft)", "var(--accent)"]; }

  // ---------------- HOME ----------------
  function home(mount) {
    var s = M.store.settings();
    var last = s.lastLocation;
    var rec = pickRecommended();
    var pct = M.store.overall();

    // hero
    mount.appendChild(el("div", { class: "hero" }, [
      avatar(""),
      el("div", { style: "flex:1" }, [
        el("h1", { text: M.i18n.t("home.welcome") }),
        el("p", { class: "sub", text: M.i18n.t("app.subtitle") }),
      ]),
      el("div", { class: "ring", style: "--p:" + pct, role: "img", "aria-label": M.i18n.t("home.progress") + " " + pct + "%" }, [el("b", { text: pct + "%" })]),
    ]));

    // recommended
    var lesson = M.get.lesson(rec), unit = lesson ? M.get.unit(lesson.unitId) : null;
    mount.appendChild(el("div", { class: "recommend" }, [
      el("div", { class: "k", text: M.i18n.t("home.recommended") }),
      el("h2", { text: lesson ? lesson.title.en : "" }),
      el("p", { class: "muted", text: (unit ? unit.title.en + " · " : "") + (lesson ? lesson.canDo.en : "") }),
      el("div", { class: "btn-row" }, [
        el("button", { class: "btn", onclick: function () { M.router.go("lesson/" + rec); } }, [el("span", { html: dom.icon("book") }), " " + M.i18n.t("home.start")]),
        (last && last !== rec) ? el("button", { class: "btn secondary", onclick: function () { M.router.go("lesson/" + last); } }, [M.i18n.t("home.continue")]) : null,
      ]),
    ]));

    // theme tiles — units as a calm grid
    mount.appendChild(el("h2", { style: "margin:1.4rem 0 .6rem;font-size:1.15rem", text: M.i18n.label("nav.lessons") }));
    var grid = el("div", { class: "tilegrid" });
    M.data.course.units.forEach(function (u) {
      if (u.id === "u00") return;
      var vis = unitVis(u.id);
      var doneCount = u.lessons.filter(function (l) { return M.store.isLessonDone(l); }).length;
      var up = Math.round((doneCount / Math.max(1, u.lessons.length)) * 100);
      grid.appendChild(el("button", { class: "themetile", onclick: function () { M.router.go("lesson/" + u.lessons[0]); } }, [
        el("span", { class: "iconwell", style: "--tint:" + vis[1] + ";--tintink:" + vis[2], html: dom.icon(vis[0]), "aria-hidden": "true" }),
        el("span", { class: "txt" }, [el("b", { text: u.title.en }), el("span", { text: M.i18n.helpAvailable() ? u.title.hu : u.canDo.en })]),
        el("span", { class: "ring sm", style: "--p:" + up + ";--accent:" + vis[2], "aria-label": up + "%" }, [el("b", { text: up + "%" })]),
      ]));
    });
    mount.appendChild(grid);

    // conversations + monthly
    mount.appendChild(el("div", { class: "card", style: "margin-top:1.2rem" }, [
      el("div", { style: "display:flex;align-items:center;gap:.8rem" }, [
        el("span", { class: "iconwell", html: dom.icon("chat"), "aria-hidden": "true" }),
        el("div", { style: "flex:1" }, [el("h2", { style: "margin:0;font-size:1.1rem", text: M.i18n.t("home.conversations") }), el("p", { class: "muted", style: "margin:.2rem 0 0", text: M.i18n.helpAvailable() ? M.i18n.hu("home.conversations") : "" })]),
      ]),
      el("div", { class: "btn-row" }, [el("button", { class: "btn secondary", onclick: function () { M.router.go("conversations"); } }, [M.i18n.t("nav.conversations")])]),
    ]));
    var monthly = M.data.monthlyAvailable || [];
    if (monthly.length) {
      var mc = el("div", { class: "card", style: "margin-top:1rem" }, [
        el("div", { style: "display:flex;align-items:center;gap:.8rem" }, [
          el("span", { class: "iconwell", style: "--tint:#f4eee6;--tintink:#a5772e", html: dom.icon("calendar"), "aria-hidden": "true" }),
          el("div", { style: "flex:1" }, [el("h2", { style: "margin:0;font-size:1.1rem", text: M.i18n.label("home.monthly") })]),
        ]),
      ]);
      monthly.forEach(function (m) {
        mc.appendChild(el("div", { class: "btn-row" }, [
          el("button", { class: "btn secondary", onclick: function () { M.router.go("lesson/" + m.id); } }, [
            (M.store.isLessonDone(m.id) ? "✓ " : "") + m.title.en + (M.i18n.helpAvailable() ? " · " + m.title.hu : ""),
          ]),
        ]));
      });
      mount.appendChild(mc);
    } else {
      mount.appendChild(el("p", { class: "muted", style: "text-align:center;margin-top:1rem", text: M.i18n.t("home.monthly.note") }));
    }
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
        el("div", { style: "display:flex;align-items:center;gap:.7rem" }, [
          el("span", { class: "avatar small", style: "width:44px;height:44px", "aria-hidden": "true", html: M.avatarFor(d.characterId) }),
          el("div", { style: "flex:1" }, [el("strong", { text: d.scene.en }), M.i18n.helpAvailable() ? el("div", { class: "muted", text: d.scene.hu }) : null]),
          count ? el("span", { class: "pill", text: "★ " + count }) : null,
        ]),
        el("div", { class: "btn-row" }, [
          el("button", { class: "btn", onclick: function () { M.router.go("talk/" + d.id); } }, [el("span", { html: dom.icon("chat") }), " " + M.i18n.t("conv.start")]),
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
