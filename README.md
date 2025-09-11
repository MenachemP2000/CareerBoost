# CareerBoost

CareerBoost is a web application designed to help software developers make smarter career decisions using data from the Stack Overflow Developer Survey. It provides salary predictions, skill-based recommendations, and a job search engine tailored to the user’s profile

### website:
https://careerboost.menachem.website

## 🔍 Features

### 🎯 Predict
- Estimate your expected salary based on:
  - Years of experience
  - Technologies and tools
  - Education and country
  - Employment type

### 💡 Recommend
- Suggest new skills to learn that can improve your salary
- Simulate how adding a skill affects your salary prediction

### 🧭 Job Search
- Discover jobs based on:
  - Your profile (skills, experience, location)
  - Custom filters (keywords, dev type, frameworks)
- Save jobs and track application status
- Visualize job status using a Sankey diagram
- Powered by Google Search API targeting LinkedIn job listings

### 📈 Analytics
- Insights on:
  - Tech trends
  - Country-wise salary comparison
  - Impact of experience and education

---

## 🛠 Tech Stack

- **Frontend**: React, TailwindCSS, Chart.js
- **Backend**: Node.js, Express.js
- **ML/Prediction**: Python (scikit-learn, pandas)
- **Database**: MongoDB
- **Job Search**: Google Programmable Search (LinkedIn Jobs)

---

## 🚀 Getting Started

### Prerequisites

- Node.js
- Python 3.x
- MongoDB

### Setup

```bash
# Clone the repo
git clone https://github.com/MenachemP2000/CareerBoost.git


# Install frontend dependencies
cd ../Frontend
npm install
npm run build

# Install backend dependencies
cd Backend
npm install
node server.js