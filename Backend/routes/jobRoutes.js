const express = require("express");
const { searchJobs } = require("../controllers/jobsController");

const router = express.Router();

router.get("/search-jobs", searchJobs);

module.exports = router;
