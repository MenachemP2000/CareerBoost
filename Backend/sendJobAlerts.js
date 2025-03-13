import cron from "node-cron"
import nodemailer from "nodemailer"
import User from "./models/User.js"
import { decode } from "html-entities";


const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "boostcareer446@gmail.com",
        pass: "lsiv mzbq ufya rovo",  // Not recommended, but works temporarily
    },
});

const decodeHtml = (html) => {
    return decode(html);
};

async function sendDailyJobAlerts() {

    const alerts = await User.find(
        {
            "alerts.frequency": "daily", // Match alerts with frequency "daily"
        },
        {
            "alerts": 1
        }
    );

    for (const alert of alerts) {
        alert.alerts = alert.alerts.filter((alert) => alert.frequency === "daily");
    }

    console.log("alerts", alerts);


    for (const alertObject of alerts) {


        for (const alert of alertObject.alerts) {
            try {
                const response = await fetch(alert.url);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                const jobs = data.jobs;

                const jobList = jobs.map((job) => `<li>${decodeHtml(job.pagemap.metatags[0]["og:title"]).replace("| LinkedIn", "").replace("LinkedIn", "")}</li>`).join("");
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
                            </body>
                        </html>
                    `,
                    replyTo: 'support@careerboost.com',
                };
                console.log("mail", mailOptions);


                await transporter.sendMail(mailOptions);
            }
            catch (error) {
                console.error("Error:", error);
            }
        }
    }
}

async function sendWeeklyJobAlerts() {

    const alerts = await User.find(
        {
            "alerts.frequency": "weekly", // Match alerts with frequency "weekly"
        },
        {
            "alerts": 1
        }
    );

    for (const alert of alerts) {
        alert.alerts = alert.alerts.filter((alert) => alert.frequency === "weekly");
    }

    console.log("alerts", alerts);


    for (const alertObject of alerts) {


        for (const alert of alertObject.alerts) {
            try {
                const response = await fetch(alert.url);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                const jobs = data.jobs;

                const jobList = jobs.map((job) => `<li>${decodeHtml(job.pagemap.metatags[0]["og:title"]).replace("| LinkedIn", "").replace("LinkedIn", "")}</li>`).join("");
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
                            </body>
                        </html>
                    `,
                    replyTo: 'support@careerboost.com',
                };
                console.log("mail", mailOptions);


                await transporter.sendMail(mailOptions);
            }
            catch (error) {
                console.error("Error:", error);
            }
        }
    }
}

cron.schedule("0 8 * * *", sendDailyJobAlerts);
cron.schedule("0 9 * * 0", sendWeeklyJobAlerts);
