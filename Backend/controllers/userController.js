const User = require("../models/User");
const jwt = require("jsonwebtoken");

// ⚠️ Store this in .env → process.env.JWT_SECRET
const key = "Some super secret key";

// ------------------------------------------------------
// Create a new user
// ------------------------------------------------------
exports.createUser = async (req, res) => {
  const { username, password, country, experience, age, education } = req.body;
  try {
    // 1) Validation
    if (!username || !password || !country || !experience || !age || !education) {
      console.log("Validation failed: Missing fields");
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    if (!hasLetter || !hasNumber) {
      return res.status(400).json({ message: "Password must contain both letters and numbers" });
    }

    // 2) Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: "Username already taken" });
    }

    // 3) (Temporary) set predictedSalary = 0
    const predictedSalary = 0;

    // 4) Create new user
    const newUser = new User({
      username,
      password,  // ⚠️ should hash before saving
      country,
      experience,
      age,
      education,
      predictedSalary,
    });

    await newUser.save();
    console.log("New user created:", newUser.username);

    // Return user (including password right now, ⚠️ should exclude password in production)
    res.status(201).send(newUser);
  } catch (error) {
    res.status(400).send({ message: "An error occurred", error });
  }
};

// ------------------------------------------------------
// Get all users (excluding passwords)
// ------------------------------------------------------
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.send(users);
  } catch (error) {
    res.status(500).send(error);
  }
};

// ------------------------------------------------------
// Get user by ID
// ------------------------------------------------------
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).send();
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
};

// ------------------------------------------------------
// Get user by username
// ------------------------------------------------------
exports.getUserByUserName = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select("-password");
    if (!user) return res.status(404).send({ message: "User not found" });
    res.send(user);
  } catch (error) {
    res.status(500).send({ error: "Internal Server Error" });
  }
};

// ------------------------------------------------------
// Update user (full update, PUT)
// Requires valid token matching user
// ------------------------------------------------------
exports.updateUser = async (req, res) => {
  const { username, password, country, experience, age, education } = req.body;
  try {
    // Check user exists
    const test = await User.findById(req.params.id);
    if (!test) return res.status(404).send();

    // Verify token
    const token = req.headers.authorization.split(" ")[1];
    const data = jwt.verify(token, key);
    if (data.username !== test.username) {
      return res.status(403).send("Forbidden");
    }

    // Prevent changing _id
    if (req.body._id !== test._id.toString()) {
      return res.status(400).send({ message: "Cannot change _id" });
    }

    // Validate fields
    if (!username || !password || !country || !experience || !age || !education) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    if (!hasLetter || !hasNumber) {
      return res.status(400).json({ message: "Password must contain both letters and numbers" });
    }

    // Update
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
};

// ------------------------------------------------------
// Partial update (PATCH)
// ------------------------------------------------------
exports.partialUpdateUser = async (req, res) => {
  try {
    const test = await User.findById(req.params.id);
    if (!test) return res.status(404).send();

    const token = req.headers.authorization.split(" ")[1];
    const data = jwt.verify(token, key);
    if (data.username !== test.username) {
      return res.status(403).send("Forbidden");
    }

    // If password is included in update → validate it
    if (req.body.password) {
      const { password } = req.body;
      if (password.length < 8) {
        return res.status(400).json({ message: "Password must be at least 8 characters" });
      }
      const hasLetter = /[a-zA-Z]/.test(password);
      const hasNumber = /[0-9]/.test(password);
      if (!hasLetter || !hasNumber) {
        return res.status(400).json({ message: "Password must contain both letters and numbers" });
      }
    }

    // Apply partial update
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
};

// ------------------------------------------------------
// Delete user
// ------------------------------------------------------
exports.deleteUser = async (req, res) => {
  try {
    const test = await User.findById(req.params.id);
    if (!test) return res.status(404).send();

    const token = req.headers.authorization.split(" ")[1];
    const data = jwt.verify(token, key);
    if (data.username !== test.username) {
      return res.status(403).send("Forbidden");
    }

    await User.findByIdAndDelete(req.params.id);
    res.status(204).send("User deleted");
  } catch (error) {
    res.status(500).send(error);
  }
};
