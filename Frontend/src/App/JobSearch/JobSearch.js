import { useState, useEffect } from "react";
import config from '../config';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';


export default function JobSearch({ toggleScreen, isSignedIn, toggleSignendIn, countryCrMap }) {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]); // Ensure this is an array

    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [recency, setRecency] = useState("d1");
    const [filters, setFilters] = useState({
        countryEnabled: true,
        devTypeEnabled: true,
        keywords: "",  // New field for excluded keywords,
        includeKeywords: ""  // New field for included keywords
    });
    const [isOpen, setIsOpen] = useState(false);
    const [includeCountry, setIncludeCountry] = useState(false);
    const [error, setError] = useState('');
    const [email, setEmail] = useState("");
    const [frequency, setFrequency] = useState("daily");
    const [alertsIsOpen, setAlertIsOpen] = useState(false);


    useEffect(() => {
        toggleScreen("JobSearch");
        if (!isSignedIn) {
            navigate("/");
        }
        const searchQuery = buildSearchQuery(isSignedIn);
        setSearchQuery(searchQuery);
        console.log("filters", filters);
    }, [filters, isSignedIn]); // Update searchQuery whenever filters change

    useEffect(() => {
        if (!loading) {
            searchJobs(1);
        }
    }, [isSignedIn.username]);



    const decodeHtml = (html) => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.documentElement.textContent || doc.body.textContent;
    };

    const buildSearchQuery = (user) => {
        const { country, experience, education, languages, Industry, RemoteWork, databases,
            platforms, webframesworks, tools, DevType } = user;

        let query = `site:linkedin.com/jobs/view `;

        // Include country if selected
        if (country && filters.countryEnabled) setIncludeCountry(true);
        else setIncludeCountry(false);

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

    const searchJobs = async (pageNumber) => {
        let initialSearch = true;

        if (pageNumber === 1 || !searchQuery) {
            setJobs([]); // Clear jobs on new search
        }
        setLoading(true);
        try {
            let url = ``;
            if (searchQuery) {
                initialSearch = false;
                url = `${config.apiBaseUrl}/api/jobs/search-jobs?query=${encodeURIComponent(searchQuery)}&page=${pageNumber}&recency=${recency}`;

                if (includeCountry) {
                    url += `&country=${countryCrMap[isSignedIn.country]}`;
                }
            }
            else {
                const { DevType } = isSignedIn;
                let query = `site:linkedin.com/jobs/view `;
                if (DevType) {
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
                const noapplications = '"No longer accepting applications"';//try to Exclude jobs that are no longer accepting applications
                query += `AND -${noapplications} `;

                url = `${config.apiBaseUrl}/api/jobs/search-jobs?query=${encodeURIComponent(query)}&page=${pageNumber}&recency=${recency}`;
                url += `&country=${countryCrMap[isSignedIn.country]}`;
            }

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            const dataJobs = data.jobs;

            if ((includeCountry || initialSearch) && (isSignedIn.country === "Israel")) {
                dataJobs.forEach(job => {
                    job.parsedTitle = decodeHtml(job.pagemap.metatags[0]["og:title"]).replace("| LinkedIn", "").replace("LinkedIn", "");
                    job.country = "Israel";
                    job.company = decodeHtml(job.pagemap.metatags[0]["og:title"].split("גיוס עובדים")[0].trim());
                    job.job = decodeHtml(job.pagemap.metatags[0]["og:title"].split("גיוס עובדים")[1].split("|").slice(0, -1).join("|").trim());
                    job.location = decodeHtml(job.pagemap.metatags[0]["og:title"].split("גיוס עובדים")[1].split("|").slice(-1)[0].replace("LinkedIn", "").trim());
                });
            }
            else if ((includeCountry || initialSearch) && (isSignedIn.country === "United States of America")) {
                dataJobs.forEach(job => {
                    job.parsedTitle = decodeHtml(job.pagemap.metatags[0]["og:title"]).replace("| LinkedIn", "").replace("LinkedIn", "");
                    job.country = "USA";
                    job.company = decodeHtml(job.pagemap.metatags[0]["og:title"].split("hiring")[0].trim());
                    job.job = decodeHtml(job.pagemap.metatags[0]["og:title"].split("hiring")[1].trim().split("in ")[0].trim());
                    job.location = decodeHtml(job.pagemap.metatags[0]["og:title"].split("hiring")[1].split("in ")[1].replace("| LinkedIn", "").trim());
                });
            }
            else {
                dataJobs.forEach(job => {
                    job.parsedTitle = decodeHtml(job.pagemap.metatags[0]["og:title"]).replace("| LinkedIn", "").replace("LinkedIn", "");
                    job.country = isSignedIn.country;
                    job.company = "not available";
                    job.job = "not available";
                    job.location = "not available";
                });
            }

            setJobs(prevJobs => {
                const newJobs = dataJobs.filter(job =>
                    !prevJobs.some(existingJob => existingJob.link === job.link)
                );
                return [...prevJobs, ...newJobs];
            });

            setTotalPages(data.totalPages || 1);
            setPage(pageNumber);
        } catch (error) {
            console.error("Error fetching jobs:", error);
        }
        setLoading(false);
    };


    const saveJob = async (job) => {

        const payload = { _id: isSignedIn._id, username: isSignedIn.username };
        const savedJobs = isSignedIn.savedJobs || [];

        savedJobs.push(job);
        payload.savedJobs = savedJobs;
        try {
            // Send the registration data to the server
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
                // If the server responds with an error, set the error message
                setError(result.message);
                return;
            }
            toggleSignendIn(isSignedIn.username);
        } catch (error) {
            setError('An error occurred. Please try again.');
            console.error('Error:', error);
        }
    }

    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > totalPages) return;
        searchJobs(newPage);
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        let initialSearch = true;
        let url = ``;
        let query = '';

        if (searchQuery) {
            query = searchQuery;
            initialSearch = false;
            url = `${config.apiBaseUrl}/api/jobs/search-jobs?query=${encodeURIComponent(searchQuery)}&page=1&recency=${recency}`;

            if (includeCountry) {
                url += `&country=${countryCrMap[isSignedIn.country]}`;
            }
        }
        else {
            const { DevType } = isSignedIn;
            query = `site:linkedin.com/jobs/view `;
            if (DevType) {
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
            const noapplications = '"No longer accepting applications"';
            query += `AND -${noapplications} `;

            url = `${config.apiBaseUrl}/api/jobs/search-jobs?query=${encodeURIComponent(query)}&page=1&recency=${recency}`;
            url += `&country=${countryCrMap[isSignedIn.country]}`;
        }

        const payload = { _id: isSignedIn._id, username: isSignedIn.username };
        const newAlerts = isSignedIn.alerts || [];
        let country = isSignedIn.country;
        if (!includeCountry && !initialSearch) {
            country = "All";
        }

        const newAlert = { query: query, recency: recency, email: email, frequency: frequency, country: country, url: url, user: isSignedIn.username };

        const isDuplicate = newAlerts.some(alert =>
            alert.query === query &&
            alert.recency === recency &&
            alert.email === email &&
            alert.frequency === frequency &&
            alert.country === country &&
            alert.url === url &&
            alert.user === isSignedIn.username
        );

        if (!isDuplicate) {
            newAlerts.push(newAlert);
        }

        payload.alerts = newAlerts;

        try {
            // Send the registration data to the server
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
                // If the server responds with an error, set the error message
                setError(result.message);
                return;
            }
            toggleSignendIn(isSignedIn.username);
        } catch (error) {
            setError('An error occurred. Please try again.');
            console.error('Error:', error);
        }
    };

    const deleteAlert = async (alert) => {
        const payload = { _id: isSignedIn._id, username: isSignedIn.username };
        const newAlerts = isSignedIn.alerts.filter(a => a !== alert);
        payload.alerts = newAlerts;

        try {
            // Send the registration data to the server
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
                // If the server responds with an error, set the error message
                setError(result.message);
                return;
            }
            toggleSignendIn(isSignedIn.username);
        } catch (error) {
            setError('An error occurred. Please try again.');
            console.error('Error:', error);
        }
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Search jobs</h1>
            <Card>
                <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                    <button
                        onClick={() => searchJobs(1)} // Reset to page 1 on search
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                        disabled={loading}
                    >
                        {loading ? "Searching..." : "Search"}
                    </button>
                </div>

                <div >
                    {/* Button to toggle dropdown */}
                    <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                        <button
                            className="px-4 py-2 border rounded bg-blue-500 text-white"
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            Filters
                        </button>
                    </div>

                    {/* Floating dropdown menu */}
                    {isOpen && (
                        <Card style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                            {/* Filter Toggles */}
                            <Card.Header >Filters</Card.Header>
                            <div className="space-y-4" style={{ padding: "10px", justifyContent: "center", margin: "10px" }}>

                                <label style={{ display: "flex", gap: "10px", border: "1px solid", padding: "5px", margin: "10px", borderRadius: "10px", width: "18rem", backgroundColor: "lightblue", justifyContent: "space-between" }}>
                                    Include Country
                                    <input
                                        type="checkbox"
                                        name="countryEnabled"
                                        checked={filters.countryEnabled}
                                        onChange={handleToggleChange}
                                    />
                                </label>
                                <label style={{ display: "flex", gap: "10px", border: "1px solid", padding: "5px", margin: "10px", borderRadius: "10px", width: "18rem", backgroundColor: "lightblue", justifyContent: "space-between" }}>
                                    Include Languages
                                    <input
                                        type="checkbox"
                                        name="languagesEnabled"
                                        checked={filters.languagesEnabled}
                                        onChange={handleToggleChange}
                                    />
                                </label>
                                <label style={{ display: "flex", gap: "10px", border: "1px solid", padding: "5px", margin: "10px", borderRadius: "10px", width: "18rem", backgroundColor: "lightblue", justifyContent: "space-between" }}>
                                    Include Databases
                                    <input
                                        type="checkbox"
                                        name="databasesEnabled"
                                        checked={filters.databasesEnabled}
                                        onChange={handleToggleChange}
                                    />
                                </label>
                                <label style={{ display: "flex", gap: "10px", border: "1px solid", padding: "5px", margin: "10px", borderRadius: "10px", width: "18rem", backgroundColor: "lightblue", justifyContent: "space-between" }}>
                                    Include Platforms
                                    <input
                                        type="checkbox"
                                        name="platformsEnabled"
                                        checked={filters.platformsEnabled}
                                        onChange={handleToggleChange}
                                    />
                                </label>
                                <label style={{ display: "flex", gap: "10px", border: "1px solid", padding: "5px", margin: "10px", borderRadius: "10px", width: "18rem", backgroundColor: "lightblue", justifyContent: "space-between" }}>
                                    Include Web Frameworks

                                    <input
                                        type="checkbox"
                                        name="webFrameworksEnabled"
                                        checked={filters.webFrameworksEnabled}
                                        onChange={handleToggleChange}
                                    />
                                </label>
                                <label style={{ display: "flex", gap: "10px", border: "1px solid", padding: "5px", margin: "10px", borderRadius: "10px", width: "18rem", backgroundColor: "lightblue", justifyContent: "space-between" }}>
                                    Include Tools

                                    <input
                                        type="checkbox"
                                        name="toolsEnabled"
                                        checked={filters.toolsEnabled}
                                        onChange={handleToggleChange}
                                    />
                                </label>
                                <label style={{ display: "flex", gap: "10px", border: "1px solid", padding: "5px", margin: "10px", borderRadius: "10px", width: "18rem", backgroundColor: "lightblue", justifyContent: "space-between" }}>
                                    Include Education

                                    <input
                                        type="checkbox"
                                        name="educationEnabled"
                                        checked={filters.educationEnabled}
                                        onChange={handleToggleChange}
                                    />
                                </label>
                                <label style={{ display: "flex", gap: "10px", border: "1px solid", padding: "5px", margin: "10px", borderRadius: "10px", width: "18rem", backgroundColor: "lightblue", justifyContent: "space-between" }}>

                                    Include Dev Type
                                    <input
                                        type="checkbox"
                                        name="devTypeEnabled"
                                        checked={filters.devTypeEnabled}
                                        onChange={handleToggleChange}
                                    />
                                </label>
                                <label style={{ display: "flex", gap: "10px", border: "1px solid", padding: "5px", margin: "10px", borderRadius: "10px", width: "18rem", backgroundColor: "lightblue", justifyContent: "space-between" }}>

                                    Include Industry
                                    <input
                                        type="checkbox"
                                        name="industryEnabled"
                                        checked={filters.industryEnabled}
                                        onChange={handleToggleChange}
                                    />
                                </label>
                                <label style={{ display: "flex", gap: "10px", border: "1px solid", padding: "5px", margin: "10px", borderRadius: "10px", width: "18rem", backgroundColor: "lightblue", justifyContent: "space-between" }}>

                                    Include Remote Work Preference
                                    <input
                                        type="checkbox"
                                        name="remoteWorkEnabled"
                                        checked={filters.remoteWorkEnabled}
                                        onChange={handleToggleChange}
                                    />
                                </label>
                            </div>

                            {/* Keyword Exclusion Filter Input */}
                            <div className="space-y-4" style={{ padding: "10px", justifyContent: "center", margin: "10px" }}>
                                <label>
                                    <span>Exclude Keywords (e.g., Senior): </span>
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
                            <div className="space-y-4" style={{ padding: "10px", justifyContent: "center", margin: "10px" }}>
                                <label>
                                    <span> Include Keywords (e.g., Junior): </span>
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
                            <div className="space-y-4" style={{ padding: "10px", justifyContent: "center", margin: "10px" }}>
                                <label>
                                    <span>Recency: </span>
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
                        </Card>
                    )}
                </div>

                <div >
                    {/* Button to toggle dropdown */}
                    <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                        <button
                            className="px-4 py-2 border rounded bg-blue-500 text-white"
                            onClick={() => setAlertIsOpen(!alertsIsOpen)}
                        >
                            Alerts
                        </button>
                    </div>

                    {/* Floating dropdown menu */}
                    {alertsIsOpen && (
                        <Card>
                            <Card.Header className="text-lg font-bold mb-4">Alerts</Card.Header>


                            <form onSubmit={handleSubmit} className="p-" style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="border p-2 rounded"
                                />
                                <select value={frequency} onChange={(e) => setFrequency(e.target.value)} className="ml-2 border p-2 rounded">
                                    <option value="daily">Daily</option>
                                    <option value="weekly">Weekly</option>
                                </select>
                                <button type="submit" className="ml-2 bg-blue-500 text-white p-2 rounded">
                                    Add alert
                                </button>
                            </form>
                            {(isSignedIn.alerts && isSignedIn.alerts.length > 0) && (

                                <ul>
                                    {isSignedIn.alerts.map((alert, index) => (
                                        <li key={index} className=" p-4" style={{ listStyleType: "none" }}>
                                            <Card>
                                                <Card.Body>
                                                    <p>query: {alert.query}</p>
                                                    <p>recency: {alert.recency}</p>
                                                    <p>email: {alert.email}</p>
                                                    <p>frequency: {alert.frequency}</p>
                                                    <p>country: {alert.country}</p>
                                                </Card.Body>
                                                <Button onClick={() => deleteAlert(alert)} variant="danger" style={{ width: '10rem', margin: "10px" }}>Delete</Button>
                                            </Card>

                                        </li>
                                    ))}
                                </ul>
                            )}

                        </Card>

                    )}
                </div>


                <Card >
                    {loading && <p>Loading...</p>}
                    {(!loading && jobs.length > 0) && (
                        <>
                            <ul className="space-y-2 ">
                                {jobs.map((job, index) => (
                                    <li key={index} className=" p-4" style={{ listStyleType: "none" }}>
                                        <Card>
                                            <Card.Link href={job.link} target="_blank" rel="noopener noreferrer" >
                                                {job.parsedTitle}
                                            </Card.Link>
                                            <Card.Body>
                                                {job.snippet.match(/\d+\s\w+\sago/).length > 0 &&
                                                    <div> Posted: {job.snippet.match(/\d+\s\w+\sago/)}
                                                    </div>
                                                }
                                                {(job.country === "Israel" || job.country === "USA") &&
                                                    <Col>
                                                        <div> Company: {job.company}
                                                        </div>
                                                        <div> Job: {job.job}
                                                        </div>
                                                        <div> Location: {job.location}
                                                        </div>
                                                    </Col>
                                                }
                                            </Card.Body>
                                            <Container>
                                                {isSignedIn.savedJobs && isSignedIn.savedJobs.find(savedJob => savedJob.link === job.link) ?
                                                    <Button as={Button} disabled style={{ width: '10rem', margin: "10px" }} variant="secondary">Saved</Button>
                                                    :
                                                    <Button as={Button} onClick={() => saveJob(job)} style={{ width: '10rem', margin: "10px" }} variant="secondary">Save</Button>
                                                }
                                            </Container>

                                        </Card>
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                    {(!loading && jobs.length === 0) && (
                        <p>No jobs found</p>
                    )}
                </Card>


                <div className="flex justify-center gap-4 mt-4 items-center">

                    {/* Next Page Button */}
                    <button
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page >= totalPages}
                        className="px-4 py-2 bg-gray-500 text-white rounded"
                    >
                        More
                    </button>
                </div>




                <Row className="d-flex justify-content-center">
                    <Container className="justify-content-center" >
                        <Button as={Link} to="/FeaturedJobs" style={{ width: '12rem', margin: "10px" }} variant="primary" className="px-5 py-3">Featured</Button>
                        <Button as={Link} to="/SavedJobs" style={{ width: '12rem', margin: "10px" }} variant="primary" className="px-5 py-3">Saved</Button>
                    </Container>
                </Row>

            </Card>

        </div>
    );
}
