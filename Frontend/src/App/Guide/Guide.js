import React from "react";
import {useEffect, useState} from "react";
import {useNavigate} from 'react-router-dom';
import "./Guide.css";
/* Import JPGs exactly like About.js */
import step1Image from "../images/step1.jpg";
import step3Image from "../images/step3.jpg";
const Guide = ({toggleScreen, isSignedIn, toggleSignendIn}) => {
    const navigate = useNavigate();
    const [error, setError] = useState('');

    useEffect(() => {
        toggleScreen("Guide");
    }, [toggleScreen]);

    const steps = [
        {
            title: "Step 1: Getting Started",
            content: "To begin, create an account or sign in. This will allow you to get a salary prediction and access personalized recommendations tailored to you.",
            img: step1Image
        },
        {
            title: "Step 2: Advanced Information",
            content: "After signing in, click on Advanced to view and modify advanced information. Doing so will yield more accurate predictions and relevant recommendations."
            // no image
        },
        {
            title: "Step 3: Predictions",
            content: "To get a salary prediction, go to the prediction tab and click on Predict. Our tool will provide you with an estimate of your potential salary based on your skills and experience. By clicking Experiment, you can experiment and see how different factors affect your salary without changing your profile information.",
            img: step3Image
        },
        {
            title: "Step 4: Recommendations",
            content: "To get recommendations, go to the recommendations tab and click Recommend. Based on your profile and preferences, we will provide you with career suggestions, skills you should develop, and inform you of their potential impact. Clicking on Saved allows you to save recommendations for later access, and clicking on Advanced provides more recommendations with filtering options."
            // no image
        }
    ];


    return (
        <div className="guide-page">
            <div className="guide-inner">
                {/* Title uses the same classes as Profile */}
                <h3 className="profile-title">Guide</h3>
                <p className="profile-subtitle">
                    Here’s a quick walkthrough to get started with CareerBoost.
                </p>

                <div className="guide-list">
                    {steps.map((s, i) => {
                        const rowClass = ["guide-section"];
                        if (!s.img) rowClass.push("no-media");        // center-only row
                        else if (i % 2) rowClass.push("reverse");     // alternate when there IS an image

                        return (
                            <section key={s.title} className={rowClass.join(" ")}>
                                {s.img && (
                                    <div className="guide-media">
                                        <img src={s.img} alt={s.alt || s.title} loading="lazy"/>
                                    </div>
                                )}

                                <div className="guide-copy">
                                    <h4 className="guide-h4">{s.title}</h4>
                                    <p className="guide-text">{s.content}</p>
                                </div>
                            </section>
                        );
                    })}
                </div>
            </div>
        </div>

    );
};

export default Guide;

