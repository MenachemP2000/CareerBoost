import { useState, useEffect } from "react";
import config from '../config';
import { useNavigate } from 'react-router-dom';

export default function Jobs({ toggleScreen, isSignedIn }) {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]); // Ensure this is an array
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState({
        country: "",
        experience: "",
        education: "",
        languages: [],
        industry: "",
        remoteWork: false,
        databases: [],
        platforms: [],
        webFrameworks: [],
        tools: [],
        keywords: "",  // New field for excluded keywords,
        includeKeywords: ""  // New field for included keywords
    });

    useEffect(() => {
        toggleScreen("Jobs");
        if (!isSignedIn) {
            navigate("/");
        }
        // Pass filters (not isSignedIn) into buildSearchQuery
        const searchQuery = buildSearchQuery(isSignedIn);
        setSearchQuery(searchQuery);
    }, [filters, isSignedIn]); // Update searchQuery whenever filters change

    const buildSearchQuery = (user) => {
        const { country, experience, education, languages, industry, remoteWork, databases,
            platforms, webFrameworks, tools } = user;

        let query = `site:linkedin.com/jobs/view `;

        // Include country if selected
        if (country && filters.countryEnabled) query += `${country} `;

        // Include languages if selected
        if (languages && languages.length > 0 && filters.languagesEnabled) query += `${languages.join(" OR ")} `;

        // Include databases if selected
        if (databases && databases.length > 0 && filters.databasesEnabled) query += `${databases.join(" OR ")} `;

        // Include platforms if selected
        if (platforms && platforms.length > 0 && filters.platformsEnabled) query += `${platforms.join(" OR ")} `;

        // Include web frameworks if selected
        if (webFrameworks && webFrameworks.length > 0 && filters.webFrameworksEnabled) query += `${webFrameworks.join(" OR ")} `;

        // Include tools if selected
        if (tools && tools.length > 0 && filters.toolsEnabled) query += `${tools.join(" OR ")} `;

        // Include experience if selected
        //if (experience && filters.experienceEnabled) query += `experience:${experience} years `;

        // Include education if selected
        if (education && filters.educationEnabled) query += `education:${education} `;

        // Include industry if selected
        if (industry && filters.industryEnabled) query += `industry:${industry} `;

        // Include remote work preference if selected
        if (remoteWork && filters.remoteWorkEnabled) query += `remote:${remoteWork} `;


        if (filters.includeKeywords) {
            const words = filters.includeKeywords.split(",").map(word => word.trim()).filter(word => word);
            console.log("Included keywords:", words);
            if (words.length > 0) {
                query += words.map(word => `${word}`).join(" ") + " ";
            }
        }

        // Exclude keywords if provided.
        // Splits the input by commas and prepends a minus sign to each term.
        if (filters.keywords) {
            const words = filters.keywords.split(",").map(word => word.trim()).filter(word => word);
            console.log("Excluded keywords:", words);
            if (words.length > 0) {
                query += words.map(word => `-${word}`).join(" ") + " ";
            }
        }
        console.log(query);

        return query;
    };

    const searchJobs = async (pageNumber = 1) => {
        setLoading(true);
        try {
            const response = await fetch(`${config.apiBaseUrl}/api/jobs/search-jobs?query=${encodeURIComponent(searchQuery)}&page=${pageNumber}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setJobs(Array.isArray(data.jobs) ? data.jobs : []);
            setTotalPages(data.totalPages || 1);
            setPage(pageNumber);
        } catch (error) {
            console.error("Error fetching jobs:", error);
        }
        setLoading(false);
    };

    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > totalPages) return;
        searchJobs(newPage);
    };

    const handlePageInputChange = (e) => {
        const inputPage = Number(e.target.value);
        if (inputPage >= 1 && inputPage <= totalPages) {
            setPage(inputPage);
        }
    };

    // Handle the toggle change for each filter
    const handleToggleChange = (e) => {
        const { name, checked } = e.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: checked
        }));
    };

    // Handle input change for excluded keywords (updates filters.keywords)
    const handleKeywordsChange = (e) => {
        const { value } = e.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            keywords: value
        }));
    };

    // Handle input change for included keywords (updates filters.includeKeywords)
    const handleIncludeKeywordsChange = (e) => {
        const { value } = e.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            includeKeywords: value
        }));
    };

    return (
        <div className="max-w-2xl mx-auto p-6" style={{ width: "100%" }}>
            <h1 className="text-2xl font-bold mb-4">Jobs</h1>
            <div className="flex gap-2 mb-4">
                <button
                    onClick={() => searchJobs(1)} // Reset to page 1 on search
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    disabled={loading}
                >
                    {loading ? "Searching..." : "Search"}
                </button>
            </div>

            {/* Filter Toggles */}
            <div className="mb-4">
                <h3 className="text-lg font-bold">Filters</h3>
                <div>
                    <label>
                        <input
                            type="checkbox"
                            name="countryEnabled"
                            checked={filters.countryEnabled || false}
                            onChange={handleToggleChange}
                        />
                        Include Country
                    </label>
                </div>
                <div>
                    <label>
                        <input
                            type="checkbox"
                            name="languagesEnabled"
                            checked={filters.languagesEnabled || false}
                            onChange={handleToggleChange}
                        />
                        Include Languages
                    </label>
                </div>
                <div>
                    <label>
                        <input
                            type="checkbox"
                            name="databasesEnabled"
                            checked={filters.databasesEnabled || false}
                            onChange={handleToggleChange}
                        />
                        Include Databases
                    </label>
                </div>
                <div>
                    <label>
                        <input
                            type="checkbox"
                            name="platformsEnabled"
                            checked={filters.platformsEnabled || false}
                            onChange={handleToggleChange}
                        />
                        Include Platforms
                    </label>
                </div>
                <div>
                    <label>
                        <input
                            type="checkbox"
                            name="webFrameworksEnabled"
                            checked={filters.webFrameworksEnabled || false}
                            onChange={handleToggleChange}
                        />
                        Include Web Frameworks
                    </label>
                </div>
                <div>
                    <label>
                        <input
                            type="checkbox"
                            name="toolsEnabled"
                            checked={filters.toolsEnabled || false}
                            onChange={handleToggleChange}
                        />
                        Include Tools
                    </label>
                </div>
                {/*  <div>
                    <label>
                        <input
                            type="checkbox"
                            name="experienceEnabled"
                            checked={filters.experienceEnabled || false}
                            onChange={handleToggleChange}
                        />
                        Include Experience
                    </label>
                </div> */}
                <div>
                    <label>
                        <input
                            type="checkbox"
                            name="educationEnabled"
                            checked={filters.educationEnabled || false}
                            onChange={handleToggleChange}
                        />
                        Include Education
                    </label>
                </div>
                <div>
                    <label>
                        <input
                            type="checkbox"
                            name="industryEnabled"
                            checked={filters.industryEnabled || false}
                            onChange={handleToggleChange}
                        />
                        Include Industry
                    </label>
                </div>
                <div>
                    <label>
                        <input
                            type="checkbox"
                            name="remoteWorkEnabled"
                            checked={filters.remoteWorkEnabled || false}
                            onChange={handleToggleChange}
                        />
                        Include Remote Work Preference
                    </label>
                </div>
            </div>

            {/* Keyword Exclusion Filter Input */}
            <div className="mb-4">
                <label>
                    Exclude Keywords (e.g., Senior):
                    <input
                        type="text"
                        value={filters.keywords || ""}
                        onChange={handleKeywordsChange}
                        className="ml-2 px-4 py-2 border rounded"
                        placeholder="Enter keywords to exclude, comma-separated"
                    />
                </label>
            </div>

            {/* Keyword Inclusion Filter Input */}
            <div className="mb-4">
                <label>
                    Include Keywords (e.g., Junior):
                    <input
                        type="text"
                        value={filters.includeKeywords || ""}
                        onChange={handleIncludeKeywordsChange}
                        className="ml-2 px-4 py-2 border rounded"
                        placeholder="Enter keywords to include, comma-separated"
                    />
                </label>
            </div>

            {jobs.length > 0 ? (
                <>
                    <ul className="space-y-2">
                        {jobs.map((job, index) => (
                            <li key={index}>
                                <a href={job.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                                    {job.title}
                                </a>
                                <div>
                                    {job.snippet}
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className="flex justify-center gap-4 mt-4 items-center">
                        {/* Page Selection Input */}
                        <input
                            type="number"
                            value={page}
                            min={1}
                            max={totalPages}
                            onChange={handlePageInputChange}
                            className="px-4 py-2 border rounded"
                        />
                        <span className="text-lg">/ {totalPages}</span>
                        <button
                            onClick={() => handlePageChange(page)}
                            disabled={page < 1 || page > totalPages}
                            className="px-4 py-2 bg-blue-500 text-white rounded"
                        >
                            Go to Page
                        </button>
                    </div>
                </>
            ) : (
                <p>No jobs found.</p>
            )}
        </div>
    );
}
