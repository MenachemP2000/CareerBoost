import { spawn } from "child_process";
const pythonProcess = spawn("python", ["./model_server.py"], {
  stdio: ["pipe", "pipe", "inherit"], // stdin, stdout, stderr
});

pythonProcess.stdout.on("data", (data) => {
  console.log(data.toString());
});

pythonProcess.on("error", (err) => {
  console.error("Python process error:", err);
});

const sendRequestToPython = (type, data) => {
    return new Promise((resolve, reject) => {
        const request = JSON.stringify({ type, data });

        pythonProcess.stdin.write(request + "\n");

        pythonProcess.stdout.once("data", (data) => {
            try {
                const response = JSON.parse(data.toString().trim());
                resolve(response);
            } catch (error) {
                reject("Failed to parse response");
            }
        });
    });
};

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

export async function recommendSkills(req, res) {
    try {
        const userProfile = req.body;
        const result = await sendRequestToPython("recommend", userProfile);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
}