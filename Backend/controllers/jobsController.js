const axios = require("axios");

const API_KEYS = ["AIzaSyBmPK_o2bbxiCirLs_n_75VBym04pQZ9fE", "AIzaSyDzUBS2KK3Z-omo5WaUgcSFi_nFQlAga2A",
    "AIzaSyA051QA0gPGJbQFPqYQY0aMH1B7cTT91JQ", "AIzaSyBr-UmhAzPcIFrXu6P6UEHCalze_DC0RvU",
    "AIzaSyCjCRAMVp1uV76obrvVTwisPTzqUfS_hPs", "AIzaSyCK4XTvuiomr7C0cMDTYfCBkmCGhPAMBtw"];

const CSE_ID = "f6a30ab52fe1f4a57";

const searchJobs = async (req, res) => {
    const { query, page, recency, country } = req.query;

    // Ensure the query parameter is provided
    if (!query) return res.status(400).json({ error: "Query parameter is required" });

    // Default to page 1 if not provided
    const pageNumber = page ? parseInt(page, 10) : 1;

    // Adjust startIndex calculation for Google Custom Search API
    const startIndex = (pageNumber - 1) * 10 + 1; // Google Custom Search returns 10 results per page

    const URLS = [];

    for (let i = 0; i < API_KEYS.length; i++) {

        let url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&key=${API_KEYS[i]}&cx=${CSE_ID}&dateRestrict=${recency}&start=${startIndex}`;

        // Add the country parameter if it exists
        if (country) {
            url += `&cr=${country}`;
        }
        URLS[i] = url;
    }

    for (let i = 0; i < URLS.length; i++) {

        try {
            const response = await axios.get(URLS[i]);

            // Safeguard: Ensure the response contains 'items'
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
            console.log(response.data.queries.nextPage);


            // Add pagination info (totalResults and current page)
            const totalResults = response.data.searchInformation?.totalResults || 0;
            const totalPages = Math.min(Math.ceil(totalResults / 10), 10); // Since max results = 100, max pages = 10
            console.log("totalPages: ", totalPages);
            res.json({
                jobs,
                page: pageNumber,
                totalPages,
                totalResults
            });
            return;
        } catch (error) {
            if (error?.response?.status === 429) {
                console.log("API Key limit reached. Trying next key...");
                continue;
            }
            console.error("Error fetching job listings:", error);
            res.status(500).json({ error: "Failed to fetch job listings" });
            return;
        }
    }
};
module.exports = { searchJobs };
