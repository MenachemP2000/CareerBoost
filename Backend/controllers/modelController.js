// Import Node.js module to spawn child processes (used to run Python script) as a separate process
import { spawn } from "child_process";

// Start the Python script `model_server.py` as a background process
// Pipe stdin and stdout to communicate with the Python process, inherit stderr to directly print Python errors to the Node.js console
const pythonProcess = spawn("python", ["./model_server.py"], {
  stdio: ["pipe", "pipe", "inherit"], // stdin, stdout, stderr
});

// Listen for any data output from the Python script and log it (useful for debugging or status info)
pythonProcess.stdout.on("data", (data) => {
  console.log(data.toString());
});

// Handle errors that occur when trying to spawn or communicate with the Python process
pythonProcess.on("error", (err) => {
  console.error("Python process error:", err);
});

// Helper function to send a request to the Python script and wait for its response
const sendRequestToPython = (type, data) => {
    return new Promise((resolve, reject) => {
        // Format request as JSON string
        const request = JSON.stringify({ type, data });

        // Send request to Python process via stdin
        pythonProcess.stdin.write(request + "\n");
        // Listen for one response from stdout
        pythonProcess.stdout.once("data", (data) => {
            try {
                // Parse the response from Python
                const response = JSON.parse(data.toString().trim());
                // Resolve the promise with the parsed response
                resolve(response);
            } catch (error) {
                // Reject if response is not valid JSON
                reject("Failed to parse response");
            }
        });
    });
};

// Express route handler to predict salary using user profile data
export async function predictSalary(req, res) {
    try {
        // Get user profile from request body
        const userProfile = req.body;
        // Ask Python to predict salary
        const result = await sendRequestToPython("predict", userProfile);
        // Return result to the client
        res.json(result);
    } catch (error) {
        console.log(error);
        // Handle errors
        res.status(500).json({ error: error.toString() });
    }
}

// Express route handler to recommend skills based on user profile
export async function recommendSkills(req, res) {
    try {
        // Get user profile from request body
        const userProfile = req.body;
        // Ask Python to recommend skills
        const result = await sendRequestToPython("recommend", userProfile);
        // Return result to the client
        res.json(result);
    } catch (error) {
        // Handle errors
        res.status(500).json({ error: error.toString() });
    }
}