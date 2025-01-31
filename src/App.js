import './App.css';
import Home from "./components/pages/Home";
import Aboutus from "./components/pages/About";
import Contact from "./components/pages/Contact";
import NavbarComponent from "./components/inc/Navbar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Import Routes

function App() {
    return (
        <Router>
            <div>
                <NavbarComponent/>

                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/aboutus" element={<Aboutus />} />
                    <Route path="/contact" element={<Contact />} />
                </Routes>
            </div>
        </Router>

    );
}

export default App;