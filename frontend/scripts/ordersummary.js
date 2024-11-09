const API_URL = "http://localhost:5001/api";

document.addEventListener("DOMContentLoaded", async function () {
  const lastorder = await fatchLastOrder();
  console.log(lastorder);
  loadOrderPager(lastorder);
});

async function fatchLastOrder() {
  const userData = JSON.parse(localStorage.getItem("user"));
  try {
    const response = await fetch(`${API_URL}/orders/user/${userData._id}`);
    const orders = await response.json();
    return orders[0];
  } catch (error) {
    console.error("Error fetching order:", error);
  }
}

async function loadOrderPager(order) {
  const page = document.getElementById("order-page");

  document.getElementById("order-id").textContent = order._id;
  document.getElementById("order-created-at").textContent = order.createdAt;

  const itemsList = document.getElementById("items-list");
  itemsList.innerHTML = "";
  let totalPrice = 0;
  order.items.forEach((item) => {
    const shoe = item.shoe;
    totalPrice += shoe.price;
    const genderImgDirectory =
      shoe.gender == "men" ? "men-items" : "women-items";
    const itemDiv = document.createElement("div");
    itemDiv.classList.add("row", "mb-8");
    itemDiv.innerHTML = `
                 <div class="d-flex flex-column flex-lg-row align-items-center justify-content-between text-center border-bottom">
  <!-- Image Section -->
  <div class="d-flex align-items-center justify-content-center bg-light-light" style="height: 288px; width: 100px;">
    <img
      class="img-fluid"
      style="object-fit: cover; max-height: 100%;"
      src="./images/${genderImgDirectory}/${shoe.name}.png"
      alt=""
    />
  </div>

  <!-- Shoe Name Section -->
  <div class="flex-grow-1 mb-6 mb-lg-0">
    <p class="mb-6 fw-bold">Shoe Name</p>
    <p class="mb-0 text-secondary">${shoe.name}</p>
  </div>

  <!-- Shipping Information Section -->
  <div class="flex-grow-1 mb-6 mb-lg-0">
     <p class="mb-6 fw-bold">Shippment Status</p>
    <p class="mb-0 text-secondary">${shoe.status}</p>
  </div>

  <!-- Payment Information Section -->
  <div class="flex-grow-1 mb-6 mb-lg-0">
    <p class="mb-6 fw-bold">Payment Info</p>
    <p class="mb-0 text-secondary">Visa</p>
  </div>

  <!-- Price Section -->
  <div class="mt-4 mt-lg-0">
    <span class="h5">$${shoe.price}</span>
  </div>
</div>


    `;

    itemsList.append(itemDiv);
  });

  document.getElementById("order-total-price").textContent = `$${totalPrice}`;
}
