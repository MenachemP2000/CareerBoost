import React from "react";
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import config from '../config';
import { Form } from 'react-bootstrap';
import "./SavedRecommendations.css"

const SavedRecommendations = ({ toggleScreen, isSignedIn, toggleSignendIn, exchangeRate, selectedCurrency }) => {
    const navigate = useNavigate();
    const [recommendations, setRecommendations] = useState(false);
    const [recommendationsIncrese, setRecommendationsIncrese] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        toggleScreen("SavedRecommendations");
        if (!isSignedIn) {
            navigate("/");
        }
    });

    useEffect(() => {
        if (!isSignedIn.recommendations || !isSignedIn.recommendationsIncrese) {
            setRecommendations(false);
            setRecommendationsIncrese(false);
            return;
        }
        if (isSignedIn.recommendations.length === 0 || isSignedIn.recommendationsIncrese.length === 0) {
            setRecommendations(false);
            setRecommendationsIncrese(false);
            return;
        }

        let filteredRecommendations = [];
        let increaseDictionary = {}

        for (let i = 0; i < isSignedIn.recommendations.length; i++) {
            filteredRecommendations.push(isSignedIn.recommendations[i]);
        }

        isSignedIn.recommendations.forEach((value, i) => {
            increaseDictionary[value] = isSignedIn.recommendationsIncrese[i];
        });
        setRecommendationsIncrese(increaseDictionary);

        setRecommendations(filteredRecommendations);

    }, [isSignedIn]);

    const [formData, setFormData] = useState({
    });

    const handleSignout = () => {
        toggleSignendIn(false);
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        console.log(formData);
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        if (formData.addRecommendation === '' || !formData.addRecommendation) {
            return;
        }
        const savedRecommendations = isSignedIn.savedRecommendations ? isSignedIn.savedRecommendations : [];
        setFormData({ ...formData, addRecommendation: '' });
        const payload = { _id: isSignedIn._id, savedRecommendations: [...savedRecommendations, formData.addRecommendation] };
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
            else {
                toggleSignendIn(isSignedIn.username);
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
            console.error('Error:', error);
        }
    };

    const handleRemove = async (e) => {
        e.preventDefault();
        const savedRecommendations = isSignedIn.savedRecommendations;
        if (formData.removeRecommendation === '') {
            return;
        }
        const remove = formData.removeRecommendation;
        const newRecommendations = savedRecommendations.filter(recommendation => recommendation !== remove);
        setFormData({ ...formData, removeRecommendation: '' });
        const payload = { _id: isSignedIn._id, savedRecommendations: newRecommendations };

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
            else {
                toggleSignendIn(isSignedIn.username);
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
            console.error('Error:', error);
        }
    };

    return (
            <div className="saved-recommendations-container" >
                <Container>
                    <h3 className="saved-recommendations-title">Saved Recommendations</h3>
                    <p className="saved-recommendations-subtitle">Here's your saved recommendations:</p>

                    <Row className="d-flex justify-content-center ">
                        <Col md={8}>
                    {isSignedIn.recommendations &&
                        <Card  className="saved-recommendations-card">
                            <Card.Header>Saved Recommendations</Card.Header>

                                <Card.Body>
                                    {!isSignedIn.savedRecommendations || (isSignedIn.savedRecommendations && isSignedIn.savedRecommendations.length == 0) &&
                                        <Card.Text>
                                            No saved recommendations yet, add some!
                                        </Card.Text>
                                    }

                                    {isSignedIn.savedRecommendations && isSignedIn.savedRecommendations.length > 0 &&
                                        <Card.Text>
                                            <ul className="recommendations-list">
                                                {isSignedIn.savedRecommendations.map((recommendation, index) => {
                                                    return (
                                                        <li key={index} className="recommendations-item">
                                                            <span>{recommendation}</span>
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
                                        </Card.Text>
                                    }
                                    {!isSignedIn.savedRecommendations &&
                                        <Form onSubmit={handleAdd}>
                                            <Form.Group controlId="formaddRecommendation" className="mb-3">
                                                <Form.Control
                                                    as="select"
                                                    name="addRecommendation"
                                                    value={formData.addRecommendation}
                                                    onChange={handleChange}
                                                >
                                                    <option value="">Select recommendation to save</option>
                                                    {isSignedIn.recommendations
                                                        .map((recommendation, index) => (
                                                            <option key={index} value={recommendation}>
                                                                {`${recommendation} ${new Intl.NumberFormat('en', {
                                                                    style: 'currency',
                                                                    currency: selectedCurrency,
                                                                    maximumFractionDigits: 0
                                                                }).format(Math.floor(recommendationsIncrese[recommendation] * exchangeRate))}`}                                                            </option>
                                                        ))}
                                                </Form.Control>
                                            </Form.Group>
                                            <Button variant="primary"  className="action-btn" type="submit">Add</Button>
                                        </Form>
                                    }
                                    {isSignedIn.savedRecommendations &&
                                        <Form onSubmit={handleAdd}>
                                            <Form.Group controlId="formaddRecommendation" className="mb-3">
                                                <Form.Control
                                                    as="select"
                                                    name="addRecommendation"
                                                    value={formData.addRecommendation}
                                                    onChange={handleChange}
                                                >
                                                    <option value="">Select recommendation to save</option>
                                                    {isSignedIn.recommendations
                                                        .filter(recommendation => !isSignedIn.savedRecommendations.includes(recommendation))
                                                        .map((recommendation, index) => (
                                                            <option key={index} value={recommendation}>
                                                                {`${recommendation} ${new Intl.NumberFormat('en', {
                                                                    style: 'currency',
                                                                    currency: selectedCurrency,
                                                                    maximumFractionDigits: 0
                                                                }).format(Math.floor(recommendationsIncrese[recommendation] * exchangeRate))}`}
                                                            </option>
                                                        ))}
                                                </Form.Control>
                                            </Form.Group>

                                            <Button variant="primary"  className="action-btn" type="submit">Add</Button>
                                        </Form>
                                    }
                                    {isSignedIn.savedRecommendations && isSignedIn.savedRecommendations.length > 0 &&
                                        <Form onSubmit={handleRemove}>
                                            <Form.Group controlId="formaremoveRecommendation" className="mb-3">
                                                <Form.Control
                                                    as="select"
                                                    name="removeRecommendation"
                                                    value={formData.removeRecommendation}
                                                    onChange={handleChange}
                                                    menuPlacement="top"
                                                >
                                                    <option value="">Select recommendation to remove</option>
                                                    {isSignedIn.savedRecommendations
                                                        .map((recommendation, index) => (
                                                            <option key={index} value={recommendation}>
                                                                {`${recommendation} ${new Intl.NumberFormat('en', {
                                                                    style: 'currency',
                                                                    currency: selectedCurrency,
                                                                    maximumFractionDigits: 0
                                                                }).format(Math.floor(recommendationsIncrese[recommendation] * exchangeRate))}   `}
                                                            </option>
                                                        ))}
                                                </Form.Control>
                                            </Form.Group>

                                            <Button variant="primary"  className="action-btn" type="submit">Remove</Button>
                                        </Form>
                                    }
                                </Card.Body>

                        </Card>
                    }
                        </Col>
                    </Row>
                    {!isSignedIn.recommendations &&
                        <Card style={{margin: "10px"}}>
                            <Card.Body>
                                <Card.Text>
                                    No saved recommendations yet, first get some recommendations!
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    }


                        <Container className="actions-container">
                            <Button as={Link} to="/Recommendations" className="action-btn">Basic</Button>
                            <Button as={Link} to="/AdvancedRecommendations" className="action-btn">Advanced</Button>
                            <Button as={Button} onClick={handleSignout} className="action-btn">Sign Out</Button>
                        </Container>

                </Container>
            </div>
    );
}

export default SavedRecommendations;