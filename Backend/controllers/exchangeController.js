const fs = require('fs') ;
const path = require('path') ;
const fileURLToPath = require('url') ;

exports.getExchangeRates = async (req, res) => {
    const filePath = path.join(__dirname, "../exchange_rates.json");

    // Check if file exists
    if (!fs.existsSync(filePath)) {
        return res.status(500).json({ error: "Exchange rates not available." });
    }

    // Read and send the JSON file
    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Failed to read exchange rates." });
        }
        res.json(JSON.parse(data));
    });
};

exports.getCurrenciesFlags = async (req, res) => {
    const filePath = path.join(__dirname, "../currencyFlags.json");

    // Check if file exists
    if (!fs.existsSync(filePath)) {
        return res.status(500).json({ error: "Currency flags not available." });
    }
    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Failed to read currency flags." });
        }
        res.json(JSON.parse(data));
    });
};

