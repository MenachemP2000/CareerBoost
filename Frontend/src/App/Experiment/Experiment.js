import Select from 'react-select';
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';

import { useNavigate } from 'react-router-dom';
import config from '../config';

const Experiment = ({ toggleSignendIn, toggleScreen, isSignedIn, languages, employments, MainBranchs,
    RemoteWork, DevType, OrgSize, ICorPM, Industry, countries, educations, ages, databases, platforms,
    webframesworks, tools, OpSys }) => {

    const navigate = useNavigate();
    const [error, setError] = useState('');

    useEffect(() => {
        toggleScreen("Experiment");
        if (!isSignedIn) {
            navigate("/");
        }
    });

    const [formData, setFormData] = useState({
        languages: isSignedIn.experiment && isSignedIn.experiment.languages ? isSignedIn.experiment.languages : [],
        employments: isSignedIn.experiment && isSignedIn.experiment.employments ? isSignedIn.experiment.employments : [],
        databases: isSignedIn.experiment && isSignedIn.experiment.databases ? isSignedIn.experiment.databases : [],
        platforms: isSignedIn.experiment && isSignedIn.experiment.platforms ? isSignedIn.experiment.platforms : [],
        webframesworks: isSignedIn.experiment && isSignedIn.experiment.webframesworks ? isSignedIn.experiment.webframesworks : [],
        tools: isSignedIn.experiment && isSignedIn.experiment.tools ? isSignedIn.experiment.tools : [],
        OpSys: isSignedIn.experiment && isSignedIn.experiment.OpSys ? isSignedIn.experiment.OpSys : [],

        ...(isSignedIn.experiment && isSignedIn.experiment.MainBranch && { MainBranch: isSignedIn.experiment.MainBranch }),
        ...(isSignedIn.experiment && isSignedIn.experiment.RemoteWork && { RemoteWork: isSignedIn.experiment.RemoteWork }),
        ...(isSignedIn.experiment && isSignedIn.experiment.DevType && { DevType: isSignedIn.experiment.DevType }),
        ...(isSignedIn.experiment && isSignedIn.experiment.OrgSize && { OrgSize: isSignedIn.experiment.OrgSize }),
        ...(isSignedIn.experiment && isSignedIn.experiment.ICorPM && { ICorPM: isSignedIn.experiment.ICorPM }),
        ...(isSignedIn.experiment && isSignedIn.experiment.Industry && { Industry: isSignedIn.experiment.Industry }),
        ...(isSignedIn.experiment && isSignedIn.experiment.YearsCode && { YearsCode: isSignedIn.experiment.YearsCode }),
        ...(isSignedIn.experiment && isSignedIn.experiment.YearsCodePro && { YearsCodePro: isSignedIn.experiment.YearsCodePro }),
        ...(isSignedIn.experiment && isSignedIn.experiment.JobSat && { JobSat: isSignedIn.experiment.JobSat }),
        ...(isSignedIn.experiment && isSignedIn.experiment.age && { age: isSignedIn.experiment.age }),
        ...(isSignedIn.experiment && isSignedIn.experiment.country && { country: isSignedIn.experiment.country }),
        ...(isSignedIn.experiment && isSignedIn.experiment.education && { education: isSignedIn.experiment.education }),
        ...(isSignedIn.experiment && isSignedIn.experiment.experience && { experience: isSignedIn.experiment.experience })
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
        const experiment = formData;
        const payload = { _id: isSignedIn._id, experiment: experiment };

        try {
            const userprofile = {};
            if (experiment.age) {
                userprofile.Age = experiment.age;
            }
            if (experiment.education) {
                userprofile.EdLevel = experiment.education;
            }
            if (experiment.experience) {
                userprofile.WorkExp = experiment.experience;
            }
            if (experiment.country) {
                userprofile.Country = experiment.country;
            }
            if (experiment.MainBranch) {
                userprofile.MainBranch = experiment.MainBranch;
            }
            if (experiment.RemoteWork) {
                userprofile.RemoteWork = experiment.RemoteWork;
            }
            if (experiment.DevType) {
                userprofile.DevType = experiment.DevType;
            }
            if (experiment.OrgSize) {
                userprofile.OrgSize = experiment.OrgSize;
            }
            if (experiment.ICorPM) {
                userprofile.ICorPM = experiment.ICorPM;
            }
            if (experiment.Industry) {
                userprofile.Industry = experiment.Industry;
            }
            if (experiment.YearsCode) {
                userprofile.YearsCode = experiment.YearsCode;
            }
            if (experiment.YearsCodePro) {
                userprofile.YearsCodePro = experiment.YearsCodePro;
            }
            if (experiment.JobSat) {
                userprofile.JobSat = experiment.JobSat;
            }
            if (experiment.languages) {
                for (let i = 0; i < experiment.languages.length; i++) {
                    userprofile[experiment.languages[i]] = 1;
                }
            }
            if (experiment.employments) {
                for (let i = 0; i < experiment.employments.length; i++) {
                    userprofile[experiment.employments[i]] = 1;
                }
            }
            if (experiment.databases) {
                for (let i = 0; i < experiment.databases.length; i++) {
                    userprofile[experiment.databases[i]] = 1;
                }
            }
            if (experiment.platforms) {
                for (let i = 0; i < experiment.platforms.length; i++) {
                    userprofile[experiment.platforms[i]] = 1;
                }
            }
            if (experiment.webframesworks) {
                for (let i = 0; i < experiment.webframesworks.length; i++) {
                    userprofile[experiment.webframesworks[i]] = 1;
                }
            }
            if (experiment.tools) {
                for (let i = 0; i < experiment.tools.length; i++) {
                    userprofile[experiment.tools[i]] = 1;
                }
            }
            if (experiment.OpSys) {
                for (let i = 0; i < experiment.OpSys.length; i++) {
                    userprofile[experiment.OpSys[i]] = 1;
                }
            }

            // Send the registration data to the server
            const response = await fetch(`${config.apiBaseUrl}/api/model/predict`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userprofile)
            });

            const result = await response.json();
            payload.experiment.prediction = Math.floor(result.prediction);

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
            else {
                toggleSignendIn(isSignedIn.username);
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <div className="position-relative text-white text-center " >
                <div style={{ minHeight: "100vh" }} className="w-100 h-100 bg-dark bg-opacity-50 d-flex flex-column align-items-center justify-content-center">
                    <h3 className="display-4 fw-bold">Experiment</h3>
                    <div className="underline mx-auto mb-3"></div>

                    <Container className="py-6">
                        <p className="lead">
                            Here you can experiment with different possibilities and get prediction without changing your profile.
                        </p>
                        <Row>
                            <Col md={{ span: 6, offset: 3 }}>
                                <Card>
                                    <Card.Body>
                                        <Card.Title>Basic Information</Card.Title>
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
                                        <Form onSubmit={handleSubmit}>

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

                                            {(isSignedIn.experiment && isSignedIn.experiment.prediction) &&
                                                <Card style={{ margin: "10px" }}>
                                                    <Card.Header>Salary Prediction</Card.Header>
                                                    <Card.Body >
                                                        <Card.Text style={{ color: "green" }}>

                                                            {isSignedIn.experiment.prediction} $ per year
                                                            <br />
                                                        </Card.Text>
                                                    </Card.Body>
                                                </Card>

                                            }

                                            <Button variant="primary" style={{ width: '10rem', margin: "10px" }} type="submit">
                                                Experiment
                                            </Button>
                                            <Button variant="primary" style={{ width: '10rem', margin: "10px" }} type="button" onClick={() => navigate("/Prediction")}>
                                                Back
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

export default Experiment;
