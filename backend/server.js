const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const { connectDB } = require("./config/db");
const shoeRoutes = require("./routes/shoeRoutes");
const userRoutes = require("./routes/userRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const storeBranchRoutes = require("./routes/storeBranchRoutes");
const servicesRoutes = require("./routes/servicesRoutes");

// Disable SSL verification for self-signed certificates (for development only)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Set Mongoose strictQuery option to avoid deprecation warning
mongoose.set('strictQuery', false);

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use("/api/shoes", shoeRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/storeBranches", storeBranchRoutes);
app.use("/api/services", servicesRoutes);

// Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
