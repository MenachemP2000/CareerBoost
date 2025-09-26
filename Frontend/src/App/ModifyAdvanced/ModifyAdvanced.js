import Select from 'react-select';
import React, { useState, useEffect, useRef } from "react";
import { Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import config from '../config';
import "./ModifyAdvanced.css";
import "../Profile/Profile.css";

/**
 * ModifyAdvanced Component
 * ------------------------
 * Provides a full-page UI for editing the "Advanced Profile".
 * Profile details are grouped into 5 sections:
 *   1) Basics (country, education, experience, age)
 *   2) Role & Organization
 *   3) Experience & Satisfaction
 *   4) Tech Stack A (languages, databases, platforms, web frameworks)
 *   5) Tech Stack B (tools, OS, employment)
 *
 * Each section supports: Edit → Cancel / Save.
 * State snapshots allow reverting changes on cancel.
 */
const ModifyAdvanced = ({
                            toggleSignendIn,
                            toggleScreen,
                            isSignedIn,
                            languages, employments, MainBranchs, RemoteWork,
                            DevType, OrgSize, ICorPM, Industry, countries,
                            educations, ages, databases, platforms,
                            webframesworks, tools, OpSys
}) => {
    const navigate = useNavigate();
    const [error, setError] = useState('');

    // Track which fields are currently being edited
    const [fieldEditing, setFieldEditing] = useState({
        country: false, education: false, experience: false, age: false,
        MainBranch: false, RemoteWork: false, DevType: false, OrgSize: false,
        ICorPM: false, Industry: false, YearsCode: false, YearsCodePro: false, JobSat: false,
        languages: false, databases: false, platforms: false, webframesworks: false, tools: false,
        OpSys: false, employments: false,
    });

    // --- Helpers to toggle individual fields ---
    const toggleField = (key) => {
        setFieldEditing((prev) => {
            const isNowEditing = !prev[key];

            // If turning ON editing for a section, snapshot its current values
            if (isNowEditing) {
                const sectionKey = Object.keys(GROUPS).find(sec =>
                    GROUPS[sec].includes(key)
                );
                if (sectionKey && !sectionSnapshots.current[sectionKey]) {
                    sectionSnapshots.current[sectionKey] = GROUPS[sectionKey].reduce(
                        (acc, field) => {
                            acc[field] = formData[field];
                            return acc;
                        },
                        {}
                    );
                }
            }

            return { ...prev, [key]: isNowEditing };
        });
    };


    // --- Section grouping (used for Cancel / Save) ---
    const GROUPS = {
        basics: ["country", "education", "experience", "age"],
        roleOrg: ["MainBranch", "RemoteWork", "DevType", "OrgSize"],
        expSat: ["ICorPM", "Industry", "YearsCode", "YearsCodePro", "JobSat"],
        stackA: ["languages", "databases", "platforms", "webframesworks"],
        stackB: ["tools", "OpSys", "employments"],
    };

    // Snapshots let you restore original values on Cancel
    const sectionSnapshots = useRef({});

    // helper: is this section currently editing?
    const isSectionEditing = (key) => GROUPS[key].some((f) => fieldEditing[f]);
    const setFieldsEditing = (keys, on) =>
        setFieldEditing((prev) => ({
            ...prev,
            ...keys.reduce((acc, k) => ((acc[k] = on), acc), {}),
        }));


    const cancelSection = (key) => {
        const snap = sectionSnapshots.current[key] || {};
        setFormData((fd) => ({ ...fd, ...snap }));
        setFieldsEditing(GROUPS[key], false);
        sectionSnapshots.current[key] = undefined;
    };

    const saveSection = async (key) => {
        await submitPatch();                // PATCH to server
        setFieldsEditing(GROUPS[key], false);
        sectionSnapshots.current[key] = undefined;
    };

    // --- Lifecycle: auth + scroll ---
    useEffect(() => {
        toggleScreen("modifyAccount");
        if (!isSignedIn) {
            navigate("/");
        }
    }, [isSignedIn, navigate, toggleScreen]);

    useEffect(() => { window.scrollTo(0, 0);}, []);

    // --- Local form state, seeded from isSignedIn ---
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

    // --- Options for react-select + <Form.Control> dropdowns ---
    const languageOptions = languages.map(lang => ({ value: lang, label: lang }));
    const employmentOptions = employments.map(employ => ({ value: employ, label: employ }));
    const databaseOptions = databases.map(db => ({ value: db, label: db }));
    const platformOptions = platforms.map(platform => ({ value: platform, label: platform }));
    const webframeOptions = webframesworks.map(webframe => ({ value: webframe, label: webframe }));
    const toolOptions = tools.map(tool => ({ value: tool, label: tool }));
    const OpSysOptions = OpSys.map(opsys => ({ value: opsys, label: opsys }));

    // --- Input change handler (for text/select inputs) ---
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // --- Save to server ---
    const submitPatch = async () => {
        const payload = { _id: isSignedIn._id, ...formData };
        try {
            const response = await fetch(
                `${config.apiBaseUrl}/api/users/${isSignedIn._id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify(payload),
                }
            );
            const result = await response.json();
            if (!response.ok) {
                setError(result.message);
                return false;
            }
            // refresh user state
            toggleSignendIn(isSignedIn.username);
            return true;
        } catch (err) {
            setError("An error occurred. Please try again.");
            console.error(err);
            return false;
        }
    };

    // --- JSX Layout ---
    return (
        <div className="advanced-container">
            <h3 className="advanced-title">Advanced Profile</h3>
            <p className="advanced-subtitle">
                Explore more profile details here. Don’t forget to Save when you're finished!
            </p>

            {/* Layout: 5 sections with Edit/Cancel/Save */}
            <div className="advanced-layout">

                {/* ===== Section 1: Basics ===== */}
                <section className="settings-section">
                    <div className="section-header">
                        <h3 className="section-title">Profile Basics</h3>
                        <p className="section-subtitle">Shown on your public profile.</p>
                    </div>

                    {/* Country */}
                    <div className="field-row">
                        <div className="field-label">Country</div>
                        <div className="field-value">
                            {!fieldEditing.country ? (
                                <span className="value-text">{formData.country || "Not Provided"}</span>
                            ) : (
                                <Form.Control
                                    as="select"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleChange}
                                >
                                    <option value="">Select your country</option>
                                    {countries.map((country, index) => (
                                        <option key={index} value={country}>{country}</option>))}
                                </Form.Control>
                            )}
                        </div>
                        <button className="field-edit" type="button" onClick={() => toggleField("country")}
                            aria-label="Edit country">
                            <span className="chev" />
                        </button>
                    </div>

                    {/* Education */}
                    <div className="field-row">
                        <div className="field-label">Education</div>
                        <div className="field-value">
                            {!fieldEditing.education ? (
                                <span className="value-text">{formData.education || "Not Provided"}</span>
                            ) : (
                                <Form.Control as="select" name="education" value={formData.education}
                                    onChange={handleChange}>
                                    <option value="">Select your education</option>
                                    {educations.map((e, i) => (
                                        <option key={i} value={e}>{e}</option>
                                    ))}
                                </Form.Control>
                            )}
                        </div>
                        <button className="field-edit" type="button" onClick={() => toggleField("education")}
                            aria-label="Edit education">
                            <span className="chev" />
                        </button>
                    </div>


                    {/* Years of Experience */}
                    <div className="field-row">
                        <div className="field-label">Years of Experience</div>
                        <div className="field-value">
                            {!fieldEditing.experience ? (
                                <span className="value-text">{formData.experience || "Not Provided"}</span>
                            ) : (
                                <Form.Control type="number" name="experience" value={formData.experience}
                                    onChange={handleChange} min="0" />
                            )}
                        </div>
                        <button className="field-edit" type="button" onClick={() => toggleField("experience")}
                            aria-label="Edit experience">
                            <span className="chev" />
                        </button>
                    </div>

                    {/* Age */}
                    <div className="field-row">
                        <div className="field-label">Age</div>
                        <div className="field-value">
                            {!fieldEditing.age ? (
                                <span className="value-text">{formData.age || "Not Provided"}</span>
                            ) : (
                                <Form.Control as="select" name="age" value={formData.age} onChange={handleChange}>
                                    <option value="">Select your age range</option>
                                    {ages.map((age, i) => (
                                        <option key={i} value={age}>{age}</option>
                                    ))}
                                </Form.Control>
                            )}
                        </div>
                        <button className="field-edit" type="button" onClick={() => toggleField("age")}
                            aria-label="Edit age">
                            <span className="chev" />
                        </button>
                    </div>

                    <div className="section-actions">
                        {isSectionEditing("basics") && (
                            <>
                                <button type="button" className="profile-button is-outline"
                                    onClick={() => cancelSection("basics")}>
                                    Cancel
                                </button>
                                <button type="button" className="profile-button is-primary"
                                    onClick={() => saveSection("basics")}>
                                    Save
                                </button>
                            </>
                        )}
                    </div>
                </section>


                {/* ===== 2) Developer by profession – Organization Size ===== */}
                <section className="settings-section">
                    <div className="section-header">
                        <h3 className="section-title">Role & Organization</h3>
                        <p className="section-subtitle">How you work today.</p>
                    </div>
                    {/* Developer by profession */}
                    <div className="field-row">
                        <div className="field-label">Developer by profession</div>
                        <div className="field-value">
                            {!fieldEditing.MainBranch ? (
                                <span className="value-text">{formData.MainBranch || "Not Provided"}</span>
                            ) : (
                                <Form.Control as="select" name="MainBranch" value={formData.MainBranch}
                                    onChange={handleChange}>
                                    <option value="">Select which best describes you today</option>
                                    {MainBranchs.map((v, i) => <option key={i} value={v}>{v}</option>)}
                                </Form.Control>
                            )}
                        </div>
                        <button className="field-edit" type="button" onClick={() => toggleField("MainBranch")}
                            aria-label="Edit profession">
                            <span className="chev" />
                        </button>
                    </div>

                    {/* Remote Work */}
                    <div className="field-row">
                        <div className="field-label">Remote Work</div>
                        <div className="field-value">
                            {!fieldEditing.RemoteWork ? (
                                <span className="value-text">{formData.RemoteWork || "Not Provided"}</span>
                            ) : (
                                <Form.Control as="select" name="RemoteWork" value={formData.RemoteWork}
                                    onChange={handleChange}>
                                    <option value="">Select your current situation</option>
                                    {RemoteWork.map((v, i) => <option key={i} value={v}>{v}</option>)}
                                </Form.Control>
                            )}
                        </div>
                        <button className="field-edit" type="button" onClick={() => toggleField("RemoteWork")}
                            aria-label="Edit remote work">
                            <span className="chev" />
                        </button>
                    </div>

                    {/* Developer Type */}
                    <div className="field-row">
                        <div className="field-label">Developer Type</div>
                        <div className="field-value">
                            {!fieldEditing.DevType ? (
                                <span className="value-text">{formData.DevType || "Not Provided"}</span>
                            ) : (
                                <Form.Control as="select" name="DevType" value={formData.DevType}
                                    onChange={handleChange}>
                                    <option value="">Select your current job</option>
                                    {DevType.map((v, i) => <option key={i} value={v}>{v}</option>)}
                                </Form.Control>
                            )}
                        </div>
                        <button className="field-edit" type="button" onClick={() => toggleField("DevType")}
                            aria-label="Edit developer type">
                            <span className="chev" />
                        </button>
                    </div>

                    {/* Organization Size */}
                    <div className="field-row">
                        <div className="field-label">Organization Size</div>
                        <div className="field-value">
                            {!fieldEditing.OrgSize ? (
                                <span className="value-text">{formData.OrgSize || "Not Provided"}</span>
                            ) : (
                                <Form.Control as="select" name="OrgSize" value={formData.OrgSize}
                                    onChange={handleChange}>
                                    <option value="">How many people are employed?</option>
                                    {OrgSize.map((v, i) => <option key={i} value={v}>{v}</option>)}
                                </Form.Control>
                            )}
                        </div>
                        <button className="field-edit" type="button" onClick={() => toggleField("OrgSize")}
                            aria-label="Edit org size">
                            <span className="chev" />
                        </button>
                    </div>

                    <div className="section-actions">
                        {isSectionEditing("roleOrg") && (
                            <>
                                <button type="button" className="profile-button is-outline"
                                    onClick={() => cancelSection("roleOrg")}>Cancel
                                </button>
                                <button type="button" className="profile-button is-primary"
                                    onClick={() => saveSection("roleOrg")}>Save
                                </button>
                            </>
                        )}
                    </div>
                </section>


                {/* ===== 3) Individual contributor or people manager – Job satisfaction ===== */}
                <section className="settings-section">
                    <div className="section-header">
                        <h3 className="section-title">Experience & Satisfaction</h3>
                        <p className="section-subtitle">Career context and sentiment.</p>
                    </div>
                    {/* IC or PM */}
                    <div className="field-row">
                        <div className="field-label">Individual contributor or people manager</div>
                        <div className="field-value">
                            {!fieldEditing.ICorPM ? (
                                <span className="value-text">{formData.ICorPM || "Not Provided"}</span>
                            ) : (
                                <Form.Control as="select" name="ICorPM" value={formData.ICorPM}
                                    onChange={handleChange}>
                                    <option value="">Choose one</option>
                                    {ICorPM.map((v, i) => <option key={i} value={v}>{v}</option>)}
                                </Form.Control>
                            )}
                        </div>
                        <button className="field-edit" type="button" onClick={() => toggleField("ICorPM")}
                            aria-label="Edit IC/PM">
                            <span className="chev" />
                        </button>
                    </div>

                    {/* Industry */}
                    <div className="field-row">
                        <div className="field-label">Industry</div>
                        <div className="field-value">
                            {!fieldEditing.Industry ? (
                                <span className="value-text">{formData.Industry || "Not Provided"}</span>
                            ) : (
                                <Form.Control as="select" name="Industry" value={formData.Industry}
                                    onChange={handleChange}>
                                    <option value="">Select industry</option>
                                    {Industry.map((v, i) => <option key={i} value={v}>{v}</option>)}
                                </Form.Control>
                            )}
                        </div>
                        <button className="field-edit" type="button" onClick={() => toggleField("Industry")}
                            aria-label="Edit industry">
                            <span className="chev" />
                        </button>
                    </div>

                    {/* Years of coding */}
                    <div className="field-row">
                        <div className="field-label">Years of coding</div>
                        <div className="field-value">
                            {!fieldEditing.YearsCode ? (
                                <span className="value-text">{formData.YearsCode ?? "Not Provided"}</span>
                            ) : (
                                <Form.Control type="number" name="YearsCode" value={formData.YearsCode}
                                    onChange={handleChange} min="0" max="50" />
                            )}
                        </div>
                        <button className="field-edit" type="button" onClick={() => toggleField("YearsCode")}
                            aria-label="Edit years coding">
                            <span className="chev" />
                        </button>
                    </div>

                    {/* Years of professional coding */}
                    <div className="field-row">
                        <div className="field-label">Years of professional coding</div>
                        <div className="field-value">
                            {!fieldEditing.YearsCodePro ? (
                                <span className="value-text">{formData.YearsCodePro ?? "Not Provided"}</span>
                            ) : (
                                <Form.Control type="number" name="YearsCodePro" value={formData.YearsCodePro}
                                    onChange={handleChange} min="0" max="50" />
                            )}
                        </div>
                        <button className="field-edit" type="button" onClick={() => toggleField("YearsCodePro")}
                            aria-label="Edit years pro">
                            <span className="chev" />
                        </button>
                    </div>

                    {/* Job satisfaction */}
                    <div className="field-row">
                        <div className="field-label">Job satisfaction</div>
                        <div className="field-value">
                            {!fieldEditing.JobSat ? (
                                <span className="value-text">{formData.JobSat ?? "Not Provided"}</span>
                            ) : (
                                <Form.Control type="number" name="JobSat" value={formData.JobSat}
                                    onChange={handleChange} min="0" max="10" placeholder="0–10" />
                            )}
                        </div>
                        <button className="field-edit" type="button" onClick={() => toggleField("JobSat")}
                            aria-label="Edit job satisfaction">
                            <span className="chev" />
                        </button>
                    </div>

                    <div className="section-actions">
                        {isSectionEditing("expSat") && (
                            <>
                                <button type="button" className="profile-button is-outline"
                                    onClick={() => cancelSection("expSat")}>Cancel
                                </button>
                                <button type="button" className="profile-button is-primary"
                                    onClick={() => saveSection("expSat")}>Save
                                </button>
                            </>
                        )}
                    </div>
                </section>


                {/* ===== 4) Languages – Web Frameworks ===== */}
                <section className="settings-section">
                    <div className="section-header">
                        <h3 className="section-title">Tech Stack</h3>
                        <p className="section-subtitle">Core languages and platforms.</p>
                    </div>

                    {/* Languages */}
                    <div className="field-row">
                        <div className="field-label">Languages</div>
                        <div className="field-value">
                            {!fieldEditing.languages ? (
                                formData.languages?.length ? (
                                    <div className="chips">{formData.languages.map(v => <span className="chip"
                                        key={v}>{v}</span>)}</div>
                                ) : <span className="value-text">Not Provided</span>
                            ) : (
                                <Select
                                    isMulti
                                    name="languages"
                                    options={languageOptions}
                                    value={languageOptions.filter(opt => (formData.languages || []).includes(opt.value))}
                                    onChange={(selected) => setFormData(fd => ({
                                        ...fd,
                                        languages: (selected || []).map(o => o.value)
                                    }))}
                                    menuPlacement="bottom"
                                    placeholder="Select the languages you've used extensively in the past year"
                                />
                            )}
                        </div>
                        <button className="field-edit" type="button" onClick={() => toggleField("languages")}
                            aria-label="Edit languages">
                            <span className="chev" />
                        </button>
                    </div>


                    {/* Databases */}
                    <div className="field-row">
                        <div className="field-label">Databases</div>
                        <div className="field-value">
                            {!fieldEditing.databases ? (
                                formData.databases?.length ? (
                                    <div className="chips">{formData.databases.map(v => <span className="chip"
                                        key={v}>{v}</span>)}</div>
                                ) : <span className="value-text">Not Provided</span>
                            ) : (
                                <Select
                                    isMulti
                                    name="databases"
                                    options={databaseOptions}
                                    value={databaseOptions.filter(opt => (formData.databases || []).includes(opt.value))}
                                    onChange={(selected) => setFormData(fd => ({
                                        ...fd,
                                        databases: (selected || []).map(o => o.value)
                                    }))}
                                    menuPlacement="bottom"
                                    placeholder="Select the databases you've used extensively in the past year"
                                />
                            )}
                        </div>
                        <button className="field-edit" type="button" onClick={() => toggleField("databases")}
                            aria-label="Edit databases">
                            <span className="chev" />
                        </button>
                    </div>

                    {/* Platforms */}
                    <div className="field-row">
                        <div className="field-label">Platforms</div>
                        <div className="field-value">
                            {!fieldEditing.platforms ? (
                                formData.platforms?.length ? (
                                    <div className="chips">{formData.platforms.map(v => <span className="chip"
                                        key={v}>{v}</span>)}</div>
                                ) : <span className="value-text">Not Provided</span>
                            ) : (
                                <Select
                                    isMulti
                                    name="platforms"
                                    options={platformOptions}
                                    value={platformOptions.filter(opt => (formData.platforms || []).includes(opt.value))}
                                    onChange={(selected) => setFormData(fd => ({
                                        ...fd,
                                        platforms: (selected || []).map(o => o.value)
                                    }))}
                                    menuPlacement="bottom"
                                    placeholder="Select the platforms you've used extensively in the past year"
                                />
                            )}
                        </div>
                        <button className="field-edit" type="button" onClick={() => toggleField("platforms")}
                            aria-label="Edit platforms">
                            <span className="chev" />
                        </button>
                    </div>


                    {/* Web Frameworks */}
                    <div className="field-row">
                        <div className="field-label">Web Frameworks</div>
                        <div className="field-value">
                            {!fieldEditing.webframesworks ? (
                                formData.webframesworks?.length ? (
                                    <div className="chips">{formData.webframesworks.map(v => <span className="chip"
                                        key={v}>{v}</span>)}</div>
                                ) : <span className="value-text">Not Provided</span>
                            ) : (
                                <Select
                                    isMulti
                                    name="webframesworks"
                                    options={webframeOptions}
                                    value={webframeOptions.filter(opt => (formData.webframesworks || []).includes(opt.value))}
                                    onChange={(selected) => setFormData(fd => ({
                                        ...fd,
                                        webframesworks: (selected || []).map(o => o.value)
                                    }))}
                                    menuPlacement="bottom"
                                    placeholder="Select the web frameworks you've used extensively in the past year"
                                />
                            )}
                        </div>
                        <button className="field-edit" type="button" onClick={() => toggleField("webframesworks")}
                            aria-label="Edit web frameworks">
                            <span className="chev" />
                        </button>
                    </div>


                    <div className="section-actions">
                        {isSectionEditing("stackA") && (
                            <>
                                <button type="button" className="profile-button is-outline"
                                    onClick={() => cancelSection("stackA")}>Cancel
                                </button>
                                <button type="button" className="advanced-button is-primary"
                                    onClick={() => saveSection("stackA")}>Save
                                </button>
                            </>
                        )}
                    </div>
                </section>


                {/* ===== 5) Tools – Employment ===== */}
                <section className="settings-section">
                    <div className="section-header">
                        <h3 className="section-title">Tools</h3>
                        <p className="section-subtitle">Tooling & employment details.</p>
                    </div>
                    {/* Tools */}
                    <div className="field-row">
                        <div className="field-label">Tools</div>
                        <div className="field-value">
                            {!fieldEditing.tools ? (
                                formData.tools?.length ? (
                                    <div className="chips">{formData.tools.map(v => <span className="chip"
                                        key={v}>{v}</span>)}</div>
                                ) : <span className="value-text">Not Provided</span>
                            ) : (
                                <Select
                                    isMulti
                                    name="tools"
                                    options={toolOptions}
                                    value={toolOptions.filter(opt => (formData.tools || []).includes(opt.value))}
                                    onChange={(selected) => setFormData(fd => ({
                                        ...fd,
                                        tools: (selected || []).map(o => o.value)
                                    }))}
                                    menuPlacement="bottom"
                                    placeholder="Select the tools you've used extensively in the past year"
                                />
                            )}
                        </div>
                        <button className="field-edit" type="button" onClick={() => toggleField("tools")}
                            aria-label="Edit tools">
                            <span className="chev" />
                        </button>
                    </div>

                    {/* Operating Systems  (NOTE: fix name="OpSys", it was "tools" before) */}
                    <div className="field-row">
                        <div className="field-label">Operating Systems</div>
                        <div className="field-value">
                            {!fieldEditing.OpSys ? (
                                formData.OpSys?.length ? (
                                    <div className="chips">{formData.OpSys.map(v => <span className="chip"
                                        key={v}>{v}</span>)}</div>
                                ) : <span className="value-text">Not Provided</span>
                            ) : (
                                <Select
                                    isMulti
                                    name="OpSys"
                                    options={OpSysOptions}
                                    value={OpSysOptions.filter(opt => (formData.OpSys || []).includes(opt.value))}
                                    onChange={(selected) => setFormData(fd => ({
                                        ...fd,
                                        OpSys: (selected || []).map(o => o.value)
                                    }))}
                                    menuPlacement="bottom"
                                    placeholder="Select the Operating Systems you've used extensively in the past year"
                                />
                            )}
                        </div>
                        <button className="field-edit" type="button" onClick={() => toggleField("OpSys")}
                            aria-label="Edit operating systems">
                            <span className="chev" />
                        </button>
                    </div>

                    {/* Employment */}
                    <div className="field-row">
                        <div className="field-label">Employment</div>
                        <div className="field-value">
                            {!fieldEditing.employments ? (
                                formData.employments?.length ? (
                                    <div className="chips">{formData.employments.map(v => <span className="chip"
                                        key={v}>{v}</span>)}</div>
                                ) : <span className="value-text">Not Provided</span>
                            ) : (
                                <Select
                                    isMulti
                                    name="employments"
                                    options={employmentOptions}
                                    value={employmentOptions.filter(opt => (formData.employments || []).includes(opt.value))}
                                    onChange={(selected) => setFormData(fd => ({
                                        ...fd,
                                        employments: (selected || []).map(o => o.value)
                                    }))}
                                    menuPlacement="bottom"
                                    placeholder="Select all that describe your employment status"
                                />
                            )}
                        </div>
                        <button className="field-edit" type="button" onClick={() => toggleField("employments")}
                            aria-label="Edit employment">
                            <span className="chev" />
                        </button>
                    </div>
                    <div className="section-actions">
                        {isSectionEditing("stackB") && (
                            <>
                                <button type="button" className="profile-button is-outline"
                                    onClick={() => cancelSection("stackB")}>Cancel
                                </button>
                                <button type="button" className="profile-button is-primary"
                                    onClick={() => saveSection("stackB")}>Save
                                </button>
                            </>
                        )}
                    </div>
                </section>
            </div>
            <br />
            <div className="advanced-buttons">
                <button className="advanced-button" onClick={() => navigate("/Profile")}>
                    Back
                </button>
            </div>
            {error && <div className="error-message">{error}</div>}


        </div>
    );
}

export default ModifyAdvanced;
