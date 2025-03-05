const axios = require("axios");

const API_KEY = "AIzaSyCjCRAMVp1uV76obrvVTwisPTzqUfS_hPs";
const CSE_ID = "f6a30ab52fe1f4a57";

const searchJobs = async (req, res) => {
    const { query, page,recency } = req.query;

    // Ensure the query parameter is provided
    if (!query) return res.status(400).json({ error: "Query parameter is required" });

    // Default to page 1 if not provided
    const pageNumber = page ? parseInt(page, 10) : 1;
    
    // Adjust startIndex calculation for Google Custom Search API
    const startIndex = (pageNumber - 1) * 10 + 1; // Google Custom Search returns 10 results per page

    // Google Custom Search API URL
    const searchUrl = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&key=${API_KEY}&cx=${CSE_ID}&dateRestrict=${recency}&start=${startIndex}`;

    try {
        const response = await axios.get(searchUrl);

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

        console.log("Jobs:", jobs);
        for (let i = 0; i < jobs.length; i++) {
            console.log("Job", i, ":", jobs[i].pagemap);
        }


        // Add pagination info (totalResults and current page)
        const totalResults = response.data.searchInformation?.totalResults || 0;
        const totalPages = Math.min(Math.ceil(totalResults / 10), 10); // Since max results = 100, max pages = 10

        res.json({
            jobs,
            page: pageNumber,
            totalPages,
            totalResults
        });
    } catch (error) {
        console.error("Error fetching job listings:", error);
        res.status(500).json({ error: "Failed to fetch job listings" });
    }
};

module.exports = { searchJobs };
