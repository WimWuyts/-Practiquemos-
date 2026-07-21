// UI: screen renderers. All copy comes from i18n; no hard-coded learner strings here beyond keys.
window.M = window.M || {};
(function (M) {
  var el, dom;
  function init() { el = M.dom.el; dom = M.dom; }
  function escapeHtml(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }

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

    // ONE clear next step: optional warm-up review, then the recommended lesson
    var due = M.review.dueItems(6);
    var lesson = M.get.lesson(rec), unit = lesson ? M.get.unit(lesson.unitId) : null;
    var recCard = el("div", { class: "recommend" }, [
      el("div", { class: "k", text: M.i18n.t("home.today") }),
    ]);
    if (due.length) {
      recCard.appendChild(el("div", { class: "btn-row", style: "margin:.2rem 0 .6rem" }, [
        el("button", { class: "btn secondary", onclick: function () { M.router.go("review"); } }, [el("span", { html: dom.icon("again") }), " " + M.i18n.t("home.warmup").replace("{n}", due.length)]),
      ]));
    }
    recCard.appendChild(el("h2", { style: "margin:.2rem 0", text: lesson ? lesson.title.en : "" }));
    recCard.appendChild(el("p", { class: "muted", text: (unit ? unit.title.en + " · " : "") + (lesson ? lesson.canDo.en : "") }));
    recCard.appendChild(el("div", { class: "btn-row" }, [
      el("button", { class: "btn", onclick: function () { M.router.go("lesson/" + rec); } }, [el("span", { html: dom.icon("book") }), " " + M.i18n.t("home.start")]),
    ]));
    mount.appendChild(recCard);

    // compact link to browse all lessons (the full grid lives in the Lessons tab)
    mount.appendChild(el("div", { class: "btn-row" }, [
      el("button", { class: "btn ghost wide", onclick: function () { M.router.go("lessons"); } }, [el("span", { html: dom.icon("list") }), " " + M.i18n.t("home.browse")]),
    ]));

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
        (function () { var dn = unit.lessons.filter(function (l) { return M.store.isLessonDone(l); }).length; return el("span", { class: "pill", text: dn + "/" + unit.lessons.length }); })(),
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
    mount.appendChild(el("div", { class: "btn-row" }, [
      el("button", { class: "btn ghost small", onclick: function () { M.router.go("lessons"); } }, [el("span", { html: dom.icon("home") }), " " + M.i18n.t("nav.back")]),
    ]));
    // themed scene band — drawn once, gives the lesson a sense of place
    if (M.scenes) {
      mount.appendChild(el("div", { class: "scene", html: M.scenes.band(lesson.unitId) + '<span class="label">' +
        escapeHtml(lesson.title.en) + '<span class="sub">' + escapeHtml(lesson.canDo.en) + '</span></span>' }));
    } else {
      mount.appendChild(el("h1", { text: lesson.title.en }));
    }
    // one persistent progress spine + one persistent stage (no title flashing per step)
    var bar = el("div", { class: "progress" }, [el("span", {})]);
    var stage = el("div", { class: "stage card" });
    mount.appendChild(bar); mount.appendChild(stage);
    function setBar() { bar.firstChild.style.width = Math.round((idx / acts.length) * 100) + "%"; }
    function fadeStage() {
      if (document.body.dataset.motion === "reduce") return;
      stage.style.animation = "none"; void stage.offsetWidth; stage.style.animation = "";
    }
    function run() {
      setBar();
      dom.clear(stage);
      fadeStage();
      if (idx >= acts.length) return complete();
      M.exercise.render(stage, acts[idx], function () {
        idx++;
        setBar();
        run();
      });
    }
    function complete() {
      M.store.completeLesson(lessonId);
      dom.clear(stage);
      fadeStage();
      setBar();
      stage.appendChild(el("div", { class: "done-badge", "aria-hidden": "true", html: dom.icon("check") }));
      stage.appendChild(el("div", { class: "avatar-row", style: "justify-content:center" }, [avatar("small"), el("h2", { style: "margin:0", text: M.i18n.t("lesson.complete") })]));
      stage.appendChild(el("p", { style: "text-align:center", text: M.i18n.t("lesson.complete.msg") }));
      if (M.i18n.helpAvailable()) stage.appendChild(el("p", { class: "muted", text: M.i18n.hu("lesson.complete.msg") }));
      var next = pickRecommended();
      // deep-link to practise what was just learned, or talk to the family
      stage.appendChild(el("div", { class: "btn-row" }, [
        el("button", { class: "btn secondary", onclick: function () { M.router.go("drill/" + lesson.unitId); } }, [el("span", { html: dom.icon("again") }), " " + M.i18n.t("lesson.next.practise")]),
        lesson.conversationId ? el("button", { class: "btn secondary", onclick: function () { M.router.go("talk/" + lesson.conversationId); } }, [el("span", { html: dom.icon("chat") }), " " + M.i18n.t("lesson.next.talk")]) : null,
      ]));
      stage.appendChild(el("div", { class: "btn-row" }, [
        el("button", { class: "btn", onclick: function () { M.router.go("lesson/" + next); } }, [M.i18n.t("home.continue")]),
        el("button", { class: "btn ghost", onclick: function () { M.router.go("home"); } }, [el("span", { html: dom.icon("home") }), " " + M.i18n.t("nav.home")]),
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
      el("h2", { text: M.i18n.t("conv.open.title") }),
      el("p", { class: "muted", text: M.i18n.t("conv.locked.note") + (M.i18n.helpAvailable() ? " · " + M.i18n.hu("conv.locked.note") : "") }),
      s.allowOpenConv ? el("p", {}, [M.i18n.t("settings.open_conv") + " ✓"]) : el("div", { class: "btn-row" }, [el("button", { class: "btn ghost small", onclick: function () { M.router.go("settings"); } }, [el("span", { html: dom.icon("gear") }), " " + M.i18n.t("nav.settings")])]),
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

  // ---------------- PRACTICE HUB ----------------
  var seq = 0;
  function actId() { return "p_" + (++seq); }
  // generic mini-runner: play a list of activity specs, then callback
  function runActivities(mount, acts, onDone) {
    var idx = 0;
    var bar = el("div", { class: "progress" }, [el("span", {})]);
    var stage = el("div", { class: "stage card" });
    mount.appendChild(bar); mount.appendChild(stage);
    function step() {
      bar.firstChild.style.width = Math.round((idx / acts.length) * 100) + "%";
      dom.clear(stage);
      if (idx >= acts.length) {
        stage.appendChild(el("div", { class: "avatar-row" }, [avatar("small"), el("h2", { text: M.i18n.t("practice.done") })]));
        stage.appendChild(el("div", { class: "btn-row" }, [el("button", { class: "btn", onclick: onDone }, [M.i18n.t("btn.continue")])]));
        return;
      }
      M.exercise.render(stage, acts[idx], function () { idx++; step(); });
    }
    step();
  }
  function backBar(to) {
    return el("div", { class: "btn-row" }, [el("button", { class: "btn ghost small", onclick: function () { M.router.go(to || "practice"); } }, [el("span", { html: dom.icon("home") }), " " + M.i18n.t("nav.back")])]);
  }

  function practice(mount) {
    mount.appendChild(el("h1", { text: M.i18n.label("nav.practice") }));
    var due = M.review.dueItems(8);
    // Review
    mount.appendChild(el("div", { class: "card" }, [
      el("div", { style: "display:flex;align-items:center;gap:.8rem" }, [
        el("span", { class: "iconwell", html: dom.icon("again"), "aria-hidden": "true" }),
        el("div", { style: "flex:1" }, [el("h2", { style: "margin:0;font-size:1.1rem", text: M.i18n.t("lesson.review") })]),
        due.length ? el("span", { class: "pill", text: due.length }) : null,
      ]),
      el("div", { class: "btn-row" }, [
        el("button", { class: "btn" + (due.length ? "" : " secondary"), onclick: function () { M.router.go("review"); } }, [M.i18n.t("practice.review")]),
      ]),
    ]));
    // Vocabulary practice — per unit
    var vCard = el("div", { class: "card" }, [
      el("div", { style: "display:flex;align-items:center;gap:.8rem" }, [el("span", { class: "iconwell", html: dom.icon("list"), "aria-hidden": "true" }), el("h2", { style: "margin:0;flex:1;font-size:1.1rem", text: M.i18n.t("practice.vocab") })]),
      el("p", { class: "muted", text: M.i18n.t("practice.choosetopic") }),
    ]);
    var vGrid = el("div", { class: "tilegrid" });
    M.data.course.units.forEach(function (u) {
      if (u.id === "u00") return;
      var n = M.data.lexicon.filter(function (l) { return l.status === "productive" && l.firstLesson && l.firstLesson.slice(0, 3) === u.id; }).length;
      if (!n) return;
      var vis = unitVis(u.id);
      vGrid.appendChild(el("button", { class: "themetile", onclick: function () { M.router.go("drill/" + u.id); } }, [
        el("span", { class: "iconwell", style: "--tint:" + vis[1] + ";--tintink:" + vis[2], html: dom.icon(vis[0]), "aria-hidden": "true" }),
        el("span", { class: "txt" }, [el("b", { text: u.title.en }), el("span", { text: n + " " + M.i18n.t("ref.words") })]),
      ]));
    });
    vCard.appendChild(vGrid); mount.appendChild(vCard);
    // Grammar practice — per point
    var gCard = el("div", { class: "card" }, [
      el("div", { style: "display:flex;align-items:center;gap:.8rem" }, [el("span", { class: "iconwell", html: dom.icon("book"), "aria-hidden": "true" }), el("h2", { style: "margin:0;flex:1;font-size:1.1rem", text: M.i18n.t("practice.grammar") })]),
      el("p", { class: "muted", text: M.i18n.t("practice.choosepoint") }),
    ]);
    M.data.grammar.forEach(function (g) {
      gCard.appendChild(el("button", { class: "lessonbtn", onclick: function () { M.router.go("gram/" + g.id); } }, [
        el("span", { html: dom.icon("book") }),
        el("span", { style: "flex:1" }, [el("strong", { text: g.title.en }), M.i18n.helpAvailable() ? el("div", { class: "muted", text: g.title.hu }) : null]),
      ]));
    });
    mount.appendChild(gCard);
    // Sounds & spelling — ALL of them
    var sCard = el("div", { class: "card" }, [el("h2", { style: "font-size:1.1rem", text: M.i18n.label("lesson.pron") })]);
    var groups = [["stage-1", "practice.sounds.step1"], ["stage-3", "practice.sounds.step3"]];
    groups.forEach(function (grp) {
      var fs = M.data.pronunciation.soundFocus.filter(function (f) { return f.stage === grp[0]; });
      if (!fs.length) return;
      sCard.appendChild(el("h3", { style: "margin:.6rem 0 .2rem", text: M.i18n.t(grp[1]) }));
      var row2 = el("div", { class: "blocks" });
      fs.forEach(function (f) { row2.appendChild(el("button", { class: "btn secondary small", onclick: function () { M.router.go("snd/" + f.id); } }, [f.focus.en])); });
      sCard.appendChild(row2);
    });
    sCard.appendChild(el("h3", { style: "margin:.8rem 0 .2rem", text: M.i18n.t("practice.sounds.step2") }));
    var spRow = el("div", { class: "blocks" });
    M.data.pronunciation.spellingFamilies.forEach(function (f) { spRow.appendChild(el("button", { class: "btn secondary small", onclick: function () { M.router.go("spell/" + f.id); } }, [f.label.en])); });
    sCard.appendChild(spRow);
    mount.appendChild(sCard);
  }

  // vocabulary drill for one unit (Rosetta-flavored: picture & sound first)
  function vocabDrill(mount, unitId) {
    var unit = M.get.unit(unitId);
    mount.appendChild(backBar("practice"));
    mount.appendChild(el("h1", { text: (unit ? unit.title.en : "") + " · " + M.i18n.t("practice.vocab") }));
    var words = M.data.lexicon.filter(function (l) { return l.status === "productive" && l.firstLesson && l.firstLesson.slice(0, 3) === unitId; });
    if (!words.length) { mount.appendChild(el("p", { class: "muted", text: M.i18n.t("practice.nowords") })); return; }
    var ids = dom.shuffle(words).slice(0, 8).map(function (l) { return l.id; });
    var iconable = words.filter(function (l) { return l.iconSpecific; }).map(function (l) { return l.id; });
    var acts = [];
    if (iconable.length >= 3) acts.push({ id: actId(), type: "icon-choice", items: iconable.slice(0, 5) });
    acts.push({ id: actId(), type: "listen-choose", items: ids.slice(0, 6) });
    acts.push({ id: actId(), type: "match", items: ids.slice(0, 6) });
    acts.push({ id: actId(), type: "typed", items: ids.slice(0, 4) });
    runActivities(mount, acts, function () { M.router.go("practice"); });
  }
  function grammarDrill(mount, grammarId) {
    var g = M.get.grammar(grammarId);
    mount.appendChild(backBar("practice"));
    mount.appendChild(el("h1", { text: (g ? g.title.en : "") + " · " + M.i18n.t("practice.grammar") }));
    runActivities(mount, [{ id: actId(), type: "grammar", grammarId: grammarId }], function () { M.router.go("practice"); });
  }
  function soundDrill(mount, focusId) {
    var f = M.get.focus(focusId);
    mount.appendChild(backBar("practice"));
    mount.appendChild(el("h1", { text: (f ? f.focus.en : "") }));
    var acts = [{ id: actId(), type: "pron-record", focusId: focusId }];
    if (f && f.minimalPairs && f.minimalPairs.length) acts.push({ id: actId(), type: "minimal-pair", focusId: focusId });
    runActivities(mount, acts, function () { M.router.go("practice"); });
  }
  function spellDrill(mount, familyId) {
    var f = M.get.family(familyId);
    mount.appendChild(backBar("practice"));
    mount.appendChild(el("h1", { text: (f ? f.label.en : "") }));
    runActivities(mount, [{ id: actId(), type: "spelling-build", family: familyId, word: (f && f.items[0] && f.items[0].word) }], function () { M.router.go("practice"); });
  }
  function reviewScreen(mount) {
    var due = M.review.dueItems(8);
    if (!due.length) { mount.appendChild(backBar("practice")); mount.appendChild(el("p", { class: "muted", text: M.i18n.t("act.review.prompt") })); return; }
    mount.appendChild(backBar("practice"));
    mount.appendChild(el("h1", { text: M.i18n.t("lesson.review") }));
    runActivities(mount, [{ id: "act_review", type: "review", items: due }], function () { M.router.go("practice"); });
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

  // ---------------- REFERENCE (addendum: all vocabulary & grammar, always current) ----------------
  var THEME_LABEL = {
    greetings: "Greetings", identity: "About me", family: "Family", countries: "Countries & languages",
    "daily-life": "Daily life", home: "Home", food: "Food & drink", shopping: "Shopping", time: "Time & dates",
    weather: "Weather & nature", plans: "Plans", phone: "Phone & calls", hobbies: "Hobbies & animals",
    opinions: "Opinions", town: "Around town", transport: "Transport", services: "Services", hotel: "Hotel",
    teaching: "Teaching online", technology: "Technology", past: "The past", travel: "Travel", airport: "Airport",
    flying: "Flying", feelings: "Feelings", numbers: "Numbers", conversation: "Conversation", colours: "Colours",
    body: "The body", health: "Health", clothes: "Clothes",
  };
  function reference(mount) {
    mount.appendChild(el("h1", { text: M.i18n.label("ref.title") }));
    mount.appendChild(el("p", { class: "muted", text: M.i18n.t("ref.intro") + (M.i18n.helpAvailable() ? " · " + M.i18n.hu("ref.intro") : "") }));
    // Vocabulary by theme (accordion)
    var byTheme = {};
    M.data.lexicon.forEach(function (l) { (byTheme[l.themes[0]] = byTheme[l.themes[0]] || []).push(l); });
    var vocabCard = el("div", { class: "card" }, [el("h2", { text: M.i18n.t("ref.vocab") + " (" + M.data.lexicon.length + " " + M.i18n.t("ref.count") + ")" })]);
    var list = el("ul", { class: "unit-list" });
    Object.keys(byTheme).sort().forEach(function (th) {
      var items = byTheme[th].slice().sort(function (a, b) { return a.headword.localeCompare(b.headword); });
      var body = el("div", { class: "lessons hidden" });
      items.forEach(function (l) {
        body.appendChild(el("div", { class: "setrow", style: "padding:.4rem 0" }, [
          el("span", { style: "flex:1" }, [el("strong", { text: l.headword }), el("span", { class: "muted", text: "  " + l.hu })]),
          el("button", { class: "btn ghost small", "aria-label": "Listen: " + l.headword, onclick: (function (w) { return function () { M.audio.speak(w); }; })(l.tts) }, [el("span", { html: dom.icon("speaker") })]),
        ]));
      });
      var header = el("button", { "aria-expanded": "false" }, [
        el("span", { html: dom.icon("list") }),
        el("span", { style: "flex:1" }, [THEME_LABEL[th] || th]),
        el("span", { class: "pill", text: items.length + " " + M.i18n.t("ref.words") }),
      ]);
      header.addEventListener("click", function () { var h = body.classList.toggle("hidden"); header.setAttribute("aria-expanded", String(!h)); });
      list.appendChild(el("li", { class: "unit" }, [header, body]));
    });
    vocabCard.appendChild(list);
    mount.appendChild(vocabCard);
    // Grammar
    var gCard = el("div", { class: "card" }, [el("h2", { text: M.i18n.t("ref.grammar") + " (" + M.data.grammar.length + ")" })]);
    M.data.grammar.forEach(function (g) {
      gCard.appendChild(el("div", { class: "grammarbox", style: "margin:.5rem 0" }, [
        el("div", { class: "lbl", text: g.title.en + (M.i18n.helpAvailable() ? " · " + g.title.hu : "") }),
        el("div", { class: "eg", text: (g.examples[0] && g.examples[0].en) || "" }),
        el("div", { class: "muted", text: g.useWhen.en }),
      ]));
    });
    mount.appendChild(gCard);
    // Useful phrases (chunks)
    var cCard = el("div", { class: "card" }, [el("h2", { text: M.i18n.t("ref.chunks") + " (" + M.data.chunks.length + ")" })]);
    var cbody = el("div", { class: "lessons hidden" });
    M.data.chunks.forEach(function (c) {
      cbody.appendChild(el("div", { class: "setrow", style: "padding:.4rem 0" }, [
        el("span", { style: "flex:1" }, [el("strong", { text: c.en }), M.i18n.helpAvailable() ? el("span", { class: "muted", text: "  " + c.hu }) : null]),
      ]));
    });
    var ch = el("button", { class: "btn secondary", "aria-expanded": "false" }, [el("span", { html: dom.icon("chat") }), " " + M.i18n.t("ref.chunks")]);
    ch.addEventListener("click", function () { var h = cbody.classList.toggle("hidden"); ch.setAttribute("aria-expanded", String(!h)); });
    cCard.appendChild(ch); cCard.appendChild(cbody);
    mount.appendChild(cCard);
  }

  // ---------------- DIAGNOSTIC screen ----------------
  function diagnostic(mount) {
    var stage = el("div", { class: "card stage" });
    mount.appendChild(stage);
    M.diagnostic.render(stage, function () { M.router.go("lesson/" + pickRecommended()); });
  }

  M.ui = {
    init: init,
    screens: {
      home: home, lessons: lessons, conversations: conversations, practice: practice,
      reference: reference, settings: settings, help: help, review: reviewScreen, diagnostic: diagnostic,
    },
    lessonRunner: lessonRunner, talk: talk,
    vocabDrill: vocabDrill, grammarDrill: grammarDrill, soundDrill: soundDrill, spellDrill: spellDrill,
    avatar: avatar,
  };
})(window.M);
