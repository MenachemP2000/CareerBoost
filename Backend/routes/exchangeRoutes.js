const express = require('express');
const router = express.Router();
const { getExchangeRates,getCurrenciesFlags } = require ("../controllers/exchangeController");

router.get('', getExchangeRates);
router.get('/flags', getCurrenciesFlags);

module.exports = router;