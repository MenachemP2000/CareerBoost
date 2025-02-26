import Select from 'react-select';
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import config from '../config';

const ModifyAdvanced = ({ toggleSignendIn, toggleScreen, isSignedIn, languages, employments, MainBranchs,
    RemoteWork, DevType, OrgSize, ICorPM, Industry, countries, educations, ages, databases, platforms,
    webframesworks, tools, OpSys
}) => {
    const navigate = useNavigate();
    const [error, setError] = useState('');

    useEffect(() => {
        toggleScreen("modifyAccount");
        if (!isSignedIn) {
            navigate("/");
        }
    });

    const [formData, setFormData] = useState({
        languages: isSignedIn.languages ? isSignedIn.languages : [],
        employments: isSignedIn.employments ? isSignedIn.employments : [],
        databases: isSignedIn.databases ? isSignedIn.databases : [],
        platforms: isSignedIn.platforms ? isSignedIn.platforms : [],
        webframesworks: isSignedIn.webframesworks ? isSignedIn.webframesworks : [],
        tools: isSignedIn.tools ? isSignedIn.tools : [],
        OpSys: isSignedIn.OpSys ? isSignedIn.OpSys : [],
        ...(isSignedIn.MainBranch && { MainBranch: isSignedIn.MainBranch }),
        ...(isSignedIn.RemoteWork && { RemoteWork: isSignedIn.RemoteWork }),
        ...(isSignedIn.DevType && { DevType: isSignedIn.DevType }),
        ...(isSignedIn.OrgSize && { OrgSize: isSignedIn.OrgSize }),
        ...(isSignedIn.ICorPM && { ICorPM: isSignedIn.ICorPM }),
        ...(isSignedIn.Industry && { Industry: isSignedIn.Industry }),
        ...(isSignedIn.YearsCode && { YearsCode: isSignedIn.YearsCode }),
        ...(isSignedIn.YearsCodePro && { YearsCodePro: isSignedIn.YearsCodePro }),
        ...(isSignedIn.JobSat && { JobSat: isSignedIn.JobSat }),
        ...(isSignedIn.experience && { experience: isSignedIn.experience }),
        ...(isSignedIn.country && { country: isSignedIn.country }),
        ...(isSignedIn.education && { education: isSignedIn.education }),
        ...(isSignedIn.age && { age: isSignedIn.age }),
    });

    const languageOptions = languages.map(lang => ({ value: lang, label: lang }));

    const employmentOptions = employments.map(employ => ({ value: employ, label: employ }));

    const databaseOptions = databases.map(db => ({ value: db, label: db }));

    const platformOptions = platforms.map(platform => ({ value: platform, label: platform }));

    const webframeOptions = webframesworks.map(webframe => ({ value: webframe, label: webframe }));

    const toolOptions = tools.map(tool => ({ value: tool, label: tool }));

    const OpSysOptions = OpSys.map(opsys => ({ value: opsys, label: opsys }));

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = { _id: isSignedIn._id, ...formData };
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
                navigate("/AdvancedProfile");
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <div style={{ minHeight: "100vh" }} className="position-relative text-white text-center " >
                <div className="w-100 h-100 bg-dark bg-opacity-50 d-flex flex-column align-items-center justify-content-center">
                    <h3 className="display-4 fw-bold">Modify Advanced</h3>
                    <div className="underline mx-auto mb-3"></div>

                    <Container className="py-6">
                        <p className="lead">
                            Modify to get a better prediction & recommendations:
                        </p>
                        <Row>
                            <Col md={{ span: 6, offset: 3 }}>
                                <Card>
                                    <Card.Body>
                                        <Card.Title>Basic Information</Card.Title>
                                        <Form onSubmit={handleSubmit}>
                                            <Form.Group controlId="formCountry" className="mb-3">
                                                <Form.Label>Country</Form.Label>
                                                <Form.Control
                                                    as="select"
                                                    name="country"
                                                    value={formData.country}
                                                    onChange={handleChange}
                                                >
                                                    <option value="">Select your country</option>
                                                    {countries.map((country, index) => (
                                                        <option key={index} value={country}>
                                                            {country}
                                                        </option>
                                                    ))}
                                                </Form.Control>
                                            </Form.Group>


                                            <Form.Group controlId="formEducation" className="mb-3">
                                                <Form.Label>Education</Form.Label>
                                                <Form.Control
                                                    as="select"
                                                    name="education"
                                                    value={formData.education}
                                                    onChange={handleChange}
                                                >
                                                    <option value="">Select your education</option>
                                                    {educations.map((education, index) => (
                                                        <option key={index} value={education}>
                                                            {education}
                                                        </option>
                                                    ))}
                                                </Form.Control>
                                            </Form.Group>

                                            <Form.Group controlId="formExperience" className="mb-3">
                                                <Form.Label>Years of Experience</Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    placeholder="Enter your years of experience"
                                                    name="experience"
                                                    value={formData.experience}
                                                    onChange={handleChange}
                                                />
                                            </Form.Group>

                                            <Form.Group controlId="formAge" className="mb-3">
                                                <Form.Label>Age</Form.Label>
                                                <Form.Control
                                                    as="select"
                                                    name="age"
                                                    value={formData.age}
                                                    onChange={handleChange}
                                                >
                                                    <option value="">Select your age range</option>
                                                    {ages.map((age, index) => (
                                                        <option key={index} value={age}>
                                                            {age}
                                                        </option>
                                                    ))}
                                                </Form.Control>
                                            </Form.Group>

                                            <Card.Title>Advanced Information</Card.Title>

                                            <Form.Group controlId="formMainBranch" className="mb-3">
                                                <Form.Label>Devloper by profession</Form.Label>
                                                <Form.Control
                                                    as="select"
                                                    name="MainBranch"
                                                    value={formData.MainBranch}
                                                    onChange={handleChange}
                                                >
                                                    <option value="">Select which of the following options best describes you today</option>
                                                    {MainBranchs.map((mainbranch, index) => (
                                                        <option key={index} value={mainbranch}>
                                                            {mainbranch}
                                                        </option>
                                                    ))}
                                                </Form.Control>
                                            </Form.Group>

                                            <Form.Group controlId="formRemoteWork" className="mb-3">
                                                <Form.Label>Remote Work</Form.Label>
                                                <Form.Control
                                                    as="select"
                                                    name="RemoteWork"
                                                    value={formData.RemoteWork}
                                                    onChange={handleChange}
                                                >
                                                    <option value="">Select which best describes your current work situation</option>
                                                    {RemoteWork.map((remotework, index) => (
                                                        <option key={index} value={remotework}>
                                                            {remotework}
                                                        </option>
                                                    ))}
                                                </Form.Control>
                                            </Form.Group>

                                            <Form.Group controlId="formDevType" className="mb-3">
                                                <Form.Label>Developer Type</Form.Label>
                                                <Form.Control
                                                    as="select"
                                                    name="DevType"
                                                    value={formData.DevType}
                                                    onChange={handleChange}
                                                >
                                                    <option value="">Select which of the following describes your current job</option>
                                                    {DevType.map((devtype, index) => (
                                                        <option key={index} value={devtype}>
                                                            {devtype}
                                                        </option>
                                                    ))}
                                                </Form.Control>
                                            </Form.Group>

                                            <Form.Group controlId="formOrgSize" className="mb-3">
                                                <Form.Label>Organization Size</Form.Label>
                                                <Form.Control
                                                    as="select"
                                                    name="OrgSize"
                                                    value={formData.OrgSize}
                                                    onChange={handleChange}
                                                >
                                                    <option value="">Select how many people are employed in your organization</option>
                                                    {OrgSize.map((orgsize, index) => (
                                                        <option key={index} value={orgsize}>
                                                            {orgsize}
                                                        </option>
                                                    ))}
                                                </Form.Control>
                                            </Form.Group>

                                            <Form.Group controlId="formICorPM" className="mb-3">
                                                <Form.Label>Individual contributor or people manager</Form.Label>
                                                <Form.Control
                                                    as="select"
                                                    name="ICorPM"
                                                    value={formData.ICorPM}
                                                    onChange={handleChange}
                                                >
                                                    <option value="">Select if you are an individual contributor or people manager</option>
                                                    {ICorPM.map((icorpm, index) => (
                                                        <option key={index} value={icorpm}>
                                                            {icorpm}
                                                        </option>
                                                    ))}
                                                </Form.Control>
                                            </Form.Group>

                                            <Form.Group controlId="formIndustry" className="mb-3">
                                                <Form.Label>Industry</Form.Label>
                                                <Form.Control
                                                    as="select"
                                                    name="Industry"
                                                    value={formData.Industry}
                                                    onChange={handleChange}
                                                >
                                                    <option value="">Select what industry is the company you work for in</option>
                                                    {Industry.map((industry, index) => (
                                                        <option key={index} value={industry}>
                                                            {industry}
                                                        </option>
                                                    ))}
                                                </Form.Control>
                                            </Form.Group>

                                            <Form.Group controlId="formYearsCode" className="mb-3">
                                                <Form.Label>Years of coding</Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    name="YearsCode"
                                                    value={formData.YearsCode}
                                                    onChange={handleChange}
                                                    min="0"
                                                    max="50"
                                                    placeholder="Enter the number of years you've been coding"
                                                />
                                            </Form.Group>

                                            <Form.Group controlId="formYearsCodePro" className="mb-3">
                                                <Form.Label>Years of professional coding</Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    name="YearsCodePro"
                                                    value={formData.YearsCodePro}
                                                    onChange={handleChange}
                                                    min="0"
                                                    max="50"
                                                    placeholder="Enter the number of years you've been coding professionally"
                                                />
                                            </Form.Group>

                                            <Form.Group controlId="formJobSat" className="mb-3">
                                                <Form.Label>Job satisfaction</Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    name="JobSat"
                                                    value={formData.JobSat}
                                                    onChange={handleChange}
                                                    min="0"
                                                    max="10"
                                                    placeholder="Enter your job satisfaction score from 0 to 10"
                                                />
                                            </Form.Group>

                                            <Form.Group controlId="formLanguages" className="mb-3">
                                                <Form.Label>Languages</Form.Label>
                                                <Select
                                                    isMulti
                                                    name="languages"
                                                    options={languageOptions}
                                                    value={languageOptions.filter(opt => formData.languages.includes(opt.value))}
                                                    onChange={(selectedOptions) => setFormData({
                                                        ...formData,
                                                        languages: selectedOptions.map(opt => opt.value),
                                                    })}
                                                    menuPlacement="top"
                                                    placeholder="Select the languages you've used extensively in the past year"
                                                />
                                            </Form.Group>



                                            <Form.Group controlId="formDatabases" className="mb-3">
                                                <Form.Label>Databases</Form.Label>
                                                <Select
                                                    isMulti
                                                    name="databases"
                                                    options={databaseOptions}
                                                    value={databaseOptions.filter(opt => formData.databases.includes(opt.value))}
                                                    onChange={(selectedOptions) => setFormData({
                                                        ...formData,
                                                        databases: selectedOptions.map(opt => opt.value),
                                                    })}
                                                    menuPlacement="top"
                                                    placeholder="Select the databases you've used extensively in the past year"
                                                />
                                            </Form.Group>

                                            <Form.Group controlId="formplatforms" className="mb-3">
                                                <Form.Label>Platforms</Form.Label>
                                                <Select
                                                    isMulti
                                                    name="platforms"
                                                    options={platformOptions}
                                                    value={platformOptions.filter(opt => formData.platforms.includes(opt.value))}
                                                    onChange={(selectedOptions) => setFormData({
                                                        ...formData,
                                                        platforms: selectedOptions.map(opt => opt.value),
                                                    })}
                                                    menuPlacement="top"
                                                    placeholder="Select the platforms you've used extensively in the past year"
                                                />
                                            </Form.Group>

                                            <Form.Group controlId="formwebframeworks" className="mb-3">
                                                <Form.Label>Web Frameworks</Form.Label>
                                                <Select
                                                    isMulti
                                                    name="webframesworks"
                                                    options={webframeOptions}
                                                    value={webframeOptions.filter(opt => formData.webframesworks.includes(opt.value))}
                                                    onChange={(selectedOptions) => setFormData({
                                                        ...formData,
                                                        webframesworks: selectedOptions.map(opt => opt.value),
                                                    })}
                                                    menuPlacement="top"
                                                    placeholder="Select the web frameworks you've used extensively in the past year"
                                                />
                                            </Form.Group>

                                            <Form.Group controlId="formtools" className="mb-3">
                                                <Form.Label>Tools</Form.Label>
                                                <Select
                                                    isMulti
                                                    name="tools"
                                                    options={toolOptions}
                                                    value={toolOptions.filter(opt => formData.tools.includes(opt.value))}
                                                    onChange={(selectedOptions) => setFormData({
                                                        ...formData,
                                                        tools: selectedOptions.map(opt => opt.value),
                                                    })}
                                                    menuPlacement="top"
                                                    placeholder="Select the tools you've used extensively in the past year"
                                                />
                                            </Form.Group>

                                            <Form.Group controlId="formopsys" className="mb-3">
                                                <Form.Label>Operrating Systems</Form.Label>
                                                <Select
                                                    isMulti
                                                    name="tools"
                                                    options={OpSysOptions}
                                                    value={OpSysOptions.filter(opt => formData.OpSys.includes(opt.value))}
                                                    onChange={(selectedOptions) => setFormData({
                                                        ...formData,
                                                        OpSys: selectedOptions.map(opt => opt.value),
                                                    })}
                                                    menuPlacement="top"
                                                    placeholder="Select the Operrating Systems you've used extensively in the past year"
                                                />
                                            </Form.Group>

                                            <Form.Group controlId="formEmployments" className="mb-3">
                                                <Form.Label>Employment</Form.Label>
                                                <Select
                                                    isMulti
                                                    name="employments"
                                                    options={employmentOptions}
                                                    value={employmentOptions.filter(opt => formData.employments.includes(opt.value))}
                                                    onChange={(selectedOptions) => setFormData({
                                                        ...formData,
                                                        employments: selectedOptions.map(opt => opt.value),
                                                    })}
                                                    menuPlacement="top"
                                                    placeholder="Select all that describes your employment status"
                                                />
                                            </Form.Group>

                                            <Button variant="primary" style={{ width: '10rem', margin: "10px" }} type="submit">
                                                Save Information
                                            </Button>
                                            <Button variant="primary" style={{ width: '10rem', margin: "10px" }} type="button" onClick={() => navigate("/AdvancedProfile")}>
                                                Cancel
                                            </Button>
                                        </Form>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                        {error && <div className="error-message">{error}</div>}
                    </Container>
                </div>
            </div>
        </div>
    );
}

export default ModifyAdvanced;
