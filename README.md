# CareerBoost

CareerBoost is a web application designed to help software developers make smarter career decisions using data from the Stack Overflow Developer Survey. It provides salary predictions, skill-based recommendations, and a job search engine tailored to the user’s profile.

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
cd CareerBoost

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install

# (Optional) Set up Python environment for salary prediction
cd ../predictor
pip install -r requirements.txt


### website:
https://careerboost.menachem.website
