// Exercise engine: data-driven, reusable activity components with calm feedback.
window.M = window.M || {};
(function (M) {
  var el = null, dom = null;
  function ready() { el = M.dom.el; dom = M.dom; }

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
      var pool = [target].concat(dom.shuffle(M.data.lexicon.filter(function (l) { return l.id !== target.id && l.partOfSpeech === target.partOfSpeech; })).slice(0, 3));
      pool = dom.shuffle(pool);
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
          feedback(mount, ok, ok ? M.i18n.t("fb.correct") : M.i18n.t("fb.listen"));
          if (ok) correctCount++;
          mount.appendChild(el("div", { class: "btn-row" }, [
            el("button", { class: "btn", onclick: function () { idx++; if (idx < items.length) round(); else done(true); } },
              [idx < items.length - 1 ? M.i18n.t("btn.next") : M.i18n.t("btn.continue")]),
          ]));
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
          if (matched === items.length) { feedback(mount, true, M.i18n.t("fb.correct")); mount.appendChild(nextBtn(done)); }
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
    mount.appendChild(el("p", { class: "prompt", text: M.i18n.t("act.spelling.prompt") }));
    mount.appendChild(el("div", { class: "card" }, [
      el("strong", { text: fam.label.en }),
      M.i18n.helpAvailable() ? el("div", { class: "muted", text: fam.note.hu }) : el("div", { class: "muted", text: fam.note.en }),
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

  R["pron-record"] = function (mount, act, done) {
    var f = M.get.focus(act.focusId);
    dom.clear(mount);
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

  R.conversation = function (mount, act, done) {
    M.conversation.render(mount, act.dialogueId, done);
  };

  R.diagnostic = function (mount, act, done) { M.diagnostic.render(mount, done); };

  function nextBtn(done) {
    return el("div", { class: "btn-row" }, [el("button", { class: "btn", onclick: function () { done(true); } }, [M.i18n.t("btn.continue")])]);
  }

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
