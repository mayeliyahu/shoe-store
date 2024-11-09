// Add item to wishlist
let wishlistItems = [];
function addToWishlist(item) {
  const title = item.title;
  const imageSrc = item.imageSrc;
  const price = item.price;
  const newPrice = item.newPrice;
  wishlistItems.push({ title, imageSrc, price });
  //Update total number of items
  document.getElementById("wishlist-total-items").innerText =
    wishlistItems.length;
  updateWishlistDisplay();
}
function openWishlistDropdown() {
  const wishlistDropdown = document.getElementById("wishlist-dropdown");
  wishlistDropdown.classList.add("show");
}

function updateWishlistDisplay() {
  const wishlistItemsContainer = document.getElementById("wishlist-items");
  wishlistItemsContainer.innerHTML = "";

  if (wishlistItems.length === 0) {
    wishlistItemsContainer.innerHTML =
      '<li class="list-group-item text-center">Your wishlist is empty</li>';
  } else {
    wishlistItems.forEach((item, index) => {
      const wishlistItem = document.createElement("li");
      wishlistItem.className =
        "list-group-item d-flex justify-content-between align-items-center";
      wishlistItem.innerHTML = `
            <div class="d-flex align-items-center">
                <img src="${item.imageSrc}" alt="${item.title}" style="width: 50px; height: 50px; margin-right: 10px;">
                <span>${item.title}</span>
                <span>${item.price}</span>
            </div>
            <button class="remove-btn btn btn-danger btn-sm" data-index="${index}">Remove</button>
        `;
      wishlistItemsContainer.appendChild(wishlistItem);
    });
    document.querySelectorAll(".remove-btn").forEach((button) => {
      button.addEventListener("click", function (event) {
        event.stopPropagation();
        const index = button.getAttribute("data-index");
        removeFromWishlist(index);
      });
    });
  }
}
function removeFromWishlist(index) {
  wishlistItems.splice(index, 1);
  document.getElementById("wishlist-total-items").innerText =
    wishlistItems.length;
  updateWishlistDisplay();
}
function openPopup(item) {
  const title = item.querySelector("h6").innerText;
  const imageSrc = item.querySelector("img").src;
  const price = item.querySelector(".price").innerText;

  document.getElementById("popup-title").innerText = title;
  document.getElementById("popup-image").src = imageSrc;
  document.getElementById("popup-price").innerText = price;

  window.currentPopupItem = { title, imageSrc, price };
  document.getElementById("popup-modal").style.display = "block";
}
document
  .querySelector(".popup-content .add-to-cart-btn:last-of-type")
  .addEventListener("click", function () {
    if (window.currentPopupItem) {
      addToWishlist(window.currentPopupItem);
      closePopup();
    } else {
      console.error("No item found for wishlist.");
    }
  });
function closePopup() {
  document.getElementById("popup-modal").style.display = "none";
}

document.querySelector(".close-popup").addEventListener("click", closePopup);
document.querySelectorAll(".item").forEach((item) => {
  item.addEventListener("click", function () {
    openPopup(item);
  });
});

window.onload = function () {
  const savedWishlist = localStorage.getItem("wishlist");
  if (savedWishlist) {
    wishlistItems = JSON.parse(savedWishlist);
    document.getElementById("wishlist-total-items").innerText =
      wishlistItems.length;
    updateWishlistDisplay();
  }
};

window.addEventListener("beforeunload", function () {
  localStorage.setItem("wishlist", JSON.stringify(wishlistItems));
});
