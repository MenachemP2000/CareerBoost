import React from "react";
import { Row, Card} from 'react-bootstrap';
import {useEffect, useState} from "react";
import {useNavigate} from 'react-router-dom';
import {BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer} from "recharts";
import config from '../config';
import "./Recommendations.css";

const Recommendations = ({toggleScreen, isSignedIn, toggleSignendIn, exchangeRate, selectedCurrency}) => {
    const navigate = useNavigate();
    const [recommendations, setRecommendations] = useState([]);
    const [recommendationsIncrese, setRecommendationsIncrese] = useState([]);
    const [error, setError] = useState('');
    const [data, setData] = useState([]);
    const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#d0ed57", "#a4de6c"];


    useEffect(() => {
        toggleScreen("Recommendations");
        if (!isSignedIn) {
            navigate("/signin");
        }
    }, [isSignedIn]);

    useEffect(() => {
        if (!isSignedIn.recommendations || !isSignedIn.recommendationsIncrese) {
            setRecommendations(false);
            setRecommendationsIncrese({});
            return;
        }
        if (isSignedIn.recommendations.length === 0 || isSignedIn.recommendationsIncrese.length === 0) {
            setRecommendations(false);
            setRecommendationsIncrese(false);
            return;
        }

        let filteredRecommendations = [];
        let increaseDictionary = {}

        for (let i = 0; i < Math.min(5, isSignedIn.recommendations.length); i++) {
            filteredRecommendations.push(isSignedIn.recommendations[i]);
        }

        isSignedIn.recommendations.forEach((value, i) => {
            increaseDictionary[value] = isSignedIn.recommendationsIncrese[i];
        });
        setRecommendationsIncrese(increaseDictionary);

        setRecommendations(filteredRecommendations);
        if (filteredRecommendations.length === 0 || !isSignedIn.prediction || !isSignedIn.combined) {
            setData([]);
        }
        const newData = [];
        const reversedRecommendations = filteredRecommendations.slice().reverse();
        newData.push({name: "Base", salary: (isSignedIn.prediction * exchangeRate).toFixed(0)});
        for (const recommendation in reversedRecommendations) {
            let salary = (parseInt(increaseDictionary[reversedRecommendations[recommendation]], 10)
                + parseInt(isSignedIn.prediction, 10)) * exchangeRate;
            let name = reversedRecommendations[recommendation].replace(/(to |it would |will )?increase your salary by approximately /g, "");
            newData.push({name: name, salary: salary.toFixed(0)});
        }
        newData.push({name: "All Combined", salary: (isSignedIn.combined * exchangeRate).toFixed(0)});
        setData(newData);

    }, [isSignedIn, exchangeRate]);


    const handleSignout = () => {
        toggleSignendIn(false);
    }
    const handleRecommendations = async (e) => {
        e.preventDefault();
        const payload = {_id: isSignedIn._id, username: isSignedIn.username};

        try {
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
        <div className="recommendations-container">
            <h3 className="recommendations-title">Recommendations</h3>
            <p className="recommendations-subtitle">Here’s an overview of your top recommendations. If you change your
                information, you can hit "Re-calculate Recommendations".</p>

            <div className="recommendations-overlay">
                {(!recommendations || !recommendationsIncrese) &&
                    <Row className="recommendations-row">
                        <Card className="recommendations-card">
                            <Card.Header>Get Recommendations</Card.Header>
                            <Card.Body>
                                <Card.Text>Click the button below to get recommendations Based on your
                                    profile</Card.Text>
                                <>
                                    <button onClick={handleRecommendations} className="recommendations-btn">
                                        Get Recommendations
                                    </button>
                                </>

                            </Card.Body>
                        </Card>
                    </Row>
                }

                {(recommendations && recommendationsIncrese) &&

                    <Card className="recommendations-card">
                        <Card.Header className="recommendations-header">Top Recommendations</Card.Header>
                        <Card.Body>
                            <ul className="recommendations-list">
                                {recommendations.map((recommendation, index) => (
                                    <li key={index} className="recommendations-item">
                                        <span className="recommendation-text">{recommendation.replace(/(to |it would |will )?increase your salary by approximately /g, "")}</span>
                                        <span className="salary-increase">
                                        + {new Intl.NumberFormat('en', {
                                                style: 'currency',
                                                currency: selectedCurrency,
                                                maximumFractionDigits: 0
                                            }).format(Math.floor(recommendationsIncrese[recommendation] * exchangeRate))}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                            <br/>
                        </Card.Body>
                        <Card.Text className="increase-approximate">
                            Following these recommendations, your salary could increase to approximately
                            <span className="salary-estimate"> {new Intl.NumberFormat('en', {
                                style: 'currency',
                                currency: selectedCurrency,
                                maximumFractionDigits: 0
                            }).format(Math.floor(isSignedIn.combined * exchangeRate))}
                            </span>
                        </Card.Text>
                        <br></br>
                        <br></br>
                        <Card.Text className="increase-approximate">
                            Hover over the bars to see the salary estimates for each recommendation.
                        </Card.Text>
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart data={data}>
                                <XAxis tick={false} dataKey="name"/>
                                <YAxis />
                                <Tooltip  labelStyle={{ color: "black" }}
                                />
                                <Bar dataKey="salary" fill="#2563eb"/>
                            </BarChart>
                        </ResponsiveContainer>
                        <br></br>
                        <div className="recalc-btn">
                            <button onClick={handleRecommendations} className="recommendations-btn">
                                Re-calculate Recommendations
                            </button>

                        </div>
                        <br></br>
                    </Card>

                }


            </div>
            <br></br>
            <div className="recommendations-actions">
                <>
                    <button onClick={()=>navigate("/AdvancedRecommendations")}
                            className="action-btn">Advanced
                    </button>
                    <button onClick={()=>navigate("/SavedRecommendations")} className="action-btn">Saved</button>
                    <button onClick={handleSignout} className="action-btn">Sign Out</button>
                </>
            </div>
        </div>
    );
}

export default Recommendations;
