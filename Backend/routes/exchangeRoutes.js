const express = require('express');
const router = express.Router();
const exchangeController = require('../controllers/exchangeController');


router.get('', exchangeController.getExchangeRates);
router.get('/flags', exchangeController.getCurrenciesFlags);

module.exports = router;