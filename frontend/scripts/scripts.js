//serach function
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

//order summary
function updateCartDisplay() {
  const cartItemsContainer = document.getElementById("cart-items");
  const orderSummaryItemsContainer = document.getElementById(
    "order-summary-items"
  );
  cartItemsContainer.innerHTML = "";
  orderSummaryItemsContainer.innerHTML = "";

  if (cartItems.length === 0) {
    cartItemsContainer.innerHTML =
      '<li class="list-group-item text-center">Your cart is empty</li>';
    orderSummaryItemsContainer.innerHTML =
      '<li class="list-group-item text-center">Your order summary is empty</li>';
  } else {
    cartItems.forEach((item, index) => {
      const displayPrice = item.newPrice ? item.newPrice : item.price;

      const cartItem = document.createElement("li");
      cartItem.className =
        "list-group-item d-flex justify-content-between align-items-center";
      cartItem.innerHTML = `
                <div class="d-flex align-items-center">
                    <img src="${item.imageSrc}" alt="${item.title}" style="width: 50px; height: 50px; margin-right: 10px;">
                    <div>
                        <span>${item.title}</span><br>
                        <span class="fw-bold">${displayPrice}</span>
                    </div>
                </div>
                <button class="remove-btn btn btn-danger btn-sm" data-index="${index}">Remove</button>
            `;
      cartItemsContainer.appendChild(cartItem);

      const orderSummaryItem = document.createElement("li");
      orderSummaryItem.className =
        "list-group-item d-flex justify-content-between align-items-center";
      orderSummaryItem.innerHTML = `
                <div class="d-flex align-items-center">
                    <img src="${item.imageSrc}" alt="${item.title}" style="width: 50px; height: 50px; margin-right: 10px;">
                    <div>
                        <span>${item.title}</span><br>
                        <span class="fw-bold">${displayPrice}</span> 
                    </div>
                </div>
            `;
      orderSummaryItemsContainer.appendChild(orderSummaryItem);
    });
  }

  document.querySelectorAll(".remove-btn").forEach((button) => {
    button.addEventListener("click", function (event) {
      event.stopPropagation();
      const index = button.getAttribute("data-index");
      removeFromCart(index);
    });
  });
}

function removeFromCart(index) {
  cartItems.splice(index, 1);
  document.getElementById("cart-total-items").innerText = cartItems.length;
  updateCartDisplay();
}

window.onload = function () {
  const savedCart = localStorage.getItem("cart");
  if (savedCart) {
    cartItems = JSON.parse(savedCart);
    document.getElementById("cart-total-items").innerText = cartItems.length;
    updateCartDisplay();
  }
};

//buy now button
document.getElementById("buy-now-btn").addEventListener("click", function () {
  alert("Thank you for your purchase!");
});
