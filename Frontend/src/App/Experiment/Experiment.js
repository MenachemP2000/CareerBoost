import Select from 'react-select';
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form } from 'react-bootstrap';
import "./Experiment.css"
import { useNavigate } from 'react-router-dom';
import config from '../config';

const Experiment = ({ toggleSignendIn, toggleScreen, isSignedIn, languages, employments, MainBranchs,
    RemoteWork, DevType, OrgSize, ICorPM, Industry, countries, educations, ages, databases, platforms,
    webframesworks, tools, OpSys, selectedCurrency, exchangeRate }) => {

    const navigate = useNavigate();
    const [error, setError] = useState('');

    useEffect(() => {
        toggleScreen("Experiment");
        if (!isSignedIn) {
            navigate("/");
        }
    });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);


    const [formData, setFormData] = useState({
        languages: isSignedIn.experiment && isSignedIn.experiment.languages ? isSignedIn.experiment.languages : [],
        employments: isSignedIn.experiment && isSignedIn.experiment.employments ? isSignedIn.experiment.employments : [],
        databases: isSignedIn.experiment && isSignedIn.experiment.databases ? isSignedIn.experiment.databases : [],
        platforms: isSignedIn.experiment && isSignedIn.experiment.platforms ? isSignedIn.experiment.platforms : [],
        webframesworks: isSignedIn.experiment && isSignedIn.experiment.webframesworks ? isSignedIn.experiment.webframesworks : [],
        tools: isSignedIn.experiment && isSignedIn.experiment.tools ? isSignedIn.experiment.tools : [],
        OpSys: isSignedIn.experiment && isSignedIn.experiment.OpSys ? isSignedIn.experiment.OpSys : [],

        ...(isSignedIn.experiment && isSignedIn.experiment.MainBranch && {MainBranch: isSignedIn.experiment.MainBranch}),
        ...(isSignedIn.experiment && isSignedIn.experiment.RemoteWork && {RemoteWork: isSignedIn.experiment.RemoteWork}),
        ...(isSignedIn.experiment && isSignedIn.experiment.DevType && {DevType: isSignedIn.experiment.DevType}),
        ...(isSignedIn.experiment && isSignedIn.experiment.OrgSize && {OrgSize: isSignedIn.experiment.OrgSize}),
        ...(isSignedIn.experiment && isSignedIn.experiment.ICorPM && {ICorPM: isSignedIn.experiment.ICorPM}),
        ...(isSignedIn.experiment && isSignedIn.experiment.Industry && {Industry: isSignedIn.experiment.Industry}),
        ...(isSignedIn.experiment && isSignedIn.experiment.YearsCode && {YearsCode: isSignedIn.experiment.YearsCode}),
        ...(isSignedIn.experiment && isSignedIn.experiment.YearsCodePro && {YearsCodePro: isSignedIn.experiment.YearsCodePro}),
        ...(isSignedIn.experiment && isSignedIn.experiment.JobSat && {JobSat: isSignedIn.experiment.JobSat}),
        ...(isSignedIn.experiment && isSignedIn.experiment.age && {age: isSignedIn.experiment.age}),
        ...(isSignedIn.experiment && isSignedIn.experiment.country && {country: isSignedIn.experiment.country}),
        ...(isSignedIn.experiment && isSignedIn.experiment.education && {education: isSignedIn.experiment.education}),
        ...(isSignedIn.experiment && isSignedIn.experiment.experience && {experience: isSignedIn.experiment.experience})
    });

    const languageOptions = languages.map(lang => ({value: lang, label: lang}));

    const employmentOptions = employments.map(employ => ({value: employ, label: employ}));

    const databaseOptions = databases.map(db => ({value: db, label: db}));

    const platformOptions = platforms.map(platform => ({value: platform, label: platform}));

    const webframeOptions = webframesworks.map(webframe => ({value: webframe, label: webframe}));

    const toolOptions = tools.map(tool => ({value: tool, label: tool}));

    const OpSysOptions = OpSys.map(opsys => ({value: opsys, label: opsys}));

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const experiment = formData;
        const payload = {_id: isSignedIn._id, experiment: experiment};

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
            } else {
                toggleSignendIn(isSignedIn.username);
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
            console.error('Error:', error);
        }
    };

    return (
        <div className="experiment-page">
            <header className="page-header">
                <h1 className="profile-title">Experiment</h1>
                <p className="profile-subtitle">
                    Try out different possibilities and get a salary prediction without changing your profile.
                </p>
            </header>

            <Container>
                <Form onSubmit={handleSubmit}>
                    <Row className="gx-4 gy-4">
                        {/* LEFT column = Advanced (order 1 on lg) */}
                        <Col lg={6} className="order-lg-1">
                            <section className="section">
                                <div className="section-header">
                                    <h2 className="section-title">Advanced Information</h2>
                                </div>

                                <div className="form-grid">
                                    <Form.Group controlId="formMainBranch">
                                        <Form.Label>Developer by profession</Form.Label>
                                        <Form.Select
                                            name="MainBranch"
                                            value={formData.MainBranch || ""}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select which best describes you today</option>
                                            {MainBranchs.map((v, i) => <option key={i} value={v}>{v}</option>)}
                                        </Form.Select>
                                    </Form.Group>

                                    <Form.Group controlId="formRemoteWork">
                                        <Form.Label>Remote Work</Form.Label>
                                        <Form.Select
                                            name="RemoteWork"
                                            value={formData.RemoteWork || ""}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select your current work situation</option>
                                            {RemoteWork.map((v, i) => <option key={i} value={v}>{v}</option>)}
                                        </Form.Select>
                                    </Form.Group>

                                    <Form.Group controlId="formDevType">
                                        <Form.Label>Developer Type</Form.Label>
                                        <Form.Select
                                            name="DevType"
                                            value={formData.DevType || ""}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select your current job</option>
                                            {DevType.map((v, i) => <option key={i} value={v}>{v}</option>)}
                                        </Form.Select>
                                    </Form.Group>

                                    <Form.Group controlId="formOrgSize">
                                        <Form.Label>Organization Size</Form.Label>
                                        <Form.Select
                                            name="OrgSize"
                                            value={formData.OrgSize || ""}
                                            onChange={handleChange}
                                        >
                                            <option value="">How many people in your org?</option>
                                            {OrgSize.map((v, i) => <option key={i} value={v}>{v}</option>)}
                                        </Form.Select>
                                    </Form.Group>

                                    <Form.Group controlId="formICorPM">
                                        <Form.Label>IC or People Manager</Form.Label>
                                        <Form.Select
                                            name="ICorPM"
                                            value={formData.ICorPM || ""}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select your role</option>
                                            {ICorPM.map((v, i) => <option key={i} value={v}>{v}</option>)}
                                        </Form.Select>
                                    </Form.Group>

                                    <Form.Group controlId="formIndustry">
                                        <Form.Label>Industry</Form.Label>
                                        <Form.Select
                                            name="Industry"
                                            value={formData.Industry || ""}
                                            onChange={handleChange}
                                        >
                                            <option value="">Company industry</option>
                                            {Industry.map((v, i) => <option key={i} value={v}>{v}</option>)}
                                        </Form.Select>
                                    </Form.Group>

                                    <Form.Group controlId="formYearsCode">
                                        <Form.Label>Years of coding</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="YearsCode"
                                            value={formData.YearsCode || ""}
                                            onChange={handleChange}
                                            min="0" max="50"
                                            placeholder="Years you've been coding"
                                        />
                                    </Form.Group>

                                    <Form.Group controlId="formYearsCodePro">
                                        <Form.Label>Years of professional coding</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="YearsCodePro"
                                            value={formData.YearsCodePro || ""}
                                            onChange={handleChange}
                                            min="0" max="50"
                                            placeholder="Years you've coded professionally"
                                        />
                                    </Form.Group>

                                    <Form.Group controlId="formJobSat">
                                        <Form.Label>Job satisfaction</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="JobSat"
                                            value={formData.JobSat || ""}
                                            onChange={handleChange}
                                            min="0" max="10"
                                            placeholder="0–10"
                                        />
                                    </Form.Group>

                                    {/* Full-width multi-selects */}
                                    <Form.Group controlId="formLanguages" className="col-span-2">
                                        <Form.Label>Languages</Form.Label>
                                        <Select
                                            isMulti classNamePrefix="rs"
                                            name="languages" options={languageOptions}
                                            value={languageOptions.filter(o => formData.languages.includes(o.value))}
                                            onChange={(sel) => setFormData({
                                                ...formData,
                                                languages: sel.map(o => o.value)
                                            })}
                                            menuPlacement="top"
                                            placeholder="Select the languages you've used extensively"
                                        />
                                    </Form.Group>

                                    <Form.Group controlId="formDatabases" className="col-span-2">
                                        <Form.Label>Databases</Form.Label>
                                        <Select
                                            isMulti classNamePrefix="rs"
                                            name="databases" options={databaseOptions}
                                            value={databaseOptions.filter(o => formData.databases.includes(o.value))}
                                            onChange={(sel) => setFormData({
                                                ...formData,
                                                databases: sel.map(o => o.value)
                                            })}
                                            menuPlacement="top"
                                            placeholder="Select the databases you've used extensively"
                                        />
                                    </Form.Group>

                                    <Form.Group controlId="formPlatforms" className="col-span-2">
                                        <Form.Label>Platforms</Form.Label>
                                        <Select
                                            isMulti classNamePrefix="rs"
                                            name="platforms" options={platformOptions}
                                            value={platformOptions.filter(o => formData.platforms.includes(o.value))}
                                            onChange={(sel) => setFormData({
                                                ...formData,
                                                platforms: sel.map(o => o.value)
                                            })}
                                            menuPlacement="top"
                                            placeholder="Select the platforms you've used extensively"
                                        />
                                    </Form.Group>

                                    <Form.Group controlId="formWebFrameworks" className="col-span-2">
                                        <Form.Label>Web Frameworks</Form.Label>
                                        <Select
                                            isMulti classNamePrefix="rs"
                                            name="webframesworks" options={webframeOptions}
                                            value={webframeOptions.filter(o => formData.webframesworks.includes(o.value))}
                                            onChange={(sel) => setFormData({
                                                ...formData,
                                                webframesworks: sel.map(o => o.value)
                                            })}
                                            menuPlacement="top"
                                            placeholder="Select the web frameworks you've used extensively"
                                        />
                                    </Form.Group>

                                    <Form.Group controlId="formTools" className="col-span-2">
                                        <Form.Label>Tools</Form.Label>
                                        <Select
                                            isMulti classNamePrefix="rs"
                                            name="tools" options={toolOptions}
                                            value={toolOptions.filter(o => formData.tools.includes(o.value))}
                                            onChange={(sel) => setFormData({...formData, tools: sel.map(o => o.value)})}
                                            menuPlacement="top"
                                            placeholder="Select the tools you've used extensively"
                                        />
                                    </Form.Group>

                                    <Form.Group controlId="formOpSys" className="col-span-2">
                                        <Form.Label>Operating Systems</Form.Label>
                                        <Select
                                            isMulti classNamePrefix="rs"
                                            name="OpSys" options={OpSysOptions}
                                            value={OpSysOptions.filter(o => formData.OpSys.includes(o.value))}
                                            onChange={(sel) => setFormData({...formData, OpSys: sel.map(o => o.value)})}
                                            menuPlacement="top"
                                            placeholder="Select the Operating Systems you've used extensively"
                                        />
                                    </Form.Group>

                                    <Form.Group controlId="formEmployments" className="col-span-2">
                                        <Form.Label>Employment</Form.Label>
                                        <Select
                                            isMulti classNamePrefix="rs"
                                            name="employments" options={employmentOptions}
                                            value={employmentOptions.filter(o => formData.employments.includes(o.value))}
                                            onChange={(sel) => setFormData({
                                                ...formData,
                                                employments: sel.map(o => o.value)
                                            })}
                                            menuPlacement="top"
                                            placeholder="Select all that describe your employment status"
                                        />
                                    </Form.Group>
                                </div>
                            </section>
                        </Col>

                        {/* RIGHT column = Basic (order 2 on lg) */}
                        <Col lg={6} className="order-lg-2">
                            <section className="section">
                                <div className="section-header">
                                    <h2 className="section-title">Basic Information</h2>
                                </div>

                                <div className="form-grid">
                                    <Form.Group controlId="formCountry">
                                        <Form.Label>Country</Form.Label>
                                        <Form.Select
                                            name="country"
                                            value={formData.country || ""}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select your country</option>
                                            {countries.map((v, i) => <option key={i} value={v}>{v}</option>)}
                                        </Form.Select>
                                    </Form.Group>

                                    <Form.Group controlId="formEducation">
                                        <Form.Label>Education</Form.Label>
                                        <Form.Select
                                            name="education"
                                            value={formData.education || ""}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select your education</option>
                                            {educations.map((v, i) => <option key={i} value={v}>{v}</option>)}
                                        </Form.Select>
                                    </Form.Group>

                                    <Form.Group controlId="formExperience">
                                        <Form.Label>Years of Experience</Form.Label>
                                        <Form.Control
                                            type="number"
                                            placeholder="Enter years of experience"
                                            name="experience"
                                            value={formData.experience || ""}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>

                                    <Form.Group controlId="formAge">
                                        <Form.Label>Age</Form.Label>
                                        <Form.Select
                                            name="age"
                                            value={formData.age || ""}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select your age range</option>
                                            {ages.map((v, i) => <option key={i} value={v}>{v}</option>)}
                                        </Form.Select>
                                    </Form.Group>
                                </div>
                            </section>
                        </Col>
                    </Row>

                    {/* Bottom–center sticky action bar */}
                    <div className="action-bar">
                        {isSignedIn.experiment?.prediction ? (
                            <div className="kpi" aria-live="polite">
              <span className="currency">
                {new Intl.NumberFormat("en", {
                    style: "currency",
                    currency: selectedCurrency,
                    maximumFractionDigits: 0
                }).format(Math.floor(isSignedIn.experiment.prediction * exchangeRate))}
              </span>
                                <span className="kpi-sub">per year</span>
                            </div>
                        ) : null}

                        <div className="btn-row">
                            <button type="submit" className="profile-button">Experiment</button>
                            <button type="button" className="btn-ghost" onClick={() => navigate("/Prediction")}>
                                Back
                            </button>
                        </div>
                    </div>
                </Form>

                {error && <p className="error-msg">{error}</p>}
            </Container>
        </div>
    );

}
    export default Experiment;
