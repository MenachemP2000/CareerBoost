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



function App() {
    const [screen, setScreen] = useState(false);
    const [isSignedIn, setSignedInStatus] = useState(() => {
        const savedStatus = localStorage.getItem('isSignedIn');
        return savedStatus ? JSON.parse(savedStatus) : false;
    });

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
                        isSignedIn={isSignedIn} />} />
                </Routes>
            </div>
        </Router>

    );
}

export default App;