import "./App.css";
import Home from "./Home/Home";
import AboutUs from "./About/About";
import Contact from "./Contacts/Contact";
import NavbarComponent from "./NavBar/Navbar";
import CreateAccount from './CreateAccount/CreateAccount';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Import Routes
import config from './config';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import SignIn from "./SignIn/SignIn";
import Profile from "./Profile/Profile";
import Recommendations from "./Recommendations/Recommendations";
import ModifyAdvanced from "./ModifyAdvanced/ModifyAdvanced";
import AdvancedRecommendations from "./AdvancedRecommendations/AdvancedRecommendations";
import Experiment from "./Experiment/Experiment";
import SavedRecommendations from "./SavedRecommendations/SavedRecommendations";
import Prediction from "./Prediction/Prediction";
import Guide from "./Guide/Guide";
import JobSearch from "./JobSearch/JobSearch";
import FeaturedJobs from "./FeaturedJobs/FeaturedJobs";
import SavedJobs from "./SavedJobs/SavedJobs";
import FooterComponent from "./Footer/Footer";
import Features from "./Features/Features";

function App() {
    const [screen, setScreen] = useState(false);


    const [isSignedIn, setSignedInStatus] = useState(() => {
        const savedStatus = localStorage.getItem('isSignedIn');
        return savedStatus ? JSON.parse(savedStatus) : false;
    });

    const MainBranchs = [
        "I am a developer by profession",
        "I am not primarily a developer, but I write code sometimes as part of my work/studies"
    ];

    const RemoteWork = [
        "Hybrid (some remote, some in-person)",
        "Remote", "In-person"
    ];

    const DevType = [
        "Developer, full-stack",
        "Developer, back-end",
        "Developer, front-end",
        "Developer, desktop or enterprise applications",
        "Developer, mobile",
        "Developer, embedded applications or devices",
        "Data engineer",
        "Engineering manager",
        "DevOps specialist",
        "Data scientist or machine learning specialist",
        "Research & Development role",
        "Academic researcher",
        "Senior Executive (C-Suite, VP, etc.)",
        "Cloud infrastructure engineer",
        "Developer, QA or test",
        "Developer, game or graphics",
        "Data or business analyst",
        "Developer, AI",
        "System administrator",
        "Student",
        "Engineer, site reliability",
        "Project manager",
        "Scientist",
        "Security professional",
        "Educator",
        "Blockchain",
        "Developer Experience",
        "Product manager",
        "Hardware Engineer",
        "Database administrator",
        "Developer Advocate",
        "Designer",
        "Marketing or sales professional",
        "Other (please specify):",
    ].sort();

    const OrgSize = [
        "Just me - I am a freelancer, sole proprietor, etc.",
        "2 to 9 employees",
        "10 to 19 employees",
        "20 to 99 employees",
        "100 to 499 employees",
        "500 to 999 employees",
        "1,000 to 4,999 employees",
        "5,000 to 9,999 employees",
        "10,000 or more employees"
    ];

    const ICorPM = [
        "Individual contributor",
        "People manager"
    ];

    const Industry = [
        "Banking/Financial Services",
        "Computer Systems Design and Services",
        "Energy",
        "Fintech",
        "Government",
        "Healthcare",
        "Higher Education",
        "Insurance",
        "Internet, Telecomm or Information Services",
        "Manufacturing",
        "Media & Advertising Services",
        "Retail and Consumer Services",
        "Software Development",
        "Transportation, or Supply Chain",
        "Other:"
    ].sort();

    const ages = [
        '18-24 years old', '25-34 years old', '35-44 years old', '45-54 years old',
        '55-64 years old', '65 years or older', 'Prefer not to say', 'Under 18 years old'
    ];

    const countries = [
        "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda",
        "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahrain", "Bangladesh",
        "Barbados", "Belarus", "Belgium", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina",
        "Botswana", "Brazil", "Brunei Darussalam", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia",
        "Cameroon", "Canada", "Cape Verde", "Central African Republic", "Chile", "China", "Colombia",
        "Congo, Republic of the...", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic",
        "Côte d'Ivoire", "Democratic People's Republic of Korea", "Democratic Republic of the Congo",
        "Denmark", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Estonia", "Ethiopia",
        "Fiji", "Finland", "France", "Georgia", "Germany", "Ghana", "Greece", "Guatemala", "Guyana",
        "Haiti", "Honduras", "Hong Kong (S.A.R.)", "Hungary", "Iceland", "India", "Indonesia",
        "Iran, Islamic Republic of...", "Iraq", "Ireland", "Isle of Man", "Israel", "Italy",
        "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kosovo", "Kuwait", "Kyrgyzstan",
        "Lao People's Democratic Republic", "Latvia", "Lebanon", "Lesotho",
        "Libyan Arab Jamahiriya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar",
        "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Mauritania", "Mauritius", "Mexico",
        "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nepal",
        "Netherlands", "New Zealand", "Nicaragua", "Nigeria", "Nomadic", "Norway", "Oman",
        "Pakistan", "Palestine", "Panama", "Paraguay", "Peru", "Philippines", "Poland",
        "Portugal", "Qatar", "Republic of Korea", "Republic of Moldova",
        "Republic of North Macedonia", "Romania", "Russian Federation",
        "Rwanda", "Samoa", "Saudi Arabia", "Senegal", "Serbia", "Sierra Leone",
        "Singapore", "Slovakia", "Slovenia", "Somalia", "South Africa", "South Korea",
        "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syrian Arab Republic",
        "Taiwan", "Tajikistan", "Thailand", "Togo", "Trinidad and Tobago", "Tunisia", "Turkey",
        "Turkmenistan", "Uganda", "Ukraine", "United Arab Emirates",
        "United Kingdom of Great Britain and Northern Ireland", "United Republic of Tanzania",
        "United States of America", "Uruguay", "Uzbekistan", "Venezuela, Bolivarian Republic of...",
        "Viet Nam", "Yemen", "Zambia", "Zimbabwe"
    ];

    const countryCrMap = {
        "Afghanistan": "countryAF", "Albania": "countryAL", "Algeria": "countryDZ", "Andorra": "countryAD", 
        "Angola": "countryAO", "Antigua and Barbuda": "countryAG", "Argentina": "countryAR", "Armenia": "countryAM", 
        "Australia": "countryAU", "Austria": "countryAT", "Azerbaijan": "countryAZ", "Bahrain": "countryBH", 
        "Bangladesh": "countryBD", "Barbados": "countryBB", "Belarus": "countryBY", "Belgium": "countryBE", 
        "Benin": "countryBJ", "Bhutan": "countryBT", "Bolivia": "countryBO", "Bosnia and Herzegovina": "countryBA", 
        "Botswana": "countryBW", "Brazil": "countryBR", "Brunei Darussalam": "countryBN", "Bulgaria": "countryBG", 
        "Burkina Faso": "countryBF", "Burundi": "countryBI", "Cambodia": "countryKH", "Cameroon": "countryCM", 
        "Canada": "countryCA", "Cape Verde": "countryCV", "Central African Republic": "countryCF", "Chile": "countryCL", 
        "China": "countryCN", "Colombia": "countryCO", "Congo, Republic of the...": "countryCG", "Costa Rica": "countryCR", 
        "Croatia": "countryHR", "Cuba": "countryCU", "Cyprus": "countryCY", "Czech Republic": "countryCZ", 
        "Côte d'Ivoire": "countryCI", "Democratic People's Republic of Korea": "countryKP", 
        "Democratic Republic of the Congo": "countryCD", "Denmark": "countryDK", "Dominican Republic": "countryDO", 
        "Ecuador": "countryEC", "Egypt": "countryEG", "El Salvador": "countrySV", "Estonia": "countryEE", 
        "Ethiopia": "countryET", "Fiji": "countryFJ", "Finland": "countryFI", "France": "countryFR", 
        "Georgia": "countryGE", "Germany": "countryDE", "Ghana": "countryGH", "Greece": "countryGR", 
        "Guatemala": "countryGT", "Guyana": "countryGY", "Haiti": "countryHT", "Honduras": "countryHN", 
        "Hong Kong (S.A.R.)": "countryHK", "Hungary": "countryHU", "Iceland": "countryIS", "India": "countryIN", 
        "Indonesia": "countryID", "Iran, Islamic Republic of...": "countryIR", "Iraq": "countryIQ", 
        "Ireland": "countryIE", "Isle of Man": "countryIM", "Israel": "countryIL", "Italy": "countryIT", 
        "Jamaica": "countryJM", "Japan": "countryJP", "Jordan": "countryJO", "Kazakhstan": "countryKZ", 
        "Kenya": "countryKE", "Kosovo": "countryXK", "Kuwait": "countryKW", "Kyrgyzstan": "countryKG", 
        "Lao People's Democratic Republic": "countryLA", "Latvia": "countryLV", "Lebanon": "countryLB", 
        "Lesotho": "countryLS", "Libyan Arab Jamahiriya": "countryLY", "Liechtenstein": "countryLI", 
        "Lithuania": "countryLT", "Luxembourg": "countryLU", "Madagascar": "countryMG", "Malawi": "countryMW", 
        "Malaysia": "countryMY", "Maldives": "countryMV", "Mali": "countryML", "Malta": "countryMT", 
        "Mauritania": "countryMR", "Mauritius": "countryMU", "Mexico": "countryMX", "Mongolia": "countryMN", 
        "Montenegro": "countryME", "Morocco": "countryMA", "Mozambique": "countryMZ", "Myanmar": "countryMM", 
        "Namibia": "countryNA", "Nepal": "countryNP", "Netherlands": "countryNL", "New Zealand": "countryNZ", 
        "Nicaragua": "countryNI", "Nigeria": "countryNG", "Norway": "countryNO", "Oman": "countryOM", 
        "Pakistan": "countryPK", "Palestine": "countryPS", "Panama": "countryPA", "Paraguay": "countryPY", 
        "Peru": "countryPE", "Philippines": "countryPH", "Poland": "countryPL", "Portugal": "countryPT", 
        "Qatar": "countryQA", "Republic of Korea": "countryKR", "Republic of Moldova": "countryMD", 
        "Republic of North Macedonia": "countryMK", "Romania": "countryRO", "Russian Federation": "countryRU", 
        "Rwanda": "countryRW", "Samoa": "countryWS", "Saudi Arabia": "countrySA", "Senegal": "countrySN", 
        "Serbia": "countryRS", "Sierra Leone": "countrySL", "Singapore": "countrySG", "Slovakia": "countrySK", 
        "Slovenia": "countrySI", "Somalia": "countrySO", "South Africa": "countryZA", "South Korea": "countryKR", 
        "Spain": "countryES", "Sri Lanka": "countryLK", "Sudan": "countrySD", "Suriname": "countrySR", 
        "Sweden": "countrySE", "Switzerland": "countryCH", "Syrian Arab Republic": "countrySY", 
        "Taiwan": "countryTW", "Tajikistan": "countryTJ", "Thailand": "countryTH", "Togo": "countryTG", 
        "Trinidad and Tobago": "countryTT", "Tunisia": "countryTN", "Turkey": "countryTR", "Turkmenistan": "countryTM", 
        "Uganda": "countryUG", "Ukraine": "countryUA", "United Arab Emirates": "countryAE", 
        "United Kingdom of Great Britain and Northern Ireland": "countryGB", "United Republic of Tanzania": "countryTZ", 
        "United States of America": "countryUS", "Uruguay": "countryUY", "Uzbekistan": "countryUZ", 
        "Venezuela, Bolivarian Republic of...": "countryVE", "Viet Nam": "countryVN", "Yemen": "countryYE", 
        "Zambia": "countryZM", "Zimbabwe": "countryZW"
    };
    

    const educations = [
        "Associate degree (A.A., A.S., etc.)", "Bachelor's degree (B.A., B.S., B.Eng., etc.)",
        "Master's degree (M.A., M.S., M.Eng., MBA, etc.)", "Primary/elementary school",
        "Professional degree (JD, MD, Ph.D, Ed.D, etc.)",
        "Secondary school (e.g. American high school, German Realschule or Gymnasium, etc.)",
        "Some college/university study without earning a degree", "Something else"
    ];

    const languages = [
        "Assembly", "Bash/Shell (all shells)", "C", "C++", "HTML/CSS", "Java", "JavaScript",
        "Python", "R", "SQL", "TypeScript", "Fortran", "MATLAB", "Julia", "C#", "MicroPython",
        "Go", "Kotlin", "Ruby", "PowerShell", "Groovy", "Elixir", "Rust", "Dart", "Delphi",
        "Apex", "PHP", "F#", "GDScript", "Perl", "Lua", "Objective-C", "VBA", "Ada", "Swift",
        "Scala", "Visual Basic (.Net)", "Lisp", "Clojure", "Erlang", "Haskell", "OCaml", "Prolog",
        "Nim", "Cobol", "Solidity", "Zig", "Zephyr", "Crystal"
    ].sort();

    const employments = [
        "Employed, full-time",
        "Employed, part-time",
        "Independent contractor, freelancer, or self-employed",
        "Not employed, and not looking for work",
        "Not employed, but looking for work",
        "Retired",
        "Student, full-time",
        "Student, part-time"
    ];

    const databases = [
        'BigQuery', 'Cassandra', 'Clickhouse', 'Cloud Firestore', 'Cockroachdb', 'Cosmos DB', 'Couch DB', 'Couchbase', 'Databricks SQL', 'Datomic', 'DuckDB', 'Dynamodb', 'Elasticsearch', 'EventStoreDB', 'Firebase Realtime Database', 'Firebird', 'H2', 'IBM DB2', 'InfluxDB', 'MariaDB', 'Microsoft Access', 'Microsoft SQL Server', 'MongoDB', 'MySQL', 'Neo4J', 'Oracle', 'PostgreSQL', 'Presto', 'RavenDB', 'Redis', 'SQLite', 'Snowflake', 'Solr', 'Supabase', 'TiDB'
    ];

    const platforms = [
        'Alibaba Cloud', 'Amazon Web Services (AWS)', 'Cloudflare', 'Colocation', 'Databricks', 'Digital Ocean', 'Firebase', 'Fly.io', 'Google Cloud', 'Heroku', 'Hetzner', 'IBM Cloud Or Watson', 'Linode, now Akamai', 'Managed Hosting', 'Microsoft Azure', 'Netlify', 'OVH', 'OpenShift', 'OpenStack', 'Oracle Cloud Infrastructure (OCI)', 'PythonAnywhere', 'Render', 'Scaleway', 'Supabase', 'VMware', 'Vercel', 'Vultr'
    ];

    const webframesworks = [
        'ASP.NET', 'ASP.NET CORE', 'Angular', 'AngularJS', 'Astro', 'Blazor', 'CodeIgniter', 'Deno', 'Django', 'Drupal', 'Elm', 'Express', 'FastAPI', 'Fastify', 'Flask', 'Gatsby', 'Htmx', 'Laravel', 'NestJS', 'Next.js', 'Node.js', 'Nuxt.js', 'Phoenix', 'Play Framework', 'React', 'Remix', 'Ruby on Rails', 'Solid.js', 'Spring Boot', 'Strapi', 'Svelte', 'Symfony', 'Vue.js', 'WordPress', 'Yii 2', 'jQuery'
    ];

    const tools = [
        'APT', 'Ansible', 'Ant', 'Bun', 'Chef', 'Chocolatey', 'Composer', 'Dagger', 'Docker', 'Godot', 'Google Test', 'Gradle', 'Homebrew', 'Kubernetes', 'MSBuild', 'Make', 'Maven (build tool)', 'Ninja', 'Nix', 'NuGet', 'Pacman', 'Pip', 'Podman', 'Pulumi', 'Puppet', 'Terraform', 'Unity 3D', 'Unreal Engine', 'Visual Studio Solution', 'Vite', 'Webpack', 'Yarn', 'npm', 'pnpm'
    ];

    const OpSys = [
        'AIX', 'Android', 'Arch', 'BSD', 'ChromeOS', 'Cygwin', 'Debian', 'Fedora', 'Haiku', 'MacOS', 'Other (please specify):', 'Other Linux-based', 'Red Hat', 'Solaris', 'Ubuntu', 'Windows', 'Windows Subsystem for Linux (WSL)', 'iOS', 'iPadOS'
    ];

    const [exchangeRates, setExchangeRates] = useState({});
    const [selectedCurrency, setSelectedCurrency] = useState(() => {
        return localStorage.getItem("selectedCurrency") || "USD"; // Default to USD
    });
    const [exchangeRate, setExchangeRate] = useState(1);
    const [currencyFlags, setCurrencyFlags] = useState({});

    useEffect(() => {
        localStorage.setItem("selectedCurrency", selectedCurrency);
    }, [selectedCurrency]);

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
                <NavbarComponent
                    exchangeRates={exchangeRates}
                    selectedCurrency={selectedCurrency}
                    exchangeRate={exchangeRate}
                    currencyFlags={currencyFlags}

                    setSelectedCurrency={setSelectedCurrency}
                    setExchangeRates={setExchangeRates}
                    setExchangeRate={setExchangeRate}
                    setCurrencyFlags={setCurrencyFlags}

                />

                <Routes>
                    <Route path="/" element={ <>
                    <Home
                    toggleScreen={toggleScreen}
                    isSignedIn={isSignedIn}
                    toggleSignendIn={toggleSignendIn}
                     />
                      <Features />
                     </>} />

                    <Route path="/Guide" element={<Guide
                        toggleScreen={toggleScreen}
                        isSignedIn={isSignedIn}
                        toggleSignendIn={toggleSignendIn} />} />
                    <Route path="/aboutus" element={<AboutUs />} />
                    <Route path="/contactus" element={<Contact />} />
                    <Route path="/createaccount" element={<CreateAccount
                        toggleSignendIn={toggleSignendIn}
                        toggleScreen={toggleScreen}
                        isSignedIn={isSignedIn}
                        countries={countries}
                        ages={ages}
                        educations={educations}
                    />} />

                    <Route path="/signin" element={<SignIn
                        toggleSignendIn={toggleSignendIn}
                        toggleScreen={toggleScreen}
                        isSignedIn={isSignedIn} />} />
                    <Route path="/profile" element={<Profile
                        toggleSignendIn={toggleSignendIn}
                        toggleScreen={toggleScreen}
                        isSignedIn={isSignedIn}
                        countries={countries}
                        educations={educations}
                        ages={ages} />} />
                    <Route path="/ModifyAdvanced" element={<ModifyAdvanced
                        toggleSignendIn={toggleSignendIn}
                        toggleScreen={toggleScreen}
                        isSignedIn={isSignedIn}
                        languages={languages}
                        employments={employments}
                        MainBranchs={MainBranchs}
                        RemoteWork={RemoteWork}
                        DevType={DevType}
                        OrgSize={OrgSize}
                        ICorPM={ICorPM}
                        Industry={Industry}
                        countries={countries}
                        educations={educations}
                        ages={ages}
                        databases={databases}
                        platforms={platforms}
                        webframesworks={webframesworks}
                        tools={tools}
                        OpSys={OpSys}
                    />} />
                    <Route path="/Recommendations" element={<Recommendations
                        toggleSignendIn={toggleSignendIn}
                        toggleScreen={toggleScreen}
                        isSignedIn={isSignedIn}
                        selectedCurrency={selectedCurrency}
                        exchangeRate={exchangeRate}

                    />} />

                    <Route path="/AdvancedRecommendations" element={<AdvancedRecommendations
                        toggleSignendIn={toggleSignendIn}
                        toggleScreen={toggleScreen}
                        isSignedIn={isSignedIn}
                        languages={languages}
                        databases={databases}
                        platforms={platforms}
                        webframesworks={webframesworks}
                        tools={tools}
                        OpSys={OpSys}
                        employments={employments}
                        selectedCurrency={selectedCurrency}
                        exchangeRate={exchangeRate}
                    />} />

                    <Route path="/SavedRecommendations" element={<SavedRecommendations
                        toggleSignendIn={toggleSignendIn}
                        toggleScreen={toggleScreen}
                        isSignedIn={isSignedIn}
                        selectedCurrency={selectedCurrency}
                        exchangeRate={exchangeRate}
                    />} />
                    <Route path="/Experiment" element={<Experiment
                        toggleSignendIn={toggleSignendIn}
                        toggleScreen={toggleScreen}
                        isSignedIn={isSignedIn}
                        languages={languages}
                        employments={employments}
                        MainBranchs={MainBranchs}
                        RemoteWork={RemoteWork}
                        DevType={DevType}
                        OrgSize={OrgSize}
                        ICorPM={ICorPM}
                        Industry={Industry}
                        countries={countries}
                        educations={educations}
                        ages={ages}
                        databases={databases}
                        platforms={platforms}
                        webframesworks={webframesworks}
                        tools={tools}
                        OpSys={OpSys}
                        selectedCurrency={selectedCurrency}
                        exchangeRate={exchangeRate}
                    />} />
                    <Route path="/Prediction" element={<Prediction
                        toggleSignendIn={toggleSignendIn}
                        toggleScreen={toggleScreen}
                        isSignedIn={isSignedIn}
                        selectedCurrency={selectedCurrency}
                        exchangeRate={exchangeRate}

                    />} />
                    <Route path="/JobSearch" element={<JobSearch
                        toggleScreen={toggleScreen}
                        toggleSignendIn={toggleSignendIn}
                        isSignedIn={isSignedIn} 
                        countryCrMap={countryCrMap}
                    />} />

                    <Route path="/FeaturedJobs" element={<FeaturedJobs
                        toggleScreen={toggleScreen}
                        isSignedIn={isSignedIn} 
                        toggleSignendIn={toggleSignendIn}
                        countryCrMap= {countryCrMap}
                    />} />

                    <Route path="/SavedJobs" element={<SavedJobs
                        toggleScreen={toggleScreen}
                        isSignedIn={isSignedIn} 
                        toggleSignendIn={toggleSignendIn}
                    />} />
                </Routes>
            <FooterComponent/>
            </div>
        </Router>

    );
}

export default App;