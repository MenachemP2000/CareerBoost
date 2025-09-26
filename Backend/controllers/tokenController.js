// Import JWT library for signing/verifying tokens
const jwt = require("jsonwebtoken");

// Secret key used to sign JWT tokens
const key = "Some super secret key";

// Import User model
const User = require("../models/User");

// ------------------------------------------------------
// Middleware: isLoggedIn
// Verifies that the request has a valid JWT token
// ------------------------------------------------------
exports.isLoggedIn = (req, res, next) => {
  // Check if the request has an Authorization header
  if (req.headers.authorization) {
    // Expected format: "Bearer <token>" → split by space and take second part
    const token = req.headers.authorization.split(" ")[1];
    try {
      // Verify the token with the secret key
      const data = jwt.verify(token, key);

      // (Optional) attach decoded token data to request for later use
      req.user = data;

      console.log("Valid token:", req.headers.authorization);
      return next(); // allow request to continue
    } catch (err) {
      // Invalid token → reject with 401 Unauthorized
      console.log("Invalid token:", req.headers.authorization);
      return res.status(401).send("Invalid Token");
    }
  } else {
    // No token provided → reject with 403 Forbidden
    console.log("Missing token:", req.headers.authorization);
    return res.status(403).send("Token required");
  }
};

// ------------------------------------------------------
// Controller: processLogin
// Handles login requests (username + password)
// ------------------------------------------------------
exports.processLogin = async (req, res) => {
  let user = false;

  try {
    // Look up user in database by username
    user = await User.findOne({ username: req.body.username });

    // If user not found
    if (!user) {
      return res.status(404).send("Invalid username");
    }
  } catch (error) {
    // Database error
    return res.status(500).send({ error: "Internal Server Error" });
  }

  if (user) {
    // Simple password check
    if (user.password !== req.body.password) {
      return res.status(404).send("Invalid password");
    } else {
      // Build payload for the token
      const data = { username: req.body.username };

      // Generate JWT token
      const token = jwt.sign(data, key);

      // Return token to client (browser/app will store it and send in headers)
      return res.status(201).json({ token });
    }
  }
};
