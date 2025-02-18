import "./App.css";
import Home from "./Home/Home";
import Aboutus from "./About/About";
import Contact from "./Contacts/Contact";
import NavbarComponent from "./NavBar/Navbar";
import CreateAccount from './CreateAccount/CreateAccount';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Import Routes
import config from './config';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import SignIn from "./SignIn/SignIn";
import Profile from "./Profile/Profile";
import ModifyAccount from "./ModifyAccount/ModifyAccount";
import Recommendations from "./Recommendations/Recommendations";
import AdvancedProfile from "./AdvancedProfile/AdvancedProfile";
import ModifyAdvanced from "./ModifyAdvanced/ModifyAdvanced";
import AdvancedRecommendations from "./AdvancedRecommendations/AdvancedRecommendations";
import Experiment from "./Experiment/Experiment";
import SavedRecommendations from "./SavedRecommendations/SavedRecommendations";
import Prediction from "./Prediction/Prediction";
import Guide from "./Guide/Guide";



function App() {
    const [screen, setScreen] = useState(false);
    const [isSignedIn, setSignedInStatus] = useState(() => {
        const savedStatus = localStorage.getItem('isSignedIn');
        return savedStatus ? JSON.parse(savedStatus) : false;
    });

    const languages = [
        "Assembly", "Bash/Shell (all shells)", "C", "C++", "HTML/CSS", "Java", "JavaScript",
        "Python", "R", "SQL", "TypeScript", "Fortran", "MATLAB", "Julia", "C#", "MicroPython",
        "Go", "Kotlin", "Ruby", "PowerShell", "Groovy", "Elixir", "Rust", "Dart", "Delphi",
        "Apex", "PHP", "F#", "GDScript", "Perl", "Lua", "Objective-C", "VBA", "Ada", "Swift",
        "Scala", "Visual Basic (.Net)", "Lisp", "Clojure", "Erlang", "Haskell", "OCaml", "Prolog",
        "Nim", "Cobol", "Solidity", "Zig", "Zephyr", "Crystal"
    ];

    useEffect(() => {
        localStorage.setItem('isSignedIn', JSON.stringify(isSignedIn));
    }, [isSignedIn]);

    const getUserByUserName = async (username) => {
        try {
            const response = await fetch(`${config.apiBaseUrl}/api/users/username/${username}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch user');
            }
            const userFromServer = await response.json();
            setSignedInStatus(userFromServer);
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    };

    const toggleSignendIn = async (username) => {

        if (username) {
            try {
                await getUserByUserName(username);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        }
        else {
            localStorage.setItem('token', '');
            setSignedInStatus(false);
        }
    };

    const toggleScreen = useCallback((screen) => {
        setScreen(screen);
    }, []);
    return (
        <Router>
            <div>
                <NavbarComponent />

                <Routes>
                    <Route path="/" element={<Home
                        toggleScreen={toggleScreen}
                        isSignedIn={isSignedIn}
                        toggleSignendIn={toggleSignendIn} />} />
                    <Route path="/Guide" element={<Guide
                        toggleScreen={toggleScreen}
                        isSignedIn={isSignedIn}
                        toggleSignendIn={toggleSignendIn} />} />
                    <Route path="/aboutus" element={<Aboutus />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/createaccount" element={<CreateAccount
                        toggleSignendIn={toggleSignendIn}
                        toggleScreen={toggleScreen}
                        isSignedIn={isSignedIn} />} />
                    <Route path="/modifyaccount" element={<ModifyAccount
                        toggleSignendIn={toggleSignendIn}
                        toggleScreen={toggleScreen}
                        isSignedIn={isSignedIn} />} />
                    <Route path="/signin" element={<SignIn
                        toggleSignendIn={toggleSignendIn}
                        toggleScreen={toggleScreen}
                        isSignedIn={isSignedIn} />} />
                    <Route path="/profile" element={<Profile
                        toggleSignendIn={toggleSignendIn}
                        toggleScreen={toggleScreen}
                        isSignedIn={isSignedIn} />} />
                    <Route path="/AdvancedProfile" element={<AdvancedProfile
                        toggleSignendIn={toggleSignendIn}
                        toggleScreen={toggleScreen}
                        isSignedIn={isSignedIn} />} />
                    <Route path="/ModifyAdvanced" element={<ModifyAdvanced
                        toggleSignendIn={toggleSignendIn}
                        toggleScreen={toggleScreen}
                        isSignedIn={isSignedIn} />} />
                    <Route path="/Recommendations" element={<Recommendations
                        toggleSignendIn={toggleSignendIn}
                        toggleScreen={toggleScreen}
                        isSignedIn={isSignedIn}/>} />

                    <Route path="/AdvancedRecommendations" element={<AdvancedRecommendations
                        toggleSignendIn={toggleSignendIn}
                        toggleScreen={toggleScreen}
                        isSignedIn={isSignedIn} 
                        languages={languages} />} />

                    <Route path="/SavedRecommendations" element={<SavedRecommendations
                        toggleSignendIn={toggleSignendIn}
                        toggleScreen={toggleScreen}
                        isSignedIn={isSignedIn} />} />
                    <Route path="/Experiment" element={<Experiment
                        toggleSignendIn={toggleSignendIn}
                        toggleScreen={toggleScreen}
                        isSignedIn={isSignedIn} />} />
                    <Route path="/Prediction" element={<Prediction
                        toggleSignendIn={toggleSignendIn}
                        toggleScreen={toggleScreen}
                        isSignedIn={isSignedIn} />} />
                </Routes>
            </div>
        </Router>

    );
}

export default App;