// Productive chunks / sentence frames / fixed expressions.
// [id, intention, en, hu, register, firstLesson, variants[], slots[]]
export const CHUNKS = [
  // Greetings & introductions
  ["greet_hello", "greet someone", "Hello, how are you?", "Szia, hogy vagy?", "neutral", "u01-l01", ["Hi, how are you?", "Hello. How are you?"], []],
  ["reply_fine", "answer how are you", "I'm fine, thank you.", "Jól vagyok, köszönöm.", "neutral", "u01-l01", ["I'm fine, thanks.", "I am fine, thank you."], []],
  ["reply_and_you", "return the question", "And you?", "És te?", "neutral", "u01-l01", ["How about you?"], []],
  ["intro_name", "say your name", "My name is Marta.", "A nevem Marta.", "neutral", "u01-l01", ["I'm Marta.", "I am Marta."], ["name"]],
  ["ask_name", "ask someone's name", "What is your name?", "Hogy hívnak?", "neutral", "u01-l01", ["What's your name?"], []],
  ["intro_from", "say where you are from", "I'm from Hungary.", "Magyarországról jöttem.", "neutral", "u01-l01", ["I am from Hungary.", "I come from Hungary."], ["country"]],
  ["ask_from", "ask where someone is from", "Where are you from?", "Honnan jössz?", "neutral", "u01-l01", ["Where do you come from?"], []],
  ["intro_nice", "polite first meeting", "Nice to meet you.", "Örülök, hogy megismerhetlek.", "polite", "u01-l02", ["It's nice to meet you.", "Pleased to meet you."], []],
  ["intro_job", "say your job", "I am a retired teacher.", "Nyugdíjas tanár vagyok.", "neutral", "u01-l02", ["I'm a retired teacher."], ["job"]],

  // Repair / survival (high priority — many encounters)
  ["repair_notunderstand", "say you don't understand", "I don't understand.", "Nem értem.", "neutral", "u07-l01", ["Sorry, I don't understand.", "I do not understand."], []],
  ["repair_repeat", "ask to repeat", "Could you repeat that, please?", "Meg tudná ismételni, kérem?", "polite", "u07-l01", ["Can you repeat that?", "Please repeat that."], []],
  ["repair_slower", "ask for slower speech", "Could you speak more slowly, please?", "Tudna lassabban beszélni, kérem?", "polite", "u07-l01", ["Can you speak more slowly?", "Please speak slowly."], []],
  ["repair_wait", "ask someone to wait", "Please wait a moment.", "Kérem, várjon egy pillanatot.", "polite", "u07-l01", ["One moment, please.", "Just a moment, please."], []],
  ["repair_sorry", "apologise politely", "Sorry, I didn't hear you.", "Elnézést, nem hallottam.", "polite", "u07-l01", ["Sorry, I didn't catch that."], []],
  ["repair_howsay", "ask how to say something", "How do you say this in English?", "Hogy mondják ezt angolul?", "neutral", "u07-l02", ["What is this in English?"], ["word"]],

  // Questions
  ["ask_howareyou", "ask how someone is", "How are you?", "Hogy vagy?", "neutral", "u01-l01", ["How are you today?"], []],
  ["ask_where_live", "ask where someone lives", "Where do you live?", "Hol laksz?", "neutral", "u03-l01", ["Where do you live now?"], []],
  ["ask_work", "ask about work", "What do you do?", "Mivel foglalkozol?", "neutral", "u03-l02", ["What is your job?", "What do you do for work?"], []],
  ["ask_family", "ask about family", "Do you have brothers or sisters?", "Van testvéred?", "neutral", "u02-l02", ["Do you have any brothers or sisters?"], []],
  ["ask_hobbies", "ask about hobbies", "What do you like doing?", "Mit szeretsz csinálni?", "neutral", "u08-l01", ["What are your hobbies?", "What do you enjoy?"], []],
  ["ask_followup_why", "follow-up question", "Really? Why?", "Tényleg? Miért?", "neutral", "u08-l02", ["Oh really? Why?"], []],
  ["ask_followup_where", "follow-up about place", "Where exactly?", "Pontosan hol?", "neutral", "u09-l01", ["Whereabouts?"], []],

  // Opinions & preferences
  ["op_like", "say you like something", "I like it.", "Szeretem.", "neutral", "u05-l01", ["I like this.", "I really like it."], ["thing"]],
  ["op_dontlike", "say you don't like something", "I don't like it.", "Nem szeretem.", "neutral", "u05-l01", ["I do not like it."], ["thing"]],
  ["op_love", "say you love something", "I love cooking.", "Imádok főzni.", "neutral", "u08-l01", ["I really love cooking."], ["activity"]],
  ["op_wouldlike", "make a polite request/wish", "I'd like a coffee, please.", "Kérnék egy kávét.", "polite", "u05-l02", ["I would like a coffee, please.", "Can I have a coffee, please?"], ["item"]],
  ["op_ithink", "give an opinion", "I think it's very nice.", "Szerintem nagyon szép.", "neutral", "u08-l02", ["In my opinion it's nice."], ["opinion"]],
  ["op_agree", "agree", "Yes, me too.", "Igen, én is.", "neutral", "u08-l02", ["Me too.", "So do I."], []],

  // Phone / video calls
  ["call_hearme", "check sound", "Can you hear me?", "Hallasz engem?", "neutral", "u07-l01", ["Can you hear me now?"], []],
  ["call_seeme", "check picture", "Can you see me?", "Látsz engem?", "neutral", "u07-l01", ["Can you see me now?"], []],
  ["call_camera", "ask to turn on camera", "Please turn your camera on.", "Kérlek, kapcsold be a kamerát.", "polite", "u11-l01", ["Can you turn your camera on?"], []],
  ["call_mic", "ask to turn on microphone", "Please turn your microphone on.", "Kérlek, kapcsold be a mikrofont.", "polite", "u11-l01", ["Can you turn your microphone on?"], []],
  ["call_start", "start a lesson", "Let's start today's lesson.", "Kezdjük a mai órát.", "neutral", "u11-l01", ["Let's begin today's lesson."], []],
  ["call_bye", "end a call", "Talk to you soon. Bye!", "Hamarosan beszélünk. Szia!", "neutral", "u07-l02", ["See you soon. Bye!"], []],

  // Teaching praise & instructions
  ["teach_wait", "ask a student to wait", "Please wait a moment.", "Kérlek, várj egy pillanatot.", "polite", "u11-l01", ["Just a moment, please."], []],
  ["teach_parent", "ask for a parent", "Can you ask your parents to come?", "Meg tudod kérni a szüleidet, hogy jöjjenek?", "polite", "u11-l02", ["Please ask your parents to come."], []],
  ["teach_excellent", "praise a student", "Excellent! Well done!", "Kiváló! Ügyes vagy!", "warm", "u11-l01", ["Very good! Well done!", "Great job!"], []],
  ["teach_repeat_me", "instruction to repeat", "Repeat after me, please.", "Ismételd utánam, kérlek.", "neutral", "u11-l01", ["Say it after me, please."], []],

  // Restaurant / hotel / services
  ["serv_order", "order food", "I'd like the soup, please.", "A levest kérném.", "polite", "u10-l01", ["Can I have the soup, please?"], ["dish"]],
  ["serv_bill", "ask for the bill", "Could I have the bill, please?", "Megkaphatnám a számlát, kérem?", "polite", "u10-l01", ["The bill, please.", "Can we have the bill, please?"], []],
  ["serv_checkin", "check into a hotel", "I have a reservation.", "Van foglalásom.", "neutral", "u10-l02", ["I booked a room.", "I have a booking."], []],
  ["serv_help", "ask for help politely", "Could you help me, please?", "Tudna segíteni, kérem?", "polite", "u10-l01", ["Can you help me, please?"], []],
  ["serv_howmuch", "ask a price", "How much is it?", "Mennyibe kerül?", "neutral", "u10-l01", ["How much does it cost?"], []],
  ["serv_excuse", "get attention politely", "Excuse me.", "Elnézést.", "polite", "u10-l01", ["Excuse me, please."], []],

  // Plans & time
  ["plan_free", "say you are free", "I'm free on Saturday.", "Szombaton ráérek.", "neutral", "u06-l02", ["I am free on Saturday."], ["day"]],
  ["plan_suggest", "suggest a plan", "Let's meet on Sunday.", "Találkozzunk vasárnap.", "neutral", "u06-l02", ["Shall we meet on Sunday?"], ["day"]],
  ["plan_accept", "accept a plan", "Yes, that's a good idea.", "Igen, ez jó ötlet.", "neutral", "u06-l02", ["Yes, great idea.", "Sounds good."], []],
  ["plan_decline", "decline gently", "Sorry, I can't on Friday.", "Sajnálom, pénteken nem tudok.", "polite", "u06-l02", ["I'm sorry, I can't on Friday."], ["day"]],
  ["plan_going", "say a future plan", "I'm going to visit my sister.", "Meglátogatom a nővéremet.", "neutral", "u13-l01", ["I am going to visit my sister."], ["activity"]],

  // Travel / airport / flying (high priority)
  ["air_gate", "ask for the gate", "Where is my gate?", "Hol van a kapum?", "neutral", "u14-l01", ["Which gate is mine?"], []],
  ["air_checkin", "ask for check-in", "Where is the check-in desk?", "Hol van a check-in pult?", "neutral", "u14-l01", ["Where do I check in?"], []],
  ["air_help", "ask for help at the airport", "Could you help me, please?", "Tudna segíteni, kérem?", "polite", "u14-l01", ["Can you help me, please?"], []],
  ["fly_afraid", "say you fear flying", "I am afraid of flying.", "Félek a repüléstől.", "neutral", "u15-l01", ["I'm afraid of flying."], []],
  ["fly_first", "say it is your first flight", "This is my first flight.", "Ez az első repülésem.", "neutral", "u15-l01", ["It is my first flight."], []],
  ["fly_nervous", "say you feel nervous", "I feel nervous.", "Ideges vagyok.", "neutral", "u15-l01", ["I'm a little nervous.", "I am a little scared."], []],
  ["fly_water", "ask for water", "Could I have some water, please?", "Kaphatnék egy kis vizet, kérem?", "polite", "u15-l01", ["Can I have some water, please?"], []],
  ["fly_blanket", "ask for a blanket", "Could I have a blanket, please?", "Kaphatnék egy takarót, kérem?", "polite", "u15-l01", ["Can I have a blanket, please?"], []],
  ["fly_toilet", "ask where the toilet is", "Where is the toilet?", "Hol van a mosdó?", "neutral", "u15-l01", ["Excuse me, where is the toilet?"], []],
  ["fly_land", "ask about landing", "When will we land?", "Mikor szállunk le?", "neutral", "u15-l02", ["What time will we land?"], []],

  // Directions / transport
  ["town_where", "ask where a place is", "Where is the station?", "Hol van az állomás?", "neutral", "u09-l01", ["Excuse me, where is the station?"], ["place"]],
  ["town_howget", "ask how to get somewhere", "How do I get to the centre?", "Hogy jutok el a központba?", "neutral", "u09-l01", ["How can I get to the centre?"], ["place"]],
  ["trans_which", "ask which bus/train", "Which bus goes to the airport?", "Melyik busz megy a reptérre?", "neutral", "u09-l02", ["Which train goes to the airport?"], ["place"]],

  // Family / conversation management
  ["conv_thanks_visit", "thank for a visit", "Thank you for coming.", "Köszönöm, hogy eljöttél.", "warm", "u16-l01", ["Thanks for coming."], []],
  ["conv_tellmore", "invite more info", "Tell me more.", "Mesélj még.", "neutral", "u16-l01", ["Please tell me more."], []],
  ["conv_expand", "expand an answer", "I'm good. I visited my sister and we had coffee.", "Jól vagyok. Meglátogattam a nővéremet, és ittunk egy kávét.", "neutral", "u12-l02", ["I'm good. I saw my sister and we had coffee."], []],
];
