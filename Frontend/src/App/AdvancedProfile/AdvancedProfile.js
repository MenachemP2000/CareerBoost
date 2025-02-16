import React from "react";
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

const AdvancedProfile = ({ toggleScreen, isSignedIn, toggleSignendIn }) => {
    const navigate = useNavigate();
    const [error, setError] = useState('');

    useEffect(() => {
        toggleScreen("AdvancedProfile");
        if (!isSignedIn) {
            navigate("/");
        }
    });
    return (

        <div>
            <div className="position-relative text-white text-center" >
                <div style={{ minHeight: "100vh" }} className=" top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex flex-column align-items-center justify-content-center">
                    <h3 className="display-4 fw-bold">Advanced Profile</h3>
                    <div className="underline mx-auto mb-3"></div>

                    <p className="lead">
                        Here you can do advanced profile actions
                    </p>

                    <Row className="d-flex justify-content-center">
                        {!isSignedIn.age &&
                            <Card style={{ width: '30rem', margin: "10px" }}>
                                <Card.Header>Age</Card.Header>
                                <Card.Body >
                                    <Card.Text>
                                        no answer
                                    </Card.Text>

                                </Card.Body>
                            </Card>
                        }
                        {isSignedIn.age &&
                            <Card style={{ width: '30rem', margin: "10px" }}>
                                <Card.Header>Age</Card.Header>
                                <Card.Body >
                                    <Card.Text>
                                        {isSignedIn.age}
                                    </Card.Text>

                                </Card.Body>
                            </Card>
                        }
                        {!isSignedIn.country &&
                            <Card style={{ width: '30rem', margin: "10px" }}>
                                <Card.Header>Country</Card.Header>
                                <Card.Body >
                                    <Card.Text>
                                        no answer
                                    </Card.Text>

                                </Card.Body>
                            </Card>
                        }
                        {isSignedIn.country &&
                            <Card style={{ width: '30rem', margin: "10px" }}>
                                <Card.Header>Country</Card.Header>
                                <Card.Body >
                                    <Card.Text>
                                        {isSignedIn.country}
                                    </Card.Text>

                                </Card.Body>
                            </Card>
                        }
                        {!isSignedIn.experience &&
                            <Card style={{ width: '30rem', margin: "10px" }}>
                                <Card.Header>Experience</Card.Header>
                                <Card.Body >
                                    <Card.Text>
                                        no answer
                                    </Card.Text>

                                </Card.Body>
                            </Card>
                        }
                        {isSignedIn.experience &&
                            <Card style={{ width: '30rem', margin: "10px" }}>
                                <Card.Header>Experience</Card.Header>
                                <Card.Body >
                                    <Card.Text>
                                        {isSignedIn.experience}
                                    </Card.Text>

                                </Card.Body>
                            </Card>
                        }
                        {!isSignedIn.education &&
                            <Card style={{ width: '30rem', margin: "10px" }}>
                                <Card.Header>Education</Card.Header>
                                <Card.Body >
                                    <Card.Text>
                                        no answer
                                    </Card.Text>

                                </Card.Body>
                            </Card>
                        }
                        {isSignedIn.education &&
                            <Card style={{ width: '30rem', margin: "10px" }}>
                                <Card.Header>Education</Card.Header>
                                <Card.Body >
                                    <Card.Text>
                                        {isSignedIn.education}
                                    </Card.Text>

                                </Card.Body>
                            </Card>
                        }
                        {!isSignedIn.MainBranch &&
                            <Card style={{ width: '30rem', margin: "10px" }}>
                                <Card.Header>Developer by Profession</Card.Header>
                                <Card.Body >
                                    <Card.Text>
                                        no answer
                                    </Card.Text>

                                </Card.Body>
                            </Card>
                        }
                        {isSignedIn.MainBranch &&
                            <Card style={{ width: '30rem', margin: "10px" }}>
                                <Card.Header>Developer by Profession</Card.Header>
                                <Card.Body >
                                    <Card.Text>
                                        {isSignedIn.MainBranch}
                                    </Card.Text>

                                </Card.Body>
                            </Card>
                        }
                        {!isSignedIn.RemoteWork &&
                            <Card style={{ width: '30rem', margin: "10px" }}>
                                <Card.Header>Remote Work</Card.Header>
                                <Card.Body >
                                    <Card.Text>
                                        no answer
                                    </Card.Text>

                                </Card.Body>
                            </Card>
                        }
                        {isSignedIn.RemoteWork &&
                            <Card style={{ width: '30rem', margin: "10px" }}>
                                <Card.Header>Remote Work</Card.Header>
                                <Card.Body >
                                    <Card.Text>
                                        {isSignedIn.RemoteWork}
                                    </Card.Text>

                                </Card.Body>
                            </Card>
                        }
                        {!isSignedIn.YearsCode &&
                            <Card style={{ width: '30rem', margin: "10px" }}>
                                <Card.Header>Years of Coding</Card.Header>
                                <Card.Body >
                                    <Card.Text>
                                        no answer
                                    </Card.Text>

                                </Card.Body>
                            </Card>
                        }
                        {isSignedIn.YearsCode &&
                            <Card style={{ width: '30rem', margin: "10px" }}>
                                <Card.Header>Years of Coding</Card.Header>
                                <Card.Body >
                                    <Card.Text>
                                        {isSignedIn.YearsCode}
                                    </Card.Text>

                                </Card.Body>
                            </Card>
                        }
                        {!isSignedIn.YearsCodePro &&
                            <Card style={{ width: '30rem', margin: "10px" }}>
                                <Card.Header>Years of Professional Coding</Card.Header>
                                <Card.Body >
                                    <Card.Text>
                                        no answer
                                    </Card.Text>

                                </Card.Body>
                            </Card>
                        }
                        {isSignedIn.YearsCodePro &&
                            <Card style={{ width: '30rem', margin: "10px" }}>
                                <Card.Header>Years of Professional Coding</Card.Header>
                                <Card.Body >
                                    <Card.Text>
                                        {isSignedIn.YearsCodePro}
                                    </Card.Text>

                                </Card.Body>
                            </Card>
                        }
                        {!isSignedIn.DevType &&
                            <Card style={{ width: '30rem', margin: "10px" }}>
                                <Card.Header>Developer Type</Card.Header>
                                <Card.Body >
                                    <Card.Text>
                                        no answer
                                    </Card.Text>

                                </Card.Body>
                            </Card>
                        }
                        {isSignedIn.DevType &&
                            <Card style={{ width: '30rem', margin: "10px" }}>
                                <Card.Header>Developer Type</Card.Header>
                                <Card.Body >
                                    <Card.Text>
                                        {isSignedIn.DevType}
                                    </Card.Text>

                                </Card.Body>
                            </Card>
                        }
                        {!isSignedIn.OrgSize &&
                            <Card style={{ width: '30rem', margin: "10px" }}>
                                <Card.Header>Organization Size</Card.Header>
                                <Card.Body >
                                    <Card.Text>
                                        no answer
                                    </Card.Text>

                                </Card.Body>
                            </Card>
                        }
                        {isSignedIn.OrgSize &&
                            <Card style={{ width: '30rem', margin: "10px" }}>
                                <Card.Header>Organization Size</Card.Header>
                                <Card.Body >
                                    <Card.Text>
                                        {isSignedIn.OrgSize}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        }
                        {!isSignedIn.ICorPM &&
                            <Card style={{ width: '30rem', margin: "10px" }}>
                                <Card.Header>Individual contributor or People manager</Card.Header>
                                <Card.Body >
                                    <Card.Text>
                                        no answer
                                    </Card.Text>

                                </Card.Body>
                            </Card>
                        }
                        {isSignedIn.ICorPM &&
                            <Card style={{ width: '30rem', margin: "10px" }}>
                                <Card.Header>Individual Contributor or People Manager</Card.Header>
                                <Card.Body >
                                    <Card.Text>
                                        {isSignedIn.ICorPM}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        }
                        {!isSignedIn.Industry &&
                            <Card style={{ width: '30rem', margin: "10px" }}>
                                <Card.Header>Industry</Card.Header>
                                <Card.Body >
                                    <Card.Text>
                                        no answer
                                    </Card.Text>

                                </Card.Body>
                            </Card>
                        }
                        {isSignedIn.Industry &&
                            <Card style={{ width: '30rem', margin: "10px" }}>
                                <Card.Header>Industry</Card.Header>
                                <Card.Body >
                                    <Card.Text>
                                        {isSignedIn.Industry}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        }
                        {!isSignedIn.JobSat &&
                            <Card style={{ width: '30rem', margin: "10px" }}>
                                <Card.Header>Job satisfaction</Card.Header>
                                <Card.Body >
                                    <Card.Text>
                                        no answer
                                    </Card.Text>

                                </Card.Body>
                            </Card>
                        }
                        {isSignedIn.JobSat &&
                            <Card style={{ width: '30rem', margin: "10px" }}>
                                <Card.Header>Job satisfaction</Card.Header>
                                <Card.Body >
                                    <Card.Text>
                                        {isSignedIn.JobSat}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        }
                    </Row>

                    <Row className="d-flex justify-content-center">
                        {(!isSignedIn.languages || (isSignedIn.languages && isSignedIn.languages.length < 1)) &&
                            <Card style={{ width: '30rem', margin: "10px" }}>
                                <Card.Header>Programming Languages</Card.Header>
                                <Card.Body >
                                    <Card.Text>
                                        no languages
                                    </Card.Text>

                                </Card.Body>
                            </Card>
                        }
                        {(isSignedIn.languages && isSignedIn.languages.length > 0) && (
                            <Card style={{ width: '30rem', margin: "10px" }}>
                                <Card.Header>Programming Languages</Card.Header>
                                <Card.Body>
                                    <Card.Text>
                                        {isSignedIn.languages.join("; ")}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        )}

                        {!isSignedIn.employments &&
                            <Card style={{ width: '30rem', margin: "10px" }}>
                                <Card.Header>Employments Status</Card.Header>
                                <Card.Body >
                                    <Card.Text>
                                        no answer
                                    </Card.Text>

                                </Card.Body>
                            </Card>
                        }
                        {(isSignedIn.employments && isSignedIn.employments.length > 0) && (
                            <Card style={{ width: '30rem', margin: "10px" }}>
                                <Card.Header>Employments Status</Card.Header>
                                <Card.Body>
                                    <Card.Text>
                                        {isSignedIn.employments.join("; ")}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        )}
                    </Row>



                    <Container className="d-flex justify-content-center" >
                        <Button as={Link} to="/Profile" style={{ width: '10rem', margin: "10px" }} variant="primary" className="px-5 py-3">Profile</Button>
                        <Button as={Link} to="/ModifyAdvanced" style={{ width: '10rem', margin: "10px" }} variant="primary" className="px-5 py-3">Modify</Button>
                    </Container>


                </div>
            </div>
        </div>
    );
}

export default AdvancedProfile;