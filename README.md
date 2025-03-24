# AI-Powered Search App  

This project is a web-based search application that fetches and displays results from **Google, Wikipedia, Unsplash, and Gemini AI**. Built using **HTML, CSS, and JavaScript**, it offers a clean UI and seamless user experience.  

## 🚀 Features  
- 🔍 **Google Search API** – Fetches web search results efficiently.  
- 📖 **Wikipedia API** – Retrieves summarized Wikipedia content.  
- 🖼 **Unsplash API** – Provides high-quality images.  
- 🤖 **Gemini AI** – Generates AI-powered responses.  
- 🎨 **Modern UI** – Designed with HTML and CSS for an intuitive experience.  
- ⚡ **Interactive & Dynamic** – JavaScript ensures smooth functionality.  
- 🏎 **Optimized Performance** – Caching reduces API calls and improves response time.  

## 🏗 Technologies Used  
- **HTML** – Structuring the webpage.  
- **CSS** – Styling and responsive design.  
- **JavaScript** – Handling API requests and UI interactions.  
- **APIs Used**:  
  - Google Custom Search API  
  - Wikipedia API  
  - Unsplash API  
  - Gemini AI API  
- **LocalStorage** – Caching for improved performance.  

## 🗄 Caching Mechanism  
To enhance performance and reduce redundant API calls, the app stores search results in `localStorage`.  

- **Cache**:  
  ```js
  let googleCache = JSON.parse(localStorage.getItem("googleCache")) || {};
  let wikiCache = JSON.parse(localStorage.getItem("wikiCache")) || {};
  let imgCache = JSON.parse(localStorage.getItem("imgCache")) || {};
  let geminiCache = JSON.parse(localStorage.getItem("geminiCache")) || {};



