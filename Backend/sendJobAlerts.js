import cron from "node-cron"
import nodemailer from "nodemailer"
import User from "./models/User.js"
import { decode } from "html-entities";

// Unsubscribe link for emails
const unsubscribeUrl = `careerboost.menachem.website/JobSearch`;

// ==========================
// Setup mail transporter
// ==========================
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "boostcareer446@gmail.com",         // Gmail address
        pass: "lsiv mzbq ufya rovo",              // App password (⚠️ should move to env var)
    },
});

// Decode HTML entities from job titles
const decodeHtml = (html) => {
    return decode(html);
};

// ==========================
// Send Daily Job Alerts
// ==========================
async function sendDailyJobAlerts() {
    // Find users with daily alerts
    const alerts = await User.find(
        { "alerts.frequency": "daily" },
        { "alerts": 1 }
    );

    // Filter only daily alerts per user
    for (const alert of alerts) {
        alert.alerts = alert.alerts.filter((alert) => alert.frequency === "daily");
    }

    console.log("alerts", alerts);

    // Iterate through each user’s alerts
    for (const alertObject of alerts) {
        for (const alert of alertObject.alerts) {
            try {
                // Fetch job data from the alert’s saved URL
                const response = await fetch(alert.url);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

                const data = await response.json();
                const jobs = data.jobs;

                // Build list of job links for email
                const jobList = jobs.map((job) =>
                    `<li>
                        <a href="${job.link}" target="_blank">
                            ${decodeHtml(job.pagemap.metatags[0]["og:title"])
                        .replace("| LinkedIn", "")
                        .replace("LinkedIn", "")}
                        </a>
                    </li>`).join("");

                // Email options
                const mailOptions = {
                    from: "CareerBoost <boostcareer446@gmail.com>",
                    to: alert.email,
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
                                <p style="font-size:12px;color:#666">
                                    Don’t want these alerts? <a href="${unsubscribeUrl}">Unsubscribe</a>.
                                </p>
                            </body>
                        </html>
                    `,
                    replyTo: 'boostcareer446@gmail.com',
                };

                console.log("mail", mailOptions);

                // Send the email
                await transporter.sendMail(mailOptions);
            } catch (error) {
                console.error("Error:", error);
            }
        }
    }
}

// ==========================
// Send Weekly Job Alerts
// ==========================
async function sendWeeklyJobAlerts() {
    // Find users with weekly alerts
    const alerts = await User.find(
        { "alerts.frequency": "weekly" },
        { "alerts": 1 }
    );

    // Filter only weekly alerts per user
    for (const alert of alerts) {
        alert.alerts = alert.alerts.filter((alert) => alert.frequency === "weekly");
    }

    console.log("alerts", alerts);

    // Iterate through each user’s alerts
    for (const alertObject of alerts) {
        for (const alert of alertObject.alerts) {
            try {
                const response = await fetch(alert.url);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

                const data = await response.json();
                const jobs = data.jobs;

                const jobList = jobs.map((job) =>
                    `<li>
                        <a href="${job.link}" target="_blank">
                            ${decodeHtml(job.pagemap.metatags[0]["og:title"])
                        .replace("| LinkedIn", "")
                        .replace("LinkedIn", "")}
                        </a>
                    </li>`).join("");

                const mailOptions = {
                    from: "CareerBoost <boostcareer446@gmail.com>",
                    to: alert.email,
                    subject: "Your CareerBoost Job Matches for The Week! 🚀",
                    text: `Hi ${alert.email.split('@')[0]},\nHere are your latest job matches:\n\n${jobList}`,
                    html: `
                        <html>
                        <head>
                        <style>
                            body { font-family: Arial, sans-serif; line-height: 1.6; background-color: #f9f9f9; padding: 20px; color: #333; }
                            h3 { color: #2c3e50; margin-bottom: 20px; }
                            ul { list-style-type: none; padding: 0; margin: 0; }
                            li { background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 15px; margin-bottom: 10px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05); }
                            a { color: #007bff; text-decoration: none; }
                            a:hover { text-decoration: underline; }
                        </style>
                        </head>
                        <body>
                        <h3>Hi ${alert.email.split('@')[0]}, here are your latest job matches:</h3>
                        <ul>${jobList}</ul>
                        <p style="font-size:12px;color:#666">Don’t want these alerts? <a href="${unsubscribeUrl}">Unsubscribe</a>.</p>
                        </body>
                        </html>
                    `,
                    replyTo: 'boostcareer446@gmail.com',
                };

                console.log("mail", mailOptions);

                await transporter.sendMail(mailOptions);
            } catch (error) {
                console.error("Error:", error);
            }
        }
    }
}

// ==========================
// Schedule Jobs with CRON
// ==========================
// Run daily alerts every day at 8:00 AM
cron.schedule("0 8 * * *", sendDailyJobAlerts);

// Run weekly alerts every Sunday at 9:00 AM
cron.schedule("0 9 * * 0", sendWeeklyJobAlerts);
