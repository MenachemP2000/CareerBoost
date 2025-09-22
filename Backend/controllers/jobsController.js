// Import axios HTTP client
const axios = require("axios");

// Multiple API keys (Google Custom Search limits usage per key, so you rotate keys if one hits the quota)
const API_KEYS = [
    "AIzaSyBmPK_o2bbxiCirLs_n_75VBym04pQZ9fE",
    "AIzaSyDzUBS2KK3Z-omo5WaUgcSFi_nFQlAga2A",
    "AIzaSyA051QA0gPGJbQFPqYQY0aMH1B7cTT91JQ",
    "AIzaSyBr-UmhAzPcIFrXu6P6UEHCalze_DC0RvU",
    "AIzaSyCjCRAMVp1uV76obrvVTwisPTzqUfS_hPs",
    "AIzaSyCK4XTvuiomr7C0cMDTYfCBkmCGhPAMBtw"
];

// Custom Search Engine (CSE) ID
const CSE_ID = "f6a30ab52fe1f4a57";

/**
 * Controller function: searchJobs
 * Queries Google Custom Search API for job listings based on parameters
 */
const searchJobs = async (req, res) => {
    // Extract query params from the request
    const { query, page, recency, country } = req.query;

    // Ensure the 'query' parameter is provided
    if (!query) return res.status(400).json({ error: "Query parameter is required" });

    // Default to page 1 if 'page' is not provided
    const pageNumber = page ? parseInt(page, 10) : 1;

    // Google Custom Search returns 10 results per page
    const startIndex = (pageNumber - 1) * 10 + 1;

    // Build an array of URLs, one for each API key
    const URLS = [];
    for (let i = 0; i < API_KEYS.length; i++) {
        let url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&key=${API_KEYS[i]}&cx=${CSE_ID}&dateRestrict=${recency}&start=${startIndex}`;

        // Add the country restriction if provided
        if (country) {
            url += `&cr=${country}`;
        }

        URLS[i] = url;
    }

    // Try each URL (API key) in order until one succeeds
    for (let i = 0; i < URLS.length; i++) {
        try {
            const response = await axios.get(URLS[i]);

            // Extract job data safely from response
            const jobs = response.data.items?.map(item => ({
                title: item.title,
                htmlTitle: item.htmlTitle,
                displayLink: item.displayLink,
                link: item.link,
                htmlSnippet: item.htmlSnippet,
                snippet: item.snippet,
                formattedUrl: item.formattedUrl,
                htmlFormattedUrl: item.htmlFormattedUrl,
                pagemap: item.pagemap
            })) || [];

            // Pagination info
            const totalResults = response.data.searchInformation?.totalResults || 0;
            const totalPages = Math.min(Math.ceil(totalResults / 10), 10); // Google caps results at 100 → max 10 pages

            // Return the data as JSON response
            res.json({
                jobs,
                page: pageNumber,
                totalPages,
                totalResults
            });
            return; // Exit once successful
        } catch (error) {
            // If API quota exceeded, try the next key
            if (error?.response?.status === 429) {
                console.log("API Key limit reached. Trying next key...");
                continue;
            }
            // Any other error → return failure
            console.error("Error fetching job listings:", error);
            res.status(500).json({ error: "Failed to fetch job listings" });
            return;
        }
    }
};

// Export the function so it can be used in routes
module.exports = { searchJobs };
