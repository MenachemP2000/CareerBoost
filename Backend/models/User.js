const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  experience: {
    type: String,
    required: true
  },
  age: {
    type: String,
    required: true
  },
  education: {
    type: String,
    required: true
  },
  prediction: {
    type: String
  },
  topRecommendations: {
    type: Object
  },
  MainBranch: {
    type: String
  },
  RemoteWork: {
    type: String
  },
  DevType: {
    type: String
  },
  OrgSize: {
    type: String
  },
  ICorPM: {
    type: String
  },
  Industry: {
    type: String
  },
  YearsCode: {
    type: String
  },
  YearsCodePro: {
    type: String
  },
  JobSat: {
    type: String
  },
  languages: {
    type: Object
  },
  employments: {
    type: Object
  },
});

module.exports = mongoose.model('User', userSchema);
