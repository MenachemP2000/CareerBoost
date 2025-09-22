import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Dropdown, DropdownButton, Form } from "react-bootstrap";
import config from '../config';
import "./AdvancedRecommendations.css";

const AdvancedRecommendations = ({
                                     // Props passed from App-level
                                     toggleScreen, isSignedIn, toggleSignendIn,
                                     // Lists of vocab/features used to filter recommendations
                                     languages, databases, platforms, webframesworks, tools, OpSys, employments,
                                     // Currency display props
                                     exchangeRate, selectedCurrency
                                 }) => {
    const navigate = useNavigate();

    // ----- Local state -----
    const [error, setError] = useState('');
    const [backwardsort, setBackwardsort] = useState(false);   // toggle reverse sorting
    const [recommendations, setRecommendations] = useState([]); // list of visible recs
    const [recommendationsIncrese, setRecommendationsIncrese] = useState({}); // rec → increase value map

    // Toggles for each feature family (whether to show/hide that group)
    const [showPath, setShowPath] = useState(true);
    const [showLanguages, setShowLanguages] = useState(true);
    const [showDatabases, setShowDatabases] = useState(true);
    const [showPlatforms, setShowPlatforms] = useState(true);
    const [showWebframesworks, setShowWebframesworks] = useState(true);
    const [showTools, setShowTools] = useState(true);
    const [showOpSys, setShowOpSys] = useState(true);
    const [showEmployments, setShowEmployments] = useState(true);

    // All non-tech path-related features
    const paths = [
        "MainBranch", "Age", "RemoteWork", "EdLevel", "YearsCode", "YearsCodePro", "DevType",
        "OrgSize", "Country", "ICorPM", "WorkExp", "Industry", "JobSat"
    ];

    // Filter and sort recommendations whenever toggles or signed-in data changes
    useEffect(() => {
        let filteredRecommendations = [];

        // Dict: family name → [toggle state, values]
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

        // Build increase mapping (string → number)
        const increaseDictionary = {};
        isSignedIn.recommendations?.forEach((value, i) => {
            increaseDictionary[value] = isSignedIn.recommendationsIncrese[i];
        });
        setRecommendationsIncrese(increaseDictionary);

        // Filter recs: keep those with a known feature & enabled family
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

        // Clone + optionally reverse order
        let sortedRecommendations = [...filteredRecommendations];
        if (backwardsort) {
            sortedRecommendations.reverse();
        }
        setRecommendations(sortedRecommendations);

    }, [
        showPath, showLanguages, showDatabases, showPlatforms, showWebframesworks, showTools, showOpSys,
        showEmployments, backwardsort, isSignedIn
    ]);

    // Set page name for navbar highlighting & guard route
    useEffect(() => {
        toggleScreen("AdvancedRecommendations");
        if (!isSignedIn) {
            navigate("/");
        }
    });

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // ----- Handlers -----

    // Sign-out handler
    const handleSignout = () => {
        toggleSignendIn(false);
    }

    // Calls backend ML model to re-generate recommendations and persist them
    const handleRecommendations = async (e) => {
        e.preventDefault();
        const payload = { _id: isSignedIn._id, username: isSignedIn.username };

        try {
            // Build user profile features for ML endpoint
            const userprofile = {
                Country: isSignedIn.country,
                WorkExp: isSignedIn.experience,
                EdLevel: isSignedIn.education,
                Age: isSignedIn.age
            };
            // Add optional fields if present
            if (isSignedIn.MainBranch) userprofile.MainBranch = isSignedIn.MainBranch;
            if (isSignedIn.RemoteWork) userprofile.RemoteWork = isSignedIn.RemoteWork;
            if (isSignedIn.DevType) userprofile.DevType = isSignedIn.DevType;
            if (isSignedIn.OrgSize) userprofile.OrgSize = isSignedIn.OrgSize;
            if (isSignedIn.ICorPM) userprofile.ICorPM = isSignedIn.ICorPM;
            if (isSignedIn.Industry) userprofile.Industry = isSignedIn.Industry;
            if (isSignedIn.YearsCode) userprofile.YearsCode = isSignedIn.YearsCode;
            if (isSignedIn.YearsCodePro) userprofile.YearsCodePro = isSignedIn.YearsCodePro;
            if (isSignedIn.JobSat) userprofile.JobSat = isSignedIn.JobSat;

            // Encode all chosen vocab as 1-hot features
            ["languages","employments","databases","platforms","webframesworks","tools","OpSys"]
                .forEach(group => {
                    if (isSignedIn[group]) {
                        for (let i = 0; i < isSignedIn[group].length; i++) {
                            userprofile[isSignedIn[group][i]] = 1;
                        }
                    }
                });

            // Call ML backend for recommendations
            const response = await fetch(`${config.apiBaseUrl}/api/model/recommend`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userprofile)
            });
            const result = await response.json();

            // Merge into payload for persistence
            payload.topRecommendations = result.topRecommendations;
            payload.combined = result.combined;
            payload.recommendations = result.recommendations;
            payload.recommendationsIncrese = result.recommendationsIncrese;
            payload.recommendationsFeature = result.recommendationsFeature;

            if (!response.ok) {
                setError(result.message);
                return;
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
            console.error('Error:', error);
        }

        try {
            // Persist updated recommendations to DB
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
            // Refresh signed-in state
            toggleSignendIn(isSignedIn.username);
        } catch (error) {
            setError('An error occurred. Please try again.');
            console.error('Error:', error);
        }
    }

    // ----- Render -----
    return (
        <div className="advrec-page">
            {/* Header */}
            <header className="profile-header">
                <h1 className="profile-title">Advanced Recommendations</h1>
                <p className="profile-subtitle">Here’s your full recommendations list.</p>
            </header>

            {/* Main section */}
            <section className="section">
                <div className="section-header">
                    <h2 className="section-title">Recommendations</h2>

                    {/* Toolbar dropdown for toggles */}
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

                {/* If no recs, show CTA */}
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
                        {/* Otherwise, show recommendation list */}
                        <div className="list">
                            <div className="list-header">
                                <div>Recommendation</div>
                                <div>Increase</div>
                            </div>

                            {recommendations.map((rec, i) => (
                                <div key={`${rec}-${i}`} className="list-row">
                                    {/* Text column: clean boilerplate words */}
                                    <div className="col-name">
                                        {rec.replace(
                                            /(to |it would |will )?increase your salary by approximately /g,
                                            ""
                                        )}
                                    </div>
                                    {/* Increase column: formatted currency */}
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

                        {/* Button to recompute */}
                        <div className="cta-center">
                            <button className="profile-button" onClick={handleRecommendations}>
                                Re-Recommended
                            </button>
                        </div>
                    </>
                )}
            </section>

            {/* Bottom navigation buttons */}
            <div className="profile-buttons">
                <button onClick={() => navigate("/Recommendations")} className="profile-button is-outline">
                    Basic
                </button>
                <button onClick={() => navigate("/SavedRecommendations")} className="profile-button is-outline">
                    Saved
                </button>
                <button onClick={handleSignout} className="profile-button is-danger-outline">
                    Sign Out
                </button>
            </div>
        </div>
    );
}

export default AdvancedRecommendations;
