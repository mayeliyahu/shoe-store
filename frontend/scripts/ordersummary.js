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
                    <div class="col-12 col-lg-2 mb-8 mb-lg-0">
                  <div
                    class="d-flex align-items-center justify-content-center h-72 bg-light-light"
                    style="height: 288px"
                  >
                    <img
                      class="img-fluid"
                      style="object-fit: cover"
                      src="./images/${genderImgDirectory}/${shoe.name}.png"
                      alt=""
                    />
                  </div>
                </div>
                <div class="col-12 col-lg-10">
                  <div class="d-flex mb-8 mb-md-16">
                    <div class="me-auto">
                      <h3 class="lead fw-bold">${shoe.name}</h3>
                    </div>
                    <span class="h5">$${shoe.price}</span>
                  </div>
                  <div class="row g-4">
                    <div class="col-12 col-lg-auto me-md-10 mb-6 mb-lg-0 me-5">
                      <p class="mb-6 fw-bold">Delivery Address</p>
                      <p class="mb-0 text-secondary">Morgan S Hembree</p>
                      <p class="mb-0 text-secondary">4767 Woodland Terrace</p>
                      <p class="mb-0 text-secondary">California, CA 95821</p>
                    </div>
                    <div class="col-12 col-lg-auto me-md-10 mb-6 mb-lg-0 me-5">
                      <p class="mb-6 fw-bold">Shipping Informations</p>
                      <p class="mb-0 text-secondary">morgan@shuffleux.com</p>
                      <p class="mb-0 text-secondary">916-971-2145</p>
                    </div>
                    <div class="col-12 col-lg-auto me-5">
                      <p class="mb-6 fw-bold">Payment Informations</p>
                      <p class="mb-0 text-secondary">Mastercard</p>
                      <p class="mb-0 text-secondary">Ending with 4242</p>
                      <p class="mb-0 text-secondary">Expires 02 / 28</p>
                    </div>
                  </div>
                </div>
    `;

    itemsList.append(itemDiv);
  });

  document.getElementById("order-total-price").textContent = `$${totalPrice}`;
}
