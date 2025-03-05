import React, { useEffect } from "react";
import { Container, Card, Button, Row, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "./AdvancedProfile.css"; // Ensure this includes your provided CSS

const AdvancedProfile = ({ toggleScreen, isSignedIn }) => {
    const navigate = useNavigate();

    useEffect(() => {
        toggleScreen("AdvancedProfile");
        if (!isSignedIn) {
            navigate("/signin");
        }
    }, [isSignedIn, navigate, toggleScreen]);

    // Helper function to create profile cards dynamically
    const renderCard = (title, value) => (
        <Card className="advanced-profile-card">
            <Card.Header className="advanced-profile-title">{title}</Card.Header>
            <Card.Body>
                <Card.Text>{value || "No answer"}</Card.Text>
            </Card.Body>
        </Card>
    );

    return (
        <div className="advanced-profile-container">
            <Container className="d-flex flex-column align-items-center">
                <Card className="advanced-profile-card">
                    <Card.Body>
                        <h2 className="advanced-profile-title">Advanced Profile</h2>
                        <p className="advanced-profile-description">Here is your advanced profile information:</p>

                        {/* Advanced Information Cards */}
                        <Row className="g-3 d-flex justify-content-center">
                            <Col md={6}>{renderCard("Age", isSignedIn.age)}</Col>
                            <Col md={6}>{renderCard("Country", isSignedIn.country)}</Col>
                            <Col md={6}>{renderCard("Experience", isSignedIn.experience)}</Col>
                            <Col md={6}>{renderCard("Education", isSignedIn.education)}</Col>
                            <Col md={6}>{renderCard("Developer by Profession", isSignedIn.MainBranch)}</Col>
                            <Col md={6}>{renderCard("Remote Work", isSignedIn.RemoteWork)}</Col>
                            <Col md={6}>{renderCard("Years of Coding", isSignedIn.YearsCode)}</Col>
                            <Col md={6}>{renderCard("Years of Professional Coding", isSignedIn.YearsCodePro)}</Col>
                            <Col md={6}>{renderCard("Developer Type", isSignedIn.DevType)}</Col>
                            <Col md={6}>{renderCard("Organization Size", isSignedIn.OrgSize)}</Col>
                            <Col md={6}>{renderCard("Role", isSignedIn.ICorPM)}</Col>
                            <Col md={6}>{renderCard("Industry", isSignedIn.Industry)}</Col>
                            <Col md={6}>{renderCard("Job Satisfaction", isSignedIn.JobSat)}</Col>
                            <Col md={6}>{renderCard("Programming Languages", isSignedIn.languages?.join("; "))}</Col>
                            <Col md={6}>{renderCard("Employment Status", isSignedIn.employments?.join("; "))}</Col>
                            <Col md={6}>{renderCard("Used Databases", isSignedIn.databases?.join("; "))}</Col>
                            <Col md={6}>{renderCard("Used Platforms", isSignedIn.platforms?.join("; "))}</Col>
                            <Col md={6}>{renderCard("Used Web Frameworks", isSignedIn.webframesworks?.join("; "))}</Col>
                            <Col md={6}>{renderCard("Used Tools", isSignedIn.tools?.join("; "))}</Col>
                            <Col md={6}>{renderCard("Operating Systems", isSignedIn.OpSys?.join("; "))}</Col>
                        </Row>

                        {/* Profile Buttons */}
                        <div className="advanced-profile-buttons">
                            <Button as={Link} to="/Profile" className="advanced-profile-button">Profile</Button>
                            <Button as={Link} to="/ModifyAdvanced" className="advanced-profile-button">Modify</Button>
                        </div>
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
};

export default AdvancedProfile;
