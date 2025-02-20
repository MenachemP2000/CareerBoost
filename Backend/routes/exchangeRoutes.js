const express = require('express');
const router = express.Router();
const { getExchangeRates } = require ("../controllers/exchangeController");

router.get('', getExchangeRates);

module.exports = router;