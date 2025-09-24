const mongoose = require('mongoose');

// Define the User schema for MongoDB
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,   // Username is mandatory
    unique: true      // Each username must be unique
  },
  password: {
    type: String,
    required: true    // Password is mandatory
  },
  country: {
    type: String,
    required: true    // Country field is required
  },
  experience: {
    type: String,
    required: true    // User’s years of experience (currently stored as string)
  },
  age: {
    type: String,
    required: true    // User’s age (currently stored as string)
  },
  education: {
    type: String,
    required: true    // Education level is required
  },
  prediction: {
    type: String      // Salary prediction or similar
  },
  topRecommendations: {
    type: Object      // Stores top recommended actions/skills
  },
  MainBranch: {
    type: String      // Example: Dev, Data, Other main branch info
  },
  RemoteWork: {
    type: String      // User’s remote work preference
  },
  DevType: {
    type: String      // Developer type (backend, frontend, etc.)
  },
  OrgSize: {
    type: String      // Organization size
  },
  ICorPM: {
    type: String      // Individual Contributor or Project Manager
  },
  Industry: {
    type: String      // Industry user works in
  },
  YearsCode: {
    type: String      // Total years coding
  },
  YearsCodePro: {
    type: String      // Years coding professionally
  },
  JobSat: {
    type: String      // Job satisfaction
  },
  languages: {
    type: Object      // Programming languages known
  },
  employments: {
    type: Object      // Employment history or status
  },
  combined: {
    type: String      // Combined features/summary field
  },
  recommendations: {
    type: Object      // All recommendations generated for user
  },
  experiment: {
    type: Object      // Experiment data
  },
  savedRecommendations: {
    type: Object      // Saved recommendations chosen by user
  },
  recommendationsFeature: {
    type: Object      // Feature-specific recommendations
  },
  recommendationsIncrese: {
    type: Object      // Recommendations to increase salary/growth
  },
  databases: {
    type: Object      // Databases known/used
  },
  platforms: {
    type: Object      // Platforms/tools used
  },
  webframesworks: {
    type: Object      // Web frameworks known
  },
  tools: {
    type: Object      // Developer tools used
  },
  OpSys: {
    type: Object      // Operating systems known/used
  },
  savedJobs: {
    type: Object      // Jobs saved by user
  },
  impacts: {
    type: Object      // Impact-related data (career goals, changes, etc.)
  },
  alerts: {
    // Alerts/notifications for the user
  }
});

// Export the User model
module.exports = mongoose.model('User', userSchema);
