// Conversation graphs. Deterministic, guided, with repair branches and 3 support levels.
// Helper builders keep the data compact and consistent.

// choose-node: character speaks, learner picks a reply
function choose(speaker, en, hu, choices, opts = {}) {
  return {
    speaker, text: { en, hu }, tts: opts.tts || en, huHelp: opts.huHelp || "",
    response: { mode: "choose", choices, fallbackNode: opts.fallback || null },
  };
}
// build-node: learner builds a sentence from word blocks
function build(speaker, en, hu, words, answer, next, opts = {}) {
  return {
    speaker, text: { en, hu }, tts: opts.tts || en, huHelp: opts.huHelp || "",
    response: {
      mode: "build", blocks: words, modelAnswer: answer, accepted: opts.accepted || [answer],
      next, hints: opts.hints || [], fallbackNode: opts.fallback || null,
    },
  };
}
// type-node: learner types a short answer, matched by keywords/patterns
function type(speaker, en, hu, accepted, keywords, modelAnswer, next, opts = {}) {
  return {
    speaker, text: { en, hu }, tts: opts.tts || en, huHelp: opts.huHelp || "",
    response: {
      mode: "type", accepted, keywords, modelAnswer, next,
      hints: opts.hints || [], fallbackNode: opts.fallback || null,
    },
  };
}
// end-node: closing line
function end(speaker, en, hu, opts = {}) {
  return { speaker, text: { en, hu }, tts: opts.tts || en, huHelp: opts.huHelp || "", response: { mode: "end" } };
}
const c = (en, hu, correct, next, fbEn, fbHu) => ({ text: { en, hu }, correct, next, feedback: { en: fbEn, hu: fbHu } });

export const DIALOGUES = [
  // ---------- Endika first conversation ----------
  {
    id: "dlg_endika_first", characterId: "endika",
    scene: { en: "First conversation with Endika", hu: "Első beszélgetés Endikával" },
    supportLevels: ["choose", "build", "type-speak"], startNode: "n1",
    memorySchema: { martaMood: "string" },
    nodes: {
      n1: choose("endika", "Hello Marta! Nice to meet you. How are you?", "Szia Marta! Örülök, hogy megismerhetlek. Hogy vagy?", [
        c("I'm fine, thank you. And you?", "Jól vagyok, köszönöm. És te?", true, "n2", "Lovely, a warm and natural reply.", "Kedves, meleg és természetes válasz."),
        c("Yes.", "Igen.", false, "n1b", "That's a little short. Try a greeting reply.", "Ez kicsit rövid. Próbálj köszönéssel válaszolni."),
        c("Goodbye.", "Viszlát.", false, "n1b", "Almost — that's for the end. Let's greet him first.", "Majdnem — az a végére való. Előbb köszönjünk."),
      ]),
      n1b: choose("endika", "No problem. Let's try again — how are you?", "Semmi baj. Próbáljuk újra — hogy vagy?", [
        c("I'm fine, thank you. And you?", "Jól vagyok, köszönöm. És te?", true, "n2", "There it is. Well done.", "Ez az. Ügyes vagy."),
        c("I'm tired, but okay.", "Fáradt vagyok, de jól.", true, "n2", "Also a great, honest answer.", "Szintén nagyszerű, őszinte válasz."),
      ]),
      n2: choose("endika", "I'm very well, thanks. Where are you from, Marta?", "Nagyon jól, köszönöm. Honnan jössz, Marta?", [
        c("I'm from Hungary.", "Magyarországról jöttem.", true, "n3", "Perfect.", "Tökéletes."),
        c("I from Hungary.", "Én Magyarország.", false, "n2b", "Almost — we need 'I'm from...'.", "Majdnem — 'I'm from...' kell."),
      ]),
      n2b: choose("endika", "Almost! Try: I'm from ...", "Majdnem! Próbáld: I'm from ...", [
        c("I'm from Hungary.", "Magyarországról jöttem.", true, "n3", "Yes! That's it.", "Igen! Ez az."),
      ]),
      n3: build("endika", "I live in Denmark. Now tell me where you live.", "Én Dániában élek. Mondd, te hol laksz?",
        ["I", "live", "in", "Hungary"], "I live in Hungary", "n4",
        { hints: ["Start with 'I live in ...'"], accepted: ["I live in Hungary", "I live in Budapest"] }),
      n4: type("endika", "Great! Do you have any hobbies?", "Remek! Van valami hobbid?",
        ["cook", "read", "garden", "music", "swim", "walk", "sing"],
        ["cook", "read", "garden", "music", "swim", "walk", "sing", "like", "love", "enjoy"],
        "I like cooking.", "n5",
        { hints: ["You can say: I like cooking / reading / gardening."], fallback: "n4b" }),
      n4b: choose("endika", "No problem. Choose a hobby to tell me:", "Semmi baj. Válassz egy hobbit, amit elmondasz:", [
        c("I like cooking.", "Szeretek főzni.", true, "n5", "Wonderful — I love cooking too!", "Csodás — én is imádok főzni!"),
        c("I like reading.", "Szeretek olvasni.", true, "n5", "Nice, reading is great.", "Szuper, az olvasás nagyszerű."),
      ]),
      n5: end("endika", "That's wonderful, Marta. It was lovely to talk to you!", "Ez csodálatos, Marta. Jó volt veled beszélgetni!"),
    },
  },

  // ---------- Endika follow-up ----------
  {
    id: "dlg_endika_followup", characterId: "endika",
    scene: { en: "Talking again with Endika", hu: "Újabb beszélgetés Endikával" },
    supportLevels: ["choose", "build", "type-speak"], startNode: "n1", memorySchema: {},
    nodes: {
      n1: choose("endika", "Hi Marta! How was your week?", "Szia Marta! Milyen volt a heted?", [
        c("It was good, thank you.", "Jó volt, köszönöm.", true, "n2", "Great answer.", "Remek válasz."),
        c("I am good week.", "Én jó hét.", false, "n1b", "Almost — try 'It was good.'", "Majdnem — 'It was good.'"),
      ]),
      n1b: choose("endika", "Try: It was ...", "Próbáld: It was ...", [
        c("It was good, thank you.", "Jó volt, köszönöm.", true, "n2", "Yes!", "Igen!"),
      ]),
      n2: build("endika", "What did you do at the weekend?", "Mit csináltál a hétvégén?",
        ["I", "visited", "my", "sister"], "I visited my sister", "n3",
        { hints: ["Use the past: I visited ..."], accepted: ["I visited my sister", "I visited my family"] }),
      n3: type("endika", "Nice! And how is Kira?", "Szuper! És hogy van Kira?",
        ["she is", "she's", "fine", "good", "well", "happy"], ["fine", "good", "well", "happy", "she"],
        "She is fine, thank you.", "n4", { hints: ["She is ..."], fallback: "n3b" }),
      n3b: choose("endika", "Choose an answer about Kira:", "Válassz választ Kiráról:", [
        c("She is fine, thank you.", "Jól van, köszönöm.", true, "n4", "Lovely.", "Kedves."),
      ]),
      n4: end("endika", "Thank you, Marta. Talk soon!", "Köszönöm, Marta. Hamarosan beszélünk!"),
    },
  },

  // ---------- Marlene first meeting ----------
  {
    id: "dlg_marlene_first", characterId: "marlene",
    scene: { en: "Meeting Marlene for the first time", hu: "Első találkozás Marlenével" },
    supportLevels: ["choose", "build", "type-speak"], startNode: "n1", memorySchema: {},
    nodes: {
      n1: choose("marlene", "Hello, I'm Marlene, David's girlfriend. Nice to meet you!", "Szia, Marlene vagyok, David barátnője. Örülök!", [
        c("Nice to meet you too. I'm Marta.", "Én is örülök. Marta vagyok.", true, "n2", "Warm and polite — perfect.", "Meleg és udvarias — tökéletes."),
        c("Hello Marlene.", "Szia Marlene.", true, "n2", "Good. You can also add your name.", "Jó. A nevedet is hozzáteheted."),
      ]),
      n2: choose("marlene", "Where are you from, Marta?", "Honnan jössz, Marta?", [
        c("I'm from Hungary. And you?", "Magyarországról. És te?", true, "n3", "Great — and you asked back!", "Remek — és vissza is kérdeztél!"),
        c("Hungary.", "Magyarország.", true, "n3", "Good. A full sentence is even nicer.", "Jó. Egy teljes mondat még szebb."),
      ]),
      n3: build("marlene", "I'm from Germany. What do you do?", "Németországból jövök. Mivel foglalkozol?",
        ["I", "am", "a", "retired", "teacher"], "I am a retired teacher", "n4",
        { hints: ["I am a ... teacher"], accepted: ["I am a retired teacher", "I'm a retired teacher"] }),
      n4: type("marlene", "How interesting! Do you have a big family?", "Milyen érdekes! Nagy családod van?",
        ["yes", "no", "sister", "brother", "family", "have"], ["yes", "no", "sister", "brother", "niece", "family", "big", "small"],
        "Yes, I have a big family.", "n5", { hints: ["Yes, I have ..."], fallback: "n4b" }),
      n4b: choose("marlene", "Choose an answer:", "Válassz választ:", [
        c("Yes, I have a big family.", "Igen, nagy családom van.", true, "n5", "Wonderful.", "Csodás."),
        c("I have two sisters.", "Két nővérem van.", true, "n5", "Lovely.", "Kedves."),
      ]),
      n5: end("marlene", "It was so nice to meet you, Marta. See you at dinner!", "Nagyon örültem, Marta. Találkozunk a vacsoránál!"),
    },
  },

  // ---------- Kira phone call ----------
  {
    id: "dlg_kira_phone", characterId: "kira",
    scene: { en: "A phone call with Kira", hu: "Telefonhívás Kirával" },
    supportLevels: ["choose", "build", "type-speak"], startNode: "n1", memorySchema: {},
    nodes: {
      n1: choose("kira", "Hi auntie! Can you hear me?", "Szia nénikém! Hallasz engem?", [
        c("Yes, I can hear you.", "Igen, hallak.", true, "n2", "Perfect.", "Tökéletes."),
        c("Sorry, I can't hear you well.", "Bocsi, nem hallak jól.", true, "n1b", "Good repair phrase!", "Jó javító mondat!"),
      ]),
      n1b: choose("kira", "Is it better now?", "Most jobb?", [
        c("Yes, now I can hear you.", "Igen, most hallak.", true, "n2", "Great.", "Remek."),
      ]),
      n2: choose("kira", "How are you today?", "Hogy vagy ma?", [
        c("I'm well, thank you. And you?", "Jól vagyok, köszönöm. És te?", true, "n3", "Lovely.", "Kedves."),
        c("A little tired, but okay.", "Kicsit fáradt, de jól.", true, "n3", "Honest and natural.", "Őszinte és természetes."),
      ]),
      n3: build("kira", "What are your plans for the weekend?", "Mik a terveid a hétvégére?",
        ["I", "am", "going", "to", "cook"], "I am going to cook", "n4",
        { hints: ["I am going to ..."], accepted: ["I am going to cook", "I am going to rest"] }),
      n4: type("kira", "Sounds nice! Shall we talk again on Sunday?", "Jól hangzik! Beszéljünk vasárnap újra?",
        ["yes", "sunday", "good", "idea", "okay", "ok"], ["yes", "sunday", "good", "idea", "okay", "sure"],
        "Yes, that's a good idea.", "n5", { hints: ["Yes, that's a good idea."], fallback: "n4b" }),
      n4b: choose("kira", "Choose your answer:", "Válassz választ:", [
        c("Yes, that's a good idea.", "Igen, ez jó ötlet.", true, "n5", "Great.", "Remek."),
      ]),
      n5: end("kira", "Lovely! Talk to you on Sunday. Bye auntie!", "Csodás! Vasárnap beszélünk. Szia nénikém!"),
    },
  },

  // ---------- Mirella work travel ----------
  {
    id: "dlg_mirella_travel", characterId: "mirella",
    scene: { en: "Talking about work travel with Mirella", hu: "Munkautazásról Mirellával" },
    supportLevels: ["choose", "build", "type-speak"], startNode: "n1", memorySchema: {},
    nodes: {
      n1: choose("mirella", "Hi Marta! I'm travelling to Belgium for work next week.", "Szia Marta! Jövő héten Belgiumba utazom dolgozni.", [
        c("Oh, how nice! Do you travel often?", "Ó, de jó! Sokat utazol?", true, "n2", "Great follow-up question.", "Remek visszakérdezés."),
        c("Belgium good.", "Belgium jó.", false, "n1b", "Almost — try a full sentence.", "Majdnem — teljes mondattal."),
      ]),
      n1b: choose("mirella", "Try asking me a question:", "Próbálj kérdezni tőlem:", [
        c("Do you travel often?", "Sokat utazol?", true, "n2", "Perfect question.", "Tökéletes kérdés."),
      ]),
      n2: choose("mirella", "Yes, I travel a lot for meetings. Do you like travelling?", "Igen, sokat utazom megbeszélésekre. Te szeretsz utazni?", [
        c("Yes, but I'm afraid of flying.", "Igen, de félek a repüléstől.", true, "n3", "Thank you for sharing that.", "Köszönöm, hogy elmondtad."),
        c("A little. I prefer trains.", "Egy kicsit. A vonatot jobban szeretem.", true, "n3", "That's a lovely answer.", "Ez kedves válasz."),
      ]),
      n3: build("mirella", "I understand. Where would you like to travel?", "Megértem. Hová szeretnél utazni?",
        ["I", "would", "like", "to", "visit", "Kira"], "I would like to visit Kira", "n4",
        { hints: ["I would like to visit ..."], accepted: ["I would like to visit Kira", "I would like to visit Denmark"] }),
      n4: end("mirella", "That's a wonderful plan. I'll help you if you need anything!", "Ez remek terv. Segítek, ha bármi kell!"),
    },
  },

  // ---------- Online student: microphone problem ----------
  {
    id: "dlg_student_mic", characterId: "student",
    scene: { en: "Online lesson: microphone trouble", hu: "Online óra: mikrofon gond" },
    supportLevels: ["choose", "build", "type-speak"], startNode: "n1", memorySchema: {},
    nodes: {
      n1: choose("student", "(The student joins, but you cannot hear them.)", "(A diák belép, de nem hallod.)", [
        c("Hello! Can you hear me?", "Szia! Hallasz engem?", true, "n2", "Good start.", "Jó kezdés."),
        c("Please turn your microphone on.", "Kérlek, kapcsold be a mikrofont.", true, "n2", "Very useful phrase!", "Nagyon hasznos mondat!"),
      ]),
      n2: choose("student", "(No sound yet — the child looks confused.)", "(Még nincs hang — a gyerek zavartnak tűnik.)", [
        c("Please turn your microphone on.", "Kérlek, kapcsold be a mikrofont.", true, "n3", "Perfect classroom English.", "Tökéletes tanári angol."),
        c("Can you repeat that?", "Meg tudod ismételni?", false, "n2b", "That's for later. First fix the sound.", "Az később jó. Előbb a hangot."),
      ]),
      n2b: choose("student", "(Still no sound.)", "(Még mindig nincs hang.)", [
        c("Please turn your microphone on.", "Kérlek, kapcsold be a mikrofont.", true, "n3", "Yes — that's the one.", "Igen — ez az."),
      ]),
      n3: choose("student", "Sorry teacher! Now it works. Hello!", "Bocsánat tanárnő! Most működik. Szia!", [
        c("Excellent! Let's start today's lesson.", "Kiváló! Kezdjük a mai órát.", true, "n4", "Great, warm and clear.", "Remek, meleg és világos."),
      ]),
      n4: end("student", "Okay! I'm ready. Thank you!", "Rendben! Kész vagyok. Köszönöm!"),
    },
  },

  // ---------- Online student: praise & parent ----------
  {
    id: "dlg_student_parent", characterId: "student",
    scene: { en: "Online lesson: praise and asking for a parent", hu: "Online óra: dicséret és a szülő hívása" },
    supportLevels: ["choose", "build", "type-speak"], startNode: "n1", memorySchema: {},
    nodes: {
      n1: choose("student", "Teacher, I finished the exercise!", "Tanárnő, kész vagyok a feladattal!", [
        c("Excellent! Well done!", "Kiváló! Ügyes vagy!", true, "n2", "Lovely praise.", "Kedves dicséret."),
        c("Wait a moment.", "Várj egy pillanatot.", false, "n1b", "First praise the child.", "Előbb dicsérd a gyereket."),
      ]),
      n1b: choose("student", "Did I do well, teacher?", "Jól csináltam, tanárnő?", [
        c("Yes, excellent! Well done!", "Igen, kiváló! Ügyes vagy!", true, "n2", "Warm and encouraging.", "Meleg és bátorító."),
      ]),
      n2: choose("student", "Thank you! My mum wants to say hello.", "Köszönöm! Anya szeretne köszönni.", [
        c("Can you ask your parents to come?", "Meg tudod kérni a szüleidet, hogy jöjjenek?", true, "n3", "Great — clear and polite.", "Remek — érthető és udvarias."),
      ]),
      n3: type("parent", "Hello, thank you for teaching my daughter. How is she doing?", "Jó napot, köszönöm, hogy tanítja a lányomat. Hogy halad?",
        ["good", "well", "very", "great", "learning", "she is", "she's"], ["good", "well", "great", "learning", "progress"],
        "She is doing very well.", "n4", { hints: ["She is doing very well."], fallback: "n3b" }),
      n3b: choose("parent", "Choose your answer to the parent:", "Válassz választ a szülőnek:", [
        c("She is doing very well.", "Nagyon jól halad.", true, "n4", "Wonderful.", "Csodás."),
      ]),
      n4: end("parent", "Thank you so much! Goodbye.", "Nagyon köszönöm! Viszlát."),
    },
  },

  // ---------- Airport journey ----------
  {
    id: "dlg_airport", characterId: "agent",
    scene: { en: "At the airport", hu: "A reptéren" },
    supportLevels: ["choose", "build", "type-speak"], startNode: "n1", memorySchema: {},
    nodes: {
      n1: choose("agent", "Good morning! Can I help you?", "Jó reggelt! Segíthetek?", [
        c("Where is the check-in desk, please?", "Hol van a check-in pult, kérem?", true, "n2", "Clear and polite.", "Érthető és udvarias."),
        c("Check-in.", "Check-in.", true, "n2", "Good. A full question is even clearer.", "Jó. A teljes kérdés még érthetőbb."),
      ]),
      n2: choose("agent", "It's over there, on the left. Do you have your passport?", "Ott van balra. Megvan az útlevele?", [
        c("Yes, here it is. Thank you.", "Igen, tessék. Köszönöm.", true, "n3", "Perfect.", "Tökéletes."),
        c("Sorry, I don't understand.", "Elnézést, nem értem.", true, "n2b", "Great repair phrase — never be afraid to use it.", "Remek javító mondat — sose félj használni."),
      ]),
      n2b: choose("agent", "(slowly) Your passport, please.", "(lassan) Az útlevelét, kérem.", [
        c("Ah, yes. Here it is.", "Ó, igen. Tessék.", true, "n3", "Well done.", "Ügyes."),
      ]),
      n3: type("agent", "Thank you. Here is your ticket. Your gate is B12.", "Köszönöm. Itt a jegye. A kapuja B12.",
        ["where", "gate", "thank", "thanks"], ["where", "gate", "thank"],
        "Where is my gate, please?", "n4", { hints: ["Where is my gate, please?"], fallback: "n3b" }),
      n3b: choose("agent", "Do you need anything else?", "Kell még valami?", [
        c("Where is my gate, please?", "Hol van a kapum, kérem?", true, "n4", "Very useful — well done.", "Nagyon hasznos — ügyes."),
      ]),
      n4: end("agent", "Gate B12 is straight ahead. Have a good flight!", "A B12 kapu egyenesen előre van. Jó repülést!"),
    },
  },

  // ---------- On the plane (emotional core) ----------
  {
    id: "dlg_plane_help", characterId: "attendant",
    scene: { en: "On the plane — asking for help", hu: "A repülőn — segítségkérés" },
    supportLevels: ["choose", "build", "type-speak"], startNode: "n1", memorySchema: {},
    nodes: {
      n1: choose("attendant", "Good afternoon. Are you comfortable?", "Jó napot. Kényelmesen ül?", [
        c("I am afraid of flying. This is my first flight.", "Félek a repüléstől. Ez az első repülésem.", true, "n2", "Thank you for telling me. You are safe here.", "Köszönöm, hogy elmondta. Itt biztonságban van."),
        c("I feel nervous.", "Ideges vagyok.", true, "n2", "That's okay. I'm here to help you.", "Semmi baj. Itt vagyok, hogy segítsek."),
      ]),
      n2: choose("attendant", "That's completely okay. Would you like some water?", "Ez teljesen rendben van. Kér egy kis vizet?", [
        c("Yes, could I have some water, please?", "Igen, kaphatnék egy kis vizet, kérem?", true, "n3", "Of course. Here you are.", "Persze. Tessék."),
        c("Could I have a blanket, please?", "Kaphatnék egy takarót, kérem?", true, "n3", "Certainly. I'll bring one now.", "Természetesen. Mindjárt hozom."),
      ]),
      n3: build("attendant", "Here you are. Is there anything else?", "Tessék. Van még valami?",
        ["When", "will", "we", "land"], "When will we land", "n4",
        { hints: ["When will we ...?"], accepted: ["When will we land", "When do we land"] }),
      n4: end("attendant", "We land in two hours. You are doing very well. Try to relax.", "Két óra múlva landolunk. Nagyon jól csinálja. Próbáljon ellazulni."),
    },
  },

  // ---------- Restaurant ----------
  {
    id: "dlg_restaurant", characterId: "waiter",
    scene: { en: "At a restaurant", hu: "Az étteremben" },
    supportLevels: ["choose", "build", "type-speak"], startNode: "n1", memorySchema: {},
    nodes: {
      n1: choose("waiter", "Good evening. Are you ready to order?", "Jó estét. Készen áll a rendelésre?", [
        c("Yes. I'd like the soup, please.", "Igen. A levest kérném.", true, "n2", "Perfect order.", "Tökéletes rendelés."),
        c("Could I have the menu, please?", "Megkaphatnám az étlapot, kérem?", true, "n1b", "Of course.", "Persze."),
      ]),
      n1b: choose("waiter", "Here is the menu. What would you like?", "Itt az étlap. Mit szeretne?", [
        c("I'd like the soup, please.", "A levest kérném.", true, "n2", "Great.", "Remek."),
      ]),
      n2: choose("waiter", "Good choice. Would you like something to drink?", "Jó választás. Kér valamit inni?", [
        c("Could I have some water, please?", "Kaphatnék egy kis vizet, kérem?", true, "n3", "Certainly.", "Természetesen."),
        c("A tea, please.", "Egy teát kérek.", true, "n3", "Coming right up.", "Máris hozom."),
      ]),
      n3: type("waiter", "Here you are. Enjoy your meal!", "Tessék. Jó étvágyat!",
        ["thank", "bill", "much"], ["thank", "bill", "how much"],
        "Thank you. Could I have the bill, please?", "n4", { hints: ["Later: Could I have the bill, please?"], fallback: "n4" }),
      n4: end("waiter", "Of course. Thank you very much. Good night!", "Persze. Nagyon köszönöm. Jó éjszakát!"),
    },
  },

  // ---------- Hotel check-in ----------
  {
    id: "dlg_hotel", characterId: "receptionist",
    scene: { en: "Hotel check-in", hu: "Bejelentkezés a szállodában" },
    supportLevels: ["choose", "build", "type-speak"], startNode: "n1", memorySchema: {},
    nodes: {
      n1: choose("receptionist", "Good evening, welcome! Do you have a reservation?", "Jó estét, üdvözöljük! Van foglalása?", [
        c("Yes, I have a reservation.", "Igen, van foglalásom.", true, "n2", "Great.", "Remek."),
        c("Sorry, could you speak more slowly?", "Elnézést, tudna lassabban beszélni?", true, "n1b", "A perfect polite request.", "Tökéletes udvarias kérés."),
      ]),
      n1b: choose("receptionist", "(slowly) Do... you... have... a... reservation?", "(lassan) Van... foglalása?", [
        c("Yes, I have a reservation.", "Igen, van foglalásom.", true, "n2", "Well done.", "Ügyes."),
      ]),
      n2: build("receptionist", "Wonderful. How many nights?", "Csodás. Hány éjszakára?",
        ["Two", "nights", "please"], "Two nights please", "n3",
        { hints: ["Two nights, please."], accepted: ["Two nights please", "Two nights", "Three nights please"] }),
      n3: choose("receptionist", "Here is your key. Room 12, on the first floor. Do you need anything?", "Itt a kulcsa. 12-es szoba, az első emeleten. Kell valami?", [
        c("Could you help me with my luggage, please?", "Tudna segíteni a poggyászommal, kérem?", true, "n4", "Of course, right away.", "Persze, azonnal."),
        c("No, thank you. Good night.", "Nem, köszönöm. Jó éjszakát.", true, "n4", "Have a lovely stay.", "Kellemes pihenést."),
      ]),
      n4: end("receptionist", "Enjoy your stay. Good night!", "Kellemes tartózkodást. Jó éjszakát!"),
    },
  },

  // ---------- Family dinner: meeting Peter ----------
  {
    id: "dlg_peter_dinner", characterId: "peter",
    scene: { en: "Meeting Peter at a family dinner", hu: "Peterrel egy családi vacsorán" },
    supportLevels: ["choose", "build", "type-speak"], startNode: "n1", memorySchema: {},
    nodes: {
      n1: choose("peter", "Hello Marta, I'm Peter, Esztella's boyfriend. Nice to meet you.", "Szia Marta, Peter vagyok, Esztella barátja. Örülök.", [
        c("Nice to meet you too, Peter.", "Én is örülök, Peter.", true, "n2", "Warm and polite.", "Meleg és udvarias."),
      ]),
      n2: choose("peter", "This food is delicious! Do you like cooking?", "Ez az étel finom! Szeretsz főzni?", [
        c("Yes, I love cooking.", "Igen, imádok főzni.", true, "n3", "Me too!", "Én is!"),
        c("A little. My sister cooks better.", "Egy kicsit. A nővérem jobban főz.", true, "n3", "Ha, that's kind of you.", "Ó, ez kedves tőled."),
      ]),
      n3: type("peter", "What do you like doing in your free time?", "Mit szeretsz csinálni a szabadidődben?",
        ["read", "cook", "walk", "garden", "music", "family", "like", "love"],
        ["read", "cook", "walk", "garden", "music", "family", "like", "love", "enjoy"],
        "I like reading and cooking.", "n4", { hints: ["I like ... and ..."], fallback: "n3b" }),
      n3b: choose("peter", "Choose an answer:", "Válassz választ:", [
        c("I like reading and cooking.", "Szeretek olvasni és főzni.", true, "n4", "Lovely.", "Kedves."),
      ]),
      n4: end("peter", "It's really nice to meet you, Marta. Let's talk more after dinner!", "Nagyon örülök, Marta. Beszéljünk még vacsora után!"),
    },
  },

  // ---------- Emma: books and opinions ----------
  {
    id: "dlg_emma_books", characterId: "emma",
    scene: { en: "Talking about books with Emma", hu: "Könyvekről Emmával" },
    supportLevels: ["choose", "build", "type-speak"], startNode: "n1", memorySchema: {},
    nodes: {
      n1: choose("emma", "Hi Aunt Marta! I'm reading a great book. Do you like reading?", "Szia Marta néni! Egy remek könyvet olvasok. Szeretsz olvasni?", [
        c("Yes, I love reading. What is your book?", "Igen, imádok olvasni. Mi a könyved?", true, "n2", "Great — and you asked a question!", "Remek — és kérdeztél is!"),
      ]),
      n2: choose("emma", "It's a story about a family. I think it's beautiful.", "Egy család története. Szerintem gyönyörű.", [
        c("It sounds interesting.", "Érdekesen hangzik.", true, "n3", "Nice opinion.", "Szép vélemény."),
        c("Really? Why do you like it?", "Tényleg? Miért szereted?", true, "n3", "Great follow-up question.", "Remek visszakérdezés."),
      ]),
      n3: type("emma", "Because the people are kind. What do you like reading?", "Mert a szereplők kedvesek. Te mit szeretsz olvasni?",
        ["book", "story", "read", "like", "history", "cook"], ["book", "story", "history", "cooking", "like", "love"],
        "I like reading about history.", "n4", { hints: ["I like reading about ..."], fallback: "n3b" }),
      n3b: choose("emma", "Choose an answer:", "Válassz választ:", [
        c("I like reading about history.", "Szeretek a történelemről olvasni.", true, "n4", "Lovely.", "Kedves."),
      ]),
      n4: end("emma", "We should share books! See you soon, auntie.", "Cseréljünk könyveket! Viszlát, néni."),
    },
  },

  // ---------- Lake Balaton family party (family event) ----------
  {
    id: "dlg_balaton", characterId: "margo",
    scene: { en: "Family party at Lake Balaton", hu: "Családi buli a Balatonnál" },
    supportLevels: ["choose", "build", "type-speak"], startNode: "n1", memorySchema: {},
    nodes: {
      n1: choose("margo", "Marta! Come and sit with us. This is Endika, Kira's boyfriend.", "Marta! Gyere, ülj le velünk. Ez itt Endika, Kira barátja.", [
        c("Hello Endika, nice to see you again.", "Szia Endika, örülök, hogy újra látlak.", true, "n2", "Warm and natural.", "Meleg és természetes."),
      ]),
      n2: choose("margo", "The weather is lovely today, isn't it?", "Csodás ma az idő, ugye?", [
        c("Yes, it's warm and sunny.", "Igen, meleg és napos.", true, "n3", "Great weather talk.", "Remek időjárás-beszéd."),
      ]),
      n3: type("endika", "Marta, would you like to eat something?", "Marta, szeretnél enni valamit?",
        ["yes", "please", "would like", "water", "cake", "soup", "no thank"], ["yes", "please", "like", "water", "cake", "thank"],
        "Yes, I'd like some cake, please.", "n4", { hints: ["Yes, I'd like some ..., please."], fallback: "n3b" }),
      n3b: choose("endika", "Choose an answer:", "Válassz választ:", [
        c("Yes, I'd like some cake, please.", "Igen, kérnék egy kis süteményt.", true, "n4", "Lovely.", "Kedves."),
        c("No, thank you. I'm fine.", "Nem, köszönöm. Jól vagyok.", true, "n4", "Perfectly polite.", "Tökéletesen udvarias."),
      ]),
      n4: end("margo", "It's so nice to have the whole family together!", "Olyan jó, hogy az egész család együtt van!"),
    },
  },
];
