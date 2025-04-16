import React from "react";
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Dropdown, DropdownButton, Form } from "react-bootstrap";
import config from '../config';
import "./AdvancedRecommendations.css"
const AdvancedRecommendations = ({ toggleScreen, isSignedIn, toggleSignendIn, languages, databases,
    platforms, webframesworks, tools, OpSys, employments, exchangeRate, selectedCurrency }) => {
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

        <div className="advanced-recommendations-container">
            <h3 className="advanced-recommendations-title">Advanced Recommendations</h3>
            <div className="advanced-recommendations-overlay">

                <p className="advanced-recommendations-subtitle">Here's your full recommendations list:</p>

                {(!isSignedIn.recommendations) &&
                    <Row className="advanced-recommendations-row">
                        <Card className="advanced-recommendations-card">
                            <Card.Header>Get Recommendations</Card.Header>
                            <Card.Body>
                                <Card.Text>
                                    Click the button below to get recommendations Based on your profile
                                </Card.Text>
                                <Button onClick={handleRecommendations} variant="primary"
                                        className="advanced-recommendations-btn">Recommendations</Button>
                            </Card.Body>
                        </Card>
                    </Row>
                }

                {(isSignedIn.recommendations) &&
                    <Card className="advanced-recommendations-card">
                        <Card.Header>Recommendations</Card.Header>

                        <DropdownButton title="Options" variant="primary"  className="custom-dropdown">
                            {[
                                {
                                    id: "checkbox1",
                                    state: showLanguages,
                                    setState: setShowLanguages,
                                    label: "Show Recommendations for Languages"
                                },
                                {
                                    id: "checkboxDatabases",
                                    state: showDatabases,
                                    setState: setShowDatabases,
                                    label: "Show Recommendations for Databases"
                                },
                                {
                                    id: "checkboxPlatforms",
                                    state: showPlatforms,
                                    setState: setShowPlatforms,
                                    label: "Show Recommendations for Platforms"
                                },
                                {
                                    id: "checkboxWebframesworks",
                                    state: showWebframesworks,
                                    setState: setShowWebframesworks,
                                    label: "Show Recommendations for Web Frameworks"
                                },
                                {
                                    id: "checkboxTools",
                                    state: showTools,
                                    setState: setShowTools,
                                    label: "Show Recommendations for Tools"
                                },
                                {
                                    id: "checkboxOpSys",
                                    state: showOpSys,
                                    setState: setShowOpSys,
                                    label: "Show Recommendations for Operating Systems"
                                },
                                {
                                    id: "checkboxEmployments",
                                    state: showEmployments,
                                    setState: setShowEmployments,
                                    label: "Show Recommendations for Employment Status"
                                },
                                {
                                    id: "checkbox2",
                                    state: showPath,
                                    setState: setShowPath,
                                    label: "Show Recommendations for Career Path"
                                },
                                {
                                    id: "checkbox3",
                                    state: backwardsort,
                                    setState: setBackwardsort,
                                    label: "Sort Low to High"
                                }
                            ].map(({id, state, setState, label}) => (
                                <Dropdown.Item as="div" key={id} className="filter-option">
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

                        <Card.Body>
                            <ul className="advanced-recommendations-list">
                                {recommendations.map((recommendation, index) => {
                                    return (
                                        <li key={index} className="advanced-recommendations-item">
                                            <span className="recommendation-text">{recommendation} </span>
                                            <span className="salary-increase">
                                                    {new Intl.NumberFormat('en', {
                                                        style: 'currency',
                                                        currency: selectedCurrency,
                                                        maximumFractionDigits: 0
                                                    }).format(Math.floor(recommendationsIncrese[recommendation] * exchangeRate))}
                                                </span>
                                        </li>
                                    );
                                })}
                            </ul>
                        </Card.Body>
                        <Card.Body>
                            <Card.Text className="re-recommended-text">
                                If you change your information, you can ask to be re-recommended:
                            </Card.Text>
                            <button onClick={handleRecommendations} className="re-btn">Re-Recommended</button>
                        </Card.Body>
                    </Card>


                }

                <Container className="advanced-recommendations-btn">
                    <Button as={Link} to="/Recommendations" className="action-btn">Basic</Button>
                    <Button as={Link} to="/SavedRecommendations" className="action-btn">Saved</Button>
                    <Button onClick={handleSignout} className="action-btn">Sign Out</Button>
                </Container>

            </div>
        </div>
    );
}

export default AdvancedRecommendations;