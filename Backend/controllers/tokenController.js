const jwt = require("jsonwebtoken");      // Import the JSON Web Token library
const key = "Some super secret key"; // Secret key used to sign and verify JWTs
const User = require("../models/User");  // Import the User model to interact with

// Ensure that the user sent a valid token
exports.isLoggedIn = (req, res, next) => {
  // Check if the request has an authorization header
  if (req.headers.authorization) {
    // Extract the token from that header
    const token = req.headers.authorization.split(" ")[1];
    try {
      // Verify the token is valid
      const data = jwt.verify(token, key);
      // Log the token for debugging
      console.log(req.headers.authorization);
      // If valid, continue to the next middleware or route
      return next();
    } catch (err) {
      // Log the token if invalid and return 401
      console.log(req.headers.authorization);
      return res.status(401).send("Invalid Token");
    }
  } else {
    // Log missing token info and return 403
    console.log(req.headers.authorization);
    return res.status(403).send("Token required");
  }
};

// Handle login form submission and issue a token
exports.processLogin = async (req, res) => {
  // Check credentials
  let user = false;
  try {
    // Try to find a user with the given username
    user = await User.findOne({ username: req.body.username });
    if (!user) {
      // If no user is found, send a 404 error
      return res.status(404).send("Invalid username");
    }
  } catch (error) {
    // If database error occurs, send 500
    return res.status(500).send({ error: "Internal Server Error" });
  }
  if (user) {
    // Check if the provided password matches the stored password
    if (user.password !== req.body.password) {
      // Incorrect password. The user should try again.
      return res.status(404).send("Invalid password");
    } else {
      const data = { username: req.body.username };
      // Generate the token.
      const token = jwt.sign(data, key);
      // Return the token to the browser
      return res.status(201).json({ token });
    }
  }
};
