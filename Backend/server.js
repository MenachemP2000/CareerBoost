const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Middleware for cross-origin requests
const fileUpload = require('express-fileupload');
const path = require('path');

const app = express();
const port = process.env.PORT || 4001;
const mongodbUri = process.env.MONGODB_URI || "mongodb://localhost:27017/careerboost";

// Background scripts (scheduled jobs, etc.)
require("./exchangeRates");       // Updates exchange rates JSON
require("./generateFlagsJson");   // Generates currency flags JSON
require("./sendJobAlerts");       // Sends daily/weekly job alert emails

// ============================
// Middleware setup
// ============================

// Increase payload size (useful for file uploads, large JSON)
app.use(express.json({ limit: '1000mb' }));
app.use(express.urlencoded({ limit: '1000mb', extended: true }));

// Exit if no MongoDB URI is configured
if (!mongodbUri) {
  console.error('MONGODB_URI is not defined');
  process.exit(1);
}

// Parse incoming JSON
app.use(express.json());

// Allow cross-origin requests (all origins)
app.use(cors());

// File upload support
app.use(fileUpload());

// Serve static files for images
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// ============================
// MongoDB connection
// ============================
mongoose.connect(mongodbUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// ============================
// Routes
// ============================
const userRoutes = require('./routes/userRoutes');       // User CRUD & profile
const tokenRoutes = require('./routes/tokenRoutes');     // Login / JWT
const modelRoutes = require('./routes/modelRoutes');     // Salary prediction & recommendations
const exchangeRoutes = require('./routes/exchangeRoutes'); // Exchange rates & flags
const jobRoutes = require('./routes/jobRoutes');         // Job search

// Prefix API routes
app.use('/api/users', userRoutes);
app.use('/api/tokens', tokenRoutes);
app.use('/api/model', modelRoutes);
app.use('/api/exchange', exchangeRoutes);
app.use('/api/jobs', jobRoutes);

// ============================
// React frontend serving
// ============================

// Serve React build folder
app.use(express.static(path.join(__dirname, '../Frontend/build')));

// For any other route, return index.html (SPA catch-all)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../Frontend/build', 'index.html'));
});

// ============================
// Start server
// ============================
app.listen(port, () => {
  console.log(`Server is running on localhost:${port}`);
});
