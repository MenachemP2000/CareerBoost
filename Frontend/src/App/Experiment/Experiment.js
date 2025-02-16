import Select from 'react-select';
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import * as XLSX from 'xlsx';

import countriesData from '../data/countries.xlsx';
import educationsData from '../data/educations.xlsx';
import agesData from '../data/ages.xlsx';

import { useNavigate } from 'react-router-dom';
import config from '../config';

const Experiment = ({ toggleSignendIn, toggleScreen, isSignedIn }) => {
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

    const MainBranchs = ["I am a developer by profession", "I am not primarily a developer, but I write code sometimes as part of my work/studies"];

    const RemoteWork = ["Hybrid (some remote, some in-person)", "Remote", "In-person"];

    const DevType = [
        "Developer, full-stack",
        "Developer, back-end",
        "Developer, front-end",
        "Developer, desktop or enterprise applications",
        "Developer, mobile",
        "Developer, embedded applications or devices",
        "Data engineer",
        "Engineering manager",
        "DevOps specialist",
        "Data scientist or machine learning specialist",
        "Research & Development role",
        "Academic researcher",
        "Senior Executive (C-Suite, VP, etc.)",
        "Cloud infrastructure engineer",
        "Developer, QA or test",
        "Developer, game or graphics",
        "Data or business analyst",
        "Developer, AI",
        "System administrator",
        "Student",
        "Engineer, site reliability",
        "Project manager",
        "Scientist",
        "Security professional",
        "Educator",
        "Blockchain",
        "Developer Experience",
        "Product manager",
        "Hardware Engineer",
        "Database administrator",
        "Developer Advocate",
        "Designer",
        "Marketing or sales professional",
        "Other (please specify):",
    ].sort();

    const OrgSize = [
        "Just me - I am a freelancer, sole proprietor, etc.",
        "2 to 9 employees",
        "10 to 19 employees",
        "20 to 99 employees",
        "100 to 499 employees",
        "500 to 999 employees",
        "1,000 to 4,999 employees",
        "5,000 to 9,999 employees",
        "10,000 or more employees"];

    const ICorPM = ["Individual contributor", "People manager"];

    const Industry = ["Banking/Financial Services",
        "Computer Systems Design and Services",
        "Energy",
        "Fintech",
        "Government",
        "Healthcare",
        "Higher Education",
        "Insurance",
        "Internet, Telecomm or Information Services",
        "Manufacturing",
        "Media & Advertising Services",
        "Retail and Consumer Services",
        "Software Development",
        "Transportation, or Supply Chain",
        "Other:"].sort();
    const languages = [
        "Assembly", "Bash/Shell (all shells)", "C", "C++", "HTML/CSS", "Java", "JavaScript",
        "Python", "R", "SQL", "TypeScript", "Fortran", "MATLAB", "Julia", "C#", "MicroPython",
        "Go", "Kotlin", "Ruby", "PowerShell", "Groovy", "Elixir", "Rust", "Dart", "Delphi",
        "Apex", "PHP", "F#", "GDScript", "Perl", "Lua", "Objective-C", "VBA", "Ada", "Swift",
        "Scala", "Visual Basic (.Net)", "Lisp", "Clojure", "Erlang", "Haskell", "OCaml", "Prolog",
        "Nim", "Cobol", "Solidity", "Zig", "Zephyr", "Crystal"
    ].sort();

    const languageOptions = languages.map(lang => ({ value: lang, label: lang }));

    const employments = [
        "Employed, full-time",
        "Employed, part-time",
        "Independent contractor, freelancer, or self-employed",
        "Not employed, and not looking for work",
        "Not employed, but looking for work",
        "Retired",
        "Student, full-time",
        "Student, part-time"
    ];

    const employmentOptions = employments.map(employ => ({ value: employ, label: employ }));

    const [countries, setCountries] = useState([]);

    useEffect(() => {
        // Load the Excel file and extract country list
        const fetchCountries = async () => {
            const file = await fetch(countriesData);
            const arrayBuffer = await file.arrayBuffer();
            const workbook = XLSX.read(arrayBuffer, { type: 'array' });

            // Assuming countries are in the first sheet and first column
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const countriesArray = XLSX.utils.sheet_to_json(sheet, { header: 1 });

            setCountries(countriesArray.map(row => row[0])); // Get countries from first column
        };

        fetchCountries();
    }, []);

    const [educations, setEducations] = useState([]);

    useEffect(() => {
        // Load the Excel file and extract country list
        const fetchEducations = async () => {
            const file = await fetch(educationsData);
            const arrayBuffer = await file.arrayBuffer();
            const workbook = XLSX.read(arrayBuffer, { type: 'array' });

            // Assuming countries are in the first sheet and first column
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const educationsArray = XLSX.utils.sheet_to_json(sheet, { header: 1 });

            setEducations(educationsArray.map(row => row[0])); // Get countries from first column
        };

        fetchEducations();
    }, []);

    const [ages, setAges] = useState([]);

    useEffect(() => {
        // Load the Excel file and extract country list
        const fetchAges = async () => {
            const file = await fetch(agesData);
            const arrayBuffer = await file.arrayBuffer();
            const workbook = XLSX.read(arrayBuffer, { type: 'array' });

            // Assuming countries are in the first sheet and first column
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const educationsArray = XLSX.utils.sheet_to_json(sheet, { header: 1 });

            setAges(educationsArray.map(row => row[0])); // Get countries from first column
        };

        fetchAges();
    }, []);


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
            <div  className="position-relative text-white text-center " >
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

                                            {(isSignedIn.experiment.prediction && isSignedIn.experiment.prediction !== 0) &&
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
