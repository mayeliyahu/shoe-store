const API_URI = "http://localhost:5001/api";

const searchIcon = document.getElementById("search-icon");
const searchBox = document.getElementById("search-box");
const searchInput = document.getElementById("search-input");
const searchDropdown = document.querySelector(".search-dropdown");

searchIcon.addEventListener("click", function (event) {
  event.preventDefault();
  searchDropdown.classList.add("search-active");
  searchInput.focus();
});

document.addEventListener("click", function (event) {
  if (!searchDropdown.contains(event.target)) {
    searchDropdown.classList.remove("search-active");
  }
});

document
  .getElementById("search-input")
  .addEventListener("input", async function () {
    const searchText = this.value;

    try {
      const response = await fetch(
        `${API_URI}/shoes/search?name=${searchText}`
      );
      const shoes = await response.json();
      console.log(shoes);
      displayResults(shoes);
    } catch (error) {
      console.error("Error fetching shoes:", error);
    }
  });

function displayResults(shoes) {
  const resultsContainer = document.getElementById("searched-items");
  const emptySearched = document.getElementById("empty-searched");

  resultsContainer.innerHTML = "";

  shoes.forEach((shoe) => {
    const resultItem = document.createElement("li");
    resultItem.classList.add("list-group-item");
    resultItem.textContent = shoe.name;

    resultItem.addEventListener("click", () => {
      console.log(`Selected item: ${shoe.name}`);
    });

    resultsContainer.appendChild(resultItem);
  });
}

document
  .getElementById("search-icon")
  .addEventListener("click", function (event) {
    event.preventDefault();
    const dropdown = document.getElementById("search-dropdown");

    dropdown.classList.toggle("show");
  });

// document.addEventListener("click", function (event) {
//   const dropdown = document.getElementById("search-dropdown");
//   const searchIcon = document.getElementById("search-icon");

//   if (!dropdown.contains(event.target) && !searchIcon.contains(event.target)) {
//     dropdown.classList.remove("show");
//   }
// });
