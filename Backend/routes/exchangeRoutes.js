const express = require('express');
const router = express.Router();
const exchangeController = require('../controllers/exchangeController');

// Route: GET /exchange
// Calls controller to return exchange rates (from exchange_rates.json)
router.get('', exchangeController.getExchangeRates);

// Route: GET /exchange/flags
// Calls controller to return currency flag data (from currencyFlags.json)
router.get('/flags', exchangeController.getCurrenciesFlags);

// Export the router to be used in app.js / server.js
module.exports = router;
