// Phase 2 chunk expansion — more productive fixed expressions / sentence frames,
// prioritising real communicative functions for Marta. Duplicate ids are skipped.
// [id, intention, en, hu, register, firstLesson, variants[], slots[]]
export const EXTRA_CHUNKS = [
  // ---- greetings & small talk ----
  ["sm_longtime", "greet warmly after time apart", "It's lovely to see you!", "De jó látni téged!", "warm", "u01-l02", ["So nice to see you!"], []],
  ["sm_howsfamily", "ask about the family", "How is your family?", "Hogy van a családod?", "neutral", "u02-l02", ["How is everyone?"], []],
  ["sm_takecare", "close warmly", "Take care!", "Vigyázz magadra!", "warm", "u07-l02", ["Take care of yourself!"], []],
  ["sm_seeyou", "say see you later", "See you soon!", "Hamarosan találkozunk!", "neutral", "u07-l02", ["See you later!", "See you next week!"], []],
  ["sm_haveniceday", "wish a nice day", "Have a nice day!", "Szép napot!", "warm", "u10-l01", ["Have a lovely day!"], []],
  ["sm_welcome", "welcome someone", "Welcome! Come in.", "Üdvözöllek! Gyere be.", "warm", "u16-l01", ["Please come in."], []],

  // ---- identity & introductions ----
  ["id_age", "say your age area", "I'm over seventy.", "Hetven fölött vagyok.", "neutral", "u01-l02", ["I'm in my seventies."], []],
  ["id_job2", "say you are retired", "I'm retired now.", "Most nyugdíjas vagyok.", "neutral", "u01-l02", ["I am retired."], []],
  ["id_teachonline", "say what you do", "I teach Hungarian online.", "Magyart tanítok online.", "neutral", "u03-l02", ["I teach children online."], []],
  ["id_thisis", "introduce a third person", "This is my sister, Margó.", "Ez a nővérem, Margó.", "neutral", "u02-l02", ["Let me introduce my sister."], ["name"]],

  // ---- family & relationships ----
  ["fam_livesin", "say where a relative lives", "My niece lives in Denmark.", "Az unokahúgom Dániában él.", "neutral", "u02-l01", ["She lives abroad."], ["place"]],
  ["fam_howmany", "ask number of siblings", "How many brothers and sisters do you have?", "Hány testvéred van?", "neutral", "u02-l02", ["Do you have a big family?"], []],
  ["fam_married", "ask about partner", "Are you married?", "Házas vagy?", "neutral", "u02-l02", ["Do you have a partner?"], []],
  ["fam_proud", "express warmth about family", "I'm very proud of my family.", "Nagyon büszke vagyok a családomra.", "warm", "u16-l01", ["I love my family very much."], []],

  // ---- opinions & feelings ----
  ["op_notsure", "say you're not sure", "I'm not sure.", "Nem vagyok biztos benne.", "neutral", "u08-l02", ["I don't know."], []],
  ["op_ilike2", "say what you enjoy", "I really enjoy it.", "Nagyon élvezem.", "neutral", "u08-l01", ["I love it."], ["activity"]],
  ["op_favourite", "name a favourite", "My favourite hobby is cooking.", "A kedvenc hobbim a főzés.", "neutral", "u08-l02", ["I love cooking most of all."], ["thing"]],
  ["op_prefer", "state a preference", "I prefer tea to coffee.", "Jobban szeretem a teát, mint a kávét.", "neutral", "u08-l02", ["I like tea more than coffee."], ["a", "b"]],
  ["fe_tired", "say you feel tired", "I'm a little tired today.", "Ma kicsit fáradt vagyok.", "neutral", "u15-l01", ["I feel tired."], []],
  ["fe_happy", "express happiness", "I'm so happy to see you.", "Nagyon örülök, hogy látlak.", "warm", "u16-l01", ["It makes me happy."], []],

  // ---- daily life & routines ----
  ["dl_getup", "say when you get up", "I get up at seven o'clock.", "Hétkor kelek.", "neutral", "u04-l01", ["I wake up early."], ["time"]],
  ["dl_usually", "describe a habit", "I usually cook in the evening.", "Általában este főzök.", "neutral", "u04-l01", ["I often cook dinner."], ["activity"]],
  ["dl_everyday", "say something is daily", "I do this every day.", "Ezt minden nap csinálom.", "neutral", "u04-l01", ["I do it every day."], []],

  // ---- food, cooking, shopping ----
  ["fd_hungry", "say you're hungry", "I'm a little hungry.", "Kicsit éhes vagyok.", "neutral", "u05-l01", ["I'm hungry."], []],
  ["fd_recipe", "offer to share cooking", "I can show you the recipe.", "Megmutathatom a receptet.", "neutral", "u05-l02", ["Let me show you how I cook it."], []],
  ["fd_howmuch2", "ask a price when shopping", "How much is this, please?", "Mennyibe kerül ez, kérem?", "polite", "u05-l02", ["What's the price?"], ["item"]],
  ["fd_takeit", "decide to buy", "I'll take it, thank you.", "Megveszem, köszönöm.", "neutral", "u05-l02", ["I'll take this one."], []],
  ["fd_delicious", "praise food", "This is delicious!", "Ez finom!", "warm", "u16-l01", ["It tastes wonderful!"], []],

  // ---- time, weather, plans ----
  ["tm_whattime", "ask the time", "What time is it?", "Mennyi az idő?", "neutral", "u06-l01", ["Do you have the time?"], []],
  ["tm_freeon", "say when you're free", "I'm free on Saturday afternoon.", "Szombat délután ráérek.", "neutral", "u06-l02", ["I have time at the weekend."], ["day"]],
  ["we_nice", "comment on nice weather", "The weather is lovely today.", "Ma csodás az idő.", "neutral", "u06-l02", ["It's a beautiful day."], []],
  ["we_cold", "comment on cold weather", "It's very cold today.", "Ma nagyon hideg van.", "neutral", "u06-l02", ["It's freezing today."], []],
  ["pl_shallwe", "suggest doing something", "Shall we meet on Sunday?", "Találkozzunk vasárnap?", "neutral", "u06-l02", ["Let's meet on Sunday."], ["day"]],
  ["pl_goodidea", "accept an idea", "That's a good idea!", "Ez jó ötlet!", "neutral", "u06-l02", ["Sounds good!", "Great idea!"], []],
  ["pl_cantsorry", "decline politely", "I'm sorry, I can't that day.", "Sajnálom, aznap nem tudok.", "polite", "u06-l02", ["I'm afraid I'm busy then."], ["day"]],

  // ---- phone & video calls ----
  ["ph_callyou", "say you'll call", "I'll call you on Sunday.", "Vasárnap felhívlak.", "neutral", "u07-l01", ["I'll ring you later."], ["day"]],
  ["ph_badline", "report a bad connection", "Sorry, the line is bad.", "Bocsi, rossz a vonal.", "neutral", "u07-l01", ["The connection is bad."], []],
  ["ph_seeyoulater", "end a video call", "Talk to you soon. Bye!", "Hamarosan beszélünk. Szia!", "warm", "u07-l02", ["See you soon. Bye!"], []],
  ["ph_sendmessage", "say you'll message", "I'll send you a message.", "Küldök egy üzenetet.", "neutral", "u07-l02", ["I'll text you."], []],

  // ---- town, directions, transport ----
  ["tw_wheretoilet", "ask for the toilet", "Where is the toilet, please?", "Hol van a mosdó, kérem?", "polite", "u09-l01", ["Excuse me, where's the toilet?"], []],
  ["tw_isitfar", "ask about distance", "Is it far from here?", "Messze van innen?", "neutral", "u09-l01", ["How far is it?"], []],
  ["tw_lost", "say you are lost", "I think I'm lost.", "Azt hiszem, eltévedtem.", "neutral", "u09-l01", ["I've lost my way."], []],
  ["tr_whichbus", "ask which bus", "Which bus goes to the centre?", "Melyik busz megy a központba?", "neutral", "u09-l02", ["Which train do I take?"], ["place"]],
  ["tr_oneticket", "buy a ticket", "One ticket, please.", "Egy jegyet kérek.", "polite", "u09-l02", ["Two tickets, please."], []],
  ["tr_getoff", "ask where to get off", "Where do I get off?", "Hol kell leszállnom?", "neutral", "u09-l02", ["Which stop is it?"], []],

  // ---- restaurant, hotel, services ----
  ["sv_tablefor", "ask for a table", "A table for two, please.", "Egy asztalt kérnék kettőnek.", "polite", "u10-l01", ["Do you have a free table?"], ["number"]],
  ["sv_recommend", "ask for a recommendation", "What do you recommend?", "Mit ajánl?", "polite", "u10-l01", ["What's good here?"], []],
  ["sv_water", "order water", "A glass of water, please.", "Egy pohár vizet kérek.", "polite", "u10-l01", ["Some water, please."], []],
  ["sv_checkin", "hotel check-in", "I'd like to check in, please.", "Szeretnék bejelentkezni.", "polite", "u10-l02", ["I have a booking."], []],
  ["sv_roomproblem", "report a small problem", "Excuse me, there's a problem with my room.", "Elnézést, gond van a szobámmal.", "polite", "u10-l02", ["My room has a problem."], []],
  ["sv_whatstime_bf", "ask about breakfast time", "What time is breakfast?", "Hánykor van a reggeli?", "neutral", "u10-l02", ["When is breakfast served?"], []],

  // ---- teaching online ----
  ["te_canyousee", "check the picture", "Can you see my screen?", "Látod a képernyőmet?", "neutral", "u11-l01", ["Can you see this?"], []],
  ["te_looksgood", "praise work", "Very good! That's correct.", "Nagyon jó! Ez helyes.", "warm", "u11-l01", ["Well done, that's right!"], []],
  ["te_tryagain", "encourage a student", "Good try! Let's try again.", "Jó próbálkozás! Próbáljuk újra.", "warm", "u11-l01", ["Nearly! Try once more."], []],
  ["te_openbook", "give an instruction", "Open your book, please.", "Nyisd ki a könyvet, kérlek.", "neutral", "u11-l01", ["Please open your book."], []],
  ["te_seeyou", "end a lesson", "That's all for today. Well done!", "Ez minden mára. Ügyes voltál!", "warm", "u11-l02", ["Great work today!"], []],

  // ---- past & storytelling ----
  ["pa_wasat", "say where you were", "I was at home yesterday.", "Tegnap otthon voltam.", "neutral", "u12-l01", ["I stayed at home."], ["place"]],
  ["pa_wentto", "say where you went", "I went to the market.", "Elmentem a piacra.", "neutral", "u12-l01", ["We went to the lake."], ["place"]],
  ["pa_wasnice", "give a past opinion", "It was really nice.", "Nagyon jó volt.", "neutral", "u12-l02", ["It was wonderful."], []],
  ["pa_howwas", "ask about the past", "How was your weekend?", "Milyen volt a hétvégéd?", "neutral", "u12-l02", ["How was your trip?"], []],

  // ---- travel & airport ----
  ["tv_needto", "say what you must do", "I need to pack my suitcase.", "Be kell csomagolnom a bőröndöt.", "neutral", "u13-l01", ["I have to get ready."], []],
  ["tv_planto", "share a travel plan", "I'm going to visit Kira in Denmark.", "Meglátogatom Kirát Dániában.", "neutral", "u13-l01", ["I plan to travel to Denmark."], ["person", "place"]],
  ["ai_wherecheckin2", "ask for check-in", "Excuse me, where do I check in?", "Elnézést, hol tudok becsekkolni?", "polite", "u14-l01", ["Where is the check-in desk?"], []],
  ["ai_myflight", "state your flight", "My flight is at ten o'clock.", "A járatom tízkor indul.", "neutral", "u14-l01", ["I'm on the ten o'clock flight."], ["time"]],
  ["ai_dontunderstand2", "ask for help understanding", "Sorry, I didn't understand. Could you help me?", "Elnézést, nem értettem. Tudna segíteni?", "polite", "u14-l01", ["I don't understand. Please help me."], []],

  // ---- on the plane (emotional core) ----
  ["fl_firsttime", "tell crew it's your first flight", "This is my first flight. I'm a little nervous.", "Ez az első repülésem. Kicsit ideges vagyok.", "neutral", "u15-l01", ["It's my first time flying."], []],
  ["fl_helpcalm", "ask for reassurance", "Could you help me? I'm afraid of flying.", "Tudna segíteni? Félek a repüléstől.", "polite", "u15-l01", ["I'm scared. Please help me."], []],
  ["fl_needanything", "respond you're okay", "I'm okay now, thank you.", "Most már jól vagyok, köszönöm.", "warm", "u15-l02", ["I feel better, thank you."], []],

  // ---- repair & survival (extra reps) ----
  ["rp_saythatagain", "ask to repeat gently", "Sorry? Could you say that again?", "Tessék? Meg tudná ismételni?", "polite", "u07-l01", ["Pardon? Again, please?"], []],
  ["rp_writeit", "ask someone to write it", "Could you write it down, please?", "Le tudná írni, kérem?", "polite", "u09-l01", ["Please write it for me."], []],
  ["rp_isthisright", "check understanding", "Is this right?", "Ez így jó?", "neutral", "u11-l01", ["Am I correct?"], []],
  ["rp_onemoment", "ask for a moment", "Just a moment, please.", "Egy pillanat, kérem.", "polite", "u07-l01", ["One second, please."], []],
];
