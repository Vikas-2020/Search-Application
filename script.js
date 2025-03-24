const roleElement = document.querySelector(".role");
const text = "Hello, Developer";
let charIndex = 0;
let isDeleting = false;
const typeSpeed = 100;
const backSpeed = 80;
const backDelay = 1000;

function typeEffect() {
  if (!isDeleting) {
    roleElement.innerText = text.substring(0, charIndex + 1);
    charIndex++;
  } else {
    roleElement.innerText = text.substring(0, charIndex - 1);
    charIndex--;
  }

  if (!isDeleting && charIndex === text.length) {
    setTimeout(() => (isDeleting = true), backDelay);
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
  }

  setTimeout(typeEffect, isDeleting ? backSpeed : typeSpeed);
}

typeEffect();

//sidebar menu
const menu = document.querySelector(".menu");
const newChat = document.querySelector(".new-chat p");
const recent = document.querySelector(".recent-title");
const bottomIconText = document.querySelectorAll(".bottom-item p");
let toggled = false;
menu.addEventListener("click", () => {
  if (!toggled) {
    newChat.style.display = "none";
    recent.style.display = "none";
    bottomIconText.forEach((text) => (text.style.display = "none"));

    toggled = true;
  } else {
    newChat.style.display = "block";
    recent.style.display = "block";
    bottomIconText.forEach((text) => (text.style.display = "block"));

    toggled = false;
  }
});

//Search(input)
const search = document.querySelector("input");
const send = document.querySelector("#send");
const mic = document.querySelector("#mic");
const recentContainer = document.querySelector(".recent-container");
const new_chat = document.querySelector(".new-chat");

send.addEventListener("click", () => {
  const input = search.value.trim();
  if (!input) {
    alert("Please enter some prompt");
    return;
  }

  let storedValues = JSON.parse(localStorage.getItem("recentInputs")) || [];

  storedValues.push(input);

  // Keep only the last 5 values
  if (storedValues.length > 5) {
    storedValues.shift();
  }

  // Save back to localStorage
  localStorage.setItem("recentInputs", JSON.stringify(storedValues));

  new_chat.addEventListener("click", loadRecent);
});

function loadRecent() {
  // Check if page has already refreshed
  if (!sessionStorage.getItem("refreshed")) {
    sessionStorage.setItem("refreshed", "true");
    location.reload(); // Refresh the page
    return;
  }
  search.value = "";
  let storedValues = JSON.parse(localStorage.getItem("recentInputs")) || [];
  const originalEntry = document.querySelector(".recent-entry");

  if (!originalEntry) {
    console.error("Error: .recent-entry not found");
    return;
  }

  recentContainer.innerHTML = ""; // Clear previous entries

  const fragment = document.createDocumentFragment();

  storedValues.forEach((value) => {
    const newEntry = originalEntry.cloneNode(true);
    
    // Shorten text if longer than 15 characters
    newEntry.querySelector("p").innerText = value.trim().length > 15 
      ? value.trim().substring(0, 16) + "..." 
      : value.trim();

    fragment.appendChild(newEntry);

    // Click event to update search input
    newEntry.addEventListener("click", () => {
      search.value = value;
    });
  });

  recentContainer.appendChild(fragment);
}

// Call loadRecent
loadRecent();