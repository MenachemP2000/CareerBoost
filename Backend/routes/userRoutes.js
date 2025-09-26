const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const tokenController = require('../controllers/tokenController');

// ==============================
// User CRUD Routes
// ==============================

// Create a new user (no auth required)
router.post('', userController.createUser);

// Get all users (could be restricted if needed)
router.get('', userController.getAllUsers);

// Get a user by ID (e.g., /users/123)
router.get('/:id', userController.getUser);

// Get a user by username (e.g., /users/username/john)
router.get('/username/:username', userController.getUserByUserName);

// ==============================
// Protected Routes (require JWT auth)
// ==============================

// Update a user completely (PUT replaces all fields)
// Must be logged in → tokenController.isLoggedIn middleware
router.put('/:id', tokenController.isLoggedIn, userController.updateUser);

// Partially update a user (PATCH updates only given fields)
// Must be logged in
router.patch('/:id', tokenController.isLoggedIn, userController.partialUpdateUser);

// Delete a user by ID
// Must be logged in
router.delete('/:id', tokenController.isLoggedIn, userController.deleteUser);

// Export the router so it can be mounted in app.js (e.g., app.use("/users", router))
module.exports = router;
