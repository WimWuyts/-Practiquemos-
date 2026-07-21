// Exercise engine: data-driven, reusable activity components with calm feedback.
window.M = window.M || {};
(function (M) {
  var el = null, dom = null;
  function ready() { el = M.dom.el; dom = M.dom; }
  function reduceMotion() { return document.body.dataset.motion === "reduce"; }
  // After an answer: on a correct recognition, auto-advance after a short reveal beat
  // (with a manual escape); on a wrong answer, always wait for a deliberate tap.
  function advance(mount, ok, goNext) {
    if (ok && !reduceMotion()) {
      var row = el("div", { class: "btn-row" }, [
        el("button", { class: "btn ghost small", onclick: function () { clearTimeout(t); goNext(); } }, [M.i18n.t("btn.continue")]),
      ]);
      mount.appendChild(row);
      var t = setTimeout(function () { if (document.body.contains(row)) goNext(); }, 900);
    } else {
      mount.appendChild(el("div", { class: "btn-row" }, [el("button", { class: "btn", onclick: goNext }, [M.i18n.t("btn.continue")])]));
    }
  }

  // shared UI bits ------------------------------------------------------------
  function speakBtn(text, label) {
    return el("div", { class: "btn-row" }, [
      el("button", { class: "btn secondary", onclick: function () { M.audio.speak(text); }, "aria-label": "Listen: " + text },
        [el("span", { html: dom.icon("speaker") }), " " + (label || M.i18n.t("btn.listen"))]),
      el("button", { class: "btn ghost", onclick: function () { M.audio.speak(text, { slow: true }); }, "aria-label": "Listen slowly: " + text },
        [el("span", { html: dom.icon("slow") }), " " + M.i18n.t("btn.listen.slow")]),
    ]);
  }
  function feedback(node, ok, msg) {
    var f = el("div", { class: "feedback " + (ok ? "good" : "gentle"), role: "status", "aria-live": "polite" }, [
      el("span", { html: dom.icon(ok ? "check" : "again") }),
      el("span", {}, [
        el("strong", { text: (ok ? M.i18n.t("a11y.correct") : M.i18n.t("a11y.incorrect")) + ". " }),
        msg || "",
      ]),
    ]);
    node.appendChild(f);
    return f;
  }
  function helpPanel(huText) {
    if (!M.i18n.helpAvailable() || !huText) return null;
    var open = false;
    var panel = el("div", { class: "helppanel hidden" }, [el("p", { text: huText })]);
    var btn = el("button", { class: "btn ghost small", "aria-expanded": "false" },
      [el("span", { html: dom.icon("help") }), " " + M.i18n.t("btn.showhelp")]);
    btn.addEventListener("click", function () {
      open = !open; panel.classList.toggle("hidden", !open);
      btn.setAttribute("aria-expanded", String(open));
      btn.lastChild.textContent = " " + (open ? M.i18n.t("btn.hidehelp") : M.i18n.t("btn.showhelp"));
    });
    return el("div", {}, [btn, panel]);
  }

  // each renderer draws into `mount` and calls done() when finished ------------
  var R = {};

  R.intro = function (mount, act, done) {
    var items = act.items.map(M.get.lex).filter(Boolean);
    var i = 0;
    function draw() {
      dom.clear(mount);
      var lx = items[i];
      mount.appendChild(el("p", { class: "prompt", text: M.i18n.t("act.intro.prompt") }));
      var card = el("div", { class: "card wordcard" }, [
        el("div", { class: "wordicon", "aria-hidden": "true", html: dom.icon(lx.icon || "dot") }),
        el("div", { class: "en", text: lx.headword }),
        el("div", { class: "hu", text: lx.hu }),
        el("div", { class: "ex muted", text: (lx.examples[0] && lx.examples[0].en) || "" }),
      ]);
      card.appendChild(speakBtn(lx.tts));
      mount.appendChild(card);
      M.store.touchItem(lx.id, "meaning", true);
      var np = el("div", { class: "btn-row" }, [
        el("button", { class: "btn secondary", disabled: i === 0 ? "disabled" : false, onclick: function () { if (i > 0) { i--; draw(); } } }, [M.i18n.t("nav.back")]),
        el("button", { class: "btn", onclick: function () { if (i < items.length - 1) { i++; draw(); } else done(true); } },
          [i < items.length - 1 ? M.i18n.t("btn.next") : M.i18n.t("btn.continue")]),
      ]);
      mount.appendChild(np);
      mount.appendChild(el("p", { class: "muted", text: (i + 1) + " / " + items.length }));
    }
    if (!items.length) return done(true);
    draw();
    M.audio.speak(items[0].tts);
  };

  R["listen-choose"] = function (mount, act, done) {
    var items = dom.shuffle(act.items.map(M.get.lex).filter(Boolean));
    var idx = 0, correctCount = 0;
    function round() {
      dom.clear(mount);
      var target = items[idx];
      var pool = dom.shuffle([target].concat(M.get.distractorWords(target, 3)));
      mount.appendChild(el("p", { class: "prompt", text: M.i18n.t("act.listenchoose.prompt") }));
      mount.appendChild(speakBtn(target.tts));
      var opts = el("div", { class: "options" });
      pool.forEach(function (o) {
        var b = el("button", { class: "option" }, [el("span", { text: o.headword })]);
        b.addEventListener("click", function () {
          var ok = o.id === target.id;
          b.classList.add(ok ? "correct" : "wrong");
          b.appendChild(el("span", { class: "mark", html: dom.icon(ok ? "check" : "again") }));
          M.store.touchItem(target.id, "listening", ok);
          Array.prototype.forEach.call(opts.children, function (c) { c.disabled = true; });
          feedback(mount, ok, ok ? M.i18n.t("fb.correct") : (M.i18n.t("fb.listen") + " — " + target.headword));
          if (ok) correctCount++;
          advance(mount, ok, function () { idx++; if (idx < items.length) round(); else done(true); });
        });
        opts.appendChild(b);
      });
      mount.appendChild(opts);
      M.audio.speak(target.tts);
    }
    if (!items.length) return done(true);
    round();
  };

  R.match = function (mount, act, done) {
    var items = act.items.map(M.get.lex).filter(Boolean).slice(0, 6);
    dom.clear(mount);
    mount.appendChild(el("p", { class: "prompt", text: M.i18n.t("act.match.prompt") }));
    var selectedEn = null, matched = 0;
    var left = el("div", { class: "options" }), right = el("div", { class: "options" });
    var grid = el("div", { style: "display:grid;grid-template-columns:1fr 1fr;gap:1rem" }, [left, right]);
    var enBtns = {}, huBtns = {};
    items.forEach(function (lx) {
      var e = el("button", { class: "option" }, [el("span", { html: dom.icon("speaker") }), " " + lx.headword]);
      e.addEventListener("click", function () {
        if (e.disabled) return;
        M.audio.speak(lx.tts);
        Object.values(enBtns).forEach(function (b) { b.classList.remove("correct"); });
        e.classList.add("correct"); selectedEn = lx.id;
      });
      enBtns[lx.id] = e; left.appendChild(e);
    });
    dom.shuffle(items).forEach(function (lx) {
      var h = el("button", { class: "option" }, [el("span", { text: lx.hu })]);
      h.addEventListener("click", function () {
        if (h.disabled || !selectedEn) return;
        var ok = selectedEn === lx.id;
        if (ok) {
          enBtns[lx.id].disabled = true; h.disabled = true;
          enBtns[lx.id].classList.remove("correct"); enBtns[lx.id].classList.add("correct");
          h.classList.add("correct"); h.appendChild(el("span", { class: "mark", html: dom.icon("check") }));
          M.store.touchItem(lx.id, "meaning", true); matched++;
          selectedEn = null;
          if (matched === items.length) { feedback(mount, true, M.i18n.t("fb.correct")); advance(mount, true, function () { done(true); }); }
        } else {
          h.classList.add("wrong"); setTimeout(function () { h.classList.remove("wrong"); }, 600);
        }
      });
      huBtns[lx.id] = h; right.appendChild(h);
    });
    mount.appendChild(grid);
    if (!items.length) done(true);
  };

  R["phrase-match"] = function (mount, act, done) {
    var items = act.items.map(M.get.chunk).filter(Boolean).slice(0, 5);
    if (!items.length) return done(true);
    dom.clear(mount);
    mount.appendChild(el("p", { class: "prompt", text: M.i18n.t("act.phrasematch.prompt") }));
    var idx = 0;
    function round() {
      var target = items[idx];
      var stage = el("div", {});
      stage.appendChild(el("div", { class: "card" }, [
        el("strong", { text: target.intention }),
        M.i18n.helpAvailable() ? el("div", { class: "muted", text: target.hu }) : null,
      ]));
      var pool = dom.shuffle([target].concat(dom.shuffle(items.filter(function (c) { return c.id !== target.id; })).slice(0, 3)));
      var opts = el("div", { class: "options" });
      pool.forEach(function (o) {
        var b = el("button", { class: "option" }, [el("span", { html: dom.icon("speaker") }), " " + o.en]);
        b.addEventListener("click", function () {
          M.audio.speak(o.en);
          var ok = o.id === target.id;
          b.classList.add(ok ? "correct" : "wrong");
          Array.prototype.forEach.call(opts.children, function (c) { c.disabled = true; });
          feedback(stage, ok, ok ? M.i18n.t("fb.correct") : M.i18n.t("fb.almost"));
          stage.appendChild(el("div", { class: "btn-row" }, [
            el("button", { class: "btn", onclick: function () { idx++; if (idx < items.length) { dom.clear(mount); mount.appendChild(el("p", { class: "prompt", text: M.i18n.t("act.phrasematch.prompt") })); round(); } else done(true); } },
              [idx < items.length - 1 ? M.i18n.t("btn.next") : M.i18n.t("btn.continue")]),
          ]));
        });
        opts.appendChild(b);
      });
      stage.appendChild(opts);
      mount.appendChild(stage);
    }
    round();
  };

  R["spelling-build"] = function (mount, act, done) {
    var fam = M.get.family(act.family);
    if (!fam) return done(true);
    dom.clear(mount);
    var sb = stepBadge(fam.stage || "stage-2"); if (sb) mount.appendChild(sb);
    mount.appendChild(el("p", { class: "prompt", text: M.i18n.t("act.spelling.prompt") }));
    mount.appendChild(el("div", { class: "card" }, [
      el("strong", { text: fam.label.en }),
      M.i18n.helpAvailable() ? el("div", { class: "muted", text: fam.note.hu }) : el("div", { class: "muted", text: fam.note.en }),
      fam.caution ? el("div", { class: "feedback gentle", style: "margin-top:.6rem" }, [el("span", { html: dom.icon("help") }), el("span", { text: M.i18n.helpAvailable() ? fam.caution.hu : fam.caution.en })]) : null,
    ]));
    var items = fam.items.slice(0, 4), idx = 0;
    function round() {
      var it = items[idx];
      var stage = el("div", {});
      stage.appendChild(speakBtn(it.word, "Listen: " + it.word));
      var target = it.onset + it.rime;
      var builder = el("div", { class: "builder", "data-empty": "…" });
      var current = "";
      var parts = dom.shuffle([it.onset, it.rime].concat(dom.shuffle(items.filter(function (x) { return x.word !== it.word; }).map(function (x) { return x.onset; })).slice(0, 2)));
      var blocks = el("div", { class: "blocks" });
      function refresh() { builder.textContent = current; }
      parts.forEach(function (p, i2) {
        var b = el("button", { class: "block", text: p });
        b.addEventListener("click", function () {
          current += p; refresh();
          if (current === target) {
            M.audio.speak(it.word);
            feedback(stage, true, M.i18n.t("fb.correct"));
            Array.prototype.forEach.call(blocks.children, function (c) { c.disabled = true; });
            stage.appendChild(el("div", { class: "btn-row" }, [
              el("button", { class: "btn secondary small", onclick: function () { current = ""; refresh(); } }, [M.i18n.t("btn.tryagain")]),
              el("button", { class: "btn", onclick: function () { idx++; dom.clear(mount); if (idx < items.length) { rebuildHead(); round(); } else done(true); } },
                [idx < items.length - 1 ? M.i18n.t("btn.next") : M.i18n.t("btn.continue")]),
            ]));
          } else if (current.length >= target.length) {
            feedback(stage, false, M.i18n.t("fb.almost"));
            current = ""; setTimeout(refresh, 500);
          }
        });
        blocks.appendChild(b);
      });
      builder.appendChild(el("button", { class: "btn ghost small", onclick: function () { current = ""; refresh(); }, text: "⟲" }));
      stage.appendChild(builder); stage.appendChild(blocks);
      mount.appendChild(stage); refresh();
    }
    function rebuildHead() {
      mount.appendChild(el("p", { class: "prompt", text: M.i18n.t("act.spelling.prompt") }));
      mount.appendChild(el("div", { class: "card" }, [el("strong", { text: fam.label.en })]));
    }
    round();
  };

  R.grammar = function (mount, act, done) {
    var g = M.get.grammar(act.grammarId);
    if (!g) return done(true);
    dom.clear(mount);
    var card = el("div", { class: "card" }, [
      el("h2", { text: g.title.en }),
      // compact grammar box: the pattern at a glance
      el("div", { class: "grammarbox" }, [
        el("div", { class: "lbl", text: M.i18n.t("lesson.grammar") }),
        el("div", { class: "eg", text: (g.examples[0] && g.examples[0].en) || g.title.en }),
        el("div", { class: "muted", text: g.useWhen.en }),
      ]),
      el("p", { class: "muted", text: g.purpose.en }),
      el("p", { text: g.explanation.en }),
    ]);
    var help = helpPanel(g.explanation.hu);
    if (help) card.appendChild(help);
    var exs = el("div", {});
    g.examples.forEach(function (ex) {
      exs.appendChild(el("div", { class: "btn-row", style: "align-items:center" }, [
        el("button", { class: "btn ghost small", onclick: function () { M.audio.speak(ex.en); }, "aria-label": "Listen: " + ex.en }, [el("span", { html: dom.icon("speaker") })]),
        el("span", {}, [el("strong", { text: ex.en }), M.i18n.helpAvailable() ? el("span", { class: "muted", text: "  — " + ex.hu }) : null]),
      ]));
    });
    card.appendChild(exs);
    // tiny check
    var checked = false;
    var input = el("input", { class: "textin", type: "text", "aria-label": g.check.question, placeholder: g.check.question });
    var checkWrap = el("div", { class: "card" }, [
      el("strong", { text: M.i18n.t("act.grammar.check") + ": " }), el("span", { text: g.check.question }), input,
      el("div", { class: "btn-row" }, [
        el("button", { class: "btn", onclick: function () {
          if (checked) return;
          var ok = M.match.close(input.value, [g.check.answer]);
          feedback(checkWrap, ok, ok ? M.i18n.t("fb.correct") : (M.i18n.t("fb.almost") + " (" + g.check.answer + ")"));
          checked = true;
        } }, [M.i18n.t("btn.check")]),
      ]),
    ]);
    card.appendChild(checkWrap);
    card.appendChild(el("div", { class: "muted", html: "<em>" + g.useWhen.en + "</em>" }));
    mount.appendChild(card);
    mount.appendChild(nextBtn(done));
  };

  R.typed = function (mount, act, done) {
    var items = act.items.map(M.get.lex).filter(Boolean).slice(0, 4);
    if (!items.length) return done(true);
    var idx = 0;
    function round() {
      dom.clear(mount);
      var lx = items[idx];
      mount.appendChild(el("p", { class: "prompt", text: M.i18n.t("act.typed.prompt") }));
      mount.appendChild(el("div", { class: "card" }, [
        el("div", { style: "font-size:1.2rem", text: lx.hu }),
        M.i18n.helpAvailable() ? null : null,
      ]));
      var input = el("input", { class: "textin", type: "text", autocomplete: "off", autocapitalize: "off", spellcheck: "false", "aria-label": M.i18n.t("act.typed.prompt") });
      mount.appendChild(input);
      var checked = false;
      mount.appendChild(el("div", { class: "btn-row" }, [
        el("button", { class: "btn ghost small", onclick: function () { M.audio.speak(lx.tts); } }, [el("span", { html: dom.icon("speaker") }), " " + M.i18n.t("btn.listen")]),
        el("button", { class: "btn", onclick: function () {
          if (checked) return;
          var ok = M.match.close(input.value, lx.acceptedForms.concat([lx.headword]));
          M.store.touchItem(lx.id, "written", ok);
          feedback(mount, ok, ok ? M.i18n.t("fb.correct") : (M.i18n.t("fb.almost") + " — " + lx.headword));
          checked = true;
          mount.appendChild(el("div", { class: "btn-row" }, [
            el("button", { class: "btn", onclick: function () { idx++; if (idx < items.length) round(); else done(true); } },
              [idx < items.length - 1 ? M.i18n.t("btn.next") : M.i18n.t("btn.continue")]),
          ]));
        } }, [M.i18n.t("btn.check")]),
      ]));
      input.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); mount.querySelector(".btn:not(.ghost)").click(); } });
      input.focus();
    }
    round();
  };

  function stepBadge(stageId) {
    var path = M.data.pronunciation.path;
    if (!path) return null;
    var st = (path.stages || []).find(function (s) { return s.id === stageId; });
    if (!st) return null;
    return el("div", { class: "stepbadge", text: st.label.en });
  }

  R["pron-record"] = function (mount, act, done) {
    var f = M.get.focus(act.focusId);
    dom.clear(mount);
    if (f) { var sb = stepBadge(f.stage); if (sb) mount.appendChild(sb); }
    mount.appendChild(el("p", { class: "prompt", text: M.i18n.t("act.pron.prompt") }));
    if (f) {
      mount.appendChild(el("div", { class: "card" }, [
        el("h3", { text: f.focus.en }),
        el("p", { class: "muted", text: M.i18n.helpAvailable() ? f.tip.hu : f.tip.en }),
      ]));
    }
    var words = (f && f.examples) || ["hello"];
    var idx = 0;
    function round() {
      var word = words[idx];
      var stage = el("div", { class: "card wordcard" }, [el("div", { class: "en", text: word })]);
      stage.appendChild(speakBtn(word));
      var recState = el("div", { class: "recstate", "aria-live": "polite" });
      var audio = el("audio", { controls: "controls", class: "hidden" });
      var recBtn = el("button", { class: "btn" }, [el("span", { html: dom.icon("mic") }), " " + M.i18n.t("btn.record")]);
      var recording = false;
      recBtn.addEventListener("click", function () {
        if (!M.audio.canRecord()) { dom.toast(M.i18n.t("cap.mic.no")); return; }
        if (!recording) {
          M.audio.startRecording(function (st, url) {
            if (st === "recording") { recording = true; recBtn.innerHTML = dom.icon("stop") + " " + M.i18n.t("btn.stop"); recState.innerHTML = '<span class="rec-dot on"></span>' + M.i18n.t("a11y.recording"); }
            else if (st === "ready") { recording = false; recBtn.innerHTML = dom.icon("mic") + " " + M.i18n.t("btn.record"); recState.textContent = ""; audio.src = url; audio.classList.remove("hidden"); }
            else if (st === "error") { recording = false; dom.toast(M.i18n.t("cap.mic.no")); }
          });
        } else { M.audio.stopRecording(); }
      });
      stage.appendChild(recState);
      stage.appendChild(el("div", { class: "btn-row" }, [recBtn]));
      stage.appendChild(audio);
      // optional experimental recognition
      if (M.caps.recognition) {
        stage.appendChild(el("div", { class: "btn-row" }, [
          el("button", { class: "btn ghost small", onclick: function () {
            dom.toast("…");
            M.audio.recognise(word, function (r) {
              if (!r.available) { dom.toast(M.i18n.t("cap.rec.experimental")); return; }
              var ok = r.said && M.match.close(r.said, [word]);
              dom.toast(ok ? M.i18n.t("fb.correct") : (M.i18n.t("cap.rec.experimental")));
            });
          } }, ["🎤? " + M.i18n.t("btn.check")]),
        ]));
        stage.appendChild(el("p", { class: "muted", text: M.i18n.t("cap.rec.experimental") }));
      }
      M.store.touchItem((M.data._lexByWord[word] || {}).id || ("_pron_" + word), "spoken", true);
      mount.appendChild(stage);
      mount.appendChild(el("div", { class: "btn-row" }, [
        el("button", { class: "btn secondary", onclick: function () { M.audio.clearRecording(); idx = (idx + 1) % words.length; dom.clear(mount); rebuildHead(); round(); } }, [M.i18n.t("btn.next")]),
        el("button", { class: "btn", onclick: function () { M.audio.clearRecording(); done(true); } }, [M.i18n.t("btn.continue")]),
      ]));
    }
    function rebuildHead() {
      mount.appendChild(el("p", { class: "prompt", text: M.i18n.t("act.pron.prompt") }));
      if (f) mount.appendChild(el("div", { class: "card" }, [el("h3", { text: f.focus.en })]));
    }
    round();
  };

  R.review = function (mount, act, done) {
    // gentle review: reuse listen-choose over the review items
    R["listen-choose"](mount, { items: act.items }, done);
  };

  // See an icon, choose the English word.
  R["icon-choice"] = function (mount, act, done) {
    var items = dom.shuffle(act.items.map(M.get.lex).filter(Boolean)).slice(0, 5);
    if (!items.length) return done(true);
    var idx = 0;
    function round() {
      dom.clear(mount);
      var target = items[idx];
      mount.appendChild(el("p", { class: "prompt", text: M.i18n.t("act.iconchoice.prompt") }));
      mount.appendChild(el("div", { class: "card wordcard" }, [
        el("div", { class: "wordicon", "aria-hidden": "true", html: dom.icon(target.icon || "dot") }),
        M.i18n.helpAvailable() ? el("div", { class: "hu", text: target.hu }) : null,
      ]));
      var pool = dom.shuffle([target].concat(M.get.distractorWords(target, 3, { iconSpecific: true })));
      var opts = el("div", { class: "options" });
      pool.forEach(function (o) {
        var b = el("button", { class: "option" }, [el("span", { text: o.headword })]);
        b.addEventListener("click", function () {
          var ok = o.id === target.id;
          b.classList.add(ok ? "correct" : "wrong");
          b.appendChild(el("span", { class: "mark", html: dom.icon(ok ? "check" : "again") }));
          M.audio.speak(target.tts);
          M.store.touchItem(target.id, "meaning", ok);
          Array.prototype.forEach.call(opts.children, function (c) { c.disabled = true; });
          feedback(mount, ok, ok ? M.i18n.t("fb.correct") : (M.i18n.t("fb.almost") + " — " + target.headword));
          advance(mount, ok, function () { idx++; if (idx < items.length) round(); else done(true); });
        });
        opts.appendChild(b);
      });
      mount.appendChild(opts);
    }
    round();
  };

  // Listen to one of a minimal pair, choose which word you heard (pronunciation discrimination).
  R["minimal-pair"] = function (mount, act, done) {
    var f = M.get.focus(act.focusId);
    var pairs = (f && f.minimalPairs) || [];
    if (!pairs.length) return done(true);
    dom.clear(mount);
    var sb = stepBadge(f.stage); if (sb) mount.appendChild(sb);
    mount.appendChild(el("p", { class: "prompt", text: M.i18n.t("act.minimalpair.prompt") }));
    if (f) mount.appendChild(el("div", { class: "card" }, [el("h3", { text: f.focus.en }), el("p", { class: "muted", text: M.i18n.helpAvailable() ? f.tip.hu : f.tip.en })]));
    var idx = 0;
    function round() {
      var pair = pairs[idx];
      var target = dom.shuffle([pair.a, pair.b])[0];
      var stage = el("div", {});
      stage.appendChild(el("div", { class: "btn-row" }, [
        el("button", { class: "btn secondary", onclick: function () { M.audio.speak(target); } }, [el("span", { html: dom.icon("speaker") }), " " + M.i18n.t("btn.listen")]),
        el("button", { class: "btn ghost", onclick: function () { M.audio.speak(target, { slow: true }); } }, [el("span", { html: dom.icon("slow") }), " " + M.i18n.t("btn.listen.slow")]),
      ]));
      stage.appendChild(el("p", { class: "muted", text: M.i18n.t("act.minimalpair.which") }));
      var opts = el("div", { class: "options" });
      [pair.a, pair.b].forEach(function (w) {
        var b = el("button", { class: "option" }, [el("span", { text: w })]);
        b.addEventListener("click", function () {
          var ok = w === target;
          b.classList.add(ok ? "correct" : "wrong");
          Array.prototype.forEach.call(opts.children, function (c) { c.disabled = true; });
          feedback(stage, ok, ok ? M.i18n.t("fb.correct") : (M.i18n.t("fb.listen") + " — " + target));
          advance(stage, ok, function () { idx++; if (idx < pairs.length) { dom.clear(mount); rebuild(); round(); } else done(true); });
        });
        opts.appendChild(b);
      });
      stage.appendChild(opts);
      mount.appendChild(stage);
      M.audio.speak(target);
    }
    function rebuild() { var s = stepBadge(f.stage); if (s) mount.appendChild(s); mount.appendChild(el("p", { class: "prompt", text: M.i18n.t("act.minimalpair.prompt") })); }
    round();
  };

  // Put the words in the right order to build a sentence.
  R.reorder = function (mount, act, done) {
    var sentences = act.sentences || [];
    if (!sentences.length) return done(true);
    var idx = 0;
    function round() {
      dom.clear(mount);
      var s = sentences[idx];
      var words = s.en.replace(/[.?!]$/, "").split(" ");
      mount.appendChild(el("p", { class: "prompt", text: M.i18n.t("act.reorder.prompt") }));
      mount.appendChild(el("div", { class: "btn-row" }, [el("button", { class: "btn ghost small", onclick: function () { M.audio.speak(s.en); } }, [el("span", { html: dom.icon("speaker") }), " " + M.i18n.t("btn.listen")]), M.i18n.helpAvailable() && s.hu ? el("span", { class: "muted", style: "align-self:center", text: s.hu }) : null]));
      var current = [];
      var builder = el("div", { class: "builder", "data-empty": "…" });
      var pool = el("div", { class: "blocks" });
      var btns = [];
      function refresh() { builder.textContent = current.join(" "); }
      dom.shuffle(words).forEach(function (w, i2) {
        var b = el("button", { class: "block", text: w });
        b.addEventListener("click", function () { if (b.disabled) return; b.disabled = true; current.push(w); refresh(); });
        btns.push(b); pool.appendChild(b);
      });
      builder.appendChild(el("button", { class: "btn ghost small", onclick: function () { current = []; btns.forEach(function (b) { b.disabled = false; }); refresh(); }, text: "⟲" }));
      mount.appendChild(builder); mount.appendChild(pool);
      mount.appendChild(el("div", { class: "btn-row" }, [
        el("button", { class: "btn", onclick: function () {
          var ok = M.match.norm(current.join(" ")) === M.match.norm(words.join(" "));
          feedback(mount, ok, ok ? M.i18n.t("fb.correct") : (M.i18n.t("fb.almost") + " — " + s.en));
          if (ok) M.audio.speak(s.en);
          mount.appendChild(el("div", { class: "btn-row" }, [el("button", { class: "btn", onclick: function () { idx++; if (idx < sentences.length) round(); else done(true); } }, [idx < sentences.length - 1 ? M.i18n.t("btn.next") : M.i18n.t("btn.continue")])]));
        } }, [M.i18n.t("btn.check")]),
      ]));
    }
    round();
  };

  // Fill the gap: choose the missing word in a sentence.
  R.gapfill = function (mount, act, done) {
    var items = act.items || [];
    if (!items.length) return done(true);
    var idx = 0;
    function round() {
      dom.clear(mount);
      var it = items[idx];
      mount.appendChild(el("p", { class: "prompt", text: M.i18n.t("act.gapfill.prompt") }));
      mount.appendChild(el("div", { class: "card" }, [
        el("div", { style: "font-size:1.2rem", html: it.text.replace("___", '<b style="color:var(--accent)">_____</b>') }),
        M.i18n.helpAvailable() && it.hu ? el("div", { class: "muted", text: it.hu }) : null,
        el("div", { class: "btn-row" }, [el("button", { class: "btn ghost small", onclick: function () { M.audio.speak(it.text.replace("___", it.answer)); } }, [el("span", { html: dom.icon("speaker") }), " " + M.i18n.t("btn.listen")])]),
      ]));
      var opts = el("div", { class: "options" });
      dom.shuffle(it.options).forEach(function (o) {
        var b = el("button", { class: "option" }, [el("span", { text: o })]);
        b.addEventListener("click", function () {
          var ok = M.match.norm(o) === M.match.norm(it.answer);
          b.classList.add(ok ? "correct" : "wrong");
          Array.prototype.forEach.call(opts.children, function (c) { c.disabled = true; });
          if (ok) M.audio.speak(it.text.replace("___", it.answer));
          feedback(mount, ok, ok ? M.i18n.t("fb.correct") : (M.i18n.t("fb.almost") + " — " + it.answer));
          advance(mount, ok, function () { idx++; if (idx < items.length) round(); else done(true); });
        });
        opts.appendChild(b);
      });
      mount.appendChild(opts);
    }
    round();
  };

  // Answer expansion: grow a short answer from one clause to three (from the brief).
  R.expand = function (mount, act, done) {
    var steps = act.steps || [];
    if (!steps.length) return done(true);
    dom.clear(mount);
    mount.appendChild(el("p", { class: "prompt", text: M.i18n.t("act.expand.prompt") }));
    if (act.question) mount.appendChild(el("div", { class: "card" }, [el("strong", { text: act.question.en }), M.i18n.helpAvailable() && act.question.hu ? el("div", { class: "muted", text: act.question.hu }) : null]));
    var i = 0;
    var out = el("div", { class: "card" });
    mount.appendChild(out);
    var controls = el("div", { class: "btn-row" });
    mount.appendChild(controls);
    function draw() {
      dom.clear(out); dom.clear(controls);
      out.appendChild(el("div", { style: "font-size:1.15rem;font-weight:600", text: steps[i].en }));
      if (M.i18n.helpAvailable() && steps[i].hu) out.appendChild(el("div", { class: "muted", text: steps[i].hu }));
      out.appendChild(el("p", { class: "muted", text: (i + 1) + " / " + steps.length }));
      if (i < steps.length - 1) {
        out.appendChild(el("div", { class: "btn-row" }, [el("button", { class: "btn secondary", onclick: function () { M.audio.speak(steps[i].en); } }, [el("span", { html: dom.icon("speaker") }), " " + M.i18n.t("btn.listen")])]));
        controls.appendChild(el("button", { class: "btn", onclick: function () { i++; draw(); } }, [M.i18n.t("act.expand.more")]));
      } else {
        // final, longest answer: say it aloud
        out.appendChild(el("p", { class: "prompt", style: "margin:.6rem 0 .2rem", text: M.i18n.t("act.sayit.prompt") }));
        out.appendChild(M.speakRecord(steps[i].en));
        controls.appendChild(el("button", { class: "btn", onclick: function () { M.audio.clearRecording(); done(true); } }, [M.i18n.t("btn.continue")]));
      }
    }
    draw();
  };

  // Listening comprehension: hear a short passage (replayable), then answer one question.
  R["listen-comprehension"] = function (mount, act, done) {
    dom.clear(mount);
    mount.appendChild(el("p", { class: "prompt", text: M.i18n.t("act.listencomp.prompt") }));
    mount.appendChild(el("div", { class: "card" }, [
      el("div", { style: "display:flex;align-items:center;gap:.7rem" }, [
        el("span", { class: "iconwell", html: dom.icon("chat"), "aria-hidden": "true" }),
        el("div", { style: "flex:1" }, [
          el("div", { class: "btn-row", style: "margin:0" }, [
            el("button", { class: "btn secondary", onclick: function () { M.audio.speak(act.passage.en, { slow: true }); } }, [el("span", { html: dom.icon("speaker") }), " " + M.i18n.t("btn.listen")]),
            el("button", { class: "btn ghost", onclick: function () { M.audio.speak(act.passage.en, { slow: true }); } }, [el("span", { html: dom.icon("again") }), " " + M.i18n.t("act.listencomp.again")]),
          ]),
        ]),
      ]),
    ]));
    mount.appendChild(el("p", { class: "prompt", text: act.question.en }));
    if (M.i18n.helpAvailable()) mount.appendChild(el("p", { class: "muted", style: "margin-top:-.6rem", text: act.question.hu }));
    var opts = el("div", { class: "options" });
    dom.shuffle(act.options).forEach(function (o) {
      var b = el("button", { class: "option" }, [el("span", { text: o })]);
      b.addEventListener("click", function () {
        var ok = o === act.answer;
        b.classList.add(ok ? "correct" : "wrong");
        Array.prototype.forEach.call(opts.children, function (c) { c.disabled = true; });
        feedback(mount, ok, ok ? M.i18n.t("fb.correct") : M.i18n.t("fb.listen"));
        mount.appendChild(el("div", { class: "btn-row" }, [el("button", { class: "btn", onclick: function () { done(true); } }, [M.i18n.t("btn.continue")])]));
      });
      opts.appendChild(b);
    });
    mount.appendChild(opts);
    M.audio.speak(act.passage.en, { slow: true });
  };

  // Odd one out: choose the word that does not belong to the group.
  R["odd-one-out"] = function (mount, act, done) {
    var groups = act.groups || [];
    if (!groups.length) return done(true);
    var idx = 0;
    function round() {
      dom.clear(mount);
      var g = groups[idx];
      mount.appendChild(el("p", { class: "prompt", text: M.i18n.t("act.odd.prompt") }));
      var opts = el("div", { class: "options" });
      dom.shuffle(g.words.concat([g.odd])).forEach(function (w) {
        var b = el("button", { class: "option" }, [el("span", { text: w })]);
        b.addEventListener("click", function () {
          var ok = w === g.odd;
          b.classList.add(ok ? "correct" : "wrong");
          Array.prototype.forEach.call(opts.children, function (c) { c.disabled = true; });
          feedback(mount, ok, ok ? M.i18n.t("fb.correct") : (M.i18n.t("fb.almost")));
          advance(mount, ok, function () { idx++; if (idx < groups.length) round(); else done(true); });
        });
        opts.appendChild(b);
      });
      mount.appendChild(opts);
    }
    round();
  };

  R.conversation = function (mount, act, done) {
    M.conversation.render(mount, act.dialogueId, done);
  };

  R.diagnostic = function (mount, act, done) { M.diagnostic.render(mount, done); };

  function nextBtn(done) {
    return el("div", { class: "btn-row" }, [el("button", { class: "btn", onclick: function () { done(true); } }, [M.i18n.t("btn.continue")])]);
  }

  // Reusable speaking widget: hear the model, record yourself, hear me (compare), optional check.
  // Used by the say-it drill, answer-expansion, and every conversation turn. Never blocks.
  M.speakRecord = function (text, opts) {
    opts = opts || {}; ready();
    var wrap = el("div", {});
    wrap.appendChild(el("div", { class: "btn-row" }, [
      el("button", { class: "btn secondary", onclick: function () { M.audio.speak(text); }, "aria-label": "Hear it: " + text }, [el("span", { html: dom.icon("speaker") }), " " + M.i18n.t("say.hear")]),
      el("button", { class: "btn ghost", onclick: function () { M.audio.speak(text, { slow: true }); } }, [el("span", { html: dom.icon("slow") }), " " + M.i18n.t("btn.listen.slow")]),
    ]));
    var recState = el("div", { class: "recstate", "aria-live": "polite" });
    var audio = el("audio", { controls: "controls", class: "hidden", "aria-label": M.i18n.t("say.hearme") });
    var recBtn = el("button", { class: "btn" }, [el("span", { html: dom.icon("mic") }), " " + M.i18n.t("say.record")]);
    var recording = false;
    recBtn.addEventListener("click", function () {
      if (!M.audio.canRecord()) { dom.toast(M.i18n.t("cap.mic.no")); return; }
      if (!recording) {
        M.audio.startRecording(function (st, url) {
          if (st === "recording") { recording = true; recBtn.innerHTML = dom.icon("stop") + " " + M.i18n.t("btn.stop"); recState.innerHTML = '<span class="rec-dot on"></span>' + M.i18n.t("a11y.recording"); }
          else if (st === "ready") { recording = false; recBtn.innerHTML = dom.icon("mic") + " " + M.i18n.t("say.again"); recState.textContent = ""; audio.src = url; audio.classList.remove("hidden"); if (opts.onRecorded) opts.onRecorded(url); }
          else if (st === "error") { recording = false; dom.toast(M.i18n.t("cap.mic.no")); }
        });
      } else { M.audio.stopRecording(); }
    });
    wrap.appendChild(el("div", { class: "btn-row" }, [recBtn]));
    wrap.appendChild(recState);
    wrap.appendChild(audio);
    if (M.caps.recognition && opts.check !== false) {
      wrap.appendChild(el("div", { class: "btn-row" }, [
        el("button", { class: "btn ghost small", onclick: function () {
          dom.toast("…");
          M.audio.recognise(text, function (r) {
            if (!r.available || r.error) { dom.toast(M.i18n.t("cap.rec.experimental")); return; }
            var okk = r.said && M.match.close(r.said, [text]);
            dom.toast(okk ? M.i18n.t("fb.correct") : M.i18n.t("cap.rec.experimental"));
          });
        } }, ["🎤? " + M.i18n.t("btn.check")]),
      ]));
    }
    return wrap;
  };

  // Speaking drill: say full phrases aloud (family lines, travel phrases, useful chunks).
  R["say-it"] = function (mount, act, done) {
    var phrases = (act.phrases || []).filter(Boolean);
    if (!phrases.length) return done(true);
    var idx = 0;
    function round() {
      dom.clear(mount);
      var p = phrases[idx];
      mount.appendChild(el("p", { class: "prompt", text: M.i18n.t("act.sayit.prompt") }));
      var card = el("div", { class: "card" }, [
        el("div", { style: "font-size:1.35rem;font-weight:700", text: p.en }),
        M.i18n.helpAvailable() && p.hu ? el("div", { class: "hu", text: p.hu }) : null,
      ]);
      card.appendChild(M.speakRecord(p.en));
      mount.appendChild(card);
      M.store.touchItem((M.data._lexByWord[p.en] || {}).id || ("_say_" + idx), "spoken", true);
      mount.appendChild(el("div", { class: "btn-row" }, [
        el("button", { class: "btn", onclick: function () { M.audio.clearRecording(); idx++; if (idx < phrases.length) round(); else done(true); } }, [idx < phrases.length - 1 ? M.i18n.t("btn.next") : M.i18n.t("btn.continue")]),
      ]));
    }
    round();
  };

  M.exercise = {
    render: function (mount, act, done) {
      ready();
      var fn = R[act.type];
      if (!fn) { mount.appendChild(el("p", { class: "muted", text: "…" })); return done(true); }
      M.store.recordAttempt(act.id, true);
      fn(mount, act, function (ok) { done(ok); });
    },
    types: Object.keys(R),
  };
})(window.M);
