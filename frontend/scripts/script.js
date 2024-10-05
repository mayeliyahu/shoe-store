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

