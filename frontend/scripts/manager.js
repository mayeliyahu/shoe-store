async function deleteUser(userId) {
    try {
        const response = await fetch(`http://localhost:5001/api/users/${userId}`, {
            method: 'DELETE',
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
            const response = await fetch(`http://localhost:5001/api/users/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newName, email: newEmail }),
            });
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
    const addShoeTab = document.getElementById("add-shoe-tab");
    const content = document.getElementById("content");
    const intro = document.getElementById("management-intro");

    // Event listeners for tabs
    userManagementTab.addEventListener("click", function () {
        setActiveTab(this);
        loadUserManagement();
    });

    reportsTab.addEventListener("click", function () {
        setActiveTab(this);
        loadReports();
    });

    addShoeTab.addEventListener("click", function () {
        setActiveTab(this);
        loadAddShoe();
    });

    // Function to set active tab and hide intro message
    function setActiveTab(selectedTab) {
        document.querySelectorAll('.nav-link').forEach(tab => tab.classList.remove('active'));
        selectedTab.classList.add('active');

        if (intro) {
            intro.style.display = 'none';
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
        document.getElementById('addShoeForm').addEventListener('submit', handleAddShoe);
    }

    async function fetchUserList() {
        try {
            const response = await fetch("http://localhost:5001/api/users");
            const users = await response.json();
            const userList = document.getElementById("userList");
            userList.innerHTML = users.map(user => `
            <div class="user-item mb-3 p-3 border rounded">
              <p><strong>${user.name}</strong> - ${user.email}</p>
              <div>
                <button class="btn btn-danger me-2" onclick="deleteUser('${user._id}')">Delete</button>
                <button class="btn btn-primary" onclick="editUser('${user._id}')">Edit</button>
              </div>
            </div>
          `).join("");
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    }

    async function handleAddShoe(event) {
        event.preventDefault();
        const name = document.getElementById('shoeName').value;
        const brand = document.getElementById('brand').value;
        const availableSizes = document.getElementById('availableSizes').value.split(',').map(Number);
        const inStockSizes = document.getElementById('inStockSizes').value.split(',').map(Number);
        const price = document.getElementById('price').value;
        const salePrice = document.getElementById('salePrice').value;
        const gender = document.getElementById('gender').value;
        const imageFile = document.getElementById('shoeImage').files[0];
        const fullFilePath = document.getElementById('fullFilePath').value || null;
        const imageFolder = salePrice ? 'images/sale-items/' : `images/${gender.toLowerCase()}-items/`;
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
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
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
    
        // Fetch users data (commented out until backend is ready)
     
        const usersResponse = await fetch("http://localhost:5001/api/users/reports");
        let usersData = await usersResponse.json();
        console.log({usersData});
    
        // Fetch orders data (commented out until backend is ready)
        
        const ordersResponse = await fetch("http://localhost:5001/api/orders/reports");
        let ordersData = await ordersResponse.json();
        console.log({ordersData});

    
        // Static data for now (replace with fetched data once backend is ready)
        //  usersData = [
        //     { _id: { year: 2024, month: 1 }, count: 20 },
        //     { _id: { year: 2024, month: 2 }, count: 15 },
        //     { _id: { year: 2024, month: 3 }, count: 30 },
        //     { _id: { year: 2024, month: 4 }, count: 100 },
        //     { _id: { year: 2024, month: 5 }, count: 40 }
        // ];
    
        //  ordersData = [
        //     { _id: { year: 2024, month: 1 }, cumulativeOrders: 50 },
        //     { _id: { year: 2024, month: 2 }, cumulativeOrders: 120 },
        //     { _id: { year: 2024, month: 3 }, cumulativeOrders: 200 },
        //     { _id: { year: 2024, month: 4 }, cumulativeOrders: 300 },
        //     { _id: { year: 2024, month: 5 }, cumulativeOrders: 500 }
        // ];
    
        createBarChart("#bar-chart", usersData, "Users Chart");
        createLinearChart("#line-chart", ordersData, "Orders Chart");
    
        console.log("Charts rendered successfully");
    }
    

    function createBarChart(container, data, title) {
        const chartWidth = document.querySelector(container).offsetWidth;
        const chartHeight = 300;
        const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    
        const svg = d3.select(container)
            .append("svg")
            .attr("width", chartWidth)
            .attr("height", chartHeight);
    
        const xScale = d3.scaleBand()
            .domain(data.map(d => `${d._id.year}-${d._id.month}`))
            .range([margin.left, chartWidth - margin.right])
            .padding(0.1);
    
        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.count)])
            .nice()
            .range([chartHeight - margin.bottom, margin.top]);
    
        svg.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", d => xScale(`${d._id.year}-${d._id.month}`))
            .attr("y", d => yScale(d.count))
            .attr("width", xScale.bandwidth())
            .attr("height", d => chartHeight - margin.bottom - yScale(d.count))
            .attr("fill", "steelblue");
    
        svg.append("g")
            .attr("transform", `translate(0,${chartHeight - margin.bottom})`)
            .call(d3.axisBottom(xScale));
    
        svg.append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(yScale));
    }
    
    function createLinearChart(container, data, title) {
        const chartWidth = document.querySelector(container).offsetWidth;
        const chartHeight = 300;
        const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    
        const svg = d3.select(container)
            .append("svg")
            .attr("width", chartWidth)
            .attr("height", chartHeight);
    
        const xScale = d3.scalePoint()
            .domain(data.map(d => `${d._id.year}-${d._id.month}`))
            .range([margin.left, chartWidth - margin.right]);
    
        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.cumulativeOrders)])
            .nice()
            .range([chartHeight - margin.bottom, margin.top]);
    
        const line = d3.line()
            .x(d => xScale(`${d._id.year}-${d._id.month}`))
            .y(d => yScale(d.cumulativeOrders));
    
        svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 2)
            .attr("d", line);
    
        svg.append("g")
            .attr("transform", `translate(0,${chartHeight - margin.bottom})`)
            .call(d3.axisBottom(xScale));
    
        svg.append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(yScale));
    }
});
