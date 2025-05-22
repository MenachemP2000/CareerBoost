// Import required packages
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import CORS middleware
const fileUpload = require('express-fileupload');
const path = require('path');

// Initialize the Express application
const app = express();

// Define the port to use (from environment variable or fallback to 4001)
const port = process.env.PORT || 4001;
const mongodbUri = process.env.MONGODB_URI || "mongodb://localhost:27017/careerboost";

//Import updates, flag icons and job alerts emails
require("./exchangeRates");
require("./generateFlagsJson");
require("./sendJobAlerts");

// Middleware to handle large JSON and URL-encoded request bodies (useful for file uploads or large payloads)
app.use(express.json({ limit: '1000mb' }));
app.use(express.urlencoded({ limit: '1000mb', extended: true }));

// Check if MongoDB URI is defined
if (!mongodbUri) {
  console.error('MONGODB_URI is not defined');
  process.exit(1);
}

// Use express.json middleware
app.use(express.json()); // Parse incoming JSON requests
app.use(cors()); // Allow requests from any origin (CORS policy)
app.use(fileUpload()); // Use express-fileupload middleware


// Serve static files
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Connect to MongoDB
mongoose.connect(mongodbUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Import routes files (each exports an Express router)
const userRoutes = require('./routes/userRoutes');
const tokenRoutes = require('./routes/tokenRoutes');
const modelRoutes = require('./routes/modelRoutes');
const exchangeRoutes = require('./routes/exchangeRoutes');
const jobRoutes = require('./routes/jobRoutes');

// Use imported route handlers under specific base paths
app.use('/api/users', userRoutes);
app.use('/api/tokens', tokenRoutes);
app.use('/api/model', modelRoutes);
app.use('/api/exchange', exchangeRoutes);
app.use('/api/jobs', jobRoutes);


// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../Frontend/build')));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../Frontend/build', 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on localhost:${port}`);
});
