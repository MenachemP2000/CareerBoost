import React from "react";
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Dropdown, DropdownButton, Form } from "react-bootstrap";
import config from '../config';

const AdvancedRecommendations = ({ toggleScreen, isSignedIn, toggleSignendIn, languages, databases,
    platforms, webframesworks, tools, OpSys, employments }) => {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [backwardsort, setBackwardsort] = useState(false);
    const [recommendations, setRecommendations] = useState([]);
    const [recommendationsIncrese, setRecommendationsIncrese] = useState({});
    const [showPath, setShowPath] = useState(true);
    const [showLanguages, setShowLanguages] = useState(true);
    const [showDatabases, setShowDatabases] = useState(true);
    const [showPlatforms, setShowPlatforms] = useState(true);
    const [showWebframesworks, setShowWebframesworks] = useState(true);
    const [showTools, setShowTools] = useState(true);
    const [showOpSys, setShowOpSys] = useState(true);
    const [showEmployments, setShowEmployments] = useState(true);

    const paths = [
        "MainBranch", "Age", "RemoteWork", "EdLevel", "YearsCode", "YearsCodePro", "DevType",
        "OrgSize", "Country", "ICorPM", "WorkExp", "Industry", "JobSat"
    ];

    useEffect(() => {

        let filteredRecommendations = [];
        let dict = {
            languages: [showLanguages, languages],
            databases: [showDatabases, databases],
            platforms: [showPlatforms, platforms],
            webframesworks: [showWebframesworks, webframesworks],
            tools: [showTools, tools],
            OpSys: [showOpSys, OpSys],
            employments: [showEmployments, employments],
            paths: [showPath, paths]
        };

        let increaseDictionary = {}
        setRecommendationsIncrese(increaseDictionary);

        isSignedIn.recommendations.forEach((value, i) => {
            increaseDictionary[value] = isSignedIn.recommendationsIncrese[i];
        });

        if (Object.values(dict).some(([show]) => show)) {
            filteredRecommendations = isSignedIn.recommendations?.length
                ? isSignedIn.recommendations
                    .map((recommendation, i) => ({ recommendation, i }))
                    .filter(({ i }) =>
                        isSignedIn.recommendationsFeature?.[i] &&
                        Object.entries(dict).some(([key, [show, values]]) =>
                            show && values.includes(isSignedIn.recommendationsFeature[i])
                        )
                    )
                    .map(({ recommendation }) => recommendation)
                : [];
        }
        let sortedRecommendations = [...filteredRecommendations]; // Copy to avoid mutation

        if (backwardsort) {
            sortedRecommendations.reverse(); // Simply flip the order
        }
        setRecommendations(sortedRecommendations);

    }, [showPath, showLanguages, showDatabases, showPlatforms, showWebframesworks, showTools, showOpSys,
        showEmployments, backwardsort, isSignedIn]);

    useEffect(() => {
        toggleScreen("AdvancedRecommendations");
        if (!isSignedIn) {
            navigate("/");
        }
    });

    const handleSignout = () => {
        toggleSignendIn(false);
    }
    const handleRecommendations = async (e) => {
        e.preventDefault();
        const payload = { _id: isSignedIn._id, username: isSignedIn.username };

        try {
            const userprofile = { Country: isSignedIn.country, WorkExp: isSignedIn.experience, EdLevel: isSignedIn.education, Age: isSignedIn.age };
            if (isSignedIn.MainBranch) {
                userprofile.MainBranch = isSignedIn.MainBranch;
            }
            if (isSignedIn.RemoteWork) {
                userprofile.RemoteWork = isSignedIn.RemoteWork;
            }
            if (isSignedIn.DevType) {
                userprofile.DevType = isSignedIn.DevType;
            }
            if (isSignedIn.OrgSize) {
                userprofile.OrgSize = isSignedIn.OrgSize;
            }
            if (isSignedIn.ICorPM) {
                userprofile.ICorPM = isSignedIn.ICorPM;
            }
            if (isSignedIn.Industry) {
                userprofile.Industry = isSignedIn.Industry;
            }
            if (isSignedIn.YearsCode) {
                userprofile.YearsCode = isSignedIn.YearsCode;
            }
            if (isSignedIn.YearsCodePro) {
                userprofile.YearsCodePro = isSignedIn.YearsCodePro;
            }
            if (isSignedIn.JobSat) {
                userprofile.JobSat = isSignedIn.JobSat;
            }
            if (isSignedIn.languages) {
                for (let i = 0; i < isSignedIn.languages.length; i++) {
                    userprofile[isSignedIn.languages[i]] = 1;
                }
            }
            if (isSignedIn.employments) {
                for (let i = 0; i < isSignedIn.employments.length; i++) {
                    userprofile[isSignedIn.employments[i]] = 1;
                }
            }
            if (isSignedIn.databases) {
                for (let i = 0; i < isSignedIn.databases.length; i++) {
                    userprofile[isSignedIn.databases[i]] = 1;
                }
            }
            if (isSignedIn.platforms) {
                for (let i = 0; i < isSignedIn.platforms.length; i++) {
                    userprofile[isSignedIn.platforms[i]] = 1;
                }
            }
            if (isSignedIn.webframesworks) {
                for (let i = 0; i < isSignedIn.webframesworks.length; i++) {
                    userprofile[isSignedIn.webframesworks[i]] = 1;
                }
            }
            if (isSignedIn.tools) {
                for (let i = 0; i < isSignedIn.tools.length; i++) {
                    userprofile[isSignedIn.tools[i]] = 1;
                }
            }
            if (isSignedIn.OpSys) {
                for (let i = 0; i < isSignedIn.OpSys.length; i++) {
                    userprofile[isSignedIn.OpSys[i]] = 1;
                }
            }
            // Send the registration data to the server
            const response = await fetch(`${config.apiBaseUrl}/api/model/recommend`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userprofile)
            });

            const result = await response.json();
            payload.topRecommendations = result.topRecommendations;
            payload.combined = result.combined;
            payload.recommendations = result.recommendations;
            payload.recommendationsIncrese = result.recommendationsIncrese;
            payload.recommendationsFeature = result.recommendationsFeature;

            if (!response.ok) {
                // If the server responds with an error, set the error message
                setError(result.message);
                return;
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
            console.error('Error:', error);
        }

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

        <div>
            <div className="position-relative text-white text-center" >
                <div style={{ minHeight: "100vh" }} className=" top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex flex-column align-items-center justify-content-center">
                    <h3 className="display-4 fw-bold">Advanced Recommendations</h3>
                    <div className="underline mx-auto mb-3"></div>

                    <p className="lead">
                        Here's your full Recommendations list:
                    </p>
                    {(!isSignedIn.recommendations) &&
                        <Row className="d-flex justify-content-center">
                            <Card style={{ width: '18rem', margin: "10px" }}>
                                <Card.Header>Get Recommendations</Card.Header>
                                <Card.Body >
                                    <Card.Text>
                                        Click the button below to get recommendations Based on your profile
                                    </Card.Text>
                                    <Button as={Button} onClick={handleRecommendations} variant="primary" className="px-5 py-3">Recommendations</Button>
                                </Card.Body>
                            </Card>
                        </Row>
                    }

                    {(isSignedIn.recommendations) &&
                        <Card style={{ margin: "10px", maxWidth: '95vw' }}>

                            <Card.Header>Recommendations</Card.Header>
                            <br />
                            <DropdownButton id="filter-dropdown" title="Options" variant="primary">
                                {[
                                    { id: "checkbox1", state: showLanguages, setState: setShowLanguages, label: "Show Recommendations for Languages" },
                                    { id: "checkboxDatabases", state: showDatabases, setState: setShowDatabases, label: "Show Recommendations for Databases" },
                                    { id: "checkboxPlatforms", state: showPlatforms, setState: setShowPlatforms, label: "Show Recommendations for Platforms" },
                                    { id: "checkboxWebframesworks", state: showWebframesworks, setState: setShowWebframesworks, label: "Show Recommendations for Web Frameworks" },
                                    { id: "checkboxTools", state: showTools, setState: setShowTools, label: "Show Recommendations for Tools" },
                                    { id: "checkboxOpSys", state: showOpSys, setState: setShowOpSys, label: "Show Recommendations for Operating Systems" },
                                    { id: "checkboxEmployments", state: showEmployments, setState: setShowEmployments, label: "Show Recommendations for Employment Status" },
                                    { id: "checkbox2", state: showPath, setState: setShowPath, label: "Show Recommendations for Career Path" },
                                    { id: "checkbox3", state: backwardsort, setState: setBackwardsort, label: "Sort Low to High" }
                                ].map(({ id, state, setState, label }) => (
                                    <Dropdown.Item as="div" key={id} className="px-3">
                                        <Form.Check
                                            type="checkbox"
                                            id={id}
                                            checked={state}
                                            onChange={() => setState(!state)}
                                            label={label}
                                        />
                                    </Dropdown.Item>
                                ))}
                            </DropdownButton>

                            <br />

                            <Card.Text >
                                <ul className="list-none space-y-2">
                                    {recommendations.map((recommendation, index) => (
                                        <li style={{ listStyle: "none", textAlign: "left" }} key={index} className="p-2">{recommendation} <span  style ={{color: "green"}} > $ {recommendationsIncrese[recommendation]}</span >.</li>
                                    ))}
                                </ul>
                            </Card.Text>
                            <Card.Body >
                                <Card.Text>
                                    if you change your information, you can ask to be re-recommended
                                </Card.Text>
                                <Button as={Button} onClick={handleRecommendations} variant="primary" className="px-5 py-3">Reccomend</Button>
                            </Card.Body>
                        </Card>

                    }

                    <Row className="d-flex justify-content-center">
                        <Container className="justify-content-center" >
                            <Button as={Link} to="/Recommendations" style={{ width: '10rem', margin: "10px" }} variant="primary" className="px-5 py-3">Basic</Button>
                            <Button as={Link} to="/SavedRecommendations" style={{ width: '10rem', margin: "10px" }} variant="primary" className="px-5 py-3">Saved</Button>
                            <Button as={Button} style={{ width: '10rem', margin: "10px", whiteSpace: "nowrap" }} onClick={handleSignout} variant="primary" className="px-5 py-3">Sign Out</Button>
                        </Container>
                    </Row>

                </div>
            </div>
        </div>
    );
}

export default AdvancedRecommendations;