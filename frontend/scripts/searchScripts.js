const API_URI = "http://localhost:5001/api";

const searchIcon = document.getElementById("search-icon");
const searchBox = document.getElementById("search-box");
const searchInput = document.getElementById("search-input");
const searchHistoryPopup = document.getElementById("search-history-popup");
searchIcon.addEventListener("click", function (event) {
  event.preventDefault();
  searchBox.style.display = "block";
  searchInput.focus();
});
document.addEventListener("click", function (event) {
  if (!searchBox.contains(event.target) && !searchIcon.contains(event.target)) {
    searchBox.style.display = "none";
  }
});

searchInput.addEventListener("input", async function () {
  const searchText = this.value;

  try {
    const response = await fetch(`${API_URI}/shoes/search?name=${searchText}`);
    const shoes = await response.json();
    displayResults(shoes);
  } catch (error) {
    console.error("Error fetching shoes:", error);
  }
});

function displayResults(shoes) {
  const resultsContainer = document.getElementById("search-history-list");

  resultsContainer.innerHTML = "";

  shoes.forEach((shoe) => {
    const resultItem = document.createElement("li");
    resultItem.classList.add("search-history-item");
    resultItem.textContent = shoe.name;

    resultItem.addEventListener("click", () => {
      console.log(`Selected item: ${shoe.name}`);
    });

    resultsContainer.appendChild(resultItem);
  });
}
