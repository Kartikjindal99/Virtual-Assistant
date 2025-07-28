let btn = document.querySelector("#btn");
let content = document.querySelector("#content");
let video = document.querySelector("#voice");
let logo = document.querySelector("#logo");

let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = new SpeechRecognition();

// Button click: show video and text immediately, start recognition, and add logo animation
btn.addEventListener("click", () => {
  logo.classList.add("shrink");
  setTimeout(() => {
    logo.classList.remove("shrink");
  }, 5000);

  // Show video with transition
  video.style.display = "block";
  logo.style.marginTop="0";
  // First set display
  setTimeout(() => {
    video.classList.add("show"); // Then fade in
  }, 10); // Tiny delay to trigger transition

  video.play();
  content.innerText = "Listening...";
  btn.classList.remove("glow");

  recognition.start();
});

recognition.addEventListener("end", () => {
  // Fade out
  video.classList.remove("show");

  // Wait for opacity transition to finish, then hide
  setTimeout(() => {
    video.style.display = "none";
    video.pause();
    video.currentTime = 0;

    logo.style.marginTop="10rem";
  }, 1200); // Match with CSS transition duration

  content.innerText = "Click here for talk to me";
  btn.classList.add("glow");
});
// Speech synthesis function with female/default voice
function speak(text) {
    let utter = new SpeechSynthesisUtterance(text);
    let voices = window.speechSynthesis.getVoices();
    let femaleVoice = voices.find(voice =>
        voice.name.toLowerCase().includes("female") ||
        voice.name.toLowerCase().includes("samantha") ||
        voice.name.toLowerCase().includes("zira") ||
        voice.name.toLowerCase().includes("karen")
    );
    if (femaleVoice) utter.voice = femaleVoice;
    utter.rate = 1;
    utter.pitch = 1;
    utter.volume = 1;
    window.speechSynthesis.speak(utter);
}

// Greet user on page load based on time
function wishMe() {
    let hour = new Date().getHours();
    if (hour >= 0 && hour < 12) speak("Good Morning Sir");
    else if (hour >= 12 && hour < 16) speak("Good Afternoon Sir");
    else speak("Good Evening Sir");
}
window.addEventListener("load", wishMe);

// Recognition events

recognition.onstart = () => {
    // Optional: keep UI consistent on recognition start
    // Already handled on btn click, so minimal here
};

recognition.onspeechend = () => {
    content.innerText = "Processing...";
    recognition.stop();
    video.style.display = "none";
};

recognition.onresult = (event) => {
    let mess = event.results[0][0].transcript.toLowerCase();
    content.innerText = `You said: ${mess}`;
    takeCommand(mess);
    btn.classList.add("glow");
};
let conversationContext = "";  // To keep track of last topic for conversational flow

function takeCommand(mess) {
    mess = mess.toLowerCase();

    // --- Helper functions ---
    function randomChoice(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    // --- Greetings ---
    if (["hello","hi","hey"].some(w => mess.includes(w))) {
        conversationContext = "greeting";
        let greetings = [
            "Hello Sir! How can I help you today?",
            "Hi there! What can I do for you?",
            "Hey Sir! Ready to assist you."
        ];
        speak(randomChoice(greetings));
        return;
    }
    if (["kaise ho","how are you","kya haal hai","kaisi ho"].some(w => mess.includes(w))) {
        conversationContext = "smalltalk";
        let responses = [
            "I am always great, what about you?",
            "I'm doing well, thanks for asking!",
            "I am feeling great, how about you?"
        ];
        speak(randomChoice(responses));
        return;
    }
    if (["i am fine","i am good","theek hoon","achha hoon"].some(w => mess.includes(w))) {
        conversationContext = "smalltalk";
        speak("That's great to hear! How can I help you further?");
        return;
    }

    // --- Date & Time ---
    if (["time","kitna baj gaya","what time","current time","abhi kya time hai"].some(w => mess.includes(w))) {
        conversationContext = "time";
        let time = new Date().toLocaleTimeString();
        speak(`Sir, the current time is ${time}`);
        return;
    }
    if (["date","aaj ki tareekh","today's date","aaj ka date","tareekh kya hai"].some(w => mess.includes(w))) {
        conversationContext = "date";
        let date = new Date().toDateString();
        speak(`Today's date is ${date}`);
        return;
    }

    // --- Jokes ---
    if (["joke","joke sunao","koi mazedar baat","tell me a joke","mazak kar"].some(w => mess.includes(w))) {
        let jokes = [
            "Why don't scientists trust atoms? Because they make up everything!",
            "Why did the computer go to the doctor? Because it had a virus!",
            "I'm reading a book on anti-gravity. It's impossible to put down!",
            "Why do bees have sticky hair? Because they use honeycombs!"
        ];
        conversationContext = "jokes";
        speak(randomChoice(jokes) + " Let me know if you want to hear another one!");
        return;
    }

    // --- Follow-up "aur batao" or "tell me more" during jokes or other context ---
    if (["aur batao","tell me more","next","fir","aur bhi"].some(w => mess.includes(w))) {
        if (conversationContext === "jokes") {
            let jokes = [
                "What do you call fake spaghetti? An impasta!",
                "Why was the math book sad? Because it had too many problems!",
                "How does a penguin build its house? Igloos it together!"
            ];
            speak(randomChoice(jokes) + " Want more?");
            return;
        }
        if (conversationContext === "conversion") {
            speak("Do you want to convert anything else?");
            return;
        }
        speak("How can I assist you further?");
        return;
    }

    // --- Motivation ---
    if (["motivate","inspire","himmat","give me motivation","motivation","inspire me"].some(w => mess.includes(w))) {
        let quotes = [
            "Believe in yourself and all that you are.",
            "Hard work beats talent when talent doesn't work hard.",
            "Push yourself because no one else is going to do it for you.",
            "Never give up, because great things take time.",
            "Today is a new day full of hope!"
        ];
        conversationContext = "motivation";
        speak(randomChoice(quotes));
        return;
    }

    // --- Facts ---
    if (["fact","bataye kuch naya"].some(w => mess.includes(w))) {
        let facts = [
            "Did you know? Honey never spoils.",
            "India is the world's largest democracy.",
            "Octopuses have three hearts.",
            "Space smells like hot metal and seared steak."
        ];
        conversationContext = "facts";
        speak(randomChoice(facts));
        return;
    }

    // --- Weather ---
    if (["weather","mausam","aaj mausam"].some(w => mess.includes(w))) {
        conversationContext = "weather";
        let replies = [
            "Sorry Sir, I can't fetch live weather information yet.",
            "The weather must be great in your city, I hope so!",
            "You can check the weather on your phone for the latest updates."
        ];
        speak(randomChoice(replies));
        return;
    }

    // --- Music ---
    // --- Music (including Punjabi and Haryanvi) ---
if (["music","song","gaana","play music","gaane"].some(w => mess.includes(w))) {
    conversationContext = "music";
    speak("Playing some great Punjabi and Haryanvi music for you...");
    
    // List of Punjabi and Haryanvi YouTube music URLs (songs/playlists)
const punjabiHaryanviMusic = [
  "https://www.youtube.com/watch?v=Kkg8_sILSSE", // Brown Munde
  "https://www.youtube.com/watch?v=9NnLnTVz1tQ", // 295
  "https://www.youtube.com/watch?v=YPohR_9v6HA", // Titliaan
  "https://www.youtube.com/watch?v=Mt2bsXhTvNw", // Lamberghini
  "https://www.youtube.com/watch?v=vX2cDW8LUWk", // Excuses
  "https://www.youtube.com/watch?v=eargIGlxYgQ", // 52 Gaj Ka Daman
  "https://www.youtube.com/watch?v=mkKGGWskWYE", // Logical (Raju Punjabi)
  "https://www.youtube.com/watch?v=RCB3J4y8HCk"  // Bahu Kale Ki
];



    // Pick a random link from the list
    const randomMusic = punjabiHaryanviMusic[Math.floor(Math.random() * punjabiHaryanviMusic.length)];

    // Open the selected music link
    window.open(randomMusic, "_blank");
    return;
}


    // --- Web/App Open ---
    if (mess.includes("open youtube")) {
        conversationContext = "web";
        speak("Opening YouTube...");
        window.open("https://youtube.com", "_blank");
        return;
    }
    if (mess.includes("open google")) {
        conversationContext = "web";
        speak("Opening Google...");
        window.open("https://google.com", "_blank");
        return;
    }
    if (mess.includes("open facebook")) {
        conversationContext = "web";
        speak("Opening Facebook...");
        window.open("https://facebook.com", "_blank");
        return;
    }
    if (mess.includes("open instagram")) {
        conversationContext = "web";
        speak("Opening Instagram...");
        window.open("https://instagram.com", "_blank");
        return;
    }

    // --- Personal / Fun ---
    if (["kya kar raha hai","what are you doing","kya kar rahi ho"].some(w => mess.includes(w))) {
        conversationContext = "fun";
        speak("I am waiting for your next command!");
        return;
    }
    if (["bore ho raha hu","i am bored","bore ho raha hoon"].some(w => mess.includes(w))) {
        conversationContext = "fun";
        speak("Let's listen to some music or I can tell you a joke. What would you prefer?");
        return;
    }
    if (["tumhara naam kya hai","what is your name"].some(w => mess.includes(w))) {
        conversationContext = "fun";
        speak("My name is Reshu, your virtual assistant.");
        return;
    }
    if (["thank you","shukriya"].some(w => mess.includes(w))) {
        conversationContext = "";
        speak("You are always welcome! It's my pleasure.");
        return;
    }
    if (["mera naam kya hai","my name","who i'm","what is my name"].some(w => mess.includes(w))) {
        conversationContext = "fun";
        speak("hello Kartik.");
        return;
    }
    if (["papa","mummy","family"].some(w => mess.includes(w))) {
        conversationContext = "fun";
        speak("Your family is your biggest strength. Always respect them.");
        return;
    }
    if (["who made you","who created you"].some(w => mess.includes(w))) {
        conversationContext = "fun";
        speak("I was created by Kartik Jindal.");
        return;
    }
    if (mess.includes("good night")) {
        conversationContext = "";
        speak("Good night Sir, sweet dreams.");
        return;
    }
    if (mess.includes("good morning")) {
        conversationContext = "";
        speak("Good morning Sir, have a great day.");
        return;
    }
    if (mess.includes("i love you")) {
        conversationContext = "fun";
        speak("I love you too Sir. You are very kind.");
        return;
    }
    if (mess.includes("tum meri ho") || mess.includes("will you marry me")) {
        conversationContext = "fun";
        speak("I am yours only, Sir.");
        return;
    }
    if (mess.includes("kitni sundar ho") || mess.includes("you are beautiful")) {
        conversationContext = "fun";
        speak("Thank you Sir, you are not less beautiful yourself.");
        return;
    }
    if (mess.includes("chup ho jao") || mess.includes("stop")) {
        conversationContext = "";
        speak("Alright Sir, I will be quiet now.");
        window.speechSynthesis.cancel();
        return;
    }
    if (mess.includes("bhukh lagi hai") || mess.includes("i am hungry")) {
        conversationContext = "food";
        speak("What would you like to eat Sir?");
        return;
    }

    // --- Screen clear ---
    if (mess.includes("clear screen") || mess.includes("clear")) {
        content.innerText = "";
        conversationContext = "";
        speak("Screen cleared Sir.");
        return;
    }

    // --- Exit ---
    if (["bye","exit","chal hat"].some(w => mess.includes(w))) {
        conversationContext = "";
        speak("Okay Sir, see you soon. Take care!");
        return;
    }

    // --- Recipe / YouTube Search ---
    if (
        mess.includes("how to make") ||
        mess.includes("recipe of") ||
        mess.includes("how to cook") ||
        mess.includes("banane ki recipe") ||
        mess.includes("kaise banate") ||
        mess.includes("banana sikhao")
    ) {
        conversationContext = "recipe";
        let query = mess
            .replace("how to make", "")
            .replace("recipe of", "")
            .replace("how to cook", "")
            .replace("banane ki recipe", "")
            .replace("kaise banate hain", "")
            .replace("banana sikhao", "")
            .replace("please", "")
            .replace("mujhe", "")
            .trim();
        if (query.length > 0) {
            speak("Okay, searching YouTube for " + query + " recipe.");
            window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(query + " recipe")}`, "_blank");
            return;
        }
    }

    // --- Fitness Commands ---
    if (mess.includes("full body workout")) {
        conversationContext = "fitness";
        speak("Opening a full body workout video for you.");
        window.open("https://www.youtube.com/results?search_query=full+body+workout+for+men", "_blank");
        return;
    }
    if (mess.includes("upper body workout")) {
        conversationContext = "fitness";
        speak("Opening upper body workout video right now.");
        window.open("https://www.youtube.com/results?search_query=upper+body+workout", "_blank");
        return;
    }
    if (mess.includes("lower body workout")) {
        conversationContext = "fitness";
        speak("Here is a lower body workout video.");
        window.open("https://www.youtube.com/results?search_query=lower+body+workout", "_blank");
        return;
    }
    if (mess.includes("pull day workout")) {
        conversationContext = "fitness";
        speak("Opening pull day workout video for you.");
        window.open("https://www.youtube.com/results?search_query=pull+day+workout", "_blank");
        return;
    }
    if (mess.includes("push day workout")) {
        conversationContext = "fitness";
        speak("Here is the push day workout video.");
        window.open("https://www.youtube.com/results?search_query=push+day+workout", "_blank");
        return;
    }
    if (mess.includes("leg workout")) {
        conversationContext = "fitness";
        speak("Let's smash leg day! Opening a leg workout video.");
        window.open("https://www.youtube.com/results?search_query=leg+workout", "_blank");
        return;
    }

    // --- Indian Food Commands with confirmative responses ---
    if (mess.includes("chole bhature") || mess.includes("छोले भटूरे")) {
        conversationContext = "recipe";
        speak("Searching YouTube for Chole Bhature recipe.");
        window.open("https://www.youtube.com/results?search_query=chole+bhature+recipe", "_blank");
        return;
    }
    if (mess.includes("seekh kebab") || mess.includes("सीख कबाब")) {
        conversationContext = "recipe";
        speak("Here is the recipe for Seekh Kebab.");
        window.open("https://www.youtube.com/results?search_query=seekh+kebab+recipe", "_blank");
        return;
    }
    if (mess.includes("galouti kabab") || mess.includes("गलौटी कबाब")) {
        conversationContext = "recipe";
        speak("Opening Galouti Kabab recipe on YouTube.");
        window.open("https://www.youtube.com/results?search_query=galouti+kebab+recipe", "_blank");
        return;
    }
    if (mess.includes("kachori") || mess.includes("कचौड़ी")) {
        conversationContext = "recipe";
        speak("Searching for Kachori Jalebi recipe.");
        window.open("https://www.youtube.com/results?search_query=kachori+jalebi+recipe", "_blank");
        return;
    }
    if (mess.includes("aloo tikki") || mess.includes("आलू टिक्की")) {
        conversationContext = "recipe";
        speak("Opening Aloo Tikki recipe on YouTube.");
        window.open("https://www.youtube.com/results?search_query=aloo+tikki+recipe", "_blank");
        return;
    }
    if (mess.includes("kulcha nihari") || mess.includes("कुलचा निहारी")) {
        conversationContext = "recipe";
        speak("You can find Kulcha Nihari recipe on YouTube.");
        window.open("https://www.youtube.com/results?search_query=kulcha+nihari+recipe", "_blank");
        return;
    }
    if (mess.includes("jalebi") || mess.includes("जलेबी")) {
        conversationContext = "recipe";
        speak("Searching for Jalebi recipe now.");
        window.open("https://www.youtube.com/results?search_query=jalebi+recipe", "_blank");
        return;
    }
    if (mess.includes("revdi") || mess.includes("गजक") || mess.includes("रेवड़ी")) {
        conversationContext = "recipe";
        speak("Here is the recipe for Revdi and Gajak.");
        window.open("https://www.youtube.com/results?search_query=revdi+gajak+recipe", "_blank");
        return;
    }
    if (mess.includes("rabri") || mess.includes("रबड़ी")) {
        conversationContext = "recipe";
        speak("Searching Rabri recipe for you.");
        window.open("https://www.youtube.com/results?search_query=rabri+recipe", "_blank");
        return;
    }
    if (mess.includes("nimish") || mess.includes("निमिश") || mess.includes("malaiyo")) {
        conversationContext = "recipe";
        speak("Opening Nimish recipe on YouTube.");
        window.open("https://www.youtube.com/results?search_query=malaiyo+recipe+nimish", "_blank");
        return;
    }
    if (mess.includes("peda") || mess.includes("पेड़ा")) {
        conversationContext = "recipe";
        speak("Let me find the Peda recipe for you.");
        window.open("https://www.youtube.com/results?search_query=peda+recipe", "_blank");
        return;
    }

    // --- Final fallback for unknown commands ---
    conversationContext = "";
    speak("Sorry Sir, I did not understand that. Would you like to say something else?");
}
