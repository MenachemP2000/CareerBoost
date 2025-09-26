// Import spawn function to run child processes
import { spawn } from "child_process";

// Start a Python process running the model_server.py script
const pythonProcess = spawn("python", ["./model_server.py"], {
    stdio: ["pipe", "pipe", "inherit"], // stdin → write requests, stdout → read responses, stderr → inherit from Node
});

// Listen for output from Python (useful for debugging / logs)
pythonProcess.stdout.on("data", (data) => {
    console.log(data.toString()); // Print Python output to console
});

// Handle errors if the Python process itself fails
pythonProcess.on("error", (err) => {
    console.error("Python process error:", err);
});

/**
 * Helper: sendRequestToPython
 * Sends a request to the Python process and waits for a JSON response.
 * - type: action (e.g., "predict" or "recommend")
 * - data: payload (user profile data)
 */
const sendRequestToPython = (type, data) => {
    return new Promise((resolve, reject) => {
        // Prepare request as JSON string
        const request = JSON.stringify({ type, data });

        // Send request to Python process via stdin
        pythonProcess.stdin.write(request + "\n");

        // Wait for Python to send back a response
        pythonProcess.stdout.once("data", (data) => {
            try {
                // Parse response (must be valid JSON)
                const response = JSON.parse(data.toString().trim());
                resolve(response);
            } catch (error) {
                reject("Failed to parse response");
            }
        });
    });
};

/**
 * Controller: predictSalary
 * API endpoint handler for salary prediction.
 * - Reads user profile from request body
 * - Sends it to Python model with type "predict"
 * - Returns result as JSON
 */
export async function predictSalary(req, res) {
    try {
        const userProfile = req.body;
        const result = await sendRequestToPython("predict", userProfile);
        res.json(result);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.toString() });
    }
}

/**
 * Controller: recommendSkills
 * API endpoint handler for recommending skills.
 * - Reads user profile from request body
 * - Sends it to Python model with type "recommend"
 * - Returns result as JSON
 */
export async function recommendSkills(req, res) {
    try {
        const userProfile = req.body;
        const result = await sendRequestToPython("recommend", userProfile);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
}
