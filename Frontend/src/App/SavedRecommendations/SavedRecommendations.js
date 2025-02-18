import React from "react";
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import config from '../config';
import { Form } from 'react-bootstrap';


const SavedRecommendations = ({ toggleScreen, isSignedIn, toggleSignendIn }) => {
    const navigate = useNavigate();
    const [recommendations, setRecommendations] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        toggleScreen("SavedRecommendations");
        if (!isSignedIn) {
            navigate("/");
        }
    });

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

        <div >
            <div className="position-relative text-white text-center" >
                <div style={{ minHeight: "100vh" }} className=" top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex flex-column align-items-center justify-content-center">
                    <h3 className="display-4 fw-bold">Saved Recommendations</h3>
                    <div className="underline mx-auto mb-3"></div>

                    <p className="lead">
                        Here's your saved Recommendations:
                    </p>
                    {isSignedIn.recommendations &&
                        <Card style={{ maxWidth: '95vw', margin: "10px", width: "fit-content" }}>
                            <Card.Header>Saved Recommendations</Card.Header>
                            <Row className="d-flex justify-content-center " >
                                <Card.Body >
                                    {!isSignedIn.savedRecommendations || (isSignedIn.savedRecommendations && isSignedIn.savedRecommendations.length == 0) &&
                                        <Card.Text >
                                            No saved recommendations yet, add some!
                                        </Card.Text>
                                    }

                                    {isSignedIn.savedRecommendations && isSignedIn.savedRecommendations.length > 0 &&
                                        <Card.Text >
                                            <ul className="list-none space-y-2">
                                                {isSignedIn.savedRecommendations.map((recommendation, index) => (
                                                    <li style={{ listStyle: "none", textAlign: "left" }} key={index} className="p-0">{recommendation}</li>
                                                ))}
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
                                                                {recommendation}
                                                            </option>
                                                        ))}
                                                </Form.Control>
                                            </Form.Group>
                                            <Button variant="primary" style={{ width: '10rem', margin: "10px" }} type="submit">
                                                Add
                                            </Button>
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
                                                                {recommendation}
                                                            </option>
                                                        ))}
                                                </Form.Control>
                                            </Form.Group>

                                            <Button variant="primary" style={{ width: '10rem', margin: "10px" }} type="submit">
                                                Add
                                            </Button>
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
                                                                {recommendation}
                                                            </option>
                                                        ))}
                                                </Form.Control>
                                            </Form.Group>

                                            <Button variant="primary" style={{ width: '10rem', margin: "10px" }} type="submit">
                                                Remove
                                            </Button>
                                        </Form>
                                    }
                                </Card.Body>

                            </Row>
                        </Card>
                    }

                    {!isSignedIn.recommendations &&
                        <Card style={{ margin: "10px" }}>
                            <Card.Body >
                                <Card.Text >
                                    No saved recommendations yet, first get some recommendations!
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    }



                    <Row className="d-flex justify-content-center">
                        <Container className=" justify-content-center" >
                            <Button as={Link} to="/Recommendations" style={{ width: '10rem', margin: "10px" }} variant="primary" className="px-5 py-3">Basic</Button>
                            <Button as={Link} to="/AdvancedRecommendations" style={{ width: '10rem', margin: "10px" }} variant="primary" className="px-5 py-3">Advanced</Button>
                            <Button as={Button} style={{ width: '10rem', margin: "10px", whiteSpace: "nowrap" }} onClick={handleSignout} variant="primary" className="px-5 py-3">Sign Out</Button>
                        </Container>
                    </Row>


                </div>
            </div>
        </div>
    );
}

export default SavedRecommendations;