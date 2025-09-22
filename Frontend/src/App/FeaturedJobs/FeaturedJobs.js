import {useState, useEffect} from "react";
import config from '../config';
import {useNavigate, Link} from 'react-router-dom';
import {Card} from 'react-bootstrap'; // not used right now, can be removed
import "./FeaturedJobs.css";

export default function FeaturedJobs({toggleScreen, isSignedIn, toggleSignendIn, countryCrMap}) {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);     // state to hold fetched jobs
    const [loading, setLoading] = useState(false); // loading spinner toggle
    const [error, setError] = useState('');   // error message state

    /* -------------------------------
       Lifecycle hooks
    ------------------------------- */
    useEffect(() => {
        toggleScreen("Jobs");   // update screen label
        if (!isSignedIn) {
            navigate("/");      // redirect to home if not signed in
        }
    }, [isSignedIn]);

    useEffect(() => {
        window.scrollTo(0, 0);  // scroll to top when page loads
    }, []);

    // Build query and trigger job search when username changes
    useEffect(() => {
        const searchQuery = buildSearchQuery(isSignedIn);
        searchJobs(searchQuery);
    }, [isSignedIn.username]);

    /* -------------------------------
       Helper functions
    ------------------------------- */
    // Decode HTML entities (for job titles etc.)
    const decodeHtml = (html) => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.documentElement.textContent || doc.body.textContent;
    };

    // Build Google Custom Search query string based on user's DevType
    const buildSearchQuery = (user) => {
        const {DevType} = user;
        let query = `site:linkedin.com/jobs/view `;

        // Add conditions depending on DevType (lots of if checks)
        if (DevType) {
            if (DevType == "Developer, full-stack") query += `AND (full-stack) `;
            if (DevType == "Developer, back-end") query += `AND (back-end) `;
            if (DevType == "Developer, front-end") query += `AND (front-end) `;
            if (DevType == "Developer, desktop or enterprise applications") query += `AND (desktop OR enterprise applications OR Desktop applications OR Enterprise) `;
            if (DevType == "Developer, mobile") query += `AND (mobile OR Mobile app) `;
            if (DevType == "Developer, embedded applications or devices") query += `AND (embedded applications OR embedded systems OR Embedded device OR Embedded) `;
            if (DevType == "Data engineer") query += `AND (Data engineer OR Data infrastructure engineer OR Data pipeline engineer) `;
            if (DevType == "Engineering manager") query += `AND (Engineering manager OR Tech lead OR Technical manager OR Engineering lead) `;
            if (DevType == "DevOps specialist") query += `AND (DevOps specialist OR DevOps engineer OR DevOps) `;
            if (DevType == "Data scientist or machine learning specialist") query += `AND (Data scientist OR Machine learning specialist OR Data scientist ML) `;
            if (DevType == "Research & Development role") query += `AND (Research & Development OR R&D role OR Research scientist) `;
            if (DevType == "Academic researcher") query += `AND Researcher `;
            if (DevType == "Senior Executive (C-Suite, VP, etc.)") query += `AND (Senior Executive OR C-Suite OR VP OR CTO OR CEO) `;
            if (DevType == "Cloud infrastructure engineer") query += `AND (Cloud infrastructure engineer OR Cloud engineer OR Cloud architect OR Cloud infrastructure) `;
            if (DevType == "Developer, QA or test") query += `AND (QA OR Quality assurance) `;
            if (DevType == "Developer, game or graphics") query += `AND (Game OR Graphics OR Games) `;
            if (DevType == "Data or business analyst") query += `AND (Data analyst OR Business analyst OR Business intelligence analyst OR BI) `;
            if (DevType == "Developer, AI") query += `AND (AI OR Artificial intelligence) `;
            if (DevType == "System administrator") query += `AND (System administrator OR Sysadmin OR System admin) `;
            if (DevType == "Student") query += `AND (Student OR Intern OR Graduate OR Recent graduate) `;
            if (DevType == "Engineer, site reliability") query += `AND (Site reliability OR SRE) `;
            if (DevType == "Project manager") query += `AND (Project manager OR Program manager) `;
            if (DevType == "Scientist") query += `AND Scientist `;
            if (DevType == "Security professional") query += `AND (Security OR Cybersecurity) `;
            if (DevType == "Educator") query += `AND (Educator OR Instructor OR Professor) `;
            if (DevType == "Blockchain") query += `AND (Blockchain OR Blockchain developer OR Blockchain engineer) `;
            if (DevType == "Developer Experience") query += `AND (Experience OR DevEx OR Advocate) `;
            if (DevType == "Product manager") query += `AND (Product manager OR Product owner OR PM) `;
            if (DevType == "Hardware Engineer") query += `AND (Hardware engineer OR Hardware developer) `;
            if (DevType == "Database administrator") query += `AND (Database administrator OR DBA OR Database engineer) `;
            if (DevType == "Developer Advocate") query += `AND (Advocate OR DevRel) `;
            if (DevType == "Designer") query += `AND Designer `;
            if (DevType == "Marketing or sales professional") query += `AND (Marketing OR Sales) `;
        }

        // Exclude jobs that are closed
        const noapplications = '"No longer accepting applications"';
        query += `AND -${noapplications} `;

        console.log(query);
        return query;
    };

    // Fetch jobs from backend API
    const searchJobs = async (searchQuery) => {
        setLoading(true);
        try {
            const response = await fetch(`${config.apiBaseUrl}/api/jobs/search-jobs?query=${encodeURIComponent(
                searchQuery
            )}&page=1&recency=d1&country=${countryCrMap[isSignedIn.country]}`);

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const data = await response.json();
            const dataJobs = data.jobs;

            // Country-specific parsing rules
            if (isSignedIn.country === "Israel") {
                dataJobs.forEach(job => {
                    job.parsedTitle = decodeHtml(job.pagemap.metatags[0]["og:title"])
                        .replace("| LinkedIn", "").replace("LinkedIn", "");
                    job.country = "Israel";
                    job.company = decodeHtml(job.pagemap.metatags[0]["og:title"].split("גיוס עובדים")[0].trim());
                    job.job = decodeHtml(job.pagemap.metatags[0]["og:title"].split("גיוס עובדים")[1]
                        .split("|").slice(0, -1).join("|").trim());
                    job.location = decodeHtml(job.pagemap.metatags[0]["og:title"].split("גיוס עובדים")[1]
                        .split("|").slice(-1)[0].replace("LinkedIn", "").trim());
                });
            } else if (isSignedIn.country === "United States of America") {
                dataJobs.forEach(job => {
                    job.parsedTitle = decodeHtml(job.pagemap.metatags[0]["og:title"])
                        .replace("| LinkedIn", "").replace("LinkedIn", "");
                    job.country = "USA";
                    job.company = decodeHtml(job.pagemap.metatags[0]["og:title"].split("hiring")[0].trim());
                    job.job = decodeHtml(job.pagemap.metatags[0]["og:title"].split("hiring")[1]
                        .trim().split("in ")[0].trim());
                    job.location = decodeHtml(job.pagemap.metatags[0]["og:title"].split("hiring")[1]
                        .split("in ")[1].replace("| LinkedIn", "").trim());
                });
            } else {
                // Fallback for other countries
                dataJobs.forEach(job => {
                    job.parsedTitle = decodeHtml(job.pagemap.metatags[0]["og:title"])
                        .replace("| LinkedIn", "").replace("LinkedIn", "");
                    job.country = isSignedIn.country;
                    job.company = "not available";
                    job.job = "not available";
                    job.location = "not available";
                });
            }

            setJobs(Array.isArray(dataJobs) ? dataJobs : []);
        } catch (error) {
            console.error("Error fetching jobs:", error);
        }
        setLoading(false);
    };

    // Save a job to user's savedJobs
    const saveJob = async (job) => {
        console.log(job);

        // Log object size (debugging)
        const jsonString = JSON.stringify(job);
        const byteLength = new TextEncoder().encode(jsonString).length;
        const sizeInKB = byteLength / 1024;
        console.log(`Size of JSON object: ${sizeInKB.toFixed(2)} KB`);

        // Prepare payload with updated savedJobs
        const payload = {_id: isSignedIn._id, username: isSignedIn.username};
        const savedJobs = isSignedIn.savedJobs || [];
        savedJobs.push(job);
        payload.savedJobs = savedJobs;

        try {
            const response = await fetch(`${config.apiBaseUrl}/api/users/${isSignedIn._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            if (!response.ok) {
                setError(result.message);
                return;
            }
            // Refresh signed-in state with updated user data
            toggleSignendIn(isSignedIn.username);
        } catch (error) {
            setError('An error occurred. Please try again.');
            console.error('Error:', error);
        }
    }

    /* -------------------------------
       Render JSX
    ------------------------------- */
    return (
        <div className="featured-jobs-container">
            <h1 className="profile-title">Featured Jobs</h1>
            <br/>

            {/* Show loading spinner */}
            {loading && <p className="featured-jobs-loading">Loading...</p>}

            {/* Jobs list */}
            {!loading && jobs.length > 0 && (
                <ul className="fj-list">
                    {jobs.map((job, index) => {
                        const postedMatch = job?.snippet?.match?.(/\d+\s\w+\sago/); // parse "posted X days ago"
                        const isSaved = !!isSignedIn.savedJobs?.some((s) => s.link === job.link);

                        return (
                            <li key={index} className="fj-row">
                                {/* Job link title */}
                                <a
                                    href={job.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="fj-title"
                                >
                                    {job.parsedTitle}
                                </a>

                                {/* Job meta info */}
                                <div className="fj-meta">
                                    {postedMatch && <span className="fj-posted">Posted: {postedMatch[0]}</span>}
                                    {(job.country === "Israel" || job.country === "USA") && (
                                        <div className="fj-info">
                                            <span><strong>Company:</strong> {job.company}</span>
                                            <span><strong>Job:</strong> {job.job}</span>
                                            <span><strong>Location:</strong> {job.location}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Save button */}
                                <div className="fj-actions">
                                    {isSaved ? (
                                        <button className="profile-button is-disabled" disabled>Saved</button>
                                    ) : (
                                        <button
                                            className="profile-button is-outline"
                                            onClick={() => saveJob(job)}
                                        >
                                            Save
                                        </button>
                                    )}
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}

            {/* Fallback if no jobs */}
            {(!loading && jobs.length === 0) && (
                <p className="featured-jobs-empty">No jobs found</p>
            )}

            {/* Navigation buttons */}
            <br/>
            <div className="profile-buttons">
                <Link to="/JobSearch">
                    <button className="profile-button is-outline">Search</button>
                </Link>
                <Link to="/SavedJobs">
                    <button className="profile-button is-outline">Saved</button>
                </Link>
            </div>
        </div>
    );
}
