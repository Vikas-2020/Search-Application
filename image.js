const imgBtn = document.querySelector("#images");
const imgApiKey = "ppkTR5GgzjzY0Tb7p1afq9sMUknWkSDHuGAOvebTPhU";

async function fetchImageData(query) {
  if (query === "") {
    document.querySelector(".cards").style.display = "flex";
    resultContainer.innerHTML = "";
    resultContainer.style.boxShadow = "none";
    return;
  }

  // Hide initial UI elements
  if (!showResult) {
    document.querySelector(".cards").style.display = "none";
  }

  // Show loader
  loader.style.display = "flex";

  allBtn.forEach((btn, idx) => {
    btn.classList.toggle("selectedBtn", idx === 3);
  });

  try {
    let response = await fetch(
      `https://api.unsplash.com/search/photos?query=${query}&client_id=${imgApiKey}`
    );
    let result = await response.json();
    // console.log(result.results);

    // Hide loader after fetching data
    loader.style.display = "none";

    imgBtn.addEventListener("click", () => {
      allBtn.forEach((btn, idx) => {
        btn.classList.toggle("selectedBtn", idx === 3);
      });
      displayImgData(result.results);
    });

    // Display results
    displayImgData(result.results);
  } catch (error) {
    console.error("Error fetching data:", error);
    loader.style.display = "none";
  }
}

// ✅ Function to display images with a download button
function displayImgData(images) {
  resultContainer.innerHTML = "";
  resultContainer.style.boxShadow = "rgba(0, 0, 0, 0.24) 0px 3px 8px";

  if (searchInput.value.trim() === "") {
    return;
  }

  let fragment = document.createElement("div");
  fragment.classList.add("image-grid");
  let imgHeading = document.createElement("h3");
  imgHeading.classList.add("head");
  imgHeading.innerHTML = `Image results for: ${searchInput.value.trim()}`;
  resultContainer.append(imgHeading);

  images.forEach((image) => {
    let imgDiv = document.createElement("div");
    imgDiv.classList.add("image-container");

    let imgTag = document.createElement("img");
    imgTag.src = image.urls.small;
    imgTag.alt = image.alt_description;
    imgTag.loading = "lazy";

    // ✅ Clicking on the image opens it in a new tab
    imgTag.addEventListener("click", (event) => {
      window.open(image.urls.full, "_blank");
    });

    // Create overlay div for download button
    let overlay = document.createElement("div");
    overlay.classList.add("overlay");

    // ✅ Create download button
    let downloadBtn = document.createElement("button");
    downloadBtn.classList.add("download-btn");
    downloadBtn.innerText = "Download";

    // 🛑 Prevents image click event from firing when downloading
    downloadBtn.addEventListener("click", (event) => {
      event.stopPropagation(); // Stops click event from reaching imgTag
      downloadImage(image.urls.full);
    });

    overlay.appendChild(downloadBtn);
    imgDiv.appendChild(imgTag);
    imgDiv.appendChild(overlay);
    fragment.appendChild(imgDiv);
  });

  resultContainer.appendChild(fragment);
}

// ✅ Function to download image
function downloadImage(url) {
  const link = document.createElement("a");
  link.href = url;
  link.target = "_blank";
  link.download = "downloaded_image.jpg"; // Set a filename
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

btn.addEventListener("click", () => {
  fetchImageData(searchInput.value.trim());
  fetchGoogleData(searchInput.value.trim());
});
