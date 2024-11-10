const API_URL = "http://localhost:5001/api";

document.addEventListener("DOMContentLoaded", async function () {
  const orders = await fatchAllOrders();
  const currentPath = window.location.pathname;

  if (currentPath.endsWith("/thanksForOrder.html")) {
    const lastorder = orders[0];
    loadOrderPager(lastorder);
  } else if (currentPath.endsWith("/myOrders.html")) {
    loadOrdersList(orders);
  } else if (currentPath.includes("orderInformation.html")) {
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get("orderId");
    console.log(orderId);
    const order = await fatchOrder(orderId);
    loadOrderPager(order);
  }
});

async function fatchAllOrders() {
  const userData = JSON.parse(localStorage.getItem("user"));
  try {
    const response = await fetch(`${API_URL}/orders/user/${userData._id}`);
    const orders = await response.json();
    return orders;
  } catch (error) {
    console.error("Error fetching order:", error);
  }
}

async function fatchOrder(orderId) {
  const userData = JSON.parse(localStorage.getItem("user"));
  try {
    const response = await fetch(
      `${API_URL}/orders/user/${userData._id}?orderId=${orderId}`
    );
    const order = await response.json();
    console.log(order);
    return order[0];
  } catch (error) {
    console.error("Error fetching order:", error);
  }
}

async function loadOrderPager(order) {
  document.getElementById("order-id").textContent = order._id;
  document.getElementById("order-created-at").textContent = order.createdAt;

  const itemsList = document.getElementById("items-list");
  itemsList.innerHTML = "";
  let totalPrice = 0;
  order.items.forEach((item) => {
    const shoe = item.shoe;
    const shoeFinalPrice = shoe.salePrice ? shoe.salePrice : shoe.price;
    totalPrice += shoeFinalPrice;
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
    <span class="h5" style="color:${
      shoeFinalPrice < shoe.price ? "red" : "black"
    };">$${shoe.salePrice ? shoe.salePrice : shoe.price}</span>
  </div>
</div>


    `;

    itemsList.append(itemDiv);
  });
  document.getElementById("order-total-price").textContent = `$${totalPrice}`;
}

async function loadOrdersList(orders) {
  const ordersTableBody = document.getElementById("orders-table-body");

  ordersTableBody.innerHTML = "";

  orders.forEach((order) => {
    const orderTr = document.createElement("tr");
    orderTr.innerHTML = `
     <td class="text-center" id="order-id">${order._id}</td>
                    <td class="text-center" id="status">${order.status}</td>
                    <td class="text-center" id="date">${order.createdAt}</td>
                    <td class="text-center" id="num-items">${order.items.length}</td>
                    <td class="text-right" id="total-sum">$${order.total}</td>
                    <td class="text-center">
                      <a
                        class="btn btn-outline-secondary"
                        title=""
                        data-toggle="tooltip"
                        href="orderInformation.html?orderId=${order._id}"
                        data-original-title="View"
                        ><i class="fa fa-eye"></i
                      ></a>
                    </td>
    `;

    ordersTableBody.append(orderTr);
  });
}
