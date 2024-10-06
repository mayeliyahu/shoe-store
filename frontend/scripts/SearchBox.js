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