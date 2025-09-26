// Import Node.js core modules
const fs = require('fs');              // File system module → lets us read/write files
const path = require('path');          // Path module → helps build file paths safely across OS
const fileURLToPath = require('url');  // URL module (not actually used in this code)

// -------------------
// Controller functions
// -------------------

/**
 * Endpoint: GET /exchange-rates
 * Reads exchange_rates.json from the server and sends it as JSON response
 */
exports.getExchangeRates = async (req, res) => {
    // Build the full path to the exchange_rates.json file
    const filePath = path.join(__dirname, "../exchange_rates.json");

    // Check if the file exists before trying to read it
    if (!fs.existsSync(filePath)) {
        return res.status(500).json({ error: "Exchange rates not available." });
    }

    // Read the file asynchronously (non-blocking)
    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            // If reading fails, send error response
            return res.status(500).json({ error: "Failed to read exchange rates." });
        }
        // Parse JSON string into JS object and return as response
        res.json(JSON.parse(data));
    });
};


/**
 * Endpoint: GET /currency-flags
 * Reads currencyFlags.json from the server and sends it as JSON response
 */
exports.getCurrenciesFlags = async (req, res) => {
    // Build the full path to the currencyFlags.json file
    const filePath = path.join(__dirname, "../currencyFlags.json");

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
        return res.status(500).json({ error: "Currency flags not available." });
    }

    // Read the file asynchronously
    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            // Handle error if reading fails
            return res.status(500).json({ error: "Failed to read currency flags." });
        }
        // Return parsed JSON to the client
        res.json(JSON.parse(data));
    });
};
