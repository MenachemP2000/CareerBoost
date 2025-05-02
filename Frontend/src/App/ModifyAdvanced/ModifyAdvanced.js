import Select from 'react-select';
import React, {useState, useEffect} from "react";
import {Card, Button, Form} from 'react-bootstrap';
import {useNavigate} from 'react-router-dom';
import config from '../config';
import "./ModifyAdvanced.css";

const ModifyAdvanced = ({
                            toggleSignendIn,
                            toggleScreen,
                            isSignedIn,
                            languages,
                            employments,
                            MainBranchs,
                            RemoteWork,
                            DevType,
                            OrgSize,
                            ICorPM,
                            Industry,
                            countries,
                            educations,
                            ages,
                            databases,
                            platforms,
                            webframesworks,
                            tools,
                            OpSys
                        }) => {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        toggleScreen("modifyAccount");
        if (!isSignedIn) {
            navigate("/");
        }
    }, [isSignedIn, navigate, toggleScreen]);


    const [formData, setFormData] = useState({
        languages: isSignedIn.languages || [],
        employments: isSignedIn.employments || [],
        databases: isSignedIn.databases || [],
        platforms: isSignedIn.platforms || [],
        webframesworks: isSignedIn.webframesworks || [],
        tools: isSignedIn.tools || [],
        OpSys: isSignedIn.OpSys || [],
        country: isSignedIn.country || '',
        education: isSignedIn.education || '',
        experience: isSignedIn.experience || '',
        age: isSignedIn.age || '',
        MainBranch: isSignedIn.MainBranch || '',
        RemoteWork: isSignedIn.RemoteWork || '',
        DevType: isSignedIn.DevType || '',
        OrgSize: isSignedIn.OrgSize || '',
        ICorPM: isSignedIn.ICorPM || '',
        Industry: isSignedIn.Industry || '',
        YearsCode: isSignedIn.YearsCode || '',
        YearsCodePro: isSignedIn.YearsCodePro || '',
        JobSat: isSignedIn.JobSat || ''
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

    const handleCancel = () => {
        setFormData({...isSignedIn});
        setIsEditing(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {_id: isSignedIn._id, ...formData};
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
            //return viewmode
            setIsEditing(false);
            if (!response.ok) {
                // If the server responds with an error, set the error message
                setError(result.message);
                return;
            } else {
                toggleSignendIn(isSignedIn.username);
                //stay in page
                // navigate("/AdvancedProfile");
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
            console.error('Error:', error);
        }
    };
    return (
        <div className="advanced-container">
            <h3 className="advanced-title">Advanced Profile</h3>
            <p className="advanced-subtitle">
                Explore more profile details here. Hit "Edit" to make changes, and don’t forget to Save when you're
                finished!
            </p>
            <Card className="advanced-card">
                <Card.Body>
                    <div className="text-center mb-4">
                        <h2 className="title">Profile Information</h2>
                    </div>
                    <Form onSubmit={handleSubmit} className="mt-4">
                        <Form.Group controlId="formCountry" className="mb-3">
                            <Form.Label>Country</Form.Label>
                            <Form.Control
                                as="select"
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                disabled={!isEditing}
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
                                disabled={!isEditing}
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
                                disabled={!isEditing}
                            />
                        </Form.Group>

                        <Form.Group controlId="formAge" className="mb-3">
                            <Form.Label>Age</Form.Label>
                            <Form.Control
                                as="select"
                                name="age"
                                value={formData.age}
                                onChange={handleChange}
                                disabled={!isEditing}
                            >
                                <option value="">Select your age range</option>
                                {ages.map((age, index) => (
                                    <option key={index} value={age}>
                                        {age}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>

                        <br></br>

                        <Card.Title className="advanced-information">Advanced Information</Card.Title>

                        <Form.Group controlId="formMainBranch" className="mb-3">
                            <Form.Label>Devloper by profession</Form.Label>
                            <Form.Control
                                as="select"
                                name="MainBranch"
                                value={formData.MainBranch}
                                onChange={handleChange}
                                disabled={!isEditing}
                            >
                                <option value="">Select which of the following options best
                                    describes you today
                                </option>
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
                                disabled={!isEditing}
                            >
                                <option value="">Select which best describes your current work
                                    situation
                                </option>
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
                                disabled={!isEditing}
                            >
                                <option value="">Select which of the following describes your
                                    current job
                                </option>
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
                                disabled={!isEditing}
                            >
                                <option value="">Select how many people are employed in your
                                    organization
                                </option>
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
                                disabled={!isEditing}
                            >
                                <option value="">Select if you are an individual contributor or
                                    people manager
                                </option>
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
                                disabled={!isEditing}
                            >
                                <option value="">Select what industry is the company you work for
                                    in
                                </option>
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
                                disabled={!isEditing}
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
                                disabled={!isEditing}
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
                                disabled={!isEditing}
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
                                isDisabled={!isEditing}
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
                                isDisabled={!isEditing}
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
                                isDisabled={!isEditing}
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
                                isDisabled={!isEditing}
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
                                isDisabled={!isEditing}
                            />
                        </Form.Group>

                        <Form.Group controlId="formopsys" className="mb-3">
                            <Form.Label>Operating Systems</Form.Label>
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
                                isDisabled={!isEditing}
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
                                disabled={!isEditing}
                                menuPlacement="top"
                                placeholder="Select all that describes your employment status"
                                isDisabled={!isEditing}

                            />
                        </Form.Group>


                    </Form>
                </Card.Body>
            </Card>
            <div className="advanced-buttons">
                {!isEditing ? (
                    <button as={Button} className="advanced-button" onClick={() => setIsEditing(true)}>
                        Edit Profile
                    </button>
                ) : (
                    <>
                        <button as={Button} className="advanced-button" onClick={handleCancel}>
                            Cancel
                        </button>
                        <button as={Button} className="advanced-button" onClick={handleSubmit}>
                            Save Information
                        </button>
                    </>
                )}


                <button as={Button} className="advanced-button" onClick={() => navigate("/Profile")}>
                    Back
                </button>
            </div>
            {error && <div className="error-message">{error}</div>}


        </div>
    );
}

export default ModifyAdvanced;
