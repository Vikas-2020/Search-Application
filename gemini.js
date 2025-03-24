import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai";

const md = window.markdownit();
const geminiBtn = document.querySelector("#gemini");
const genAI = new GoogleGenerativeAI("AIzaSyAylt4BSpu8cvRrLt0us9FhhVhRVbaX6Ok");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// Load cache from localStorage when the page loads
let geminiCache = JSON.parse(localStorage.getItem("geminiCache")) || {};

async function runGimini(query) {
  if (query === "") {
    document.querySelector(".cards").style.display = "flex";
    resultContainer.innerHTML = "";
    resultContainer.style.boxShadow = "none";
    return;
  }

  // Check cache first
  if (geminiCache[query]) {
    console.log("Fetching from cache...");

    geminiBtn.addEventListener("click", () => {
      allBtn.forEach((btn, idx) => {
        btn.classList.toggle("selectedBtn", idx === 2);
      });
      displayGeminiData(geminiCache[query]);
    });

    displayGeminiData(geminiCache[query]);
    return;
  }

  // Hide initial UI elements
  if (!showResult) {
    document.querySelector(".cards").style.display = "none";
  }

  // Show loader
  loader.style.display = "flex";

  allBtn.forEach((btn, idx) => {
    btn.classList.toggle("selectedBtn", idx === 2);
  });

  try {
    const result = await model.generateContent(query);
    const text = result.response.candidates[0].content.parts[0].text;

    // Hide loader after fetching data
    loader.style.display = "none";

    // Cache the result in memory and localStorage
    geminiCache[query] = text;
    localStorage.setItem("geminiCache", JSON.stringify(geminiCache));

    geminiBtn.addEventListener("click", () => {
      allBtn.forEach((btn, idx) => {
        btn.classList.toggle("selectedBtn", idx === 2);
      });
      displayGeminiData(text);
    });

    displayGeminiData(text);
  } catch (error) {
    console.error("Error fetching data:", error);
    loader.style.display = "none";
  }
}

function displayGeminiData(text) {
  // Stop any ongoing speech before displaying new results
  window.speechSynthesis.cancel();

  resultContainer.innerHTML = "";
  resultContainer.style.boxShadow = "rgba(0, 0, 0, 0.24) 0px 3px 8px";

  if (searchInput.value.trim() === "") {
    return;
  }

  let dataDiv = document.createElement("div");
  dataDiv.classList.add("data-div");
  dataDiv.innerHTML = md.render(text);

  let geminiHeading = document.createElement("h3");
  geminiHeading.classList.add("head");
  geminiHeading.innerHTML = `Gemini results for: ${searchInput.value.trim()}`;

  // 🗣️ Add Speaker Button
  let speakerIcon = document.createElement("span");
  speakerIcon.classList.add("fa-solid", "fa-volume-xmark");
  speakerIcon.style.cursor = "pointer";

  // 🗣️ Add Event Listener for Text-to-Speech
  speakerIcon.addEventListener("click", () => {
    toggleSpeech(speakerIcon, text);
  });

  // Append elements to result container
  geminiHeading.appendChild(speakerIcon);
  resultContainer.append(geminiHeading, dataDiv);
}

// 🗣️ Toggle Speech Function
function toggleSpeech(speakerIcon, content) {
  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
    speakerIcon.classList.add("fa-volume-xmark");
    speakerIcon.classList.remove("fa-volume-high");
  } else {
    let speech = new SpeechSynthesisUtterance(content);
    speech.onend = () => {
      speakerIcon.classList.add("fa-volume-xmark");
      speakerIcon.classList.remove("fa-volume-high");
    };
    window.speechSynthesis.speak(speech);
    speakerIcon.classList.remove("fa-volume-xmark");
    speakerIcon.classList.add("fa-volume-high");
  }
}

// Stop speech when starting a new search
geminiBtn.addEventListener("click", () => {
  window.speechSynthesis.cancel(); // Stop speech before fetching new results
  runGimini(searchInput.value.trim());
  // fetchGoogleData(searchInput.value.trim());
});

// Stop speech when the page refreshes
window.addEventListener("load", () => {
  window.speechSynthesis.cancel();
});

// Clear cache when clicking "New Chat"
document.querySelector(".new-chat").addEventListener("click", () => {
  localStorage.removeItem("geminiCache"); // Clear cached data
  location.reload();
});

