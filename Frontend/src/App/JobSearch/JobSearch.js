import { useState, useEffect } from "react";
import config from '../config';
import { useNavigate } from 'react-router-dom';

export default function JobSearch({ toggleScreen }) {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [jobs, setJobs] = useState([]); // Ensure this is an array
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");


    useEffect(() => {
        toggleScreen("JobSearch");
    });


    const searchJobs = async (pageNumber = 1) => {
        if (!query.trim()) return;

        setLoading(true);
        try {

            setSearchQuery(`site:linkedin.com/jobs/view ${query}`); // Add LinkedIn job search restriction
            const response = await fetch(`${config.apiBaseUrl}/api/jobs/search-jobs?query=${encodeURIComponent(searchQuery)}&page=${pageNumber}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            // Safeguard: Ensure 'data.jobs' is an array before using it
            setJobs(Array.isArray(data.jobs) ? data.jobs : []);
            setTotalPages(data.totalPages || 1); // Ensure totalPages is a valid number
            setPage(pageNumber);
        } catch (error) {
            console.error("Error fetching jobs:", error);
        }
        setLoading(false);
    };

    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > totalPages) return; // Prevent invalid page numbers
        searchJobs(newPage);
    };

    const handlePageInputChange = (e) => {
        const inputPage = Number(e.target.value);
        if (inputPage >= 1 && inputPage <= totalPages) {
            setPage(inputPage);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6" style={{ width: "100%" }}>
            <h1 className="text-2xl font-bold mb-4">Job Search</h1>
            <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Enter job title (e.g. React Developer)"
                    className="border p-2 w-full rounded"
                    style={{ minWidth: "50%" }}
                />
                <button
                    onClick={() => searchJobs(1)} // Reset to page 1 on search
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    disabled={loading}
                >
                    {loading ? "Searching..." : "Search"}
                </button>
            </div>
            {jobs.length > 0 ? (
                <>
                    <ul className="space-y-2">
                        {jobs.map((job, index) => (
                            <li key={index}>
                                <a href={job.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                                    {job.title}
                                </a>
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
