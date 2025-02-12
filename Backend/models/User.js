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
    type: Number,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  education: {
    type: String,
    required: true
  },
  prediction: {
    type: Number
  }
});

module.exports = mongoose.model('User', userSchema);
