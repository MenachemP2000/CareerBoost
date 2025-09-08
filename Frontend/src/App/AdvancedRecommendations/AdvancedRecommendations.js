import React from "react";
// import {Container, Row, Col, Card, Button} from 'react-bootstrap';
// import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
import {useNavigate} from 'react-router-dom';
import {Dropdown, DropdownButton, Form} from "react-bootstrap";
import config from '../config';
import "./AdvancedRecommendations.css"

const AdvancedRecommendations = ({
                                     // App-level props
                                     toggleScreen, isSignedIn, toggleSignendIn,
                                     // Vocab lists used for filtering by feature family
                                     languages, databases, platforms, webframesworks, tools, OpSys, employments,
                                     // Currency display
                                     exchangeRate, selectedCurrency
                                 }) => {
    const navigate = useNavigate();
    // ----- Local state -----
    const [error, setError] = useState('');
    // Whether to reverse the natural order (low → high)
    const [backwardsort, setBackwardsort] = useState(false);
    // The currently shown recommendation strings
    const [recommendations, setRecommendations] = useState([]);
    // Map: recommendation string → numeric increase (in base currency)
    const [recommendationsIncrese, setRecommendationsIncrese] = useState({});

    // Toggle visibility of feature families
    const [showPath, setShowPath] = useState(true);
    const [showLanguages, setShowLanguages] = useState(true);
    const [showDatabases, setShowDatabases] = useState(true);
    const [showPlatforms, setShowPlatforms] = useState(true);
    const [showWebframesworks, setShowWebframesworks] = useState(true);
    const [showTools, setShowTools] = useState(true);
    const [showOpSys, setShowOpSys] = useState(true);
    const [showEmployments, setShowEmployments] = useState(true);

    // Toggle visibility of feature families
    const paths = [
        "MainBranch", "Age", "RemoteWork", "EdLevel", "YearsCode", "YearsCodePro", "DevType",
        "OrgSize", "Country", "ICorPM", "WorkExp", "Industry", "JobSat"
    ];

    // Guard route + set current page label for navbar highlighting
    useEffect(() => {

        let filteredRecommendations = [];
        // Build a convenience structure describing which families are on/off
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

        // Create a map: recommendation string → increase value
        const inc = {};
        isSignedIn.recommendations.forEach((value, i) => {
            inc[value] = isSignedIn.recommendationsIncrese[i];
        });
        setRecommendationsIncrese(inc);

        let increaseDictionary = {}
        setRecommendationsIncrese(increaseDictionary);

        isSignedIn.recommendations.forEach((value, i) => {
            increaseDictionary[value] = isSignedIn.recommendationsIncrese[i];
        });

        if (Object.values(dict).some(([show]) => show)) {
            filteredRecommendations = isSignedIn.recommendations?.length
                ? isSignedIn.recommendations
                    .map((recommendation, i) => ({recommendation, i}))
                    .filter(({i}) =>
                        // Only keep recs with a known source feature
                        isSignedIn.recommendationsFeature?.[i] &&
                        // Keep if its source feature belongs to any enabled family
                        Object.entries(dict).some(([key, [show, values]]) =>
                            show && values.includes(isSignedIn.recommendationsFeature[i])
                        )
                    )
                    .map(({recommendation}) => recommendation)
                : [];
        }

        // Copy to avoid mutation
        let sortedRecommendations = [...filteredRecommendations];

        // Optional reverse to “low → high”
        if (backwardsort) {
            sortedRecommendations.reverse(); // Simply flip the order
        }
        setRecommendations(sortedRecommendations);

    }, [showPath, showLanguages, showDatabases, showPlatforms, showWebframesworks, showTools, showOpSys,
        showEmployments, backwardsort, isSignedIn]);

    // page guard + set current page name
    useEffect(() => {
        toggleScreen("AdvancedRecommendations");
        if (!isSignedIn) {
            navigate("/");
        }
    });

    // ----- Handlers -----

    const handleSignout = () => {
        toggleSignendIn(false);
    }

    // Calls the model to re-generate recommendations, then persists them
    const handleRecommendations = async (e) => {
        e.preventDefault();
        const payload = {_id: isSignedIn._id, username: isSignedIn.username};

        try {
            // Build the feature payload for the ML endpoint
            const userprofile = {
                Country: isSignedIn.country,
                WorkExp: isSignedIn.experience,
                EdLevel: isSignedIn.education,
                Age: isSignedIn.age
            };
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

            // Merge result into payload for persistence
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
            // Refresh app-level signed-in state
            toggleSignendIn(isSignedIn.username);
        } catch (error) {
            setError('An error occurred. Please try again.');
            console.error('Error:', error);
        }
    }
    // ----- Render -----
    return (

        <div className="advrec-page">
            <header className="profile-header">
                <h1 className="profile-title">Advanced Recommendations</h1>
                <p className="profile-subtitle">Here’s your full recommendations list.</p>
            </header>


            {/* Main content block */}
            <section className="section">
                <div className="section-header">
                    <h2 className="section-title">Recommendations</h2>

                    {/* Right-aligned toolbar with a compact dropdown of toggles */}
                    <div className="toolbar">
                        <DropdownButton title="Options" align="end" className="toolbar-dropdown">
                            {[
                                { id: "lang", state: showLanguages, set: setShowLanguages, label: "Show Languages" },
                                { id: "db", state: showDatabases, set: setShowDatabases, label: "Show Databases" },
                                { id: "plat", state: showPlatforms, set: setShowPlatforms, label: "Show Platforms" },
                                { id: "web", state: showWebframesworks, set: setShowWebframesworks, label: "Show Web Frameworks" },
                                { id: "tools", state: showTools, set: setShowTools, label: "Show Tools" },
                                { id: "ops", state: showOpSys, set: setShowOpSys, label: "Show Operating Systems" },
                                { id: "emp", state: showEmployments, set: setShowEmployments, label: "Show Employment Status" },
                                { id: "path", state: showPath, set: setShowPath, label: "Show Career Path" },
                                { id: "sort", state: backwardsort, set: setBackwardsort, label: "Sort Low to High" },
                            ].map(({ id, state, set, label }) => (
                                <Dropdown.Item as="div" key={id} className="filter-option">
                                    <Form.Check
                                        type="checkbox"
                                        id={`opt-${id}`}
                                        checked={state}
                                        onChange={() => set(!state)}
                                        label={label}
                                    />
                                </Dropdown.Item>
                            ))}
                        </DropdownButton>
                    </div>
                </div>

                {/* Empty state */}
                {!isSignedIn?.recommendations || recommendations.length === 0 ? (
                    <>
                        <p className="muted">Click the button below to get recommendations based on your profile.</p>
                        <div className="cta-center">
                            <button className="profile-button" onClick={handleRecommendations}>
                                Get Recommendations
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Table-like list with two columns: text + increase */}
                        <div className="list">
                            <div className="list-header">
                                <div>Recommendation</div>
                                <div>Increase</div>
                            </div>

                            {recommendations.map((rec, i) => (
                                <div key={`${rec}-${i}`} className="list-row">
                                    {/* Recommendation text with boilerplate removed */}
                                    <div className="col-name">
                                        {rec.replace(
                                            /(to |it would |will )?increase your salary by approximately /g,
                                            ""
                                        )}
                                    </div>

                                    {/* Currency pill on the right */}
                                    <div className="col-inc">
                    <span className="pill pill-positive">
                      +
                        {" "}
                        {new Intl.NumberFormat("en", {
                            style: "currency",
                            currency: selectedCurrency,
                            maximumFractionDigits: 0,
                        }).format(
                            Math.floor((recommendationsIncrese[rec] || 0) * exchangeRate)
                        )}
                    </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Recompute CTA */}
                        <div className="cta-center">
                            <button className="profile-button" onClick={handleRecommendations}>
                                Re-Recommended
                            </button>
                        </div>
                    </>
                )}
            </section>


            {/* Bottom navigation: matches Profile/Prediction ghost buttons */}
                <div className="profile-buttons">
                    <button onClick={() => navigate("/Recommendations")} className="profile-button is-outline">
                        Basic
                    </button>
                    <button onClick={() => navigate("/SavedRecommendations")} className="profile-button is-outlineprofile-button is-outline">
                        Saved
                    </button>
                    <button onClick={handleSignout} className="profile-button is-danger-outline">
                        Sign Out
                    </button>
                </div>


        </div>
    )
        ;
}

export default AdvancedRecommendations;