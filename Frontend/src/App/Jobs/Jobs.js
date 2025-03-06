import { useState, useEffect } from "react";
import config from '../config';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';


export default function Jobs({ toggleScreen, isSignedIn, toggleSignendIn, countryCrMap }) {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]); // Ensure this is an array
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');


    useEffect(() => {
        toggleScreen("Jobs");
        if (!isSignedIn) {
            navigate("/");
        }
    }, [isSignedIn]);

    useEffect(() => {
        const searchQuery = buildSearchQuery(isSignedIn);
        searchJobs(searchQuery);
    }, [isSignedIn.username]);

    const decodeHtml = (html) => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.documentElement.textContent || doc.body.textContent;
    };



    const buildSearchQuery = (user) => {
        const { country, DevType } = user;

        let query = `site:linkedin.com/jobs/view `;
        // Include DevType if selected
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
        console.log(query);

        return query;
    };

    const searchJobs = async (searchQuery) => {
        setLoading(true);
        try {
            const response = await fetch(`${config.apiBaseUrl}/api/jobs/search-jobs?query=${encodeURIComponent(searchQuery)}&page=1&recency=d1&country=${countryCrMap[isSignedIn.country]}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const dataJobs = data.jobs;
            
            if (isSignedIn.country === "Israel") {
                dataJobs.forEach(job => {
                    job.country = "Israel";
                    job.company = decodeHtml(job.pagemap.metatags[0]["og:title"].split("גיוס עובדים")[0].trim());
                    job.job = decodeHtml(job.pagemap.metatags[0]["og:title"].split("גיוס עובדים")[1].split("|").slice(0, -1).join("|").trim());
                    job.location = decodeHtml(job.pagemap.metatags[0]["og:title"].split("גיוס עובדים")[1].split("|").slice(-1)[0].replace("LinkedIn", "").trim());
                });
            }
            if (isSignedIn.country === "United States of America") {
                dataJobs.forEach(job => {
                    job.country = "USA";
                    job.company = decodeHtml(job.pagemap.metatags[0]["og:title"].split("hiring")[0].trim());
                    job.job = decodeHtml(job.pagemap.metatags[0]["og:title"].split("hiring")[1].trim().split("in ")[0].trim());
                    job.location = decodeHtml(job.pagemap.metatags[0]["og:title"].split("hiring")[1].split("in ")[1].replace("| LinkedIn", "").trim());
                });
            }

            setJobs(Array.isArray(dataJobs) ? dataJobs : []);
        } catch (error) {
            console.error("Error fetching jobs:", error);
        }
        setLoading(false);
    };

    const saveJob = async (job) => {
        console.log(job);

        const jsonString = JSON.stringify(job);

        // Measure the byte length of the JSON string
        const byteLength = new TextEncoder().encode(jsonString).length;

        // Convert bytes to kilobytes (1 KB = 1024 bytes)
        const sizeInKB = byteLength / 1024;

        console.log(`Size of JSON object: ${sizeInKB.toFixed(2)} KB`);

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


    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Featured Jobs </h1>
            <Card >
                {loading && <p>Loading...</p>}
                {(!loading && jobs.length > 0) && (
                    <>
                        <ul className="space-y-2 ">
                            {jobs.map((job, index) => (
                                <li key={index} className=" p-4" style={{ listStyleType: "none" }}>
                                    <Card>
                                        <Card.Link href={job.link} target="_blank" rel="noopener noreferrer" >
                                            {decodeHtml(job.pagemap.metatags[0]["og:title"].replace("| LinkedIn", "")).replace("LinkedIn", "")}
                                        </Card.Link>
                                            <Card.Text>
                                                {job.snippet.match(/\d+\s\w+\sago/).length > 0 &&
                                                    <div> Posted: {job.snippet.match(/\d+\s\w+\sago/)}
                                                    </div>
                                                }
                                                {(job.country === "Israel"|| job.country === "USA") &&
                                                    <Col>
                                                        <div> Company: {job.company}
                                                        </div>
                                                        <div> Job: {job.job}
                                                        </div>
                                                        <div> Location: {job.location}
                                                        </div>
                                                    </Col>
                                                }
                                            </Card.Text>

                                        <Container>
                                            <Button as={Button} onClick={() => saveJob(job)} style={{ width: '10rem', margin: "10px" }} variant="secondary">Save</Button>
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


            <Row className="d-flex justify-content-center">
                <Container className="justify-content-center" >
                    <Button as={Link} to="/JobSearch" style={{ width: '12rem', margin: "10px" }} variant="primary" className="px-5 py-3">Search</Button>
                    <Button as={Link} to="/SavedRecommendations" style={{ width: '12rem', margin: "10px" }} variant="primary" className="px-5 py-3">Saved</Button>
                </Container>
            </Row>
        </div>
    );
}
