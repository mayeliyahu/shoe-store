const express = require("express");
const bodyParser = require("body-parser");
const { connectDB } = require("./config/db");
const shoeRoutes = require("./routes/shoeRoutes");
const userRoutes = require("./routes/userRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const storeBranchRoutes = require("./routes/storeBranchRoutes");
const cors = require("cors");

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(bodyParser.json());

//use cors
app.use(cors());

// Routes
app.use("/api/shoes", shoeRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/storeBranches", storeBranchRoutes);

// Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
