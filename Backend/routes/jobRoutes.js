const express = require("express");
const { searchJobs } = require("../controllers/jobsController");

const router = express.Router();

// Route: GET /jobs/search-jobs
// Calls the searchJobs controller function to fetch job listings
router.get("/search-jobs", searchJobs);

// Export the router so it can be mounted in app.js (e.g., app.use("/jobs", router))
module.exports = router;
