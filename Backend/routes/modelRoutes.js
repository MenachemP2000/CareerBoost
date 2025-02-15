const express = require('express');
const router = express.Router();
const { predictSalary, recommendSkills } = require("../controllers/modelController");

router.post("/predict", predictSalary);
router.post("/recommend", recommendSkills);

module.exports = router;