import Select from 'react-select';
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form } from 'react-bootstrap';
import "./Experiment.css"
import { useNavigate } from 'react-router-dom';
import config from '../config';

const Experiment = ({
                        toggleSignendIn, toggleScreen, isSignedIn,
                        languages, employments, MainBranchs, RemoteWork, DevType, OrgSize, ICorPM, Industry,
                        countries, educations, ages, databases, platforms, webframesworks, tools, OpSys,
                        selectedCurrency, exchangeRate
                    }) => {
    const navigate = useNavigate();
    const [error, setError] = useState('');

    /* -------------------------------
       Effects
    ------------------------------- */
    useEffect(() => {
        // Mark current screen for parent and redirect if not signed in
        toggleScreen("Experiment");
        if (!isSignedIn) {
            navigate("/");
        }
    });
    useEffect(() => {
        // Scroll to top when component loads
        window.scrollTo(0, 0);
    }, []);

    /* -------------------------------
       Form State
    ------------------------------- */
    const [formData, setFormData] = useState({
        // If user has experiment data saved → preload, otherwise empty
        languages: isSignedIn.experiment?.languages || [],
        employments: isSignedIn.experiment?.employments || [],
        databases: isSignedIn.experiment?.databases || [],
        platforms: isSignedIn.experiment?.platforms || [],
        webframesworks: isSignedIn.experiment?.webframesworks || [],
        tools: isSignedIn.experiment?.tools || [],
        OpSys: isSignedIn.experiment?.OpSys || [],
        ...(isSignedIn.experiment?.MainBranch && { MainBranch: isSignedIn.experiment.MainBranch }),
        ...(isSignedIn.experiment?.RemoteWork && { RemoteWork: isSignedIn.experiment.RemoteWork }),
        ...(isSignedIn.experiment?.DevType && { DevType: isSignedIn.experiment.DevType }),
        ...(isSignedIn.experiment?.OrgSize && { OrgSize: isSignedIn.experiment.OrgSize }),
        ...(isSignedIn.experiment?.ICorPM && { ICorPM: isSignedIn.experiment.ICorPM }),
        ...(isSignedIn.experiment?.Industry && { Industry: isSignedIn.experiment.Industry }),
        ...(isSignedIn.experiment?.YearsCode && { YearsCode: isSignedIn.experiment.YearsCode }),
        ...(isSignedIn.experiment?.YearsCodePro && { YearsCodePro: isSignedIn.experiment.YearsCodePro }),
        ...(isSignedIn.experiment?.JobSat && { JobSat: isSignedIn.experiment.JobSat }),
        ...(isSignedIn.experiment?.age && { age: isSignedIn.experiment.age }),
        ...(isSignedIn.experiment?.country && { country: isSignedIn.experiment.country }),
        ...(isSignedIn.experiment?.education && { education: isSignedIn.experiment.education }),
        ...(isSignedIn.experiment?.experience && { experience: isSignedIn.experiment.experience })
    });

    // Convert arrays of values into react-select options
    const languageOptions = languages.map(v => ({ value: v, label: v }));
    const employmentOptions = employments.map(v => ({ value: v, label: v }));
    const databaseOptions = databases.map(v => ({ value: v, label: v }));
    const platformOptions = platforms.map(v => ({ value: v, label: v }));
    const webframeOptions = webframesworks.map(v => ({ value: v, label: v }));
    const toolOptions = tools.map(v => ({ value: v, label: v }));
    const OpSysOptions = OpSys.map(v => ({ value: v, label: v }));

    // Handle regular select / input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    /* -------------------------------
       Submit Handler
    ------------------------------- */
    const handleSubmit = async (e) => {
        e.preventDefault();
        const experiment = formData;
        const payload = { _id: isSignedIn._id, experiment };

        try {
            // Build user profile object to send to model API
            const userprofile = {};
            if (experiment.age) userprofile.Age = experiment.age;
            if (experiment.education) userprofile.EdLevel = experiment.education;
            if (experiment.experience) userprofile.WorkExp = experiment.experience;
            if (experiment.country) userprofile.Country = experiment.country;
            if (experiment.MainBranch) userprofile.MainBranch = experiment.MainBranch;
            if (experiment.RemoteWork) userprofile.RemoteWork = experiment.RemoteWork;
            if (experiment.DevType) userprofile.DevType = experiment.DevType;
            if (experiment.OrgSize) userprofile.OrgSize = experiment.OrgSize;
            if (experiment.ICorPM) userprofile.ICorPM = experiment.ICorPM;
            if (experiment.Industry) userprofile.Industry = experiment.Industry;
            if (experiment.YearsCode) userprofile.YearsCode = experiment.YearsCode;
            if (experiment.YearsCodePro) userprofile.YearsCodePro = experiment.YearsCodePro;
            if (experiment.JobSat) userprofile.JobSat = experiment.JobSat;

            // Convert all multi-select arrays into binary features for model
            for (let arr of ["languages", "employments", "databases", "platforms", "webframesworks", "tools", "OpSys"]) {
                if (experiment[arr]) {
                    for (let item of experiment[arr]) {
                        userprofile[item] = 1;
                    }
                }
            }

            // Call backend model API to get salary prediction
            const response = await fetch(`${config.apiBaseUrl}/api/model/predict`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userprofile)
            });

            const result = await response.json();
            payload.experiment.prediction = Math.floor(result.prediction);

            if (!response.ok) {
                setError(result.message);
                return;
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
            console.error('Error:', error);
        }

        try {
            // Save experiment results back to user profile
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

    /* -------------------------------
       Render (JSX)
    ------------------------------- */
    return (
        <div className="experiment-page">
            {/* Page header */}
            <header className="page-header">
                <h1 className="profile-title">Experiment</h1>
                <p className="profile-subtitle">
                    Try out different possibilities and get a salary prediction without changing your profile.
                </p>
            </header>

            <Container>
                {/* Form wraps both columns */}
                <Form onSubmit={handleSubmit}>
                    <Row className="gx-4 gy-4">
                        {/* LEFT column = Advanced Information */}
                        <Col lg={6} className="order-lg-1">
                            <section className="section">
                                <div className="section-header">
                                    <h2 className="section-title">Advanced Information</h2>
                                </div>

                                <div className="form-grid">
                                    {/* Example of standard select */}
                                    <Form.Group controlId="formMainBranch">
                                        <Form.Label>Developer by profession</Form.Label>
                                        <Form.Select name="MainBranch" value={formData.MainBranch || ""} onChange={handleChange}>
                                            <option value="">Select which best describes you today</option>
                                            {MainBranchs.map((v, i) => <option key={i} value={v}>{v}</option>)}
                                        </Form.Select>
                                    </Form.Group>

                                    {/* Repeat for RemoteWork, DevType, OrgSize, ICorPM, Industry, YearsCode, YearsCodePro, JobSat */}
                                    {/* ... (already well-structured in your code) */}

                                    {/* Multi-selects using react-select */}
                                    <Form.Group controlId="formLanguages" className="col-span-2">
                                        <Form.Label>Languages</Form.Label>
                                        <Select
                                            isMulti classNamePrefix="rs"
                                            name="languages" options={languageOptions}
                                            value={languageOptions.filter(o => formData.languages.includes(o.value))}
                                            onChange={(sel) => setFormData({ ...formData, languages: sel.map(o => o.value) })}
                                            menuPlacement="top"
                                            placeholder="Select the languages you've used extensively"
                                        />
                                    </Form.Group>

                                    {/* Similar groups for Databases, Platforms, Web Frameworks, Tools, OS, Employments */}
                                </div>
                            </section>
                        </Col>

                        {/* RIGHT column = Basic Information */}
                        <Col lg={6} className="order-lg-2">
                            <section className="section">
                                <div className="section-header">
                                    <h2 className="section-title">Basic Information</h2>
                                </div>

                                <div className="form-grid">
                                    {/* Country dropdown */}
                                    <Form.Group controlId="formCountry">
                                        <Form.Label>Country</Form.Label>
                                        <Form.Select name="country" value={formData.country || ""} onChange={handleChange}>
                                            <option value="">Select your country</option>
                                            {countries.map((v, i) => <option key={i} value={v}>{v}</option>)}
                                        </Form.Select>
                                    </Form.Group>

                                    {/* Education, Experience, Age (same pattern as above) */}
                                </div>
                            </section>
                        </Col>
                    </Row>

                    {/* Bottom action bar with prediction + buttons */}
                    <div className="action-bar">
                        {/* If prediction exists, show formatted salary */}
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

                        {/* Buttons: submit and back */}
                        <div className="btn-row">
                            <button type="submit" className="profile-button">Experiment</button>
                            <button type="button" className="btn-ghost" onClick={() => navigate("/Prediction")}>
                                Back
                            </button>
                        </div>
                    </div>
                </Form>

                {/* Error message shown below form */}
                {error && <p className="error-msg">{error}</p>}
            </Container>
        </div>
    );
};

export default Experiment;
