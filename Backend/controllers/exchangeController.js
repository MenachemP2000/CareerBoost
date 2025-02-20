import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function getExchangeRates (req, res) {
    const filePath = path.join( __dirname, "../exchange_rates.json");

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

