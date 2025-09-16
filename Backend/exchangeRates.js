import axios from "axios";    // For making HTTP requests
import fs from "fs";          // For reading/writing files
import xml2js from "xml2js";  // For converting XML to JSON
import cron from "node-cron"; // For scheduling tasks

// Function to fetch and save exchange rates
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

        rates["USD"] = 1; // Add USD to USD rate

        // Save to JSON file
        fs.writeFileSync("exchange_rates.json", JSON.stringify(rates, null, 2));

        //console.log("Exchange rates updated:", rates);
    } catch (error) {
        console.error("Error fetching exchange rates:", error);
    }
}

// Schedule to run once a day at midnight
cron.schedule("0 0 * * *", fetchExchangeRates);

// Fetch immediately on startup
fetchExchangeRates();

export default fetchExchangeRates;