// Import necessary modules
import cron from "node-cron" // For scheduling periodic tasks
import nodemailer from "nodemailer" // For sending emails
import User from "./models/User.js" // User model to query alerts from MongoDB
import { decode } from "html-entities"; // To decode HTML entities in job titles

// Configure the email transporter using Gmail SMTP service
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "boostcareer446@gmail.com",
        pass: "lsiv mzbq ufya rovo",  // Not recommended, but works temporarily
    },
});

// Utility function to decode HTML entities in job titles
const decodeHtml = (html) => {
    return decode(html);
};

// Function to send daily job alerts to users
async function sendDailyJobAlerts() {

    // Query users who have at least one alert set to "daily"
    const alerts = await User.find(
        {
            "alerts.frequency": "daily", // Match alerts with frequency "daily"
        },
        {"alerts": 1} // Only return the alerts field
    );

    // Filter each user's alerts to retain only daily ones
    for (const alert of alerts) {
        alert.alerts = alert.alerts.filter((alert) => alert.frequency === "daily");
    }

    // Log fetched alerts for debugging
    console.log("alerts", alerts);

// Loop through each user
    for (const alertObject of alerts) {
        // Loop through each of that user's alerts
        for (const alert of alertObject.alerts) {
            try {
                // Fetch job data from the alert URL
                const response = await fetch(alert.url);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                // Convert response to JSON
                const data = await response.json();
                // Extract jobs array
                const jobs = data.jobs;

                // Construct HTML list of job links
                const jobList = jobs.map((job) =>
                    `<li>
                        <a href="${job.link}" target="_blank">
                            ${decodeHtml(job.pagemap.metatags[0]["og:title"])
                        .replace("| LinkedIn", "")
                        .replace("LinkedIn", "")}
                        </a>
                    </li>`).join("");

                // Define email contents
                const mailOptions = {
                    from: "CareerBoost <boostcareer446@gmail.com>",
                    to: alert.email, // Recipient
                    subject: "Your CareerBoost Job Matches for Today! 🚀",
                    text: `Hi ${alert.email.split('@')[0]},\nHere are your latest job matches:\n\n${jobList}`,
                    html: `
                        <html>
                            <head>
                                <style>
                                    body { font-family: Arial, sans-serif; line-height: 1.6; }
                                    h3 { color: #333; }
                                    ul { margin: 0; padding: 0; }
                                    li { margin-bottom: 10px; }
                                </style>
                            </head>
                            <body>
                                <h3>Hi ${alert.email.split('@')[0]}, here are your latest job matches:</h3>
                                <ul>${jobList}</ul>
                            </body>
                        </html>
                    `,
                    // HTML version of the email
                    replyTo: 'support@careerboost.com',
                };
                // Log email for verification
                console.log("mail", mailOptions);

                // Send the email
                await transporter.sendMail(mailOptions);
            }
            catch (error) {
                // Catch and log errors for each alert
                console.error("Error:", error);
            }
        }
    }
}

// Function to send weekly job alerts to users
async function sendWeeklyJobAlerts() {

    // Query users who have at least one alert set to "weekly"
    const alerts = await User.find(
        {
            "alerts.frequency": "weekly", // Match alerts with frequency "weekly"
        },
        {
            "alerts": 1
        }
    );

    // Filter alerts to include only weekly frequency
    for (const alert of alerts) {
        alert.alerts = alert.alerts.filter((alert) => alert.frequency === "weekly");
    }

    // Log alerts
    console.log("alerts", alerts);

    // Loop through users and their alerts
    for (const alertObject of alerts) {
        for (const alert of alertObject.alerts) {
            try {
                // Fetch job results from the saved search URL
                const response = await fetch(alert.url);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                const jobs = data.jobs;

                // Format job links as HTML
                const jobList = jobs.map((job) =>
                    `<li>
                        <a href="${job.link}" target="_blank">
                            ${decodeHtml(job.pagemap.metatags[0]["og:title"])
                        .replace("| LinkedIn", "")
                        .replace("LinkedIn", "")}
                        </a>
                    </li>`).join("");

                // Weekly email template with styled HTML
                const mailOptions = {
                    from: "CareerBoost <boostcareer446@gmail.com>",
                    to: alert.email,
                    subject: "Your CareerBoost Job Matches for The Week! 🚀",
                    text: `Hi ${alert.email.split('@')[0]},\nHere are your latest job matches:\n\n${jobList}`,
                    html: `
                        <html>
                        <head>
                        <style>
                            body {
                            font-family: Arial, sans-serif;
                            line-height: 1.6;
                            background-color: #f9f9f9;
                            padding: 20px;
                            color: #333;
                            }

                            h3 {
                            color: #2c3e50;
                            margin-bottom: 20px;
                            }

                            ul {
                            list-style-type: none;
                            padding: 0;
                            margin: 0;
                            }

                            li {
                            background: #fff;
                            border: 1px solid #ddd;
                            border-radius: 6px;
                            padding: 15px;
                            margin-bottom: 10px;
                            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
                            }

                            a {
                            color: #007bff;
                            text-decoration: none;
                            }

                            a:hover {
                            text-decoration: underline;
                            }
                        </style>
                        </head>
                        <body>
                        <h3>Hi ${alert.email.split('@')[0]}, here are your latest job matches:</h3>
                        <ul>${jobList}</ul>
                        </body>
                        </html>
                    `,
                    replyTo: 'support@careerboost.com',
                };
                console.log("mail", mailOptions);

                // Send the email using the configured transporter
                await transporter.sendMail(mailOptions);
            }
            catch (error) {
                // Log errors
                console.error("Error:", error);
            }
        }
    }
}

// Schedule the daily job alerts to run every day at 8 AM
cron.schedule("0 8 * * *", sendDailyJobAlerts);

// Schedule the weekly job alerts to run every Sunday at 9 AM
cron.schedule("0 9 * * 0", sendWeeklyJobAlerts);
