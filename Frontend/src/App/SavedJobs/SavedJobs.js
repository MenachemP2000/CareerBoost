import React from "react";
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Sankey, Tooltip, Layer, Text } from "recharts";

import config from '../config';

const AppliedButton = ({ job, isSignedIn, toggleSignendIn }) => {
    const [checked, setChecked] = useState(false);
    const [error, setError] = useState('');


    useEffect(() => {
        const isApplied = job.applied;
        if (isApplied) {
            setChecked(true);
        }
    }, [isSignedIn, job.link]);



    const handleApplied = async () => {
        setChecked(!checked);
        const savedJobs = isSignedIn.savedJobs.map((savedJob) =>
            savedJob.link === job.link ? { ...savedJob, applied: !checked } : savedJob
        );
        const payload = { _id: isSignedIn._id, savedJobs: savedJobs };

        try {
            // Send the registration data to the server
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
            else {
                toggleSignendIn(isSignedIn.username);
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
            console.error('Error:', error);
        }

    };

    return (
        <Button
            onClick={handleApplied}
            style={{ width: "10rem", margin: "10px", display: "flex", justifyContent: "center" }}
            variant="secondary"
            disabled={job.interview || job.offer || job.rejected}
        >
            Applied
            <Form.Check
                type="checkbox"
                checked={checked}
                onChange={handleApplied}
                className="ms-2"
            />
        </Button>
    );
};

const InterviewButton = ({ job, isSignedIn, toggleSignendIn }) => {
    const [checked, setChecked] = useState(false);
    const [error, setError] = useState('');


    useEffect(() => {
        const isInterview = job.interview;
        if (isInterview) {
            setChecked(true);
        }
    }, [isSignedIn, job.link]);



    const handleInterview = async () => {
        setChecked(!checked);
        const savedJobs = isSignedIn.savedJobs.map((savedJob) =>
            savedJob.link === job.link ? { ...savedJob, interview: !checked } : savedJob
        );
        const payload = { _id: isSignedIn._id, savedJobs: savedJobs };

        try {
            // Send the registration data to the server
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
            else {
                toggleSignendIn(isSignedIn.username);
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
            console.error('Error:', error);
        }

    };

    return (
        <Button
            onClick={handleInterview}
            style={{
                width: "10rem",
                margin: "10px",
                display: "flex",
                justifyContent: "center",
            }}
            variant="secondary"
            disabled={!job.applied || job.offer || job.rejected}
        >
            Interview
            <Form.Check
                type="checkbox"
                checked={checked}
                onChange={handleInterview}
                className="ms-2"
            />
        </Button>

    );
};
const OfferButton = ({ job, isSignedIn, toggleSignendIn }) => {
    const [checked, setChecked] = useState(false);
    const [error, setError] = useState('');


    useEffect(() => {
        const isOffer = job.offer;
        if (isOffer) {
            setChecked(true);
        }
    }, [isSignedIn, job.link]);



    const handleOffer = async () => {
        setChecked(!checked);
        const savedJobs = isSignedIn.savedJobs.map((savedJob) =>
            savedJob.link === job.link ? { ...savedJob, offer: !checked } : savedJob
        );
        const payload = { _id: isSignedIn._id, savedJobs: savedJobs };

        try {
            // Send the registration data to the server
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
            else {
                toggleSignendIn(isSignedIn.username);
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
            console.error('Error:', error);
        }

    };

    return (
        <Button
            onClick={handleOffer}
            style={{ width: "10rem", margin: "10px", display: "flex", justifyContent: "center" }}
            variant="secondary"
            disabled={!job.interview || !job.applied || job.accepted || job.rejected}
        >
            Offer
            <Form.Check
                type="checkbox"
                checked={checked}
                onChange={handleOffer}
                className="ms-2"
            />
        </Button>
    );
};

const RejectedButton = ({ job, isSignedIn, toggleSignendIn }) => {
    const [checked, setChecked] = useState(false);
    const [error, setError] = useState('');


    useEffect(() => {
        const isRejected = job.rejected;
        if (isRejected) {
            setChecked(true);
        }
    }, [isSignedIn, job.link]);



    const handleRejected = async () => {
        setChecked(!checked);
        const savedJobs = isSignedIn.savedJobs.map((savedJob) =>
            savedJob.link === job.link ? { ...savedJob, rejected: !checked } : savedJob
        );
        const payload = { _id: isSignedIn._id, savedJobs: savedJobs };

        try {
            // Send the registration data to the server
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
            else {
                toggleSignendIn(isSignedIn.username);
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
            console.error('Error:', error);
        }

    };

    return (
        <Button
            onClick={handleRejected}
            style={{ width: "10rem", margin: "10px", display: "flex", justifyContent: "center" }}
            variant="secondary"
            disabled={(!job.applied && !job.interview && !job.offer) || job.accepted}
        >
            Rejected
            <Form.Check
                type="checkbox"
                checked={checked}
                onChange={handleRejected}
                className="ms-2"
            />
        </Button>
    );
};

const AcceptedButton = ({ job, isSignedIn, toggleSignendIn }) => {
    const [checked, setChecked] = useState(false);
    const [error, setError] = useState('');


    useEffect(() => {
        const isAccepted = job.accepted;
        if (isAccepted) {
            setChecked(true);
        }
    }, [isSignedIn, job.link]);



    const handleAccepted = async () => {
        setChecked(!checked);
        const savedJobs = isSignedIn.savedJobs.map((savedJob) =>
            savedJob.link === job.link ? { ...savedJob, accepted: !checked } : savedJob
        );
        const payload = { _id: isSignedIn._id, savedJobs: savedJobs };

        try {
            // Send the registration data to the server
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
            else {
                toggleSignendIn(isSignedIn.username);
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
            console.error('Error:', error);
        }

    };

    return (
        <Button
            onClick={handleAccepted}
            style={{ width: "10rem", margin: "10px", display: "flex", justifyContent: "center" }}
            variant="secondary"
            disabled={!job.offer || job.rejected}
        >
            Accepted
            <Form.Check
                type="checkbox"
                checked={checked}
                onChange={handleAccepted}
                className="ms-2"
            />
        </Button>
    );
};

const SavedJobs = ({ toggleScreen, isSignedIn, toggleSignendIn }) => {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [filters, setFilters] = useState({
        appliedEnabled: true,
        interviewEnabled: true,
        offerEnabled: true,
        rejectedEnabled: true
    });
    const [addIsOpen, setAddIsOpen] = useState(false);
    const [sankeyIsOpen, setSankeyIsOpen] = useState(false);

    const [newJob, setNewJob] = useState({});
    const [data, setData] = useState({});
    const colors = ["blue", "blue", "green", "#FFD700", "#FF33A8", "#33FFF6"];
    const getColor = (index) => colors[index % colors.length];

    const handleToggleChange = (e) => {
        const { name, checked } = e.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: checked
        }));

    };
    useEffect(() => {
        console.log("Filters updated:", filters);
    }, [filters]);

    useEffect(() => {
        toggleScreen("SavedJobs");
        if (!isSignedIn) {
            navigate("/");
        }
    });

    useEffect(() => {

        if (!isSignedIn.savedJobs) {
            return;
        }
        const applied = isSignedIn.savedJobs.filter(job => job.applied);
        const appliedCount = applied.length;
        const appliedNoResponse = applied.filter(job => !job.interview && !job.rejected);
        const appliedNoResponseCount = appliedNoResponse.length;
        const appliedRejected = applied.filter(job => !job.interview && job.rejected);
        const appliedRejectedCount = appliedRejected.length;
        const appliedInterview = applied.filter(job => job.interview);
        const appliedInterviewCount = appliedInterview.length;
        const interviewNoResponse = appliedInterview.filter(job => !job.offer && !job.rejected);
        const interviewNoResponseCount = interviewNoResponse.length;
        const interviewRejected = appliedInterview.filter(job => !job.offer && job.rejected);
        const interviewRejectedCount = interviewRejected.length;
        const offer = applied.filter(job => job.offer);
        const offerCount = offer.length;
        const offerNoResponse = offer.filter(job => !job.accepted && !job.rejected);
        const offerNoResponseCount = offerNoResponse.length;
        const offerRejected = offer.filter(job => !job.accepted && job.rejected);
        const offerRejectedCount = offerRejected.length;
        const accepted = offer.filter(job => job.accepted);
        const acceptedCount = accepted.length;

        let filteredLinks = [
            { source: 0, target: 1, value: appliedNoResponseCount },
            { source: 0, target: 2, value: appliedRejectedCount },
            { source: 0, target: 3, value: appliedInterviewCount },
            { source: 1, target: 4, value: appliedNoResponseCount },
            { source: 2, target: 5, value: appliedRejectedCount },
            { source: 3, target: 4, value: interviewNoResponseCount },
            { source: 3, target: 5, value: interviewRejectedCount },
            { source: 3, target: 6, value: offerCount },
            { source: 4, target: 7, value: interviewNoResponseCount + appliedNoResponseCount },
            { source: 5, target: 8, value: interviewRejectedCount + appliedRejectedCount },
            { source: 6, target: 7, value: offerNoResponseCount },
            { source: 6, target: 8, value: offerRejectedCount },
            { source: 6, target: 9, value: acceptedCount },
        ].filter(link => link.value > 0);


        // Step 2: Identify nodes that are used in at least one link
        const usedNodeIndices = new Set();
        filteredLinks.forEach(link => {
            usedNodeIndices.add(link.source);
            usedNodeIndices.add(link.target);
        });

        // Step 3: Filter out unused nodes and re-index remaining ones
        const oldToNewIndex = {};
        let newIndex = 0;

        const filteredNodes = [
            { name: `Applied: ${appliedCount} ` },
            { name: `No Response: ${appliedNoResponseCount} ` },
            { name: `Rejected: ${appliedRejectedCount} ` },
            { name: `Interview: ${appliedInterviewCount} ` },
            { name: `No Response: ${interviewNoResponseCount + appliedNoResponseCount} ` },
            { name: `Rejected: ${interviewRejectedCount + appliedRejectedCount} ` },
            { name: `Offer: ${offerCount} ` },
            { name: `No Response: ${interviewNoResponseCount + appliedNoResponseCount + offerNoResponseCount} ` },
            { name: `Rejected: ${interviewRejectedCount + appliedRejectedCount + offerRejectedCount} ` },
            { name: `Accepted: ${acceptedCount} ` },
        ]
            .map((node, index) => {
                if (usedNodeIndices.has(index)) {
                    oldToNewIndex[index] = newIndex++;
                    return node;
                }
                return null;
            })
            .filter(node => node !== null); // Remove null values

        // Step 4: Update source/target indices in filtered links
        filteredLinks = filteredLinks.map(link => ({
            source: oldToNewIndex[link.source],
            target: oldToNewIndex[link.target],
            value: link.value
        }));

        // Step 5: Construct the final Sankey data object
        const newData = {
            nodes: filteredNodes,
            links: filteredLinks,
        };

        setData(newData);

    }, [isSignedIn]);

    const handleRemove = async (job) => {
        const newSavedJobs = isSignedIn.savedJobs.filter((savedJob) => savedJob.link !== job.link);
        const payload = { _id: isSignedIn._id, savedJobs: newSavedJobs };

        try {
            // Send the registration data to the server
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
            else {
                toggleSignendIn(isSignedIn.username);
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
            console.error('Error:', error);
        }
    };

    const handleAdd = async (job) => {

        const newJob = job;
        if (newJob.location === undefined || newJob.location === "") {
            newJob.location = "not available";
        }
        if (newJob.company === undefined || newJob.company === "") {
            newJob.company = "not available";
        }
        if (newJob.job === undefined || newJob.job === "") {
            newJob.job = "not available";
        }
        const newSavedJobs = [...isSignedIn.savedJobs, newJob];
        const payload = { _id: isSignedIn._id, savedJobs: newSavedJobs };

        try {
            // Send the registration data to the server
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
            else {
                setNewJob({});
                setAddIsOpen(false);
                toggleSignendIn(isSignedIn.username);
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
            console.error('Error:', error);
        }
    }



    return (

        <div >
            <div className="position-relative text-white text-center d-flex justify-content-center" >
            </div>
            <div className="position-relative text-white text-center" >
                <div style={{ minHeight: "100vh" }} className=" top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex flex-column align-items-center justify-content-center">
                    <h3 className="display-4 fw-bold">Saved Jobs</h3>
                    <div className="underline mx-auto mb-3"></div>

                    <p className="lead">
                        Here's your saved Jobs:
                    </p>
                    <Card style={{ maxWidth: '95vw', margin: "10px", width: '90vw' }}>
                        <Card.Header>Saved Jobs</Card.Header>


                        <div >
                            {/* Button to toggle dropdown */}
                            <button
                                className="px-4 py-2 border rounded bg-blue-500 text-white"
                                onClick={() => setAddIsOpen(!addIsOpen)}
                            >
                                add a job
                            </button>

                            {/* Floating dropdown menu */}
                            {addIsOpen && (
                                <Form onSubmit={(e) => {
                                    e.preventDefault();
                                    handleAdd(newJob);
                                }}>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Label>Job Title</Form.Label>
                                        <Form.Control type="text" placeholder="Enter job title" onChange={(e) => setNewJob({ ...newJob, parsedTitle: e.target.value })} required />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Label>Link</Form.Label>
                                        <Form.Control type="url" placeholder="Enter Link" onChange={(e) => setNewJob({ ...newJob, link: e.target.value })} required />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Label>Company</Form.Label>
                                        <Form.Control type="text" placeholder="Enter company" onChange={(e) => setNewJob({ ...newJob, company: e.target.value })} />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Label>Job</Form.Label>
                                        <Form.Control type="text" placeholder="Enter job" onChange={(e) => setNewJob({ ...newJob, job: e.target.value })} />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Label>Location</Form.Label>
                                        <Form.Control type="text" placeholder="Enter location" onChange={(e) => setNewJob({ ...newJob, location: e.target.value })} />
                                    </Form.Group>
                                    <Button type="submit" style={{ width: '10rem', margin: "10px" }} variant="secondary">Add</Button>
                                </Form>
                            )}
                        </div>

                        <div >
                            {/* Button to toggle dropdown */}
                            <button
                                className="px-4 py-2 border rounded bg-blue-500 text-white"
                                onClick={() => setIsOpen(!isOpen)}
                            >
                                Filters
                            </button>

                            {/* Floating dropdown menu */}
                            {isOpen && (
                                <div className="absolute z-10 mt-2 w-80 bg-white shadow-lg rounded border p-4">
                                    {/* Filter Toggles */}
                                    <h3 className="text-lg font-bold mb-4">Filters</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    name="appliedEnabled"
                                                    checked={filters.appliedEnabled}
                                                    onChange={handleToggleChange}
                                                />
                                                Show Applied
                                            </label>
                                        </div>
                                        <div>
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    name="interviewEnabled"
                                                    checked={filters.interviewEnabled}
                                                    onChange={handleToggleChange}
                                                />
                                                Show Interview
                                            </label>
                                        </div>
                                        <div>
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    name="offerEnabled"
                                                    checked={filters.offerEnabled}
                                                    onChange={handleToggleChange}
                                                />
                                                Show Offer
                                            </label>
                                        </div>
                                        <div>
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    name="rejectedEnabled"
                                                    checked={filters.rejectedEnabled}
                                                    onChange={handleToggleChange}
                                                />
                                                Show Rejected
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>


                        <div >
                            {(isSignedIn.savedJobs && isSignedIn.savedJobs.filter(job => job.applied).length > 0 && data?.nodes?.length && data?.links?.length  ) && (
                                <div className="d-flex justify-content-center">
                                    <Sankey
                                        width={800}
                                        height={400}
                                        data={data}
                                        nodePadding={30}
                                        margin={{
                                            left: 60,
                                            right: 60,
                                            top: 50,
                                            bottom: 50,
                                        }}
                                        node={(nodeProps) => (
                                            <Layer key={nodeProps.index}>
                                                <rect
                                                    x={nodeProps.x}
                                                    y={nodeProps.y}
                                                    width={nodeProps.width}
                                                    height={nodeProps.height}
                                                    fill="#8884d8"
                                                />
                                                {/* Background rectangle */}
                                                <rect
                                                    x={nodeProps.x + nodeProps.width / 2 - nodeProps.payload.name.length * 4} // Adjust based on text position
                                                    y={nodeProps.y + nodeProps.height + 5} // Adjust based on text position
                                                    width={nodeProps.payload.name.length * 8} // Adjust width based on text length
                                                    height={20} // Adjust height for background size
                                                    fill="aqua" // Background color
                                                    rx={5} // Optional: round the corners
                                                />
                                                <Text
                                                    x={nodeProps.x} // Move text to the right for the first node
                                                    y={nodeProps.y + nodeProps.height + 20} // Center the label vertically
                                                    textAnchor="middle" // Align text to the center
                                                    fontSize={14}
                                                    fill="blue"
                                                    dx={5}
                                                >
                                                    {nodeProps.payload.name}
                                                </Text>
                                            </Layer>
                                        )}
                                        link={
                                            {
                                                stroke: "#8884d8"
                                            }}
                                        animationDuration={1000} // Duration of the animation (in ms)
                                        animationEasing="linear"
                                    >
                                        <Tooltip />
                                    </Sankey>
                                </div>
                            )}
                        </div>

                        <Row className="d-flex justify-content-center " >
                            <Card.Body >
                                {!isSignedIn.savedJobs || (isSignedIn.savedJobs && isSignedIn.savedJobs.length == 0) &&
                                    <Card.Text >
                                        No saved jobs yet, add some!
                                    </Card.Text>
                                }

                                {isSignedIn.savedJobs && isSignedIn.savedJobs.length > 0 &&
                                    <Card.Text >
                                        <ul style={{ paddingLeft: "20px" }}>
                                            {isSignedIn.savedJobs.map((job, index) => (
                                                (filters.appliedEnabled || !job.applied) &&
                                                (filters.interviewEnabled || !job.interview) &&
                                                (filters.offerEnabled || !job.offer) &&
                                                (filters.rejectedEnabled || !job.rejected) &&
                                                <li key={index} className=" p-4" style={{ listStyleType: "none" }}>
                                                    <Card>
                                                        <Card.Link href={job.link} target="_blank" rel="noopener noreferrer" >
                                                            {job.parsedTitle}
                                                        </Card.Link>
                                                        <Card.Body>
                                                            <Col>
                                                                <div> Company: {job.company}
                                                                </div>
                                                                <div> Job: {job.job}
                                                                </div>
                                                                <div> Location: {job.location}
                                                                </div>
                                                            </Col>
                                                        </Card.Body>
                                                        <Container>

                                                            <Container className="d-flex justify-content-center">

                                                                <Button as={Button} onClick={() => handleRemove(job)} style={{ width: '10rem', margin: "10px" }} variant="secondary">Remove</Button>
                                                                <AppliedButton key={job._id} job={job} isSignedIn={isSignedIn} toggleSignendIn={toggleSignendIn} />
                                                                <InterviewButton key={job._id} job={job} isSignedIn={isSignedIn} toggleSignendIn={toggleSignendIn} />
                                                                <OfferButton key={job._id} job={job} isSignedIn={isSignedIn} toggleSignendIn={toggleSignendIn} />
                                                                <AcceptedButton key={job._id} job={job} isSignedIn={isSignedIn} toggleSignendIn={toggleSignendIn} />
                                                                <RejectedButton key={job._id} job={job} isSignedIn={isSignedIn} toggleSignendIn={toggleSignendIn} />

                                                            </Container>
                                                        </Container>

                                                    </Card>
                                                </li>
                                            ))}
                                        </ul>
                                    </Card.Text>
                                }
                            </Card.Body>

                        </Row>
                    </Card>


                    <Row className="d-flex justify-content-center">
                        <Container className=" justify-content-center" >
                            <Button as={Link} to="/FeaturedJobs" style={{ width: '10rem', margin: "10px" }} variant="primary" className="px-5 py-3">Featured</Button>
                            <Button as={Link} to="/JobSearch" style={{ width: '10rem', margin: "10px" }} variant="primary" className="px-5 py-3">Search</Button>
                        </Container>
                    </Row>


                </div>
            </div >
        </div >
    );
}

export default SavedJobs;