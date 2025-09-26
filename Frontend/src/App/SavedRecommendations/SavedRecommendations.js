import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import config from "../config";
import "./SavedRecommendations.css";

/* =======================================
   SavedRecommendations Component
   - Lets users view, add, and remove saved recommendations
   - Each recommendation shows a salary increase label
   ======================================= */
const SavedRecommendations = ({
                                  toggleScreen,
                                  isSignedIn,
                                  toggleSignendIn,
                                  exchangeRate,
                                  selectedCurrency,
                              }) => {
    const navigate = useNavigate();

    // Map: recommendation text -> increase value (in base currency)
    const [recommendationsIncrese, setRecommendationsIncrese] = useState({});
    const [error, setError] = useState("");

    // Controlled selects for Add & Remove forms
    const [formData, setFormData] = useState({
        addRecommendation: "",
        removeRecommendation: "",
    });

    // Currency formatter for increases (uses selectedCurrency)
    const fmt = new Intl.NumberFormat("en", {
        style: "currency",
        currency: selectedCurrency,
        maximumFractionDigits: 0,
    });

    /* === Initial setup & guards === */
    useEffect(() => {
        toggleScreen("SavedRecommendations"); // mark active screen
        if (!isSignedIn) navigate("/");       // redirect if signed out
    }, [isSignedIn, navigate, toggleScreen]);

    // Scroll to top on mount
    useEffect(() => { window.scrollTo(0, 0); }, []);

    /* === Build quick lookup map for increases === */
    useEffect(() => {
        if (!isSignedIn?.recommendations || !isSignedIn?.recommendationsIncrese) {
            setRecommendationsIncrese({});
            return;
        }
        const map = {};
        isSignedIn.recommendations.forEach((rec, i) => {
            map[rec] = isSignedIn.recommendationsIncrese[i];
        });
        setRecommendationsIncrese(map);
    }, [isSignedIn]);

    const handleSignout = () => toggleSignendIn(false);

    // Controlled select change handler
    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((s) => ({...s, [name]: value}));
    };

    // Display label helper (format increase)
    const incLabel = (rec) => {
        const inc = recommendationsIncrese[rec];
        if (typeof inc !== "number" || Number.isNaN(inc)) return "—";
        return fmt.format(Math.floor(inc * exchangeRate));
    };

    /* === Derived collections for rendering === */
    const savedList = isSignedIn?.savedRecommendations || [];
    const allRecs = isSignedIn?.recommendations || [];

    // Only allow adding positive-valued recommendations not yet saved
    const addOptions = allRecs.filter(
        (r) => !(isSignedIn.savedRecommendations || []).includes(r) &&
            Number(recommendationsIncrese?.[r]) > 0
    );

    /* === Handlers: Add & Remove === */
    const handleAdd = async (e) => {
        e.preventDefault();
        const chosen = formData.addRecommendation;
        if (!chosen) return;

        const saved = isSignedIn.savedRecommendations || [];
        const payload = {
            _id: isSignedIn._id,
            savedRecommendations: [...saved, chosen],
        };

        try {
            const res = await fetch(`${config.apiBaseUrl}/api/users/${isSignedIn._id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(payload),
            });
            const result = await res.json();
            if (!res.ok) {
                setError(result.message);
                return;
            }
            // Reset select + refresh state
            setFormData((s) => ({...s, addRecommendation: ""}));
            toggleSignendIn(isSignedIn.username);
        } catch (err) {
            setError("An error occurred. Please try again.");
            console.error(err);
        }
    };

    const handleRemove = async (e) => {
        e.preventDefault();
        const remove = formData.removeRecommendation;
        if (!remove) return;

        const saved = isSignedIn.savedRecommendations || [];
        const payload = {
            _id: isSignedIn._id,
            savedRecommendations: saved.filter((r) => r !== remove),
        };

        try {
            const res = await fetch(`${config.apiBaseUrl}/api/users/${isSignedIn._id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(payload),
            });
            const result = await res.json();
            if (!res.ok) {
                setError(result.message);
                return;
            }
            // Reset select + refresh state
            setFormData((s) => ({...s, removeRecommendation: ""}));
            toggleSignendIn(isSignedIn.username);
        } catch (err) {
            setError("An error occurred. Please try again.");
            console.error(err);
        }
    };

    // Convenience helper: only returns valid positive increases
    const incFor = (rec) => {
        const v = Number(recommendationsIncrese?.[rec]);
        return Number.isFinite(v) && v > 0 ? v : null;
    };

    /* === Render === */
    return (
        <div className="saved-page">
            {/* Page Header */}
            <header className="page-header">
                <h1 className="profile-title">Saved Recommendations</h1>
                <p className="profile-subtitle">Here’s your saved recommendations.</p>
            </header>

            {/* Main Section */}
            <section className="section">
                <div className="section-header">
                    <h2 className="section-title">Saved Recommendations</h2>
                </div>

                {/* Empty state vs list */}
                {savedList.length === 0 ? (
                    <p className="muted center">No saved recommendations yet — add some below.</p>
                ) : (
                    <div className="list">
                        <div className="list-header">
                            <div>Recommendation</div>
                            <div>Increase</div>
                        </div>
                        {savedList.map((rec, i) => {
                            const inc = incFor(rec);
                            return (
                                <div className="list-row" key={`${rec}-${i}`}>
                                    <div className="col-name">{rec}</div>
                                    <div className="col-inc">
                                        {inc ? (
                                            <span className="pill pill-positive">
                                                {fmt.format(Math.floor(inc * exchangeRate))}
                                            </span>
                                        ) : (
                                            <span className="pill pill-neutral">—</span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Add & Remove forms */}
                <div className="forms">
                    {/* Add form */}
                    <form className="form-row" onSubmit={handleAdd}>
                        <select
                            className="select"
                            name="addRecommendation"
                            value={formData.addRecommendation || ""}
                            onChange={handleChange}
                        >
                            <option value="">Select recommendation to save</option>
                            {addOptions.map((rec, i) => (
                                <option key={`add-${i}`} value={rec}>
                                    {rec} ({incLabel(rec)})
                                </option>
                            ))}
                        </select>
                        <button type="submit" className="profile-button">Add</button>
                    </form>

                    {/* Remove form (only if there are saved recs) */}
                    {savedList.length > 0 && (
                        <form className="form-row" onSubmit={handleRemove}>
                            <select
                                className="select"
                                name="removeRecommendation"
                                value={formData.removeRecommendation || ""}
                                onChange={handleChange}
                            >
                                <option value="">Select recommendation to remove</option>
                                {savedList.map((rec, i) => (
                                    <option key={`rm-${i}`} value={rec}>
                                        {rec} ({incLabel(rec)})
                                    </option>
                                ))}
                            </select>
                            <button type="submit" className="profile-button is-danger-outline">Remove</button>
                        </form>
                    )}
                </div>
            </section>

            {/* Bottom Navigation */}
            <div className="profile-buttons">
                <button className="profile-button is-outline" onClick={() => navigate("/Recommendations")}>
                    Basic
                </button>
                <button className="profile-button is-outline" onClick={() => navigate("/AdvancedRecommendations")}>
                    Advanced
                </button>
                <button className="profile-button is-danger-outline" onClick={handleSignout}>
                    Sign Out
                </button>
            </div>

            {/* Error message */}
            {error && <p className="error-msg">{error}</p>}
        </div>
    );
};

export default SavedRecommendations;
