const User = require("../models/User");
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const key = "Some super secret key";

exports.createUser = async (req, res) => {
  const { username, password, country, experience, age, education } = req.body;
  try {
    // Basic validation
    if (!username || !password || !country || !experience || !age || !education) {
      console.log("Validation failed: Missing fields");
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 8) {
      console.log("Validation failed: Password too short");
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters" });
    }

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

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.send(users);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Get user by id
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
// Get user by name
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

// Update a user (PUT)
exports.updateUser = async (req, res) => {
  const { username, password, country, experience, age, education  } = req.body;
  try {
    const test = await User.findById(req.params.id);
    if (!test) {
      console.log("id is wrong");
      return res.status(404).send();
    }
    const token = req.headers.authorization.split(" ")[1];
    const data = jwt.verify(token, key);
    if (data.username !== test.username) {
      console.log("user is wrong");
      return res.status(403).send("Forbidden");
    }
    if (
      req.body._id !== test._id ||
      req.body._id !== new String(test._id).valueOf()
    ) {
      console.log(req.body._id);
      console.log(new String(test._id).valueOf());
      return res.status(400).send({ message: "Cannot change _id" });
    }
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

// Update a user
exports.partialUpdateUser = async (req, res) => {
  try {
    const test = await User.findById(req.params.id);
    if (!test) {
      return res.status(404).send();
    }

    const token = req.headers.authorization.split(" ")[1];
    const data = jwt.verify(token, key);
    if (data.username !== test.username) {
      return res.status(403).send("Forbidden");
    }
    
    if (req.body.username && req.body.username !== test.username) {
      return res.status(400).send({ message: "Cannot change username" });
    }

    if (req.body.password) {
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

    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.send(user);
  } catch (error) {
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
    const token = req.headers.authorization.split(" ")[1];
    const data = jwt.verify(token, key);
    if (data.username !== test.username) {
      return res.status(403).send("Forbidden");
    }

    // Delete the user
    await User.findByIdAndDelete(req.params.id);
    res.status(204).send("User deleted");
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};