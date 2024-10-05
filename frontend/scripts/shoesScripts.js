const apiURI = "http://localhost:5001/api";

document.addEventListener("DOMContentLoaded", function () {
  const currentPath = window.location.pathname;

  console.log("Current Path:", currentPath); // Debugging

  let selectedGender = "";

  if (currentPath.endsWith("women.html")) {
    selectedGender = "women";
    setupFiltering();
  } else if (currentPath.endsWith("men.html")) {
    selectedGender = "men";
    setupFiltering();
  } else if (currentPath.endsWith("index.html")) {
    fetchAllShoes();
  }

  function setupFiltering() {
    const brandRadios = document.querySelectorAll('input[name="type"]');
    const sizeLinks = document.querySelectorAll(".sidebar ul li a");
    const minPriceInput = document.querySelector(".input-min");
    const maxPriceInput = document.querySelector(".input-max");
    const minRange = document.querySelector(".range-min");
    const maxRange = document.querySelector(".range-max");

    let selectedBrand = "";
    let selectedSize = "";
    let minPrice = minPriceInput.value;
    let maxPrice = maxPriceInput.value;

    brandRadios.forEach((radio) => {
      radio.addEventListener("change", function () {
        selectedBrand = this.id;
        fetchFilteredResults();
      });
    });

    sizeLinks.forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        selectedSize = this.textContent.trim();
        fetchFilteredResults();
      });
    });

    minRange.addEventListener("input", function () {
      minPrice = this.value;
      fetchFilteredResults();
    });

    maxRange.addEventListener("input", function () {
      maxPrice = this.value;
      fetchFilteredResults();
    });

    async function fetchFilteredResults() {
      const url = `${apiURI}/shoes?brand=${selectedBrand}&size=${selectedSize}&gender=${selectedGender}&minPrice=${minPrice}&maxPrice=${maxPrice}`;

      try {
        const response = await fetch(url);
        const shoes = await response.json();
        console.log(shoes);
        console.log(url);
        createShoeCardItem(shoes);
      } catch (error) {
        console.error("Error fetching shoes:", error);
      }
    }
  }

  async function fetchAllShoes() {
    try {
      const response = await fetch(`${apiURI}/shoes`);
      const shoes = await response.json();
      console.log(shoes);
      createNewItemsDiv(shoes);
    } catch (error) {
      console.error("Error fetching shoes:", error);
    }
  }
  function createNewItemsDiv(shoes) {
    const container = document.getElementById("allShoesDisplayContainer");

    shoes.forEach((shoe) => {
      const shoeDiv = document.createElement("div");
      shoeDiv.classList.add("category");

      shoeDiv.innerHTML = `
      <img src="./images/new-items/${shoe.name}.png" alt="${shoe.gender}" class="category-image">
      <a>${shoe.price}$</a>
      <a class="nav-link" href="index.html">Shop Now</a>
        `;
      console.log(shoeDiv);

      container.appendChild(shoeDiv);
    });
  }

  function createShoeCardItem(shoes) {
    const container = document.getElementById("items-section-container");

    container.innerHTML = "";

    shoes.forEach((shoe) => {
      const shoeDiv = document.createElement("div");
      shoeDiv.classList.add("item");

      shoeDiv.innerHTML = `
        <img src="./images/new-items/${shoe.name}.png" alt="${shoe.name}">
        <h6>${shoe.name}</h6>
        <div class="price-container">
          <span>${shoe.price}$</span>
          
      </div> 
        `;

      container.appendChild(shoeDiv);
    });
  }
});











