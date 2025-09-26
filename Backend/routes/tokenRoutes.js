const express = require('express');
const router = express.Router();
const tokenController = require('../controllers/tokenController');

// Route: POST /token
// Calls the processLogin controller to handle user login and return a JWT token
router.post('', tokenController.processLogin);

// Export the router so it can be mounted in app.js (e.g., app.use("/token", router))
module.exports = router;
