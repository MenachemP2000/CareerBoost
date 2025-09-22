import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import config from '../config';
// Charting components from Recharts
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer, LabelList } from 'recharts';

import './Prediction.css';
import "../Profile/Profile.css";

/**
 * Prediction Component
 * --------------------
 * Displays salary prediction and top feature drivers for a signed-in user.
 * Features:
 *  - Predict/Re-predict salary via backend model
 *  - Show salary in chosen currency with exchange rate
 *  - Bar chart of top 3 impacting features
 */
const Prediction = ({ toggleScreen, isSignedIn, toggleSignendIn, selectedCurrency, exchangeRate }) => {
    const navigate = useNavigate();

    const [error, setError] = useState('');
    const [top3Data, setTop3Data] = useState(
        isSignedIn.impacts ? isSignedIn.impacts.slice(0, 3) : []
    ); // Top 3 model impacts

    // --- Formatter for compact numbers (10K, 1M, etc.) ---
    const formatCompact = (n) =>
        new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(n);

    // --- Custom tooltip for bar chart ---
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

    // --- Prepare chart data with colors ---
    const chartData = useMemo(() => {
        const COLORS = ["#14b8a6", "#4f46e5", "#f59e0b"]; // Teal, Indigo, Amber
        return (top3Data || []).map((d, i) => ({
            ...d,
            impact: Number(d.impact),       // Ensure numeric value
            _color: COLORS[i % COLORS.length], // Assign color cyclically
        }));
    }, [top3Data]);

    // --- Set screen and redirect if not signed in ---
    useEffect(() => {
        toggleScreen("Prediction");
        if (!isSignedIn) {
            navigate("/signin");
        }
    });

    // --- Scroll to top on mount ---
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // --- Update top3Data when profile changes ---
    useEffect(() => {
        setTop3Data(isSignedIn.impacts ? isSignedIn.impacts.slice(0, 3) : []);
    }, [isSignedIn]);

    // --- Handle signout ---
    const handleSignout = () => {
        toggleSignendIn(false);
    };

    // --- Call backend model to predict salary ---
    const handlePredict = async (e) => {
        e.preventDefault();

        const payload = { _id: isSignedIn._id, username: isSignedIn.username };
        try {
            // Build userprofile object with all features
            const userprofile = {
                Country: isSignedIn.country,
                WorkExp: isSignedIn.experience,
                EdLevel: isSignedIn.education,
                Age: isSignedIn.age
            };

            // Add optional fields if available
            if (isSignedIn.MainBranch) userprofile.MainBranch = isSignedIn.MainBranch;
            if (isSignedIn.RemoteWork) userprofile.RemoteWork = isSignedIn.RemoteWork;
            if (isSignedIn.DevType) userprofile.DevType = isSignedIn.DevType;
            if (isSignedIn.OrgSize) userprofile.OrgSize = isSignedIn.OrgSize;
            if (isSignedIn.ICorPM) userprofile.ICorPM = isSignedIn.ICorPM;
            if (isSignedIn.Industry) userprofile.Industry = isSignedIn.Industry;
            if (isSignedIn.YearsCode) userprofile.YearsCode = isSignedIn.YearsCode;
            if (isSignedIn.YearsCodePro) userprofile.YearsCodePro = isSignedIn.YearsCodePro;
            if (isSignedIn.JobSat) userprofile.JobSat = isSignedIn.JobSat;

            // Encode arrays as one-hot features (e.g. JavaScript=1)
            ["languages", "employments", "databases", "platforms", "webframesworks", "tools", "OpSys"].forEach(key => {
                if (isSignedIn[key]) {
                    for (let i = 0; i < isSignedIn[key].length; i++) {
                        userprofile[isSignedIn[key][i]] = 1;
                    }
                }
            });

            // --- Call model API ---
            const response = await fetch(`${config.apiBaseUrl}/api/model/predict`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userprofile)
            });

            const result = await response.json();
            payload.prediction = Math.floor(result.prediction); // Rounded prediction
            payload.impacts = result.impacts;                   // Feature importances

            if (!response.ok) {
                setError(result.message);
                return;
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
            console.error('Error:', error);
        }

        // --- Update user with prediction in DB ---
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
                setError(result.message);
                return;
            }

            // Refresh user data
            toggleSignendIn(isSignedIn.username);
        } catch (error) {
            setError('An error occurred. Please try again.');
            console.error('Error:', error);
        }
    };

    return (
        <div className="prediction-page">
            {/* Page header */}
            <header className="page-header">
                <h1 className="profile-title">Prediction</h1>
                <p className="profile-subtitle">Your projected salary based on your profile.</p>
            </header>

            {isSignedIn && (
                <>
                    {/* Salary Prediction Section */}
                    <section className="section">
                        <div className="section-header">
                            <h2 className="section-title">Salary Prediction</h2>
                        </div>

                        {/* If no prediction yet, show Predict button */}
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
                            /* Show salary result */
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

                                {/* Actions */}
                                <div className="profile-buttons">
                                    <button onClick={handlePredict} className="profile-button">Re-predict</button>
                                    <Link to="/Experiment" className="btn-ghost">Experiment</Link>
                                    <button onClick={handleSignout} className="profile-button is-danger-outline">
                                        Sign Out
                                    </button>
                                </div>
                            </>
                        )}
                    </section>

                    {/* Top Salary Drivers Chart */}
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
                                        {/* Gradient colors per bar */}
                                        <defs>
                                            {chartData.map((d, i) => (
                                                <linearGradient id={`grad-${i}`} key={i} x1="0" y1="0" x2="1" y2="0">
                                                    <stop offset="0%" stopColor={d._color} stopOpacity={0.9} />
                                                    <stop offset="100%" stopColor={d._color} stopOpacity={0.65} />
                                                </linearGradient>
                                            ))}
                                        </defs>

                                        {/* Axes & grid */}
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
                                            tick={{ fill: "var(--text)", fontSize: "small" }}
                                            axisLine={false}
                                        />

                                        {/* Tooltip + Bars */}
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

            {/* Error message */}
            {error && <p className="error-msg">{error}</p>}
        </div>
    );
}

export default Prediction;
