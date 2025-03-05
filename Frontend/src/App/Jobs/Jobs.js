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
    const [recency, setRecency] = useState("d1");
    const [filters, setFilters] = useState({
        keywords: "",  // New field for excluded keywords,
        includeKeywords: ""  // New field for included keywords
    });
    const [isOpen, setIsOpen] = useState(false);


    useEffect(() => {
        toggleScreen("Jobs");
        if (!isSignedIn) {
            navigate("/");
        }
        // Pass filters (not isSignedIn) into buildSearchQuery
        const searchQuery = buildSearchQuery(isSignedIn);
        setSearchQuery(searchQuery);
        console.log("filters", filters);
    }, [filters, isSignedIn]); // Update searchQuery whenever filters change

    const buildSearchQuery = (user) => {
        const { country, experience, education, languages, Industry, RemoteWork, databases,
            platforms, webframesworks, tools, DevType } = user;

        let query = `site:linkedin.com/jobs/view `;

        // Include country if selected
        if (country && filters.countryEnabled) query += `AND ${country} `;

        // Include languages if selected
        if (languages && languages.length > 0 && filters.languagesEnabled) query += `AND (${languages.join(" OR ")}) `;

        // Include databases if selected
        if (databases && databases.length > 0 && filters.databasesEnabled) query += `AND (${databases.join(" OR ")}) `;

        // Include platforms if selected
        if (platforms && platforms.length > 0 && filters.platformsEnabled) query += `AND (${platforms.join(" OR ")}) `;

        // Include web frameworks if selected
        if (webframesworks && webframesworks.length > 0 && filters.webFrameworksEnabled) query += `AND (${webframesworks.join(" OR ")}) `;

        // Include tools if selected
        if (tools && tools.length > 0 && filters.toolsEnabled) query += `AND (${tools.join(" OR ")}) `;

        // Include experience if selected
        //if (experience && filters.experienceEnabled) query += `experience:${experience} years `;

        // Include education if selected
        // Include education if selected with flexible matching
        if (education && filters.educationEnabled) {
            if (education == "Bachelor's degree (B.A., B.S., B.Eng., etc.)") {
                query += `AND ("Bachelor's degree" OR "B.A." OR "BA" OR "A.B." OR "AB" OR "B.S." OR "BS" OR "B.Sc." OR "BSc" OR "B.S.E." OR "BSE" OR "B.Eng." OR "BEng" OR "B.E." OR "BE" OR "B.Ed." OR "BEd" OR "BFA" OR "B.F.A." OR "LLB" OR "LL.B." OR "B.L." OR "BBA" OR "B.B.A." OR "B.Com." OR "BCA" OR "B.Arch." OR "BDes" OR "BPharm" OR "BTech" OR "B.Mus." OR "B.N." OR "BMedSci" OR "BFin" OR "B.H.Sc." OR "B.Acy." OR "BAcy" OR "B.Acc." OR "BAcc" OR "B.App.Sc." OR "BAppSc" OR "B.A.S." OR "BAS" OR "BIS" OR "B.I.S." OR "BASc" OR "B.A.Sc." OR "B.Bus." OR "BBus" OR "B.Int.Bus." OR "BIB" OR "BIBus" OR "BCE" OR "B.C.E." OR "B.C.L." OR "BCL" OR "B.Des." OR "BFA" OR "B.F.A." OR "BHA" OR "B.H.A." OR "BHS" OR "B.H.S." OR "BIS" OR "B.I.S." OR "BLitt" OR "B.Litt." OR "B.Math." OR "BMath" OR "B.M.S." OR "BMS" OR "B.Med.Sc." OR "BMedSc" OR "B.Mus." OR "BMus" OR "B.N." OR "BN" OR "B.Phil." OR "BPhil" OR "B.P.E." OR "BPE" OR "B.Phil.Ed." OR "BPhilEd" OR "B.P.S." OR "BPS" OR "B.P.T." OR "BPT" OR "B.Pub.Admin." OR "BPA" OR "B.S.A." OR "BSA" OR "B.S.Ag." OR "BSAgr" OR "B.S.Arch." OR "BSArch" OR "B.S.B.A." OR "BSBA" OR "B.S.Chem." OR "BSChem" OR "B.S.C.S." OR "BSCS" OR "B.S.E." OR "BSE" OR "B.S.E.E." OR "BSEE" OR "B.S.F.S." OR "BSFS" OR "B.S.I.E." OR "BSIE" OR "B.S.M.E." OR "BSME" OR "B.Soc.Sc." OR "BSocSc" OR "B.S.W." OR "BSW" OR "B.Tech." OR "BTech" OR "B.Theol." OR "BTheol" OR "B.Th." OR "BTh" OR "B.G.S." OR "B.S.G.S." OR "B.H.S." OR "B.H.Sc." OR "B.I.B.E." OR "B.In." OR "BFA" OR "B.F.A." OR "BM" OR "B.M." OR "BGInS" OR "BAcc" OR "BAFM") `;
            }
            if (education == "Master's degree (M.A., M.S., M.Eng., MBA, etc.)") {
                query += `AND ("Master's degree" OR "M.A." OR "MA" OR "M.S." OR "MS" OR "M.Sc." OR "MSc" OR "M.Eng." OR "MEng" OR "M.E." OR "ME" OR "M.Ed." OR "MEd" OR "MFA" OR "M.F.A." OR "LL.M." OR "LLM" OR "MBA" OR "M.B.A." OR "M.Com." OR "MCA" OR "M.Arch." OR "MDes" OR "MPharm" OR "MTech" OR "M.Mus." OR "M.N." OR "M.MedSci" OR "MFin" OR "M.H.Sc." OR "M.Acy." OR "MAcy" OR "M.Acc." OR "MAcc" OR "M.App.Sc." OR "MAppSc" OR "M.A.S." OR "MAS" OR "MIS" OR "M.I.S." OR "MASc" OR "M.A.Sc." OR "M.Bus." OR "MBus" OR "M.Int.Bus." OR "MIB" OR "MIBus" OR "MCE" OR "M.C.E." OR "M.C.L." OR "MCL" OR "M.Des." OR "MFA" OR "M.F.A." OR "MHA" OR "M.H.A." OR "MHS" OR "M.H.S." OR "MIS" OR "M.I.S." OR "MLitt" OR "M.Litt." OR "M.Math." OR "MMath" OR "M.M.S." OR "MMS" OR "M.Med.Sc." OR "MMedSc" OR "M.Mus." OR "MMus" OR "M.N." OR "MN" OR "M.Phil." OR "MPhil" OR "M.P.E." OR "MPE" OR "M.Phil.Ed." OR "MPhilEd" OR "M.P.S." OR "MPS" OR "M.P.T." OR "MPT" OR "M.Pub.Admin." OR "MPA" OR "M.S.A." OR "MSA" OR "M.S.Ag." OR "MSAgr" OR "M.S.Arch." OR "MSArch" OR "M.S.B.A." OR "MSBA" OR "M.S.Chem." OR "MSChem" OR "M.S.C.S." OR "MSCS" OR "M.S.E." OR "MSE" OR "M.S.E.E." OR "MSEE" OR "M.S.F.S." OR "MSFS" OR "M.S.I.E." OR "MSIE" OR "M.S.M.E." OR "MSME" OR "M.Soc.Sc." OR "MSocSc" OR "M.S.W." OR "MSW" OR "M.Tech." OR "MTech" OR "M.Theol." OR "MTheol" OR "M.Th." OR "MTh" OR "M.G.S." OR "M.S.G.S." OR "M.H.S." OR "M.H.Sc." OR "M.I.B.E." OR "M.In." OR "MFA" OR "M.F.A." OR "MM" OR "M.M." OR "MGInS" OR "MAcc" OR "MAFM") `;
            }
            if (education == "Professional degree (JD, MD, Ph.D, Ed.D, etc.)") {
                query += `AND ("Doctor of Philosophy" OR "Ph.D." OR "PhD" OR "Doctor of Medicine" OR "M.D." OR "MD" OR "Doctor of Dental Surgery" OR "D.D.S." OR "DDS" OR "Doctor of Dental Medicine" OR "D.M.D." OR "DMD" OR "Doctor of Pharmacy" OR "Pharm.D." OR "PharmD" OR "Juris Doctor" OR "J.D." OR "JD" OR "Doctor of Optometry" OR "O.D." OR "OD" OR "Doctor of Veterinary Medicine" OR "D.V.M." OR "DVM" OR "Doctor of Chiropractic" OR "D.C." OR "DC" OR "Doctor of Podiatric Medicine" OR "D.P.M." OR "DPM" OR "Doctor of Psychology" OR "Psy.D." OR "PsyD" OR "Doctor of Education" OR "Ed.D." OR "EdD" OR "Doctor of Business Administration" OR "D.B.A." OR "DBA" OR "Doctor of Nursing Practice" OR "D.N.P." OR "DNP" OR "Doctor of Public Health" OR "Dr.P.H." OR "DrPH" OR "Doctor of Engineering" OR "Eng.D." OR "EngD" OR "Doctor of Theology" OR "Th.D." OR "ThD" OR "Doctor of Sacred Theology" OR "S.T.D." OR "STD" OR "Doctor of Health Science" OR "D.H.Sc." OR "DHSc" OR "Doctor of Social Work" OR "D.S.W." OR "DSW" OR "Doctor of Professional Studies" OR "D.Prof." OR "DProf" OR "Doctor of Fine Arts" OR "D.F.A." OR "DFA" OR "Doctor of Science" OR "D.Sc." OR "Sc.D." OR "DSc" OR "ScD" OR "Doctor of Musical Arts" OR "D.M.A." OR "DMA") `;
            }
            if (education == "Associate degree (A.A., A.S., etc.)") {
                query += `AND ("Associate's degree" OR "Associate degree" OR "A.A." OR "AA" OR "A.S." OR "AS" OR "A.A.S." OR "AAS" OR "A.E." OR "AE" OR "A.N." OR "AN" OR "A.F." OR "AF" OR "A.T." OR "AT" OR "A.A.A." OR "AAA" OR "A.A.B." OR "AAB" OR "A.A.T." OR "AAT" OR "A.B.A." OR "ABA" OR "A.B.S." OR "ABS" OR "A.D.N." OR "ADN" OR "A.E.S." OR "AES" OR "A.E.T." OR "AET" OR "A.F.A." OR "AFA" OR "A.G.S." OR "AGS" OR "A.I.T." OR "AIT" OR "A.O.S." OR "AOS" OR "A.P.E." OR "APE" OR "A.P.S." OR "APS" OR "A.P.T." OR "APT" OR "A.P.S.T." OR "APST" OR "A.P.N." OR "APN" OR "A.P.R.N." OR "APRN" OR "A.R.N.P." OR "ARNP" OR "A.U.D." OR "AUD" OR "A.D." OR "AD" OR "A.C.R.N.P." OR "ACRNP" OR "A.P.S." OR "APS" OR "A.P.T." OR "APT" OR "A.P.E." OR "APE" OR "A.P.S.T." OR "APST" OR "A.P.N." OR "APN" OR "A.P.R.N." OR "APRN" OR "A.R.N.P." OR "ARNP" OR "A.U.D." OR "AUD" OR "A.D." OR "AD" OR "A.C.R.N.P." OR "ACRNP")`;
            }
        }

        // Include DevType if selected
        if (DevType && filters.devTypeEnabled) {
            if (DevType == "Developer, full-stack") {
                query += `AND (full-stack) `;
            }
            if (DevType == "Developer, back-end") {
                query += `AND (back-end) `;
            }
            if (DevType == "Developer, front-end") {
                query += `AND (front-end) `;
            }
            if (DevType == "Developer, desktop or enterprise applications") {
                query += `AND (desktop OR enterprise applications OR Desktop applications OR Enterprise) `;
            }
            if (DevType == "Developer, mobile") {
                query += `AND (mobile OR Mobile app) `;
            }
            if (DevType == "Developer, embedded applications or devices") {
                query += `AND (embedded applications OR embedded systems OR Embedded device OR Embedded) `;
            }
            if (DevType == "Data engineer") {
                query += `AND (Data engineer OR Data infrastructure engineer OR Data pipeline engineer) `;
            }
            if (DevType == "Engineering manager") {
                query += `AND (Engineering manager OR Tech lead OR Technical manager OR Engineering lead) `;
            }
            if (DevType == "DevOps specialist") {
                query += `AND (DevOps specialist OR DevOps engineer OR DevOps) `;
            }
            if (DevType == "Data scientist or machine learning specialist") {
                query += `AND (Data scientist OR Machine learning specialist OR Data scientist ML) `;
            }
            if (DevType == "Research & Development role") {
                query += `AND (Research & Development OR R&D role OR Research scientist) `;
            }
            if (DevType == "Academic researcher") {
                query += `AND Researcher `;
            }
            if (DevType == "Senior Executive (C-Suite, VP, etc.)") {
                query += `AND (Senior Executive OR C-Suite OR VP OR CTO OR CEO) `;
            }
            if (DevType == "Cloud infrastructure engineer") {
                query += `AND (Cloud infrastructure engineer OR Cloud engineer OR Cloud architect OR Cloud infrastructure) `;
            }
            if (DevType == "Developer, QA or test") {
                query += `AND (QA OR Quality assurance) `;
            }
            if (DevType == "Developer, game or graphics") {
                query += `AND (Game OR Graphics OR Games) `;
            }
            if (DevType == "Data or business analyst") {
                query += `AND (Data analyst OR Business analyst OR Business intelligence analyst OR BI) `;
            }
            if (DevType == "Developer, AI") {
                query += `AND (AI OR Artificial intelligence) `;
            }
            if (DevType == "System administrator") {
                query += `AND (System administrator OR Sysadmin OR System admin) `;
            }
            if (DevType == "Student") {
                query += `AND (Student OR Intern OR Graduate OR Recent graduate) `;
            }
            if (DevType == "Engineer, site reliability") {
                query += `AND (Site reliability OR SRE) `;
            }
            if (DevType == "Project manager") {
                query += `AND (Project manager OR Program manager) `;
            }
            if (DevType == "Scientist") {
                query += `AND Scientist `;
            }
            if (DevType == "Security professional") {
                query += `AND (Security OR Cybersecurity) `;
            }
            if (DevType == "Educator") {
                query += `AND (Educator OR Instructor OR Professor) `;
            }
            if (DevType == "Blockchain") {
                query += `AND (Blockchain OR Blockchain developer OR Blockchain engineer) `;
            }
            if (DevType == "Developer Experience") {
                query += `AND (Experience OR DevEx OR Advocate) `;
            }
            if (DevType == "Product manager") {
                query += `AND (Product manager OR Product owner OR PM) `;
            }
            if (DevType == "Hardware Engineer") {
                query += `AND (Hardware engineer OR Hardware developer) `;
            }
            if (DevType == "Database administrator") {
                query += `AND (Database administrator OR DBA OR Database engineer) `;
            }
            if (DevType == "Developer Advocate") {
                query += `AND (Advocate OR DevRel) `;
            }
            if (DevType == "Designer") {
                query += `AND Designer `;
            }
            if (DevType == "Marketing or sales professional") {
                query += `AND (Marketing OR Sales) `;
            }

        }

        // Include industry if selected
        if (Industry && filters.industryEnabled) query += `AND ${Industry} `;

        // Include remote work preference if selected
        if (RemoteWork && filters.remoteWorkEnabled) query += `AND ${RemoteWork} `;


        if (filters.includeKeywords) {
            const words = filters.includeKeywords.split(",").map(word => word.trim()).filter(word => word);
            console.log("Included keywords:", words);
            if (words.length > 0) {
                query += words.map(word => `AND ${word}`).join(" ") + " ";
            }
        }

        // Exclude keywords if provided.
        // Splits the input by commas and prepends a minus sign to each term.
        if (filters.keywords) {
            const words = filters.keywords.split(",").map(word => word.trim()).filter(word => word);
            console.log("Excluded keywords:", words);
            if (words.length > 0) {
                query += words.map(word => ` -${word}`).join(" ") + " ";
            }
        }
        const noapplications = '"No longer accepting applications"';//try to Exclude jobs that are no longer accepting applications
        query += `AND -${noapplications} `;
        console.log(query);

        return query;
    };

    const searchJobs = async (pageNumber = 1) => {
        setLoading(true);
        try {
            const response = await fetch(`${config.apiBaseUrl}/api/jobs/search-jobs?query=${encodeURIComponent(searchQuery)}&page=${pageNumber}&recency=${recency}`);

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

    const handleRecencyChange = (e) => {
        setRecency(e.target.value);
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

            <div className="relative">
                {/* Button to toggle dropdown */}
                <button
                    className="px-4 py-2 border rounded bg-blue-500 text-white"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    Filters
                </button>

                {/* Floating dropdown menu */}
                {isOpen && (
                    <div className="absolute z-10 mt-2 w-80 bg-white shadow-lg rounded border p-4">
                        {/* Filter Toggles */}
                        <h3 className="text-lg font-bold mb-4">Filters</h3>
                        <div className="space-y-4">
                            <div>
                                <label>
                                    <input
                                        type="checkbox"
                                        name="countryEnabled"
                                        checked={filters.countryEnabled}
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
                                        checked={filters.languagesEnabled}
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
                                        checked={filters.databasesEnabled}
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
                                        checked={filters.platformsEnabled}
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
                                        checked={filters.webFrameworksEnabled}
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
                                        checked={filters.toolsEnabled}
                                        onChange={handleToggleChange}
                                    />
                                    Include Tools
                                </label>
                            </div>
                            <div>
                                <label>
                                    <input
                                        type="checkbox"
                                        name="educationEnabled"
                                        checked={filters.educationEnabled}
                                        onChange={handleToggleChange}
                                    />
                                    Include Education
                                </label>
                            </div>
                            <div>
                                <label>
                                    <input
                                        type="checkbox"
                                        name="devTypeEnabled"
                                        checked={filters.devTypeEnabled}
                                        onChange={handleToggleChange}
                                    />
                                    Include Dev Type
                                </label>
                            </div>
                            <div>
                                <label>
                                    <input
                                        type="checkbox"
                                        name="industryEnabled"
                                        checked={filters.industryEnabled}
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
                                        checked={filters.remoteWorkEnabled}
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
                                    value={filters.keywords}
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
                                    value={filters.includeKeywords}
                                    onChange={handleIncludeKeywordsChange}
                                    className="ml-2 px-4 py-2 border rounded"
                                    placeholder="Enter keywords to include, comma-separated"
                                />
                            </label>
                        </div>

                        {/* Recency Selection */}
                        <div className="mb-4">
                            <label>
                                Recency:
                                <select
                                    value={recency}
                                    onChange={handleRecencyChange}
                                    className="ml-2 px-4 py-2 border rounded"
                                >
                                    <option value="d1">Past 24 Hours</option>
                                    <option value="d7">Past 7 Days</option>
                                    <option value="d30">Past 30 Days</option>
                                </select>
                            </label>
                        </div>
                    </div>
                )}
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
