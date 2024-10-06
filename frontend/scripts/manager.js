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

function clearContainer(container) {
    d3.select(container).selectAll("*").remove(); // Clear any existing content
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
        <div id="userList"></div>
      `;
        fetchUserList();
    }

    function loadReports() {
        content.innerHTML = `
        <h3>Reports</h3>
        <div id="orders-chart"></div>
        <div id="users-chart"></div>
      `;
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
        let imageFolder = `images/${gender.toLowerCase()}-items/`;
        if (salePrice) {
            imageFolder = 'images/sale-items/';
        }
        const formData = new FormData();
        formData.append('name', name);
        formData.append('brand', brand);
        formData.append('availableSizes', availableSizes);
        formData.append('inStockSizes', inStockSizes);
        formData.append('price', price);
        formData.append('salePrice', salePrice || null);
        formData.append('gender', gender);
        formData.append('imageUploadPath', imageFile.name); // User's local filename
        formData.append('imagePath', `images/${gender.toLowerCase()}-items/${imageFile.name}`); // Path on the server

        try {
            const response = await fetch("http://localhost:5001/api/shoes", {
                method: "POST",
                body: formData
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
        try {
            const ordersResponse = await fetch("http://localhost:5001/api/orders/reports");
            const ordersData = await ordersResponse.json();
            console.log("Orders Data:", ordersData); // Log the data to check the structure
            
            const usersResponse = await fetch("http://localhost:5001/api/users/reports");
            const usersData = await usersResponse.json();
            console.log("Users Data:", usersData); // Log the data to check the structure
        
            if (Array.isArray(ordersData) && Array.isArray(usersData)) {
                console.log("Creating charts...");
                createLinearChart("#orders-chart", ordersData, "Orders Over Time");
                createBarChart("#users-chart", usersData, "New Users Over Time");
            } else {
                console.error("Data is not an array. Cannot create charts.");
            }
        } catch (error) {
            console.error("Error loading reports:", error);
        }
    }
    
    function createLinearChart(container, data, title) {
        d3.select(container).selectAll("*").remove();
        const svgWidth = 400, svgHeight = 300, padding = 40;
        const svg = d3.select(container).append("svg")
            .attr("width", svgWidth)
            .attr("height", svgHeight)
            .style("border", "1px solid black");  // Add border to visualize the SVG container

        // Format the date using year, month, and day
        const formattedData = data.map(d => ({
            date: `${d._id.year}-${d._id.month}-${d._id.day}`,
            cumulativeOrders: d.cumulativeOrders
        }));

        const xScale = d3.scalePoint()
            .domain(formattedData.map(d => d.date)) // Use formatted date
            .range([padding, svgWidth - padding]);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(formattedData, d => d.cumulativeOrders)])  // Use 'cumulativeOrders' for the y-axis
            .range([svgHeight - padding, padding]);

        // Create X axis
        svg.append("g")
            .attr("transform", `translate(0, ${svgHeight - padding})`)
            .call(d3.axisBottom(xScale).ticks(formattedData.length));

        // Create Y axis
        svg.append("g")
            .attr("transform", `translate(${padding}, 0)`)
            .call(d3.axisLeft(yScale));

        // Create line for cumulative orders
        svg.append("path")
            .datum(formattedData)
            .attr("fill", "none")
            .attr("stroke", "blue")
            .attr("stroke-width", 2)
            .attr("d", d3.line()
                .x(d => xScale(d.date))
                .y(d => yScale(d.cumulativeOrders))
            );

        // Add chart title
        svg.append("text")
            .attr("x", svgWidth / 2)
            .attr("y", padding / 2)
            .attr("text-anchor", "middle")
            .text(title);
    }
    
    function createBarChart(container, data, title) {
        d3.select(container).selectAll("*").remove();
        const svgWidth = 400, svgHeight = 300, padding = 40;
        const svg = d3.select(container).append("svg")
            .attr("width", svgWidth)
            .attr("height", svgHeight);

        // Format the date using year and month
        const formattedData = data.map(d => ({
            date: `${d._id.year}-${d._id.month}`,
            count: d.count
        }));

        const xScale = d3.scaleBand()
            .domain(formattedData.map(d => d.date)) // Use formatted date
            .range([padding, svgWidth - padding])
            .padding(0.1);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(formattedData, d => d.count)]) // Use 'count' for the y-axis
            .range([svgHeight - padding, padding]);

        // Create X axis
        svg.append("g")
            .attr("transform", `translate(0, ${svgHeight - padding})`)
            .call(d3.axisBottom(xScale));

        // Create Y axis
        svg.append("g")
            .attr("transform", `translate(${padding}, 0)`)
            .call(d3.axisLeft(yScale));

        // Create bars for new users
        svg.selectAll(".bar")
            .data(formattedData)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", d => xScale(d.date))
            .attr("y", d => yScale(d.count))
            .attr("width", xScale.bandwidth())
            .attr("height", d => svgHeight - padding - yScale(d.count))
            .attr("fill", "green");

        // Add chart title
        svg.append("text")
            .attr("x", svgWidth / 2)
            .attr("y", padding / 2)
            .attr("text-anchor", "middle")
            .text(title);
    }
    
});
