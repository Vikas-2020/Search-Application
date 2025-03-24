let resultContainer = document.querySelector(".result-container");
let btn = document.querySelector("#send");
let searchInput = document.querySelector("input");
let googleBtn = document.querySelector("#google");
let showResult = false;
let loader = document.querySelector(".loader");
let micInput = document.querySelector("#mic");
let allBtn = document.querySelectorAll(".button-container .button");

const apiKey = "AIzaSyB6WtUughJpJCifhnZNVNfi062J4BSw4EU";
const cx = "d2328ac8ca7674c47";

// Load cache from localStorage when the page loads
let googleCache = JSON.parse(localStorage.getItem("googleCache")) || {};

async function fetchGoogleData(query) {
  if (query === "") {
    resultContainer.innerHTML = "";
    resultContainer.style.boxShadow = "none";
    return;
  }

   // Check cache first
   if (googleCache[query]) {
    console.log("Fetching from cache...");

    googleBtn.addEventListener("click", () => {
      allBtn.forEach((btn, idx) => {
        btn.classList.toggle("selectedBtn", idx === 0);
      });
      displayData(result.items);
    });
    
    displayData(googleCache[query]);
    return;
  }

  // Hide initial UI elements
  if (!showResult) {
    document.querySelector(".cards").style.display = "none";
  }

  // Show loader
  loader.style.display = "flex";

  // Ensure only the Google button is selected
  allBtn.forEach((btn, idx) => {
    btn.classList.toggle("selectedBtn", idx === 0);
  });

  try {
    let response = await fetch(
      `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${query}`
    );
    let result = await response.json();

    // console.log(result.items); // Debugging

    // Hide loader after fetching data
    loader.style.display = "none";

     // Cache the result in memory and localStorage
     googleCache[query] = result.items;
     localStorage.setItem("googleCache", JSON.stringify(googleCache));

    googleBtn.addEventListener("click", () => {
      allBtn.forEach((btn, idx) => {
        btn.classList.toggle("selectedBtn", idx === 0);
      });
      displayData(result.items);
    });

    // Display results
    displayData(result.items);
  } catch (error) {
    console.error("Error fetching data:", error);
    loader.style.display = "none"; // Hide loader on error
    resultContainer.innerHTML = "";
  }
}

function displayData(result) {
  if(!Array.isArray(result)){
    resultContainer.innerHTML = `<p class="head">Google result not availabe please try angain later.</p>`;
    return;
  }
  resultContainer.innerHTML = "";
  resultContainer.style.boxShadow = "rgba(0, 0, 0, 0.24) 0px 3px 8px";
  if (searchInput.value.trim() === "") {
    return;
  }

  let fragment = document.createDocumentFragment();
  let googleHeading = document.createElement("h3");
  googleHeading.classList.add("head");
  googleHeading.innerHTML = `Google search result for : ${searchInput.value.trim()}`;
  fragment.append(googleHeading);
  
  result.forEach((data) => {
    let googleResultDiv = document.createElement("div");
    googleResultDiv.classList.add("google-search-container");

    let headerDiv = document.createElement("div");
    headerDiv.classList.add("header-div");

    let imgIconDiv = document.createElement("div");
    imgIconDiv.classList.add("imgIcon-div");

    let iconImg = document.createElement("img");
    iconImg.src =
      data.pagemap?.metatags?.[0]?.["og:image"] || "assets/defaultIcon.svg";

    let titleDiv = document.createElement("div");
    titleDiv.classList.add("title-div", "title-div-dark");

    let title = document.createElement("h4");
    let showTitle = data.displayLink.split(".");

    if (showTitle.length > 2) {
      title.innerHTML = showTitle[1];
    } else {
      title.innerHTML = showTitle[0];
    }

    let websiteLink = document.createElement("a");
    websiteLink.href = data.link;
    websiteLink.target = "_blank";
    websiteLink.innerText = data.link;

    let descriptionDiv = document.createElement("div");
    descriptionDiv.classList.add("description-div", "description-div-dark");

    let anchorHeading = document.createElement("a");
    anchorHeading.href = data.link;
    anchorHeading.target = "_blank";

    let heading = document.createElement("h2");
    heading.innerHTML = data.htmlTitle;
    let descriptionPara = document.createElement("p");
    descriptionPara.innerHTML = data.htmlSnippet;

    let divide = document.createElement("hr");

    anchorHeading.append(heading);

    imgIconDiv.append(iconImg);
    titleDiv.append(title, websiteLink);

    headerDiv.append(imgIconDiv, titleDiv);
    descriptionDiv.append(anchorHeading, descriptionPara);

    googleResultDiv.append(headerDiv, descriptionDiv);
    fragment.append(googleResultDiv, divide);
  });

  resultContainer.append(fragment);
}

//reload the page when click on new chat
document.querySelector(".new-chat").addEventListener("click", () => {
  location.reload();
});

window.addEventListener(
  "DOMContentLoaded",
  () => (resultContainer.style.boxShadow = "none")
);

//voice search

let isRecognizing = false;
const recognition = new webkitSpeechRecognition();
recognition.continuous = true;
recognition.lang = "en-US";
micInput.addEventListener("click", () => {
  if (!isRecognizing) {
    recognition.start(); // Start recognition
    micInput.textContent = "Stop Voice Recognition";
    micInput.style.backgroundColor = "#f7d2c7";
    isRecognizing = true;
  } else {
    recognition.stop(); // Stop recognition
    micInput.textContent = "Start Voice Recognition";
    micInput.style.backgroundColor = "";
    isRecognizing = false;
  }
});

recognition.onresult = (event) => {
  const result = event.results[event.results.length - 1][0].transcript;
  searchInput.value += result;
};

recognition.onerror = (event) => {
  console.error("Speech recognition error:", event.error);
};

btn.addEventListener("click", () => fetchGoogleData(searchInput.value.trim()));

// ✅ Clear cache when clicking "New Chat"
document.querySelector(".new-chat").addEventListener("click", () => {
  localStorage.removeItem("googleCache"); // Clear cached data
  location.reload();
});

