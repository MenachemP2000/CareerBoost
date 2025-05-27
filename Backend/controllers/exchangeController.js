// Import Node.js core modules for working with the file system and file paths
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
// Convert the module URL to a file path so we can use __dirname in an ES module context
const __dirname = path.dirname(fileURLToPath(import.meta.url));


/**
 * Controller to handle GET request for exchange rates
 * Reads the exchange_rates.json file and sends it as a JSON response
 */
export async function getExchangeRates(req, res) {
    // Construct absolute file path to exchange_rates.json
    const filePath = path.join(__dirname, "../exchange_rates.json");

    // Check if file exists
    if (!fs.existsSync(filePath)) {
        return res.status(500).json({ error: "Exchange rates not available." });
    }

    // Read and send the JSON file
    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            // Handle any errors while reading the file
            return res.status(500).json({ error: "Failed to read exchange rates." });
        }
        // Send parsed JSON data as the response
        res.json(JSON.parse(data));
    });
};

/**
 * Controller to handle GET request for currency flags
 * Reads the currencyFlags.json file and sends it as a JSON response
 */

export async function getCurrenciesFlags(req, res) {
    // Construct absolute file path to currencyFlags.json
    const filePath = path.join(__dirname, "../currencyFlags.json");

    // Check if file exists
    if (!fs.existsSync(filePath)) {
        return res.status(500).json({ error: "Currency flags not available." });
    }
    // Asynchronously read the contents of the file
    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Failed to read currency flags." });
        }
        // Send parsed JSON data as the response
        res.json(JSON.parse(data));
    });
};

