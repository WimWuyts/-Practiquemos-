// Grammar practice bank — real, varied A1 exercises for each grammar point,
// grounded in Marta's world (Kira in Denmark, Endika, Esztella in Prague, David's
// studies, her online students, the airport, family meals). Folded onto each grammar
// card by build-data.mjs as `g.practice`. Kinds:
//   form  → choose the right form (tap)         {text with ___, answer, options, hu}
//   type  → type the right form                 {text with ___, accepted[], hint{en,hu}, hu}
//   fix   → one word is wrong; tap & correct it  {tokens[], wrong index, fix, hu}
//   build → put the words in order (reorder)     {en, hu}
//   say   → say it out loud (record)             {en, hu}
// Keep English natural, spoken, correct, strictly A1. Hungarian = natural meaning.
export const GRAMMAR_PRACTICE = {
  gr_be: [
    { kind: "form", text: "My niece Kira ___ in Denmark.", answer: "is", options: ["am", "is", "are"], hu: "Kira unokahúgom Dániában van." },
    { kind: "type", text: "I ___ a retired teacher.", accepted: ["am", "'m"], hint: { en: "I → am", hu: "I mellett: am" }, hu: "Nyugdíjas tanár vagyok." },
    { kind: "fix", tokens: ["We", "is", "a", "happy", "family"], wrong: 1, fix: "are", hu: "Boldog család vagyunk." },
    { kind: "say", en: "I am a little nervous.", hu: "Kicsit ideges vagyok." },
  ],
  gr_pronouns: [
    { kind: "form", text: "Endika is from Spain. ___ is very kind.", answer: "He", options: ["He", "She", "They"], hu: "Endika Spanyolországból jött. Nagyon kedves." },
    { kind: "form", text: "Kira and Endika live in Denmark. ___ are happy.", answer: "They", options: ["We", "They", "She"], hu: "Kira és Endika Dániában él. Boldogok." },
    { kind: "fix", tokens: ["Kira", "is", "kind.", "Her", "is", "my", "niece"], wrong: 3, fix: "She", hu: "Kira kedves. Ő az unokahúgom." },
    { kind: "say", en: "She is my niece.", hu: "Ő az unokahúgom." },
  ],
  gr_questions_wh: [
    { kind: "form", text: "___ are you from?", answer: "Where", options: ["What", "Where", "How"], hu: "Honnan jössz?" },
    { kind: "form", text: "___ is your name?", answer: "What", options: ["What", "Where", "When"], hu: "Hogy hívnak?" },
    { kind: "type", text: "___ are you? I'm fine, thank you.", accepted: ["how"], hint: { en: "asks about the way", hu: "a módra kérdez" }, hu: "Hogy vagy? Jól vagyok, köszönöm." },
    { kind: "say", en: "Where is the gate, please?", hu: "Hol van a beszállókapu, kérem?" },
  ],
  gr_articles: [
    { kind: "form", text: "It is ___ apple.", answer: "an", options: ["a", "an"], hu: "Ez egy alma." },
    { kind: "form", text: "I am ___ teacher.", answer: "a", options: ["a", "an"], hu: "Tanár vagyok." },
    { kind: "type", text: "I would like ___ orange, please.", accepted: ["an"], hint: { en: "before a vowel sound → an", hu: "magánhangzó előtt: an" }, hu: "Egy narancsot kérek." },
    { kind: "fix", tokens: ["Kira", "has", "a", "umbrella"], wrong: 2, fix: "an", hu: "Kirának van egy esernyője." },
  ],
  gr_possadj: [
    { kind: "form", text: "Kira is a woman. ___ boyfriend is Endika.", answer: "Her", options: ["His", "Her", "Their"], hu: "Kira nő. A barátja Endika." },
    { kind: "form", text: "This is ___ family. I love them.", answer: "my", options: ["my", "your", "his"], hu: "Ez az én családom. Szeretem őket." },
    { kind: "type", text: "David studies a lot. ___ subject is computer science.", accepted: ["his"], hint: { en: "a man → his", hu: "férfié → his" }, hu: "David sokat tanul. A szakja informatika." },
    { kind: "say", en: "Her name is Kira.", hu: "Az ő neve Kira." },
  ],
  gr_poss_s: [
    { kind: "type", text: "This is Marta___ house.", accepted: ["'s", "s"], hint: { en: "add 's to the name", hu: "tegyél 's-t a név után" }, hu: "Ez Marta háza." },
    { kind: "form", text: "Endika is ___ boyfriend.", answer: "Kira's", options: ["Kira's", "Kiras", "Kira"], hu: "Endika Kira barátja." },
    { kind: "fix", tokens: ["That", "is", "my", "sisters", "car"], wrong: 3, fix: "sister's", hu: "Az a nővérem autója." },
    { kind: "say", en: "This is my niece's boyfriend.", hu: "Ez az unokahúgom barátja." },
  ],
  gr_have: [
    { kind: "form", text: "She ___ a nice house.", answer: "has", options: ["have", "has"], hu: "Szép háza van." },
    { kind: "form", text: "I ___ two nieces.", answer: "have", options: ["have", "has"], hu: "Két unokahúgom van." },
    { kind: "type", text: "David ___ a girlfriend, Marlene.", accepted: ["has"], hint: { en: "he/she/it → has", hu: "he/she/it mellett: has" }, hu: "Davidnek van egy barátnője, Marlene." },
    { kind: "fix", tokens: ["My", "sister", "have", "three", "children"], wrong: 2, fix: "has", hu: "A nővéremnek három gyereke van." },
  ],
  gr_plural: [
    { kind: "type", text: "I have three ___.", accepted: ["children"], hint: { en: "child → children", hu: "child → children" }, hu: "Három gyerekem van." },
    { kind: "form", text: "Two ___, please.", answer: "coffees", options: ["coffee", "coffees"], hu: "Két kávét kérek." },
    { kind: "build", en: "I have two sisters.", hu: "Két nővérem van." },
    { kind: "fix", tokens: ["I", "have", "four", "book"], wrong: 3, fix: "books", hu: "Négy könyvem van." },
  ],
  gr_presentsimple: [
    { kind: "type", text: "She ___ Hungarian online.", accepted: ["teaches"], hint: { en: "he/she → verb + s", hu: "he/she mellett: ige + s" }, hu: "Magyart tanít online." },
    { kind: "form", text: "I ___ coffee every morning.", answer: "drink", options: ["drink", "drinks"], hu: "Minden reggel kávét iszom." },
    { kind: "fix", tokens: ["Kira", "live", "in", "Denmark"], wrong: 1, fix: "lives", hu: "Kira Dániában él." },
    { kind: "say", en: "I teach children online.", hu: "Gyerekeket tanítok online." },
  ],
  gr_dodoes: [
    { kind: "form", text: "___ you like tea?", answer: "Do", options: ["Do", "Does"], hu: "Szereted a teát?" },
    { kind: "form", text: "___ she live in Prague?", answer: "Does", options: ["Do", "Does"], hu: "Prágában él?" },
    { kind: "type", text: "___ Endika speak Hungarian?", accepted: ["does"], hint: { en: "he/she/it → does", hu: "he/she/it mellett: does" }, hu: "Beszél Endika magyarul?" },
    { kind: "say", en: "Do you have a ticket?", hu: "Van jegyed?" },
  ],
  gr_frequency: [
    { kind: "build", en: "I always drink coffee.", hu: "Mindig kávét iszom." },
    { kind: "form", text: "I ___ teach on Mondays.", answer: "usually", options: ["usually", "usual"], hu: "Hétfőnként általában tanítok." },
    { kind: "build", en: "I never drink cola.", hu: "Soha nem iszom kólát." },
    { kind: "say", en: "I sometimes call my family.", hu: "Néha felhívom a családomat." },
  ],
  gr_thereis: [
    { kind: "form", text: "___ three chairs in the kitchen.", answer: "There are", options: ["There is", "There are"], hu: "Három szék van a konyhában." },
    { kind: "form", text: "___ a problem with my laptop.", answer: "There is", options: ["There is", "There are"], hu: "Van egy gond a laptopommal." },
    { kind: "type", text: "___ a lot of people at the airport.", accepted: ["there are"], hint: { en: "plural → there are", hu: "többes szám → there are" }, hu: "Sok ember van a reptéren." },
    { kind: "say", en: "There is a nice garden.", hu: "Van egy szép kert." },
  ],
  gr_someany: [
    { kind: "form", text: "Do you have ___ tea?", answer: "any", options: ["some", "any"], hu: "Van teád?" },
    { kind: "form", text: "I would like ___ water, please.", answer: "some", options: ["some", "any"], hu: "Kérek egy kis vizet." },
    { kind: "fix", tokens: ["There", "isn't", "some", "milk"], wrong: 2, fix: "any", hu: "Nincs tej." },
    { kind: "say", en: "Can I have some water, please?", hu: "Kaphatnék egy kis vizet, kérem?" },
  ],
  gr_wouldlike: [
    { kind: "type", text: "I ___ a coffee, please.", accepted: ["would like", "'d like", "would like to"], hint: { en: "polite: I'd like", hu: "udvarias: I'd like" }, hu: "Egy kávét kérek." },
    { kind: "form", text: "___ you like some tea?", answer: "Would", options: ["Would", "Do", "Are"], hu: "Kérsz egy kis teát?" },
    { kind: "build", en: "I would like to visit Kira.", hu: "Szeretném meglátogatni Kirát." },
    { kind: "say", en: "I'd like a window seat, please.", hu: "Ablak melletti ülést kérek." },
  ],
  gr_can: [
    { kind: "form", text: "___ you swim?", answer: "Can", options: ["Can", "Do"], hu: "Tudsz úszni?" },
    { kind: "type", text: "___ you hear me? The connection is bad.", accepted: ["can"], hint: { en: "ability/possibility → can", hu: "képesség → can" }, hu: "Hallasz engem? Rossz a kapcsolat." },
    { kind: "fix", tokens: ["I", "can", "cooks"], wrong: 2, fix: "cook", hu: "Tudok főzni." },
    { kind: "say", en: "Can you repeat that, please?", hu: "Meg tudod ismételni, kérlek?" },
  ],
  gr_goingto: [
    { kind: "form", text: "I ___ going to call Kira tonight.", answer: "am", options: ["am", "do", "is"], hu: "Ma este fel fogom hívni Kirát." },
    { kind: "type", text: "We ___ going to travel to Denmark.", accepted: ["are", "'re"], hint: { en: "we → are going to", hu: "we mellett: are going to" }, hu: "Dániába fogunk utazni." },
    { kind: "build", en: "I am going to visit my family.", hu: "Meg fogom látogatni a családomat." },
    { kind: "say", en: "I'm going to be brave on the plane.", hu: "Bátor leszek a repülőn." },
  ],
  gr_presentcont: [
    { kind: "type", text: "Right now I ___ lunch for the family.", accepted: ["am cooking", "'m cooking"], hint: { en: "now → am + -ing", hu: "most → am + -ing" }, hu: "Most ebédet főzök a családnak." },
    { kind: "form", text: "The children ___ listening to me.", answer: "are", options: ["is", "are", "am"], hu: "A gyerekek hallgatnak engem." },
    { kind: "fix", tokens: ["I", "am", "teach", "now"], wrong: 2, fix: "teaching", hu: "Most tanítok." },
    { kind: "say", en: "I am waiting at the gate.", hu: "A kapunál várok." },
  ],
  gr_prepositions_time: [
    { kind: "form", text: "I teach ___ Monday.", answer: "on", options: ["at", "on", "in"], hu: "Hétfőn tanítok." },
    { kind: "form", text: "The lesson starts ___ three o'clock.", answer: "at", options: ["at", "on", "in"], hu: "Az óra háromkor kezdődik." },
    { kind: "type", text: "My birthday is ___ May.", accepted: ["in"], hint: { en: "months → in", hu: "hónapok előtt: in" }, hu: "A születésnapom májusban van." },
    { kind: "say", en: "I call my family at the weekend.", hu: "Hétvégén felhívom a családomat." },
  ],
  gr_object_pronouns: [
    { kind: "form", text: "Can you hear ___?", answer: "me", options: ["I", "me"], hu: "Hallasz engem?" },
    { kind: "form", text: "I love my family. I miss ___.", answer: "them", options: ["they", "them"], hu: "Szeretem a családomat. Hiányoznak." },
    { kind: "fix", tokens: ["Please", "call", "I", "tomorrow"], wrong: 2, fix: "me", hu: "Kérlek, hívj fel holnap." },
    { kind: "say", en: "I want to see you soon.", hu: "Hamarosan látni akarlak." },
  ],
  gr_likeing: [
    { kind: "type", text: "I like ___ books in the garden.", accepted: ["reading"], hint: { en: "like + verb-ing", hu: "like + ige-ing" }, hu: "Szeretek könyvet olvasni a kertben." },
    { kind: "form", text: "She loves ___ with the children.", answer: "working", options: ["work", "working"], hu: "Szeret a gyerekekkel dolgozni." },
    { kind: "fix", tokens: ["I", "like", "cook", "for", "my", "family"], wrong: 2, fix: "cooking", hu: "Szeretek főzni a családomnak." },
    { kind: "say", en: "I like teaching Hungarian.", hu: "Szeretek magyart tanítani." },
  ],
  gr_imperatives: [
    { kind: "form", text: "___ left at the corner.", answer: "Turn", options: ["Turn", "Turning"], hu: "A sarkon fordulj balra." },
    { kind: "type", text: "Please ___ your microphone on.", accepted: ["turn"], hint: { en: "instruction → base verb", hu: "utasítás → alapige" }, hu: "Kérlek, kapcsold be a mikrofont." },
    { kind: "build", en: "Please repeat after me.", hu: "Kérlek, ismételd utánam." },
    { kind: "say", en: "Let's start today's lesson.", hu: "Kezdjük a mai órát." },
  ],
  gr_could_requests: [
    { kind: "type", text: "Could I ___ some water, please?", accepted: ["have"], hint: { en: "Could I + base verb", hu: "Could I + alapige" }, hu: "Kaphatnék egy kis vizet, kérem?" },
    { kind: "form", text: "___ you help me, please?", answer: "Could", options: ["Could", "Do", "Are"], hu: "Tudna segíteni, kérem?" },
    { kind: "build", en: "Could you say that again?", hu: "Meg tudná ismételni?" },
    { kind: "say", en: "Could I have the bill, please?", hu: "Kérhetném a számlát?" },
  ],
  gr_waswere: [
    { kind: "form", text: "They ___ very happy to see me.", answer: "were", options: ["was", "were"], hu: "Nagyon örültek, hogy láttak." },
    { kind: "form", text: "The flight ___ fine. I was calm.", answer: "was", options: ["was", "were"], hu: "A repülés jó volt. Nyugodt voltam." },
    { kind: "type", text: "We ___ at Aunt Eva's for Christmas.", accepted: ["were"], hint: { en: "we/you/they → were", hu: "we/you/they mellett: were" }, hu: "Karácsonykor Eva néninél voltunk." },
    { kind: "say", en: "It was lovely to see you.", hu: "Csodás volt látni téged." },
  ],
  gr_pastsimple: [
    { kind: "type", text: "Yesterday I ___ Kira on the phone.", accepted: ["called"], hint: { en: "add -ed", hu: "tegyél -ed-t" }, hu: "Tegnap felhívtam Kirát telefonon." },
    { kind: "fix", tokens: ["We", "goed", "to", "Prague"], wrong: 1, fix: "went", hu: "Prágába mentünk." },
    { kind: "build", en: "I cooked lunch for the family.", hu: "Ebédet főztem a családnak." },
    { kind: "say", en: "We had coffee in the garden.", hu: "Kávéztunk a kertben." },
  ],
  gr_needhaveto: [
    { kind: "form", text: "I ___ to pack my bag.", answer: "need", options: ["need", "needs"], hu: "Be kell csomagolnom a táskámat." },
    { kind: "type", text: "She ___ to check in at the airport.", accepted: ["has"], hint: { en: "she → has to", hu: "she mellett: has to" }, hu: "Be kell jelentkeznie a reptéren." },
    { kind: "build", en: "I have to be brave.", hu: "Bátornak kell lennem." },
    { kind: "say", en: "I need to call my niece.", hu: "Fel kell hívnom az unokahúgomat." },
  ],
  gr_comparatives: [
    { kind: "type", text: "Denmark is ___ than Hungary. (big)", accepted: ["bigger"], hint: { en: "short word → -er", hu: "rövid szó → -er" }, hu: "Dánia nagyobb, mint Magyarország." },
    { kind: "form", text: "Prague is ___ beautiful than I remembered.", answer: "more", options: ["more", "most"], hu: "Prága szebb, mint emlékeztem." },
    { kind: "fix", tokens: ["Today", "is", "more", "warm", "than", "yesterday"], wrong: 2, fix: "warmer", hu: "Ma melegebb van, mint tegnap." },
    { kind: "say", en: "My English is better now.", hu: "Az angolom most jobb." },
  ],
  gr_conjunctions: [
    { kind: "form", text: "I'm tired ___ I worked a lot.", answer: "because", options: ["but", "because"], hu: "Fáradt vagyok, mert sokat dolgoztam." },
    { kind: "form", text: "I like tea ___ I love coffee.", answer: "but", options: ["and", "but"], hu: "Szeretem a teát, de imádom a kávét." },
    { kind: "build", en: "I called Kira and we talked.", hu: "Felhívtam Kirát, és beszélgettünk." },
    { kind: "say", en: "I'm happy because I see my family.", hu: "Boldog vagyok, mert látom a családomat." },
  ],
};
