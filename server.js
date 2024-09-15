const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const shoeRoutes = require('./routes/shoeRoutes');

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api', shoeRoutes);

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
