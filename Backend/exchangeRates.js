import axios from "axios";    // For making HTTP requests
import fs from "fs";          // For reading/writing files
import xml2js from "xml2js";  // For converting XML (from FloatRates) to JSON
import cron from "node-cron"; // For scheduling tasks

// ==============================
// Function: fetchExchangeRates
// - Fetches latest USD-based exchange rates in XML
// - Converts to JSON
// - Saves to exchange_rates.json
// ==============================
async function fetchExchangeRates() {
    try {
        // URL for USD-based exchange rates from FloatRates
        const url = "https://www.floatrates.com/daily/usd.xml";
        console.log("Fetching exchange rates...");

        // Make GET request to fetch XML data
        const response = await axios.get(url);
        const xml = response.data;

        // Convert XML to JSON
        const parser = new xml2js.Parser({ explicitArray: false });
        const result = await parser.parseStringPromise(xml);

        // Extract exchange rates into a key-value object
        const rates = {};
        result.channel.item.forEach((item) => {
            // Example: rates["EUR"] = 0.92
            rates[item.targetCurrency] = parseFloat(item.exchangeRate);
        });

        // Add USD as reference (1:1)
        rates["USD"] = 1;

        // Save to JSON file (pretty-printed with indentation)
        fs.writeFileSync("exchange_rates.json", JSON.stringify(rates, null, 2));

        //console.log("Exchange rates updated:", rates);
    } catch (error) {
        console.error("Error fetching exchange rates:", error);
    }
}

// ==============================
// Scheduling
// ==============================

// Run the task automatically every day at midnight (00:00 server time)
cron.schedule("0 0 * * *", fetchExchangeRates);

// Fetch immediately on startup (so you don’t have to wait until midnight)
fetchExchangeRates();

// Export for potential reuse in other modules
export default fetchExchangeRates;
