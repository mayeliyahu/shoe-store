const apiURI = "http://localhost:5001/api";

document.addEventListener("DOMContentLoaded", function () {
  const currentPath = window.location.pathname;

  const userData = JSON.parse(localStorage.getItem("user"));

  let selectedGender = "";
  if (userData && userData._id) {
    updateCartDisplay();
  }

  if (currentPath.endsWith("/women.html")) {
    selectedGender = "women";
    fetchAllShoesByGender(selectedGender);
    setupFiltering();
  } else if (currentPath.endsWith("/men.html")) {
    selectedGender = "men";
    fetchAllShoesByGender(selectedGender);
    setupFiltering();
  } else if (currentPath.endsWith("/index.html")) {
    fetchNewshoes();
  } else if (currentPath.endsWith("/sale.html")) {
    fatchSaleShoes();
    setupFiltering();
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
      const isSalePage = currentPath.endsWith("/sale.html");
      const url = `${apiURI}/shoes?brand=${selectedBrand}&size=${selectedSize}&gender=${selectedGender}&minPrice=${minPrice}&maxPrice=${maxPrice}&sale=${isSalePage}`;

      try {
        const response = await fetch(url);
        const shoes = await response.json();
        console.log(shoes);
        console.log(url);
        if (isSalePage) {
          createSaleShoeCardItem(shoes);
        } else {
          createShoeCardItem(shoes);
        }
      } catch (error) {
        console.error("Error fetching shoes:", error);
      }
    }
  }

  async function fatchSaleShoes() {
    try {
      const response = await fetch(`${apiURI}/shoes?sale=true`);
      const shoes = await response.json();
      console.log(shoes);
      createSaleShoeCardItem(shoes);
    } catch (error) {
      console.error("Error fetching shoes:", error);
    }
  }

  async function fetchAllShoesByGender(gender) {
    try {
      const response = await fetch(`${apiURI}/shoes?gender=${gender}`);
      const shoes = await response.json();
      createShoeCardItem(shoes);
    } catch (error) {
      console.error("Error fetching shoes:", error);
    }
  }

  async function fetchNewshoes() {
    try {
      const response = await fetch(`${apiURI}/shoes/new-items`);
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
      const genderImgDirectory =
        shoe.gender == "men" ? "men-items" : "women-items";
      shoeDiv.classList.add("category");

      shoeDiv.innerHTML = `
      <img src="./images/${genderImgDirectory}/${shoe.name}.png" alt="${shoe.gender}" class="category-image">
      <a>${shoe.price}$</a>
      <a class="nav-link">Shop Now</a>
        `;

      container.appendChild(shoeDiv);
      shoeDiv.addEventListener("click", function () {
        openShoePopup(shoe);
      });
    });
  }

  function createSaleShoeCardItem(shoes) {
    const container = document.getElementById("sale-items-section-container");

    container.innerHTML = "";
    console.log(shoes);

    shoes.forEach((shoe) => {
      const shoeDiv = document.createElement("div");
      const genderImgDirectory =
        shoe.gender == "men" ? "men-items" : "women-items";
      shoeDiv.classList.add("item");

      shoeDiv.innerHTML = `
          <img src="./images/${genderImgDirectory}/${shoe.name}.png" alt="${shoe.name}" />
          <h6>${shoe.name}</h6>
          <div class="price-container">
            <span class="original-price">${shoe.price}$</span>
            <span class="new-price">${shoe.salePrice}$</span>
          </div>
        `;

      container.appendChild(shoeDiv);
      shoeDiv.addEventListener("click", function () {
        openShoePopup(shoe);
      });
    });
  }

  function createShoeCardItem(shoes) {
    const container = document.getElementById("items-section-container");

    container.innerHTML = "";
    console.log(shoes);

    shoes.forEach((shoe) => {
      const shoeDiv = document.createElement("div");
      const genderImgDirectory =
        shoe.gender == "men" ? "men-items" : "women-items";
      shoeDiv.classList.add("item");

      shoeDiv.innerHTML = `
        <img src="./images/${genderImgDirectory}/${shoe.name}.png" alt="${shoe.name}">
        <h6>${shoe.name}</h6>
        <div class="price-container">
          <span class="price" >${shoe.price}$</span>
          
      </div> 
        `;

      container.appendChild(shoeDiv);
      shoeDiv.addEventListener("click", function () {
        openShoePopup(shoe);
      });
    });
  }
});

//Item Popup function- men/woman
function openShoePopup(item) {
  const currentPath = window.location.pathname;
  const isSalePage = currentPath.endsWith("sale.html");
  const userData = JSON.parse(localStorage.getItem("user"));
  console.log(item);
  const genderImgDirectory = item.gender == "men" ? "men-items" : "women-items";

  const sizesSelect = document.getElementById("sizes");
  sizesSelect.innerHTML = "";

  document.getElementById(
    "popup-image"
  ).src = `./images/${genderImgDirectory}/${item.name}.png`;
  document.getElementById("popup-title").innerText = item.name;
  if (isSalePage) {
    document.getElementById("popup-original-price").innerText =
      item.price + "$";
    document.getElementById("popup-new-price").innerText = item.salePrice + "$";
  } else {
    document.getElementById("popup-price").innerText = item.price + "$";
  }

  item.inStockSizes.forEach((size) => {
    const option = document.createElement("option");
    option.value = size;
    option.textContent = size;
    sizesSelect.appendChild(option);
  });

  if (userData && userData._id) {
    document.getElementById("login-reminder").style.display = "none";
  } else {
    document.getElementById("shoe-popup-user-actions").style.display = "none";
  }

  document.getElementById("popup-modal").style.display = "flex";

  document
    .getElementById("add-to-cart-btn")
    .addEventListener("click", function () {
      if (userData && userData._id) addToCart(item, sizesSelect.value);
      else {
        alert("Please login :)");
      }
    });
}
function closePopup() {
  document.getElementById("popup-modal").style.display = "none";
}

document.querySelector(".close-popup").addEventListener("click", closePopup);

window.addEventListener("click", function (event) {
  const modal = document.getElementById("popup-modal");
  if (event.target === modal) {
    closePopup();
  }
});

async function addToCart(shoe, size) {
  const userData = JSON.parse(localStorage.getItem("user"));
  payload = {
    userId: userData._id,
    shoeId: shoe._id,
    shoeSize: size,
    quantity: 1,
  };
  const response = await fetch(`${apiURI}/cart`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  closePopup();
  updateCartDisplay();
}

async function removeFromCart(shoeId, userId) {
  console.log("sdsad");
  const response = await fetch(`${apiURI}/cart/${userId}?shoeId=${shoeId}`, {
    method: "DELETE",
  });
  console.log(await response.json());
  updateCartDisplay();
}

async function updateCartDisplay() {
  const currentPath = window.location.pathname;

  let cartTotalPrice = 0;

  const userData = JSON.parse(localStorage.getItem("user"));
  const res = await fetch(`${apiURI}/cart/${userData._id}`);

  const orderSummaryItemsContainer = document.getElementById(
    "order-summary-items"
  );

  let isCartPage =
    currentPath.endsWith("cart.html") && orderSummaryItemsContainer
      ? true
      : false;

  const cartItemsContainer = document.getElementById("cart-items");

  const userCart = await res.json();

  cartItemsContainer.innerHTML = "";
  if (isCartPage) orderSummaryItemsContainer.innerHTML = "";

  document.getElementById("cart-total-items").textContent =
    userCart.items.length;
  document.getElementById(
    "cart-count"
  ).textContent = `(${userCart.items.length})`;
  if (userCart.items.length === 0) {
    cartItemsContainer.innerHTML =
      '<li class="list-group-item text-center">Your cart is empty</li>';

    if (isCartPage)
      orderSummaryItemsContainer.innerHTML =
        '<li class="list-group-item text-center">Your order summary is empty</li>';
  } else {
    userCart.items.forEach((item, index) => {
      const shoe = item.shoe;
      const shoePrice = shoe.salePrice === null ? shoe.price : shoe.salePrice;
      cartTotalPrice += shoePrice;
      const genderImgDirectory =
        shoe.gender == "men" ? "men-items" : "women-items";
      const cartItem = document.createElement("li");
      cartItem.className =
        "list-group-item d-flex justify-content-between align-items-center";
      cartItem.innerHTML = `
                <div class="d-flex align-items-center">
                    <img src="./images/${genderImgDirectory}/${shoe.name}.png" alt="${shoe.name}" style="width: 50px; height: 50px; margin-right: 10px;">
                    <div>
                        <span>${shoe.name}</span><br>
                        <span class="fw-bold">${shoePrice}$</span>
                    </div>
                </div>
                <button class="remove-btn btn btn-danger btn-sm" data-index="${shoe._id}">Remove</button>
            `;
      cartItemsContainer.appendChild(cartItem);
      if (isCartPage) {
        const orderSummaryItem = document.createElement("tr");

        orderSummaryItem.innerHTML = `
          
                <td class="d-flex align-items-center">
            <img
              src="./images/${genderImgDirectory}/${shoe.name}.png"
              alt="${shoe.name}"
              style="width: 50px; height: 50px; margin-right: 10px"
            />
            <div><span>${shoe.name}</span><br /></div>
          </td>
          <td>${shoePrice}$</td>
          <td>${item.size}</td>
          <td>
            <button
              class="remove-btn btn btn-danger btn-sm"
              data-index="${shoe._id}"
            >
              Remove
            </button>
          </td>
            `;
        orderSummaryItemsContainer.appendChild(orderSummaryItem);
      }
    });
    document.querySelectorAll(".remove-btn").forEach((button) => {
      button.addEventListener("click", function (event) {
        event.stopPropagation();
        const shoe_id = button.getAttribute("data-index");
        removeFromCart(shoe_id, userData._id);
      });
    });

    if (isCartPage)
      document
        .getElementById("buy-now-btn")
        .addEventListener("click", async function () {
          console.log("sda");
          if (userCart.items.length === 0) alert("Cart is Empty!");
          else {
            payload = {
              userId: userData._id,
              items: userCart.items,
              total: cartTotalPrice,
            };
            const response = await fetch(`${apiURI}/orders`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(payload),
            });
            document.getElementById("cart-total-items").textContent = 0;
            document.getElementById("cart-count").textContent = `(0)`;
            cartItemsContainer.innerHTML =
              '<li class="list-group-item text-center">Your cart is empty</li>';
            orderSummaryItemsContainer.innerHTML =
              '<li class="list-group-item text-center">Your order summary is empty</li>';
            console.log(await response.json());
            alert("Thank you for your purchase!");
          }
        });
  }
}
