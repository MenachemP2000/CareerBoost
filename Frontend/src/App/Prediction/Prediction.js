import React from "react";
// import { Row, Card, Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { useNavigate } from 'react-router-dom';
import config from '../config';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer, LabelList  } from 'recharts';
import './Prediction.css';
import "../Profile/Profile.css";


const Prediction = ({ toggleScreen, isSignedIn, toggleSignendIn, selectedCurrency, exchangeRate }) => {

    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [top3Data, setTop3Data] = useState(isSignedIn.impacts ? isSignedIn.impacts.slice(0, 3) : []); //top 3 impacting features


// compact number formatter for axes/labels (10K, 20K…)
    const formatCompact = (n) =>
        new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(n);


// small tooltip component for the chart
    const CustomTooltip = ({ active, payload, label }) => {
        if (!active || !payload?.length) return null;
        const v = payload[0].value;
        return (
            <div className="cb-tooltip">
                <div className="cb-tooltip-title">{label}</div>
                <div className="cb-tooltip-value">{formatCompact(v)} impact</div>
            </div>
        );
    };

    const chartData = useMemo(() => {
        const COLORS = ["#14b8a6", "#4f46e5", "#f59e0b"];
        return (top3Data || []).map((d, i) => ({
            ...d,
            impact: Number(d.impact),
            _color: COLORS[i % COLORS.length],
        }));
    }, [top3Data]);



    useEffect(() => {
        toggleScreen("Prediction");
        if (!isSignedIn) {
            navigate("/signin");
        }
    });
    useEffect(() => {
        setTop3Data(isSignedIn.impacts ? isSignedIn.impacts.slice(0, 3) : []); //top 3 impacting features
    }, [isSignedIn]);

    const handleSignout = () => {
        toggleSignendIn(false);
    }

    const handlePredict = async (e) => {
        e.preventDefault();

        const payload = { _id: isSignedIn._id, username: isSignedIn.username };
        try {
            const userprofile = {
                Country: isSignedIn.country, WorkExp: isSignedIn.experience,
                EdLevel: isSignedIn.education, Age: isSignedIn.age
            }; //basic user profile
            if (isSignedIn.MainBranch) {
                userprofile.MainBranch = isSignedIn.MainBranch;
            }
            if (isSignedIn.RemoteWork) {
                userprofile.RemoteWork = isSignedIn.RemoteWork;
            }
            if (isSignedIn.DevType) {
                userprofile.DevType = isSignedIn.DevType;
            }
            if (isSignedIn.OrgSize) {
                userprofile.OrgSize = isSignedIn.OrgSize;
            }
            if (isSignedIn.ICorPM) {
                userprofile.ICorPM = isSignedIn.ICorPM;
            }
            if (isSignedIn.Industry) {
                userprofile.Industry = isSignedIn.Industry;
            }
            if (isSignedIn.YearsCode) {
                userprofile.YearsCode = isSignedIn.YearsCode;
            }
            if (isSignedIn.YearsCodePro) {
                userprofile.YearsCodePro = isSignedIn.YearsCodePro;
            }
            if (isSignedIn.JobSat) {
                userprofile.JobSat = isSignedIn.JobSat;
            }
            if (isSignedIn.languages) {
                for (let i = 0; i < isSignedIn.languages.length; i++) {
                    userprofile[isSignedIn.languages[i]] = 1;
                }
            }
            if (isSignedIn.employments) {
                for (let i = 0; i < isSignedIn.employments.length; i++) {
                    userprofile[isSignedIn.employments[i]] = 1;
                }
            }
            if (isSignedIn.databases) {
                for (let i = 0; i < isSignedIn.databases.length; i++) {
                    userprofile[isSignedIn.databases[i]] = 1;
                }
            }
            if (isSignedIn.platforms) {
                for (let i = 0; i < isSignedIn.platforms.length; i++) {
                    userprofile[isSignedIn.platforms[i]] = 1;
                }
            }
            if (isSignedIn.webframesworks) {
                for (let i = 0; i < isSignedIn.webframesworks.length; i++) {
                    userprofile[isSignedIn.webframesworks[i]] = 1;
                }
            }
            if (isSignedIn.tools) {
                for (let i = 0; i < isSignedIn.tools.length; i++) {
                    userprofile[isSignedIn.tools[i]] = 1;
                }
            }
            if (isSignedIn.OpSys) {
                for (let i = 0; i < isSignedIn.OpSys.length; i++) {
                    userprofile[isSignedIn.OpSys[i]] = 1;
                }
            }
            // Send the registration data to the server
            console.log(userprofile);
            const response = await fetch(`${config.apiBaseUrl}/api/model/predict`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userprofile)
            });

            const result = await response.json();
            payload.prediction = Math.floor(result.prediction);
            payload.impacts = result.impacts;

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
            toggleSignendIn(isSignedIn.username);
        } catch (error) {
            setError('An error occurred. Please try again.');
            console.error('Error:', error);
        }

    }
    return (
        <div className="prediction-page">
            <header className="page-header">
                <h1 className="profile-title">Prediction</h1>
                <p className="profile-subtitle">Your projected salary based on your profile.</p>
            </header>

            {isSignedIn && (
                <>
                    {/* Salary section */}
                    <section className="section">
                        <div className="section-header">
                            <h2 className="section-title">Salary Prediction</h2>
                        </div>

                        {(!isSignedIn.prediction || isSignedIn.prediction === 0) ? (
                            <>
                                <p className="muted">
                                    We haven’t predicted your salary yet. Click below and we’ll do it now.
                                </p>
                                <div className="btn-row">
                                    <button onClick={handlePredict} className="profile-button">Predict</button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="kpi-wrap" aria-live="polite">
                                    <div className="kpi">
                  <span className="currency">
                    {new Intl.NumberFormat("en", {
                        style: "currency",
                        currency: selectedCurrency,
                        maximumFractionDigits: 0,
                    }).format(Math.floor(isSignedIn.prediction * exchangeRate))}
                  </span>
                                        <span className="kpi-sub">per year</span>
                                    </div>
                                </div>
                                <br/>
                                <div className="profile-buttons">
                                    <button onClick={handlePredict} className="profile-button">Re-predict</button>
                                    <Link to="/Experiment" className="btn-ghost">Experiment</Link>
                                    <button onClick={handleSignout} className="profile-button is-danger-outline">Sign Out</button>
                                </div>
                            </>
                        )}
                    </section>

                    {/* Feature importance section */}
                    {(isSignedIn.prediction && isSignedIn.prediction !== 0) && (
                        <section className="section">
                            <div className="section-header">
                                <h2 className="section-title">Top Salary Drivers</h2>
                                <span className="section-hint">Model feature impact</span>
                            </div>

                            <div className="chart-wrap">
                                <ResponsiveContainer width="100%" height={320}>
                                    <BarChart
                                        data={chartData}
                                        layout="vertical"
                                        margin={{ top: 8, right: 24, bottom: 8, left: 16 }}
                                    >
                                        <defs>
                                            {chartData.map((d, i) => (
                                                <linearGradient id={`grad-${i}`} key={i} x1="0" y1="0" x2="1" y2="0">
                                                    <stop offset="0%" stopColor={d._color} stopOpacity={0.9} />
                                                    <stop offset="100%" stopColor={d._color} stopOpacity={0.65} />
                                                </linearGradient>
                                            ))}
                                        </defs>

                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis
                                            type="number"
                                            tickFormatter={formatCompact}
                                            tick={{ fill: "var(--muted)" }}
                                            axisLine={false}
                                        />
                                        <YAxis
                                            type="category"
                                            dataKey="feature"
                                            tick={{ fill: "var(--text)",fontSize: "small" }}
                                            axisLine={false}
                                        />
                                        <Tooltip content={<CustomTooltip />} />

                                        <Bar dataKey="impact" barSize={24} radius={[0, 12, 12, 0]}>
                                            {chartData.map((_, i) => (
                                                <Cell key={i} fill={`url(#grad-${i})`} />
                                            ))}
                                            <LabelList dataKey="impact" position="right" formatter={formatCompact} />
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </section>
                    )}
                </>
            )}

            {error && <p className="error-msg">{error}</p>}
        </div>
    );

}

export default Prediction;