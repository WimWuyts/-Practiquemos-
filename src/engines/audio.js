// Audio engine: British TTS + microphone record/replay. No uploads, in-memory by default.
window.M = window.M || {};
(function (M) {
  var voices = [];
  var chosen = null;

  function pickBritish() {
    var pref = M.store.settings().voiceURI;
    if (pref) { var byUri = voices.find(function (v) { return v.voiceURI === pref; }); if (byUri) return byUri; }
    var gb = voices.filter(function (v) { return /en[-_]GB/i.test(v.lang); });
    if (gb.length) {
      // prefer a female-sounding named voice if present, else first GB
      var named = gb.find(function (v) { return /female|Hazel|Libby|Sonia|Susan|Kate|Serena/i.test(v.name); });
      return named || gb[0];
    }
    var anyEn = voices.filter(function (v) { return /^en/i.test(v.lang); });
    return anyEn[0] || voices[0] || null;
  }

  function loadVoices() {
    if (!M.caps.tts) return;
    voices = window.speechSynthesis.getVoices() || [];
    chosen = pickBritish();
    M.caps.britishVoice = !!(chosen && /en[-_]GB/i.test(chosen.lang));
    if (M.onVoicesReady) M.onVoicesReady();
  }

  M.audio = {
    init: function () {
      if (!M.caps.tts) return;
      loadVoices();
      // voices often load asynchronously
      window.speechSynthesis.onvoiceschanged = loadVoices;
      // retry a few times (some browsers are slow / need a nudge)
      var tries = 0;
      var iv = setInterval(function () {
        if ((voices && voices.length) || tries++ > 10) { clearInterval(iv); loadVoices(); }
        else window.speechSynthesis.getVoices();
      }, 250);
    },
    voices: function () { return voices; },
    currentVoice: function () { return chosen; },
    setVoice: function (uri) { M.store.setSetting("voiceURI", uri); chosen = pickBritish(); },
    hasBritish: function () { return M.caps.britishVoice; },

    speak: function (text, opts) {
      opts = opts || {};
      if (!M.caps.tts || !text) return false;
      try {
        window.speechSynthesis.cancel(); // cancel queued speech before a new example
        var u = new SpeechSynthesisUtterance(String(text));
        if (chosen) { u.voice = chosen; u.lang = chosen.lang; } else { u.lang = "en-GB"; }
        u.rate = opts.slow ? 0.7 : 0.95;
        u.pitch = 1;
        window.speechSynthesis.speak(u);
        return true;
      } catch (e) { return false; }
    },
    stopSpeak: function () { try { window.speechSynthesis.cancel(); } catch (e) {} },

    // ----- recorder -----
    _rec: null, _chunks: [], _stream: null, _url: null,
    canRecord: function () { return M.caps.mic; },
    startRecording: function (onState) {
      var self = this;
      if (!M.caps.mic) { onState && onState("error"); return; }
      navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
        self._stream = stream; self._chunks = [];
        var mr = new MediaRecorder(stream);
        self._rec = mr;
        mr.ondataavailable = function (e) { if (e.data && e.data.size) self._chunks.push(e.data); };
        mr.onstop = function () {
          if (self._url) { URL.revokeObjectURL(self._url); self._url = null; }
          var size = self._chunks.reduce(function (n, c) { return n + (c.size || 0); }, 0);
          // release tracks
          if (self._stream) { self._stream.getTracks().forEach(function (t) { t.stop(); }); self._stream = null; }
          if (size < 800) { self._chunks = []; onState && onState("empty"); return; } // too short → no clip
          var blob = new Blob(self._chunks, { type: mr.mimeType || "audio/webm" });
          self._url = URL.createObjectURL(blob);
          onState && onState("ready", self._url);
        };
        mr.start();
        onState && onState("recording");
      }).catch(function () { onState && onState("error"); });
    },
    stopRecording: function () { try { if (this._rec && this._rec.state !== "inactive") this._rec.stop(); } catch (e) {} },
    lastRecordingURL: function () { return this._url; },
    clearRecording: function () {
      try { if (this._rec && this._rec.state !== "inactive") this._rec.stop(); } catch (e) {}
      if (this._stream) { this._stream.getTracks().forEach(function (t) { t.stop(); }); this._stream = null; }
      if (this._url) { URL.revokeObjectURL(this._url); this._url = null; }
      this._chunks = [];
    },

    // ----- optional experimental recognition -----
    recognise: function (expected, cb) {
      var Rec = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!Rec) { cb({ available: false }); return; }
      try {
        var r = new Rec(); r.lang = "en-GB"; r.maxAlternatives = 3; r.interimResults = false;
        r.onresult = function (e) {
          var said = e.results[0][0].transcript || "";
          cb({ available: true, said: said });
        };
        r.onerror = function () { cb({ available: true, said: "", error: true }); };
        r.start();
      } catch (e) { cb({ available: false }); }
    },
  };
})(window.M);
