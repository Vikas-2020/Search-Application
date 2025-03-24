let wikiBtn = document.querySelector("#wiki");

// Load cache from localStorage when the page loads
let wikiCache = JSON.parse(localStorage.getItem("wikiCache")) || {};

async function fetchWikipediaResults(query) {
  if (query === "") {
    document.querySelector(".cards").style.display = "flex";
    resultContainer.innerHTML = "";
    resultContainer.style.boxShadow = "none";
    return;
  }

  // Check cache first
  if (wikiCache[query]) {
    console.log("Fetching from cache...");

    wikiBtn.addEventListener("click", () => {
      allBtn.forEach((btn, idx) => {
        btn.classList.toggle("selectedBtn", idx === 1);
      });
      displayWikiData(wikiCache[query]);
    });

    displayWikiData(wikiCache[query]);
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
    btn.classList.toggle("selectedBtn", idx === 1);
  });

  try {
    let response = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${query}&format=json&origin=*`
    );
    let result = await response.json();
    let resultData = result.query.search.map((result)=>{
        return result}
    );
    // console.log(resultData); // Debugging

    // Hide loader after fetching data
    loader.style.display = "none";

    // Cache the result in memory and localStorage
    wikiCache[query] = resultData;
    localStorage.setItem("wikiCache", JSON.stringify(wikiCache));


    wikiBtn.addEventListener("click", () => {
      allBtn.forEach((btn, idx) => {
        btn.classList.toggle("selectedBtn", idx === 1);
      });
      displayWikiData(resultData);
    });

    // Display results
    displayWikiData(resultData);
  } catch (error) {
    console.error("Error fetching data:", error);
    loader.style.display = "none"; // Hide loader on error
  }
}

function displayWikiData(result){
    resultContainer.innerHTML = "";
    resultContainer.style.boxShadow = "rgba(0, 0, 0, 0.24) 0px 3px 8px";
    if(searchInput.value.trim() === ""){
        return;
    }

    let fragment = document.createDocumentFragment();
    let wikiHeading = document.createElement("h3");
    wikiHeading.classList.add("head")
    wikiHeading.innerHTML = `Wikipedia search result for : ${searchInput.value.trim()}`
    fragment.append(wikiHeading);

    result.forEach((data) =>{
    let title = data.title 
    let link = `https://en.wikipedia.org/wiki/${data.title.replace(/ /g, "_")}`;
    let timestamp =  data.timestamp.slice(0,10);
    let snippet = data.snippet;

    let result = document.createElement("div");
    result.classList.add("result" , "result-dark");

    let titleHeading = document.createElement("div");
    titleHeading.classList.add("title","title-dark");

    let anchor = document.createElement("a");
    anchor.href = link;
    anchor.target = "_blank";
    anchor.innerHTML = title;

    let dateAndTimeDiv = document.createElement("div");
    dateAndTimeDiv.classList.add("dataAndTime","dataAndTime-dark")
    dateAndTimeDiv.innerHTML = timestamp


    let description = document.createElement("div");
    description.classList.add("description","description-dark")
    description.innerHTML = snippet;

    let hrTag = document.createElement("hr");

    titleHeading.append(anchor);
    result.append(titleHeading,dateAndTimeDiv,description,hrTag);
    fragment.append(result)
    })
    resultContainer.append(fragment);
}

btn.addEventListener("click", () =>{
    fetchWikipediaResults(searchInput.value.trim());
    fetchGoogleData(searchInput.value.trim());
})

// Clear cache when clicking "New Chat"
document.querySelector(".new-chat").addEventListener("click", () => {
  localStorage.removeItem("wikiCache"); // Clear cached data
  location.reload();
});
