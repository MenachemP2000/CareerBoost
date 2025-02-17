import React from "react";
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import config from '../config';

const AdvancedRecommendations = ({ toggleScreen, isSignedIn, toggleSignendIn }) => {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [showLanguages, setShowLanguages] = useState(true);
    const [showPath, setShowPath] = useState(true);
    const [backwardsort, setBackwardsort] = useState(false);

    const languages = [
        "Assembly", "Bash/Shell (all shells)", "C", "C++", "HTML/CSS", "Java", "JavaScript",
        "Python", "R", "SQL", "TypeScript", "Fortran", "MATLAB", "Julia", "C#", "MicroPython",
        "Go", "Kotlin", "Ruby", "PowerShell", "Groovy", "Elixir", "Rust", "Dart", "Delphi",
        "Apex", "PHP", "F#", "GDScript", "Perl", "Lua", "Objective-C", "VBA", "Ada", "Swift",
        "Scala", "Visual Basic (.Net)", "Lisp", "Clojure", "Erlang", "Haskell", "OCaml", "Prolog",
        "Nim", "Cobol", "Solidity", "Zig", "Zephyr", "Crystal"
    ];

    const languageRecommendations = isSignedIn.recommendations?.length
        ? isSignedIn.recommendations
            .map((recommendation, i) => ({ recommendation, i }))
            .filter(({ i }) => isSignedIn.recommendationsFeature?.[i] && languages.includes(isSignedIn.recommendationsFeature[i])) // Filter by feature
            .sort((a, b) => (isSignedIn.recommendationsIncrese?.[b.i] || 0) - (isSignedIn.recommendationsIncrese?.[a.i] || 0)) // Sort by increase
            .map(({ recommendation }) => recommendation)
        : [];

    const [recommendations, setRecommendations] = useState([]);

    useEffect(() => {

        let filteredRecommendations = [];

        if (showLanguages && !showPath) {
            filteredRecommendations = isSignedIn.recommendations?.length
                ? isSignedIn.recommendations
                    .map((recommendation, i) => ({ recommendation, i }))
                    .filter(({ i }) => isSignedIn.recommendationsFeature?.[i] && languages.includes(isSignedIn.recommendationsFeature[i]))
                    .map(({ recommendation }) => recommendation)
                : [];
        } else if (!showLanguages && showPath) {
            filteredRecommendations = isSignedIn.recommendations?.length
                ? isSignedIn.recommendations
                    .map((recommendation, i) => ({ recommendation, i }))
                    .filter(({ i }) => !languages.includes(isSignedIn.recommendationsFeature[i]))
                    .map(({ recommendation }) => recommendation)
                : [];
        }
        else if (showLanguages && showPath) {
            filteredRecommendations = isSignedIn.recommendations?.length
                ? isSignedIn.recommendations
                : [];
        }
        let sortedRecommendations = [...filteredRecommendations]; // Copy to avoid mutation

        if (backwardsort) {
            sortedRecommendations.reverse(); // Simply flip the order
        }
        setRecommendations(sortedRecommendations);

    }, [showPath, showLanguages, backwardsort,isSignedIn]);

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
                        <Card style={{ margin: "10px", width: '80vw' }}>
                            <Card.Header>Recommendations</Card.Header>
                            <Container className="d-flex justify-content-center">
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="checkbox1"
                                        checked={showLanguages}
                                        onChange={() => setShowLanguages(!showLanguages)}
                                    />
                                    <label className="form-check-label " htmlFor="checkbox1" style={{ marginRight: "10px" }}>
                                        Show Recommendations for Languages
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="checkbox2"
                                        checked={showPath}
                                        onChange={() => setShowPath(!showPath)}
                                    />
                                    <label className="form-check-label" htmlFor="checkbox2" style={{ marginRight: "10px" }}>
                                    Show Recommendations for Career Path
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="checkbox3"
                                        checked={backwardsort}
                                        onChange={() => setBackwardsort(!backwardsort)}
                                    />
                                    <label className="form-check-label" htmlFor="checkbox3" style={{ marginRight: "10px" }}>
                                        Sort Low to High
                                    </label>
                                </div>
                            </Container>
                            <Card.Body >
                                <Card.Text >
                                    <ul className="list-none space-y-2">
                                        {recommendations.map((recommendation, index) => (
                                            <li style={{ listStyle: "none", textAlign: "left" }} key={index} className="p-2">{recommendation}</li>
                                        ))}
                                    </ul>
                                </Card.Text>
                                <Card.Text>
                                    if you change your information, you can ask to be re-recommended
                                </Card.Text>
                                <Button as={Button} onClick={handleRecommendations} variant="primary" className="px-5 py-3">Reccomend</Button>
                            </Card.Body>
                        </Card>

                    }

                    <Container className="d-flex justify-content-center" >
                        <Button as={Link} to="/Recommendations" style={{ width: '10rem', margin: "10px" }} variant="primary" className="px-5 py-3">Basic</Button>
                        <Button as={Link} to="/SavedRecommendations" style={{ width: '10rem', margin: "10px" }} variant="primary" className="px-5 py-3">Saved</Button>
                        <Button as={Button} style={{ width: '10rem', margin: "10px" }} onClick={handleSignout} variant="primary" className="px-5 py-3">Sign Out</Button>
                    </Container>

                </div>
            </div>
        </div>
    );
}

export default AdvancedRecommendations;