function renderCart() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const cartItems = document.getElementById('cart-items');
  const cartTotalItems = document.getElementById('cart-total-items');
  const cartCount = document.getElementById('cart-count');

  cartItems.innerHTML = '';
  let totalAmount = 0;
  if (cart.length === 0) {
    cartItems.innerHTML = '<li class="list-group-item">Your cart is empty</li>';
  } else {
    cart.forEach((item) => {
      const li = document.createElement('li');
      li.className = 'list-group-item bg-transparent d-flex justify-content-between lh-sm';
      li.innerHTML = `
        <div>
          <h5><a href="${item.link}">${item.name}</a></h5>
          <small>${item.description}</small>
          <a href="#" class="d-block fw-medium text-capitalize mt-2" onclick="removeFromCart('${item.id}')">Remove</a>
        </div>
        <span class="text-primary">$${item.price}</span>
      `;
      cartItems.appendChild(li);
      totalAmount += item.price;
    });
  }

  cartTotalItems.textContent = cart.length;
  cartCount.textContent = `(${cart.length})`;
}

function removeFromCart(id) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart = cart.filter(item => item.id !== id);
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
}

window.onload = function() {
  renderCart();
};

//Searchbox function
const searchIcon = document.getElementById('search-icon');
const searchBox = document.getElementById('search-box');
const searchInput = document.getElementById('search-input');
const searchDropdown = document.querySelector('.search-dropdown');

searchIcon.addEventListener('click', function (event) {
  event.preventDefault();
  searchDropdown.classList.add('search-active');
  searchInput.focus();
});

document.addEventListener('click', function (event) {
  if (!searchDropdown.contains(event.target)) {
    searchDropdown.classList.remove('search-active');
  }
});



//Item Popup function
function openPopup(item) {
  const imageSrc = item.querySelector('img').src;
  const title = item.querySelector('h6').innerText;
  const originalPrice = item.querySelector('.original-price').innerText;
  const newPrice = item.querySelector('.new-price').innerText;

  document.getElementById('popup-image').src = imageSrc;
  document.getElementById('popup-title').innerText = title;
  document.getElementById('popup-original-price').innerText = originalPrice;
  document.getElementById('popup-new-price').innerText = newPrice;

  document.getElementById('popup-modal').style.display = 'flex';
}

function closePopup() {
  document.getElementById('popup-modal').style.display = 'none';
}

document.querySelectorAll('.item').forEach(item => {
  item.addEventListener('click', function() {
    openPopup(item);
  });
});

document.querySelector('.close-popup').addEventListener('click', closePopup);

window.addEventListener('click', function(event) {
  const modal = document.getElementById('popup-modal');
  if (event.target === modal) {
    closePopup();
  }
});




// Add item to wishlist
let wishlistItems = [];
function addToWishlist(item) {
  const title = item.title;
  const imageSrc = item.imageSrc;
  const originalPrice = item.originalPrice;
  const newPrice = item.newPrice;
  wishlistItems.push({ title, imageSrc, originalPrice, newPrice });
  //Update total number of items 
  document.getElementById('wishlist-total-items').innerText = wishlistItems.length;
  updateWishlistDisplay();
}
function openWishlistDropdown() {
  const wishlistDropdown = document.getElementById('wishlist-dropdown');
  wishlistDropdown.classList.add('show');
}


function updateWishlistDisplay() {
  const wishlistItemsContainer = document.getElementById('wishlist-items');
  wishlistItemsContainer.innerHTML = '';

  if (wishlistItems.length === 0) {
      wishlistItemsContainer.innerHTML = '<li class="list-group-item text-center">Your wishlist is empty</li>';
  } else {
      wishlistItems.forEach((item, index) => {
          const wishlistItem = document.createElement('li');
          wishlistItem.className = 'list-group-item d-flex justify-content-between align-items-center'; // Flexbox עבור סידור
          wishlistItem.innerHTML = `
              <div class="d-flex align-items-center">
                  <img src="${item.imageSrc}" alt="${item.title}" style="width: 50px; height: 50px; margin-right: 10px;">
                  <span>${item.title}</span>
                  <span>${item.newPrice}</span>
              </div>
              <button class="remove-btn btn btn-danger btn-sm" data-index="${index}">Remove</button> <!-- כפתור להסרה -->
          `;
          wishlistItemsContainer.appendChild(wishlistItem);
      });
      document.querySelectorAll('.remove-btn').forEach(button => {
          button.addEventListener('click', function(event) {
              event.stopPropagation();
              const index = button.getAttribute('data-index');
              removeFromWishlist(index);
          });
      });
  }
}
function removeFromWishlist(index) {
    wishlistItems.splice(index, 1);
    document.getElementById('wishlist-total-items').innerText = wishlistItems.length;
    updateWishlistDisplay();
}
function openPopup(item) {
    const title = item.querySelector('h6').innerText;
    const imageSrc = item.querySelector('img').src;
    const originalPrice = item.querySelector('.original-price').innerText;
    const newPrice = item.querySelector('.new-price').innerText;

    document.getElementById('popup-title').innerText = title;
    document.getElementById('popup-image').src = imageSrc;
    document.getElementById('popup-original-price').innerText = originalPrice;
    document.getElementById('popup-new-price').innerText = newPrice;
    window.currentPopupItem = { title, imageSrc, originalPrice, newPrice };
    document.getElementById('popup-modal').style.display = 'block';
}
document.querySelector('.popup-content .add-to-cart-btn:last-of-type').addEventListener('click', function() {
    if (window.currentPopupItem) {
        addToWishlist(window.currentPopupItem);
        closePopup(); 
    } else {
        console.error('No item found for wishlist.');
    }
});
function closePopup() {
    document.getElementById('popup-modal').style.display = 'none';
}

document.querySelector('.close-popup').addEventListener('click', closePopup);
document.querySelectorAll('.item').forEach((item) => {
    item.addEventListener('click', function() {
        openPopup(item); 
    });
});

window.onload = function() {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
        wishlistItems = JSON.parse(savedWishlist);
        document.getElementById('wishlist-total-items').innerText = wishlistItems.length;
        updateWishlistDisplay();
    }
};

window.addEventListener('beforeunload', function() {
    localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
});
