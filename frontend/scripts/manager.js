async function deleteUser(userId) {
  try {
    const response = await fetch(`http://localhost:5001/api/users/${userId}`, {
      method: "DELETE",
    });
    if (response.ok) {
      alert("User deleted successfully!");
      fetchUserList(); // Refresh the user list after deletion
    } else {
      alert("Failed to delete user.");
    }
  } catch (error) {
    console.error("Error deleting user:", error);
  }
}

async function editUser(userId) {
  const newName = prompt("Enter the new name:");
  const newEmail = prompt("Enter the new email:");
  if (newName && newEmail) {
    try {
      const response = await fetch(
        `http://localhost:5001/api/users/${userId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: newName, email: newEmail }),
        }
      );
      if (response.ok) {
        alert("User updated successfully!");
        fetchUserList(); // Refresh the user list after update
      } else {
        alert("Failed to update user.");
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const userManagementTab = document.getElementById("user-management-tab");
  const reportsTab = document.getElementById("reports-tab");
  const ordersTab = document.getElementById("orders-tab");
  const addShoeTab = document.getElementById("add-shoe-tab");
  const content = document.getElementById("content");
  const intro = document.getElementById("management-intro");
  const webServiceTab = document.getElementById("web-service-tab");
  const twitterTab = document.getElementById("twitter-tab");

  // Event listeners for tabs
  userManagementTab.addEventListener("click", function () {
    setActiveTab(this);
    loadUserManagement();
  });

  reportsTab.addEventListener("click", function () {
    setActiveTab(this);
    loadReports();
  });

  ordersTab.addEventListener("click", function () {
    setActiveTab(this);
    loadOrders();
  });

  addShoeTab.addEventListener("click", function () {
    setActiveTab(this);
    loadAddShoe();
  });

  webServiceTab.addEventListener("click", function () {
    setActiveTab(this);
    loadStockPrices();
  });

  twitterTab.addEventListener("click", function () {
    setActiveTab(this);
    loadTweets();
  });

  // Function to set active tab and hide intro message
  function setActiveTab(selectedTab) {
    document
      .querySelectorAll(".nav-link")
      .forEach((tab) => tab.classList.remove("active"));
    selectedTab.classList.add("active");

    if (intro) {
      intro.style.display = "none";
    }
  }

  function loadUserManagement() {
    content.innerHTML = `
        <h3>User Management</h3>
        <div id="userList"></div>`;
    fetchUserList();
  }

  function loadReports() {
    content.innerHTML = `
            <div class="reports-page">
                <h3>Reports</h3>
                <div class="chart-block">
                    <h2>Users Chart</h2>
                    <p>Shows how many new users registered each month.</p>
                    <div id="bar-chart"></div>
                </div>
                <div class="chart-block">
                    <h2>Orders Chart</h2>
                    <p>Displays the cumulative number of orders from the first in the store.</p>
                    <div id="line-chart"></div>
                </div>
            </div>`;
    loadCharts();
  }
  async function loadOrders() {
    const response = await fetch("http://localhost:5001/api/orders/getall");
    const orders = await response.json();
    console.log(orders);

    content.innerHTML = `
        <div class="page">
            <div class="order-history">
                <div>
                    <div id="content" class="col-sm-12">
                        <h4 class="text-uppercase p-3">Order History</h4>
                        <div class="table-responsive order-table">
                            <table class="table table-borderless table-hover">
                                <thead class="border-bottom">
                                    <tr>
                                        <td class="text-center">Order ID</td>
                                        <td class="text-center">user</td>
                                        <td class="text-center">Date Added</td>
                                        <td class="text-center">Number Of Items</td>
                                        <td class="text-right">Total</td>
                                        <td></td>
                                    </tr>
                                </thead>
                                <tbody id="orders-table-body">
                                    ${orders
                                      .map(
                                        (order) => `
                                        <tr>
                                            <td class="text-center">${order._id}</td>
                                            <td class="text-center">${order.user.name}</td>
                                            <td class="text-center">${order.createdAt}</td>
                                            <td class="text-center">${order.items.length}</td>
                                            <td class="text-right">$${order.total}</td>
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
                                        </tr>
                                    `
                                      )
                                      .join("")}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
  }

  function loadAddShoe() {
    content.innerHTML = `
        <h3>Add New Shoe</h3>
        <form id="addShoeForm">
         <div class="mb-3">
           <label for="shoeName" class="form-label">Shoe Name</label>
           <input type="text" class="form-control" id="shoeName" required>
         </div>
         <div class="mb-3">
           <label for="brand" class="form-label">Brand</label>
           <input type="text" class="form-control" id="brand" required>
         </div>
         <div class="mb-3">
           <label for="availableSizes" class="form-label">Available Sizes (comma-separated)</label>
           <input type="text" class="form-control" id="availableSizes" required>
         </div>
         <div class="mb-3">
           <label for="inStockSizes" class="form-label">In Stock Sizes (comma-separated)</label>
           <input type="text" class="form-control" id="inStockSizes" required>
         </div>
         <div class="mb-3">
           <label for="price" class="form-label">Price</label>
           <input type="number" class="form-control" id="price" required>
         </div>
         <div class="mb-3">
           <label for="salePrice" class="form-label">Sale Price (optional)</label>
           <input type="number" class="form-control" id="salePrice">
         </div>
         <div class="mb-3">
           <label for="gender" class="form-label">Gender</label>
           <select class="form-select" id="gender" required>
             <option value="Men">Men</option>
             <option value="Women">Women</option>
             <option value="Unisex">Unisex</option>
           </select>
          </div>
          <div class="mb-3">
            <label for="fullFilePath" class="form-label">Full File Path (optional)</label>
            <input type="text" class="form-control" id="fullFilePath" placeholder="C:/path/to/image.png">
          </div>
          <div class="mb-3">
            <label for="shoeImage" class="form-label">Shoe Image</label>
            <input type="file" class="form-control" id="shoeImage" required>
          </div>
          <button type="submit" class="btn btn-primary">Add Shoe</button>
         </form>`;
    document
      .getElementById("addShoeForm")
      .addEventListener("submit", handleAddShoe);
  }

  async function fetchUserList() {
    try {
      const response = await fetch("http://localhost:5001/api/users");
      const users = await response.json();
      const userList = document.getElementById("userList");
      userList.innerHTML = users
        .map(
          (user) => `
            <div class="user-item mb-3 p-3 border rounded">
              <p><strong>${user.name}</strong> - ${user.email}</p>
              <div>
                <button class="btn btn-danger me-2" onclick="deleteUser('${user._id}')">Delete</button>
                <button class="btn btn-primary" onclick="editUser('${user._id}')">Edit</button>
              </div>
            </div>
          `
        )
        .join("");
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }

  async function handleAddShoe(event) {
    event.preventDefault();
    const name = document.getElementById("shoeName").value;
    const brand = document.getElementById("brand").value.toLowerCase();
    const availableSizes = document
      .getElementById("availableSizes")
      .value.split(",")
      .map(Number);
    const inStockSizes = document
      .getElementById("inStockSizes")
      .value.split(",")
      .map(Number);
    const price = document.getElementById("price").value;
    const salePrice = document.getElementById("salePrice").value;
    const gender = document.getElementById("gender").value.toLowerCase();
    const imageFile = document.getElementById("shoeImage").files[0];
    const fullFilePath = document.getElementById("fullFilePath").value || null;
    const genderImgDirectory = gender == "men" ? "men-items" : "women-items";
    const imageFolder = `./images/${genderImgDirectory}/`;

    const payload = {
      name,
      brand,
      availableSizes,
      inStockSizes,
      price,
      salePrice,
      gender,
      fullFilePath,
      imageNewPath: `${imageFolder}${imageFile.name}`,
    };
    try {
      const response = await fetch("http://localhost:5001/api/shoes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Shoe added successfully!");
      } else {
        alert("Failed to add shoe.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async function loadCharts() {
    console.log("Rendering charts...");
    const usersResponse = await fetch(
      "http://localhost:5001/api/users/reports"
    );
    let usersData = await usersResponse.json();
    console.log({ usersData });
    const ordersResponse = await fetch(
      "http://localhost:5001/api/orders/reports"
    );
    let ordersData = await ordersResponse.json();
    console.log({ ordersData });
    createBarChart("#bar-chart", usersData, "Users Chart");
    createLinearChart("#line-chart", ordersData, "Orders Chart");
    console.log("Charts rendered successfully");
  }

  function createBarChart(container, data, title) {
    const chartWidth = document.querySelector(container).offsetWidth;
    const chartHeight = 300;
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };

    const svg = d3
      .select(container)
      .append("svg")
      .attr("width", chartWidth)
      .attr("height", chartHeight);

    const xScale = d3
      .scaleBand()
      .domain(data.map((d) => `${d._id.year}-${d._id.month}`))
      .range([margin.left, chartWidth - margin.right])
      .padding(0.1);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.count)])
      .nice()
      .range([chartHeight - margin.bottom, margin.top]);

    svg
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => xScale(`${d._id.year}-${d._id.month}`))
      .attr("y", (d) => yScale(d.count))
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => chartHeight - margin.bottom - yScale(d.count))
      .attr("fill", "steelblue");

    svg
      .append("g")
      .attr("transform", `translate(0,${chartHeight - margin.bottom})`)
      .call(d3.axisBottom(xScale));

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale));
  }

  function createLinearChart(container, data, title) {
    const chartWidth = document.querySelector(container).offsetWidth;
    const chartHeight = 300;
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };

    const svg = d3
      .select(container)
      .append("svg")
      .attr("width", chartWidth)
      .attr("height", chartHeight);

    const xScale = d3
      .scalePoint()
      .domain(data.map((d) => `${d._id.year}-${d._id.month}`))
      .range([margin.left, chartWidth - margin.right]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.cumulativeOrders)])
      .nice()
      .range([chartHeight - margin.bottom, margin.top]);

    const line = d3
      .line()
      .x((d) => xScale(`${d._id.year}-${d._id.month}`))
      .y((d) => yScale(d.cumulativeOrders));

    svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2)
      .attr("d", line);

    svg
      .append("g")
      .attr("transform", `translate(0,${chartHeight - margin.bottom})`)
      .call(d3.axisBottom(xScale));

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale));
  }

  function loadStockPrices() {
    content.innerHTML = `
        <h3>Shoe Brand & Retailer Stock Prices</h3>
        <p>Latest stock prices for popular shoe brands and retailers:</p>
        <table class="table table-striped" id="stock-table">
            <thead>
                <tr>
                    <th>Brand</th>
                    <th>Stock Symbol</th>
                    <th>Current Price</th>
                    <th>Change (%)</th>
                </tr>
            </thead>
            <tbody id="stock-data"></tbody>
        </table>`;

    fetchStockPrices();
  }
  async function fetchStockPrices() {
    const stockDataDiv = document.getElementById("stock-data");

    const symbols = [
      { name: "Adidas", symbol: "ADDYY" },
      { name: "Nike", symbol: "NKE" },
      { name: "Puma", symbol: "PUMSY" },
      { name: "Skechers", symbol: "SKX" },
      { name: "Under Armour", symbol: "UAA" },
      { name: "Foot Locker", symbol: "FL" },
      { name: "JD Sports", symbol: "JDSPY" },
    ];

    stockDataDiv.innerHTML =
      "<tr><td colspan='4'>Loading stock data...</td></tr>";

    try {
      const response = await fetch(
        "http://localhost:5001/api/services/stock-prices"
      );
      const stockData = await response.json();
      console.log({ stockData });

      // Create a mapping of stock data by symbol
      const stockMap = stockData.reduce((map, data) => {
        map[data.symbol] = data;
        return map;
      }, {});
      stockDataDiv.innerHTML = symbols
        .map(({ name, symbol }) => {
          const data = stockMap[symbol];
          if (!data) {
            return `<tr><td colspan="4">Data unavailable for ${name}</td></tr>`;
          }
          const color = data.direction === "up" ? "green" : "red";
          const sign = data.direction === "up" ? "+" : "";
          return `
                    <tr>
                        <td>${name}</td>
                        <td>${symbol}</td>
                        <td>$${data.latestPrice}</td>
                        <td style="color: ${color};">${sign}${data.percentChange}%</td>
                    </tr>`;
        })
        .join("");
    } catch (error) {
      stockDataDiv.innerHTML =
        "<tr><td colspan='4'>Error fetching stock data.</td></tr>";
      console.error("Error fetching stock prices:", error);
    }
  }

  function loadTweets() {
    content.innerHTML = `
            <h3>Latest Updates from @SneakerNews</h3>
            <p><strong>@SneakerNews</strong> is a premier source for all things sneakers, providing real-time updates on the latest releases, exclusive previews, trending styles, and must-have deals in the sneaker world. Stay informed on what’s hot and upcoming in sneaker culture.</p>
            <p>Follow along to catch the first look at new collections from top brands like Nike, Adidas, and more.</p>
            <div id="tweet-data"></div>
        `;
    fetchTweets();
  }

  async function fetchTweets() {
    const tweetDataDiv = document.getElementById("tweet-data");
    tweetDataDiv.innerHTML = "Loading tweets...";
    try {
      const response = await fetch(
        `http://localhost:5001/api/services/tweets/getRecent`
      );
      const data = await response.json();

      function makeLinksClickable(text) {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        return text.replace(
          urlRegex,
          (url) => `<a href="${url}" target="_blank">${url}</a>`
        );
      }

      tweetDataDiv.innerHTML = data.recentTweets
        .map(
          (tweet) => `
              <div class="tweet-card">
                <p>${makeLinksClickable(tweet)}</p>
            </div>
            `
        )
        .join("");
    } catch (error) {
      console.error("Error fetching tweets:", error);
      tweetDataDiv.innerHTML = "Error fetching tweets.";
    }
  }
});
