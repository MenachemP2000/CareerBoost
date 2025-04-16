import React from "react";
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import config from '../config';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer, LabelList } from 'recharts';
import './Prediction.css';


const Prediction = ({ toggleScreen, isSignedIn, toggleSignendIn, selectedCurrency, exchangeRate }) => {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [top3Data, setTop3Data] = useState(isSignedIn.impacts ? isSignedIn.impacts.slice(0, 3) : []); //top 3 impacting features

    const COLORS = ['#BFC1C2', '#F1C232', '#B08D57'];
    useEffect(() => {
        toggleScreen("Prediction");
        if (!isSignedIn) {
            navigate("/signin");
        }
    });
    useEffect(() => {
        setTop3Data(isSignedIn.impacts ? isSignedIn.impacts.slice(0, 3) : []); //top 3 impacting features
    }, [isSignedIn]);

    const handleSignout = () => {
        toggleSignendIn(false);
    }

    const handlePredict = async (e) => {
        e.preventDefault();

        const payload = { _id: isSignedIn._id, username: isSignedIn.username };
        try {
            const userprofile = {
                Country: isSignedIn.country, WorkExp: isSignedIn.experience,
                EdLevel: isSignedIn.education, Age: isSignedIn.age
            }; //basic user profile
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
            console.log(userprofile);
            const response = await fetch(`${config.apiBaseUrl}/api/model/predict`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userprofile)
            });

            const result = await response.json();
            payload.prediction = Math.floor(result.prediction);
            payload.impacts = result.impacts;

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

        <div className="position-relative text-white text-center" >
            <div className="prediction-container">
                <h1 className="prediction-header">Prediction</h1>
                <div className="underline mx-auto mb-3"></div>

                <p className="lead text-center">
                    Here's our model's Prediction:
                </p>
                {isSignedIn &&

                     <Row className="d-flex justify-content-center">
                        {((!isSignedIn.prediction) || isSignedIn.prediction === 0) &&
                            <Card className="prediction-card">
                                <Card.Header>Salary Prediction</Card.Header>
                                <Card.Body >
                                    <Card.Text>
                                        We Havent Predicted your Salary Yet,
                                        click the button below to
                                        Let our AI predict your salary!
                                    </Card.Text>
                                    <Button onClick={handlePredict} className="prediction-button">Predict</Button>
                                </Card.Body>
                            </Card>

                        }
                        {(isSignedIn.prediction && isSignedIn.prediction !== 0) &&
                            <Card className="prediction-card " style={{ margin: "10px", maxWidth: "80vw" }} >
                                <Card.Header>Salary Prediction</Card.Header>
                                <Card.Body >
                                    The model predicts your salary to be around:
                                    <br />
                                    <br />

                                    <Card.Title style={{ color: "green" }}>{new Intl.NumberFormat('en', {
                                        style: 'currency',
                                        currency: selectedCurrency,
                                        maximumFractionDigits: 0
                                    }).format(Math.floor(isSignedIn.prediction * exchangeRate))} per year</Card.Title>
                                    <br />
                                    <button onClick={handlePredict} className="repredict-button">Re-predict</button>
                                </Card.Body>

                                <Card style={{ margin: "10px", maxWidth: "80vw" }}>
                                    <Card.Header>Top Salary Impacting Features</Card.Header>
                                    <Card.Body className="d-flex flex-column align-items-center">
                                        <ResponsiveContainer height={400}>
                                            <BarChart data={top3Data}>
                                                <XAxis axisLine={false} dataKey="feature" tick={false} />
                                                <YAxis axisLine={false} tick={false} />
                                                <Tooltip />
                                                <Bar dataKey="impact" label>
                                                    {top3Data.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                                                    ))}
                                                    <LabelList
                                                        dataKey="feature"
                                                        fontSize={12}
                                                        fill="#000"
                                                    />
                                                    <LabelList
                                                        dataKey="impact"
                                                        position="top"
                                                        fontSize={12}
                                                        fill="#000"
                                                    />
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </Card.Body>

                                </Card>
                            </Card>

                        }
                        <Container className="prediction-buttons">
                            <Button as={Link} to="/Experiment" style={{ width: '10rem', margin: "10px" }} className="prediction-button">Experiment</Button>
                            <Button onClick={handleSignout} className="prediction-button">Sign Out</Button>
                        </Container>
                    </Row>
                }


            </div>
        </div>
    );
}

export default Prediction;