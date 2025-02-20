import axios from "axios";
import fs from "fs";
import xml2js from "xml2js";
import cron from "node-cron";

async function fetchExchangeRates() {
    try {
        const url = "https://www.floatrates.com/daily/usd.xml";
        console.log("Fetching exchange rates...");

        const response = await axios.get(url);
        const xml = response.data;
        
        // Convert XML to JSON
        const parser = new xml2js.Parser({ explicitArray: false });
        const result = await parser.parseStringPromise(xml);

        // Extract exchange rates
        const rates = {};
        result.channel.item.forEach((item) => {
            rates[item.targetCurrency] = parseFloat(item.exchangeRate);
        });

        rates["USD"] = 1; // Add USD to USD rate

        // Save to JSON file
        fs.writeFileSync("exchange_rates.json", JSON.stringify(rates, null, 2));

        console.log("Exchange rates updated:", rates);
    } catch (error) {
        console.error("Error fetching exchange rates:", error);
    }
}

// Schedule to run once a day at midnight
cron.schedule("0 0 * * *", fetchExchangeRates);

// Fetch immediately on startup
fetchExchangeRates();

export default fetchExchangeRates;