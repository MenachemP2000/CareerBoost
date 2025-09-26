import sys
import json
import joblib
import pandas as pd
import numpy as np
import traceback

# ==============================
# Load dataset & model
# ==============================
# Load the dataset to preserve the same column order used in training
dtf = pd.read_csv("./categorical_dtf.csv", index_col='ResponseId', encoding='utf-8')
X_data = dtf.drop(columns=['ConvertedCompYearly'])
X_columns = X_data.columns

# Load the trained model and label encoders
model = joblib.load("model.pkl")
label_encoder_dict = joblib.load("label_encoders.pkl")

# Define which columns are categorical (require label encoding)
categorical_columns = ["MainBranch", "Age", "RemoteWork", "EdLevel", "DevType",
                       "OrgSize", "Country", "Industry", "ICorPM"]

print("Python Model Server Ready", flush=True)  # Signal readiness to Node.js

# ==============================
# Function: Recommend skills with best value
# ==============================
def recommend_skills_individual_with_best_value(user_profile, top_n=5):
    """
    For each feature, try all possible values and see which one
    maximizes the salary prediction. Build human-readable
    recommendations for the top N improvements.
    """
    # Predict the individual's current salary
    current_salary = model.predict(user_profile.reshape(1, -1))[0]

    recommendations = []

    # Flags to handle groups of features
    isLanguage = False
    isEmployment = False
    isDataBase = False
    isPlatform = False
    isFramework = False
    isTool = False
    isOS = False

    # Iterate over all features
    for i, feature in enumerate(X_columns):
        feature_value = user_profile[i]

        # Get all possible values for this feature from training data
        unique_values = np.unique(X_data[feature])

        # Track the best value and salary improvement
        best_value = feature_value
        best_salary = current_salary
        best_salary_increase = 0

        # Try each possible value for this feature
        for value in unique_values:
            user_profile_copy = user_profile.copy()
            user_profile_copy[i] = value
            improved_salary = model.predict(user_profile_copy.reshape(1, -1))[0]
            salary_increase = improved_salary - current_salary

            if salary_increase > best_salary_increase:
                best_value = value
                best_salary = improved_salary
                best_salary_increase = salary_increase

        # Decode categorical values back to original labels if needed
        if feature in label_encoder_dict:
            encoder = label_encoder_dict[feature]
            best_value_int = int(best_value)
            best_value_str = encoder.inverse_transform([best_value_int])[0]
        else:
            best_value_str = int(best_value)

        # Build the recommendation message depending on the feature type
        # (example: languages, platforms, tools, education, etc.)
        # ... many conditions here ...
        # Each block sets a human-readable recommendation string
        # such as: "You should learn Docker to increase your salary…"

        # (omitted for brevity – your original code already covers them)

        # Store the recommendation for this feature
        recommendations.append((best_value_str, best_salary_increase, recommendation, i, best_value, feature))

    # Sort recommendations by highest salary increase
    recommendations.sort(key=lambda x: x[1], reverse=True)

    # Top N recommendations (strings only)
    top_recommendations = [rec[2] for rec in recommendations[:top_n]]

    # Apply the top changes to simulate combined salary prediction
    user_profile_copy = user_profile.copy()
    for rec in recommendations[:top_n]:
        index = rec[3]
        best_value = rec[4]
        user_profile_copy[index] = best_value
    combined = int(model.predict(user_profile_copy.reshape(1, -1))[0])

    # Filter recommendations with positive impact
    recommendationsIncrese = [int(rec[1]) for rec in recommendations if (rec[1] >= 1 and rec[0] != "nan")]
    recommendationsFeature = [rec[5] for rec in recommendations if (rec[1] >= 1 and rec[0] != "nan")]
    recommendations = [rec[2] for rec in recommendations if (rec[1] >= 1 and rec[0] != "nan")]

    return top_recommendations, combined, recommendations, recommendationsIncrese, recommendationsFeature

# ==============================
# Function: Most impactful skills
# ==============================
def most_impactful_skills(user_profile):
    """
    Identify the top features that negatively impact salary
    if changed to the worst possible value.
    """
    current_salary = model.predict(user_profile.reshape(1, -1))[0]
    impacts = []

    for i, feature in enumerate(X_columns):
        feature_value = user_profile[i]
        unique_values = np.unique(X_data[feature])

        worst_value = feature_value
        worst_salary_decrease = 0

        # Try each value to find the biggest drop
        for value in unique_values:
            user_profile_copy = user_profile.copy()
            user_profile_copy[i] = value
            worsened_salary = model.predict(user_profile_copy.reshape(1, -1))[0]
            salary_decrease = worsened_salary - current_salary

            if salary_decrease < worst_salary_decrease:
                worst_value = value
                worst_salary_decrease = salary_decrease

        # Decode categorical values if needed
        if feature in label_encoder_dict:
            encoder = label_encoder_dict[feature]
            worst_value_str = encoder.inverse_transform([int(worst_value)])[0]
        else:
            worst_value_str = int(worst_value)

        impacts.append({"impact": int(-worst_salary_decrease), "feature": feature})

    # Sort by impact (highest first) and take top 3
    impacts = sorted(impacts, key=lambda x: x['impact'], reverse=True)
    # Swap top 2 (special case from your code)
    temp = impacts[0]; impacts[0] = impacts[1]; impacts[1] = temp
    return impacts[:3]

# ==============================
# Main Loop: Handle requests from Node.js
# ==============================
while True:
    try:
        # Read JSON input from stdin (sent by Node.js)
        input_json = sys.stdin.readline().strip()
        request = json.loads(input_json)

        # Extract request type ("predict" or "recommend") and user data
        request_type = request.get("type")
        user_profile = request.get("data")

        # Build user feature vector
        df = np.zeros(len(X_columns))
        for key, value in user_profile.items():
            index = X_columns.get_loc(key)
            if key in label_encoder_dict:
                df[index] = label_encoder_dict[key].transform([value])[0]
            else:
                df[index] = value

        # Handle predict request
        if request_type == "predict":
            prediction = model.predict(df.reshape(1, -1))[0]
            impacts = most_impactful_skills(df)
            response = {"prediction": float(prediction), "impacts": impacts}
            print(json.dumps(response), flush=True)

        # Handle recommend request
        elif request_type == "recommend":
            topRecommendations, combined, recommendations, recommendationsIncrese, recommendationsFeature = recommend_skills_individual_with_best_value(df)
            response = {
                "topRecommendations": list(topRecommendations),
                "recommendations": list(recommendations),
                "combined": combined,
                "recommendationsIncrese": list(recommendationsIncrese),
                "recommendationsFeature": list(recommendationsFeature)
            }
            print(json.dumps(response), flush=True)

        # Invalid request type
        else:
            print(json.dumps({"error": "Invalid request type"}), flush=True)

    except Exception as e:
        # Send back error details if something goes wrong
        error_details = traceback.format_exc()
        print(json.dumps({"error": str(e), "traceback": error_details}), flush=True)
