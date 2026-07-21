// Listening comprehension passages — short, slow, with a replay button and one question.
// Original content (family voice messages, airport/cabin announcements, teaching).
// [lesson, passageEn, question{en,hu}, options[], answerIndex]
export const LISTENINGS = [
  ["u06-l02", "Hi auntie, it's Kira. The weather here in Denmark is cold and rainy today. Let's talk on Sunday. Bye!",
    { en: "What is the weather like in Denmark?", hu: "Milyen az idő Dániában?" },
    ["Cold and rainy", "Hot and sunny", "Warm and windy"], 0],
  ["u07-l02", "Hello Marta, this is a short message. I will call you at seven o'clock this evening. Talk soon!",
    { en: "What time will the call be?", hu: "Hánykor lesz a hívás?" },
    ["Seven in the evening", "Seven in the morning", "Nine in the evening"], 0],
  ["u12-l02", "Hi Marta! At the weekend I visited my sister. We cooked lunch and talked for hours. It was lovely.",
    { en: "What did she do at the weekend?", hu: "Mit csinált a hétvégén?" },
    ["Visited her sister", "Went to the airport", "Stayed at work"], 0],
  ["u14-l01", "Attention please. The flight to Copenhagen is now boarding at gate twelve. Please have your passport ready.",
    { en: "Which gate is the flight?", hu: "Melyik kapunál van a járat?" },
    ["Gate twelve", "Gate two", "Gate twenty"], 0],
  ["u14-l02", "This is a final call for passenger Marta. Please go to gate twelve. The gate is closing soon.",
    { en: "What must the passenger do?", hu: "Mit kell tennie az utasnak?" },
    ["Go to the gate", "Collect luggage", "Buy a ticket"], 0],
  ["u15-l02", "Ladies and gentlemen, we will land in about twenty minutes. Please fasten your seatbelt. Thank you.",
    { en: "When will the plane land?", hu: "Mikor száll le a repülő?" },
    ["In about twenty minutes", "In two hours", "It has landed"], 0],
  ["u11-l01", "Good morning class! Today we will read a short story. Please open your book and turn your camera on.",
    { en: "What should the students do?", hu: "Mit kell tenniük a diákoknak?" },
    ["Open the book and turn the camera on", "Close the book", "Go to sleep"], 0],
];
