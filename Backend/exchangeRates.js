// Import required modules
import axios from "axios";      // HTTP client for fetching remote data
import fs from "fs";            // File system for writing data to a file
import xml2js from "xml2js";    // XML to JSON converter
import cron from "node-cron";   // Scheduler for running tasks periodically

// Main function to fetch exchange rates
async function fetchExchangeRates() {
    try {
        const url = "https://www.floatrates.com/daily/usd.xml";
        console.log("Fetching exchange rates...");

        const response = await axios.get(url);
        const xml = response.data;
        
        // Convert XML to JSON
        const parser = new xml2js.Parser({ explicitArray: false });
        const result = await parser.parseStringPromise(xml);

        // Extract exchange rates from the parsed JSON
        const rates = {};
        result.channel.item.forEach((item) => {
            rates[item.targetCurrency] = parseFloat(item.exchangeRate);
        });
        // Add a USD-to-USD rate for consistency
        rates["USD"] = 1;

        // Save the rates to a JSON file
        fs.writeFileSync("exchange_rates.json", JSON.stringify(rates, null, 2));

        //console.log("Exchange rates updated:", rates); //optional
    } catch (error) {
        console.error("Error fetching exchange rates:", error);
    }
}

// Schedule to run once a day at midnight (server time)
cron.schedule("0 0 * * *", fetchExchangeRates);

// Fetch immediately on startup
fetchExchangeRates();

export default fetchExchangeRates;