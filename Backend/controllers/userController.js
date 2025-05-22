const User = require("../models/User");  // Import the User model (MongoDB schema)
const jwt = require("jsonwebtoken");     // Import JWT for authentication and authorization
const key = "Some super secret key"; // Secret key for signing/verifying tokens (should be in env file in production)

// Create a new user
exports.createUser = async (req, res) => {
  const { username, password, country, experience, age, education } = req.body;
  try {
    // Basic validation: Ensure all required fields are present
    if (!username || !password || !country || !experience || !age || !education) {
      console.log("Validation failed: Missing fields");
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validation: Password length must be 8+ characters
    if (password.length < 8) {
      console.log("Validation failed: Password too short");
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters" });
    }

    // Validation: Password must contain both letters and numbers
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    if (!hasLetter || !hasNumber) {
      console.log(
        "Validation failed: Password does not contain both letters and numbers"
      );
      return res
        .status(400)
        .json({ message: "Password must contain both letters and numbers" });
    }

    // Check if the username is already taken
    const existingUser = await User.findOne({ username: username });
    if (existingUser) {
      console.log("Validation failed: Username already taken");
      return res.status(409).json({ message: "Username already taken" });
    }

    // Default salary (to be updated later)
    const predictedSalary = 0;

    // Create and save the new user
    const newUser = new User({
      username,
      password,
      country,
      experience,
      age,
      education,
      predictedSalary
    });

    await newUser.save();
    console.log("new user has been created" + newUser.username);
    res.status(201).send(newUser);
  } catch (error) {
    res.status(400).send({ message: "An error occurred", error });
  }
};

// Get all users (excluding password field)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.send(users);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Get user by id (excluding password)
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Get user by username (excluding password)
exports.getUserByUserName = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select(
      "-password"
    );
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.send(user);
  } catch (error) {
    res.status(500).send({ error: "Internal Server Error" });
  }
};

// Fully update a user (PUT)
exports.updateUser = async (req, res) => {
  const { username, password, country, experience, age, education  } = req.body;
  try {
    // Find user by ID
    const test = await User.findById(req.params.id);
    if (!test) {
      console.log("id is wrong");
      return res.status(404).send();
    }

    // Verify token and ensure the token's username matches the target user
    const token = req.headers.authorization.split(" ")[1];
    const data = jwt.verify(token, key);
    if (data.username !== test.username) {
      console.log("user is wrong");
      return res.status(403).send("Forbidden");
    }

    // Prevent changing _id
    if (
      req.body._id !== test._id ||
      req.body._id !== new String(test._id).valueOf()
    ) {
      console.log(req.body._id);
      console.log(new String(test._id).valueOf());
      return res.status(400).send({ message: "Cannot change _id" });
    }

    // Validate all fields again
    if (!username || !password || !country || !experience || !age || !education) {
      console.log("empty fields");
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 8) {
      console.log("password length is wrong");
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters" });
    }

    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    if (!hasLetter || !hasNumber) {
      console.log("empty");
      return res
        .status(400)
        .json({ message: "Password must contain both letters and numbers" });
    }

    // Perform the update
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    console.log("no problem...");
    res.send(user);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

// Partially update a user (PATCH)
exports.partialUpdateUser = async (req, res) => {
  try {
    // Find the user by ID
    const test = await User.findById(req.params.id);
    if (!test) {
      return res.status(404).send();
    }

    // Extract and verify the JWT token from the Authorization heade
    const token = req.headers.authorization.split(" ")[1];
    const data = jwt.verify(token, key);

    // Only allow the logged-in user to update their own information
    if (data.username !== test.username) {
      return res.status(403).send("Forbidden");
    }

    // If password is being updated, validate i
    if (req.body.password) {
      const { password } = req.body;
      if (password.length < 8) {
        return res
          .status(400)
          .json({ message: "Password must be at least 8 characters" });
      }
      const hasLetter = /[a-zA-Z]/.test(password);
      const hasNumber = /[0-9]/.test(password);
      if (!hasLetter || !hasNumber) {
        return res
          .status(400)
          .json({ message: "Password must contain both letters and numbers" });
      }
    }

    // Log the update payload for debugging
    console.log(req.body);

    // Apply the partial update (only update provided fields)
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    // Send the updated user back to the client
    res.send(user);
  } catch (error) {
    // Send error if anything goes wrong
    res.status(400).send(error);
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  try {
    const test = await User.findById(req.params.id);
    if (!test) {
      return res.status(404).send();
    }

    // Verify identity with JWT
    const token = req.headers.authorization.split(" ")[1];
    const data = jwt.verify(token, key);
    if (data.username !== test.username) {
      return res.status(403).send("Forbidden");
    }

    // Delete the user from database
    await User.findByIdAndDelete(req.params.id);
    res.status(204).send("User deleted");
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};