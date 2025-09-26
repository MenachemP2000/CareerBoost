const express = require('express');
const router = express.Router();
const { predictSalary, recommendSkills } = require("../controllers/modelController");

// Route: POST /model/predict
// Calls the predictSalary controller to get a salary prediction
router.post("/predict", predictSalary);

// Route: POST /model/recommend
// Calls the recommendSkills controller to get skill recommendations
router.post("/recommend", recommendSkills);

// Export the router so it can be mounted in app.js (e.g., app.use("/model", router))
module.exports = router;
