import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip,
    ResponsiveContainer, CartesianGrid, LabelList, Cell
} from "recharts";
import config from '../config';
import "./Recommendations.css";

/**
 * Recommendations Component
 * --------------------------
 * Displays salary improvement recommendations based on the signed-in user's profile.
 * - Shows top 5 recommendations with estimated salary increases
 * - Displays chart with base salary, individual recommendations, and combined impact
 * - Allows recalculating recommendations
 * - Provides navigation to advanced and saved recommendations
 */

// Bar colors palette (loops if more bars than colors)
const BAR_COLORS = [
    "#f97316", // orange
    "#f59e0b", // amber
    "#22c55e", // green
    "#38bdf8", // sky
    "#6366f1", // indigo
    "#8b5cf6", // violet
    "#06b6d4", // cyan
];

// Format numbers compactly (10K, 1M, etc.)
const compact = (n) =>
    new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(n);

// Custom angled-top bar shape for nicer styling
const AngledBar = (props) => {
    const { x, y, width, height, fill } = props;
    const cap = Math.min(18, width * 0.35); // top angle cap
    const d = [
        `M ${x} ${y + cap}`,
        `L ${x + cap} ${y}`,
        `L ${x + width - cap} ${y}`,
        `L ${x + width} ${y + cap}`,
        `L ${x + width} ${y + height}`,
        `L ${x} ${y + height} Z`,
    ].join(" ");
    return <path d={d} fill={fill} />;
};

// Custom label bubble that floats above each bar
const LabelBubble = (props) => {
    const { x, y, width, value } = props;
    if (x == null || y == null) return null;
    const cx = x + width / 2;
    const txt = compact(Number(value));
    const w = Math.max(52, txt.length * 9); // dynamic bubble width
    const h = 22;
    const rx = 8;
    return (
        <g transform={`translate(${cx - w / 2}, ${y - h - 12})`}>
            <rect width={w} height={h} rx={rx} fill="white" stroke="var(--border)" />
            {/* Little triangle pointer */}
            <polygon
                points={`${w / 2 - 6},${h} ${w / 2 + 6},${h} ${w / 2},${h + 8}`}
                fill="white"
                stroke="var(--border)" />
            <text
                x={w / 2}
                y={h / 2 + 4}
                textAnchor="middle"
                fontSize="12"
                fontWeight="700"
                fill="#111827">
                {txt}
            </text>
        </g>
    );
};

const Recommendations = ({ toggleScreen, isSignedIn, toggleSignendIn, exchangeRate, selectedCurrency }) => {
    const navigate = useNavigate();

    // State for recommendations and salary increases
    const [recommendations, setRecommendations] = useState([]);
    const [recommendationsIncrese, setRecommendationsIncrese] = useState({});
    const [error, setError] = useState('');
    const [data, setData] = useState([]); // Chart data

    // Screen setup + redirect if not signed in
    useEffect(() => {
        toggleScreen("Recommendations");
        if (!isSignedIn) navigate("/signin");
    }, [isSignedIn, navigate, toggleScreen]);

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Build top 5 recommendations and chart data whenever user data or FX changes
    useEffect(() => {
        if (!isSignedIn.recommendations || !isSignedIn.recommendationsIncrese) {
            setRecommendations([]);
            setRecommendationsIncrese({});
            setData([]);
            return;
        }
        if (!isSignedIn.recommendations.length || !isSignedIn.recommendationsIncrese.length) {
            setRecommendations([]);
            setRecommendationsIncrese({});
            setData([]);
            return;
        }

        // Slice only top 5 recommendations
        const filteredRecommendations = isSignedIn.recommendations.slice(0, 5);

        // Build dictionary mapping rec → increase amount
        const increaseDictionary = {};
        isSignedIn.recommendations.forEach((rec, i) => {
            increaseDictionary[rec] = isSignedIn.recommendationsIncrese[i];
        });

        setRecommendationsIncrese(increaseDictionary);
        setRecommendations(filteredRecommendations);

        // Stop if missing base prediction or combined value
        if (!filteredRecommendations.length || !isSignedIn.prediction || !isSignedIn.combined) {
            setData([]);
            return;
        }

        // Build bar chart data
        const newData = [];
        const reversedRecommendations = filteredRecommendations.slice().reverse();

        // Base salary
        newData.push({ name: "Base", salary: Number(isSignedIn.prediction) * exchangeRate });

        // Each recommendation adds on top of base
        for (const rec of reversedRecommendations) {
            const bump = Number(increaseDictionary[rec] || 0);
            const name = rec.replace(/(to |it would |will )?increase your salary by approximately /g, "");
            newData.push({
                name,
                salary: (Number(isSignedIn.prediction) + bump) * exchangeRate
            });
        }

        // Final combined salary
        newData.push({ name: "All Combined", salary: Number(isSignedIn.combined) * exchangeRate });

        setData(newData);
    }, [isSignedIn, exchangeRate]);

    // Sign out
    const handleSignout = () => {
        toggleSignendIn(false);
    };

    // Request new recommendations from backend
    const handleRecommendations = async (e) => {
        e.preventDefault();
        const payload = { _id: isSignedIn._id, username: isSignedIn.username };

        try {
            // Construct user profile payload
            const userprofile = {
                Country: isSignedIn.country,
                WorkExp: isSignedIn.experience,
                EdLevel: isSignedIn.education,
                Age: isSignedIn.age,
            };
            // Copy optional fields if present
            if (isSignedIn.MainBranch) userprofile.MainBranch = isSignedIn.MainBranch;
            if (isSignedIn.RemoteWork) userprofile.RemoteWork = isSignedIn.RemoteWork;
            if (isSignedIn.DevType) userprofile.DevType = isSignedIn.DevType;
            if (isSignedIn.OrgSize) userprofile.OrgSize = isSignedIn.OrgSize;
            if (isSignedIn.ICorPM) userprofile.ICorPM = isSignedIn.ICorPM;
            if (isSignedIn.Industry) userprofile.Industry = isSignedIn.Industry;
            if (isSignedIn.YearsCode) userprofile.YearsCode = isSignedIn.YearsCode;
            if (isSignedIn.YearsCodePro) userprofile.YearsCodePro = isSignedIn.YearsCodePro;
            if (isSignedIn.JobSat) userprofile.JobSat = isSignedIn.JobSat;

            // Encode categorical multi-selects as one-hot
            for (const listName of ["languages", "employments", "databases", "platforms", "webframesworks", "tools", "OpSys"]) {
                if (isSignedIn[listName]) {
                    for (const val of isSignedIn[listName]) {
                        userprofile[val] = 1;
                    }
                }
            }

            // Ask backend for recommendations
            const response = await fetch(`${config.apiBaseUrl}/api/model/recommend`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userprofile),
            });

            const result = await response.json();
            payload.topRecommendations = result.topRecommendations;
            payload.combined = result.combined;
            payload.recommendations = result.recommendations;
            payload.recommendationsIncrese = result.recommendationsIncrese;
            payload.recommendationsFeature = result.recommendationsFeature;

            if (!response.ok) {
                setError(result.message);
                return;
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
            console.error('Error:', error);
        }

        // Save recommendations back to user profile in DB
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
            toggleSignendIn(isSignedIn.username);
        } catch (error) {
            setError('An error occurred. Please try again.');
            console.error('Error:', error);
        }
    };

    return (
        <div className="recommendations-page">
            {/* Page header */}
            <header className="page-header">
                <h1 className="profile-title">Recommendations</h1>
                <p className="profile-subtitle">
                    Here’s an overview of your top recommendations. If you change your information,
                    you can hit “Re-calculate Recommendations”.
                </p>
            </header>

            {/* Initial state: no recommendations */}
            {(!recommendations.length || !Object.keys(recommendationsIncrese).length) ? (
                <section className="section">
                    <div className="section-header">
                        <h2 className="section-title">Get Recommendations</h2>
                    </div>
                    <p className="muted">
                        Click the button below to get recommendations based on your profile.
                    </p>
                    <div className="btn-row">
                        <button onClick={handleRecommendations} className="profile-button">
                            Get Recommendations
                        </button>
                    </div>
                </section>
            ) : (
                <section className="section">
                    {/* Recommendations list */}
                    <div className="section-header">
                        <h2 className="section-title">Top Recommendations</h2>
                    </div>
                    <ul className="rec-list">
                        {recommendations.map((rec, i) => (
                            <li key={i} className="rec-item">
                                <span className="rec-text">
                                    {rec.replace(/(to |it would |will )?increase your salary by approximately /g, "")}
                                </span>
                                <div className="col-inc">
                                    <span className="pill pill-positive">
                                        +{" "}
                                        {new Intl.NumberFormat("en", {
                                            style: "currency",
                                            currency: selectedCurrency,
                                            maximumFractionDigits: 0,
                                        }).format(Math.floor((recommendationsIncrese[rec] || 0) * exchangeRate))}
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>

                    {/* Combined salary estimate */}
                    <div className="kpi-wrap" aria-live="polite">
                        <div className="kpi">
                            <span className="kpi-lead">
                                Following these recommendations, your salary could be
                            </span>
                            <span className="salary-estimate">
                                {new Intl.NumberFormat("en", {
                                    style: "currency",
                                    currency: selectedCurrency,
                                    maximumFractionDigits: 0,
                                }).format(Math.floor(isSignedIn.combined * exchangeRate))}
                            </span>
                            <span className="kpi-sub">per year</span>
                        </div>
                    </div>

                    {/* Salary chart */}
                    <p className="muted center">
                        Hover over the bars to see the salary estimates for each recommendation.
                    </p>
                    <div className="chart-wrap">
                        <ResponsiveContainer width="100%" height={340}>
                            <BarChart data={data} margin={{ top: 20, right: 16, left: 8, bottom: 0 }}>
                                <defs>
                                    {/* Drop shadow for bars */}
                                    <filter id="barShadow" height="130%">
                                        <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.25" />
                                    </filter>
                                    {/* Gradient for each bar */}
                                    {data.map((_, i) => (
                                        <linearGradient id={`grad-${i}`} key={i} x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor={BAR_COLORS[i % BAR_COLORS.length]} stopOpacity="1" />
                                            <stop offset="100%" stopColor={BAR_COLORS[i % BAR_COLORS.length]} stopOpacity="0.75" />
                                        </linearGradient>
                                    ))}
                                </defs>

                                <CartesianGrid vertical={false} stroke="var(--border)" />
                                <XAxis dataKey="name" tick={{ fill: "var(--muted)" }} axisLine={false} tickLine={false} />
                                <Tooltip
                                    content={({ active, payload, label }) => {
                                        if (!active || !payload?.length) return null;
                                        const v = payload[0].value;
                                        return (
                                            <div className="cb-tooltip">
                                                <div className="cb-tooltip-title">{label}</div>
                                                <div className="cb-tooltip-value">
                                                    {new Intl.NumberFormat("en", {
                                                        style: "currency",
                                                        currency: selectedCurrency,
                                                        maximumFractionDigits: 0,
                                                    }).format(v)}
                                                </div>
                                            </div>
                                        );
                                    }}
                                />

                                <Bar dataKey="salary" shape={<AngledBar />} filter="url(#barShadow)">
                                    {data.map((_, i) => <Cell key={i} fill={`url(#grad-${i})`} />)}
                                    <LabelList dataKey="salary" position="top" offset={16} content={<LabelBubble />} />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Recalculate button */}
                    <div className="btn-row center">
                        <button onClick={handleRecommendations} className="profile-button">
                            Re-calculate Recommendations
                        </button>
                    </div>
                </section>
            )}

            {/* Bottom navigation buttons */}
            <div className="btn-row">
                <button onClick={() => navigate("/AdvancedRecommendations")} className="profile-button is-outline">
                    Advanced
                </button>
                <button onClick={() => navigate("/SavedRecommendations")} className="profile-button is-outline">
                    Saved
                </button>
                <button onClick={handleSignout} className="profile-button is-danger-outline">
                    Sign Out
                </button>
            </div>

            {error && <p className="error-msg">{error}</p>}
        </div>
    );
};

export default Recommendations;
