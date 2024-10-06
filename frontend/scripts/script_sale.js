//Item Popup function- sale
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
        wishlistItem.className = 'list-group-item d-flex justify-content-between align-items-center';
        wishlistItem.innerHTML = `
            <div class="d-flex align-items-center">
                <img src="${item.imageSrc}" alt="${item.title}" style="width: 50px; height: 50px; margin-right: 10px;">
                <span>${item.title}</span>
                <span>${item.newPrice}</span>
            </div>
            <button class="remove-btn btn btn-danger btn-sm" data-index="${index}">Remove</button>
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


//Add item to cart
function updateCartCount() {
  document.getElementById('cart-count').innerText = `(${cartItems.length})`;
}
let cartItems = [];
function addToCart(item) {
    const title = item.title;
    const imageSrc = item.imageSrc;
    const originalPrice = item.originalPrice;
    const newPrice = item.newPrice;
    cartItems.push({ title, imageSrc, originalPrice, newPrice });
    document.getElementById('cart-total-items').innerText = cartItems.length;
    updateCartDisplay();
    updateCartCount();
}

function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = '';

    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = '<li class="list-group-item text-center">Your cart is empty</li>';
    } else {
        cartItems.forEach((item, index) => {
            const cartItem = document.createElement('li');
            cartItem.className = 'list-group-item d-flex justify-content-between align-items-center';
            cartItem.innerHTML = `
                <div class="d-flex align-items-center">
                    <img src="${item.imageSrc}" alt="${item.title}" style="width: 50px; height: 50px; margin-right: 10px;">
                    <div>
                        <span>${item.title}</span><br>
                        <span class="text-muted" style="text-decoration: line-through;">${item.originalPrice}</span>
                        <span class="fw-bold text-danger">${item.newPrice}</span>
                    </div>
                </div>
                <button class="remove-btn btn btn-danger btn-sm" data-index="${index}">Remove</button>
            `;
            cartItemsContainer.appendChild(cartItem);
        });

        document.querySelectorAll('.remove-btn').forEach(button => {
            button.addEventListener('click', function(event) {
                event.stopPropagation();
                const index = button.getAttribute('data-index');
                removeFromCart(index);
            });
        });
    }
}
function removeFromCart(index) {
    cartItems.splice(index, 1);
    document.getElementById('cart-total-items').innerText = cartItems.length;
    updateCartDisplay();
    updateCartCount();
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
document.querySelector('.popup-content .add-to-cart-btn').addEventListener('click', function() {
    if (window.currentPopupItem) {
        addToCart(window.currentPopupItem);
        closePopup();
    } else {
        console.error('No item found for cart.');
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
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cartItems = JSON.parse(savedCart);
        document.getElementById('cart-total-items').innerText = cartItems.length;
        updateCartDisplay();
    }
};

window.addEventListener('beforeunload', function() {
    localStorage.setItem('cart', JSON.stringify(cartItems));
});
