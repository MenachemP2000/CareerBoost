import sys
import json
import joblib
import pandas as pd
import numpy as np
import traceback

dtf = pd.read_csv("./categorical_dtf.csv",index_col='ResponseId', encoding='utf-8')
X_data = dtf.drop(columns=['ConvertedCompYearly'])
X_columns = X_data.columns

# Load the model once
model = joblib.load("model.pkl")
label_encoder_dict = joblib.load("label_encoders.pkl")  

categorical_columns = ["MainBranch", "Age", "RemoteWork", "EdLevel", "DevType", "OrgSize", "Country", "Industry", "ICorPM"]

print("Python Model Server Ready", flush=True)

def recommend_skills_individual_with_best_value(user_profile,top_n=5):
    """
    Generate automatic top N skill recommendations with estimated salary impact for an individual,
    by testing all possible values for each feature and determining which gives the best salary prediction.
    
    user_profile: A pandas Series or numpy array containing the individual's features (skills, experience, etc.)
    top_n: The number of recommendations to provide
    
    Returns the current salary and a list of skill improvement recommendations with salary impact.
    """
    # Predict the individual's current salary
    current_salary = model.predict(user_profile.reshape(1, -1))[0]
    
    recommendations = []
    isLanguage = False
    isEmployment = False
    
    # Iterate through all features to calculate the salary impact of improving each feature
    for i, feature in enumerate(X_columns):
        feature_value = user_profile[i]
        
        # Get all unique values for this feature from the data
        unique_values = np.unique(X_data[feature])
        
        # Initialize variables to track the best result for this feature
        best_value = feature_value
        best_salary = current_salary
        best_salary_increase = 0
        
        # Simulate changing this feature to each possible value
        for value in unique_values:
            # Create a copy of the user profile to simulate the change in this feature
            user_profile_copy = user_profile.copy()
            
            # Set the feature value to the candidate value
            user_profile_copy[i] = value
            
            # Predict the new salary after the change
            improved_salary = model.predict(user_profile_copy.reshape(1, -1))[0]
            
            # Calculate the salary increase
            salary_increase = improved_salary - current_salary
            
            # If this value gives a better salary, update the best value
            if salary_increase > best_salary_increase:
                best_value = value
                best_salary = improved_salary
                best_salary_increase = salary_increase
        
        # If the feature is categorical and has a label encoder, decode the value back to its original label
        if feature in label_encoder_dict:
            encoder = label_encoder_dict[feature]
            # Convert best_value to integer for inverse_transform
            best_value_int = int(best_value)
            best_value_str = encoder.inverse_transform([best_value_int])[0]
        else:
            best_value_str = int(best_value)
            
        # Generate the recommendation
        if feature == 'Assembly' :
            isLanguage = True
        if feature == 'Employed, full-time' :
            isEmployment = True
        if isLanguage:
            if best_value_str == 1:
                recommendation = f"You should use {feature} to increase your salary by approximately $ {int(best_salary_increase)}."
            else:
                recommendation = f"You should not use {feature} to increase your salary by approximately $ {int(best_salary_increase)}."
        elif feature == 'MainBranch' :
            if not best_value_str == "I am a developer by profession" :
                recommendation = f"You should become developer by profession to increase your salary by approximately $ {int(best_salary_increase)}."
            else :
                recommendation = f"You should stop being a developer by profession to increase your salary by approximately $ {int(best_salary_increase)}."
        elif feature == 'Age' :
            recommendation = f"if your age range was {best_value_str} it would increase your salary by approximately ${int(best_salary_increase)}."
        elif feature == 'RemoteWork' :
            recommendation = f"Change your work situation to {best_value_str} increase your salary by approximately $ {best_salary_increase:.0f}."
        elif feature == 'EdLevel' :
            recommendation = f"Change your education level to {best_value_str} to increase your salary by approximately $ {int(best_salary_increase)}."           
        elif feature == 'DevType' :
            recommendation = f"Change your developer type to {best_value_str} to increase your salary by approximately $ {int(best_salary_increase)}."
        elif feature == 'OrgSize' :
            recommendation = f"Change your organization size to {best_value_str} to increase your salary by approximately $ {int(best_salary_increase)}."
        elif feature == 'Country' :
            recommendation = f"Move to {best_value_str} to increase your salary by approximately $ {int(best_salary_increase)}."
        elif feature == 'Industry' :
            recommendation = f"Work in the {best_value_str} industry to increase your salary by approximately $ {int(best_salary_increase)}."
        elif feature == 'ICorPM' :
            recommendation = f"Change your role to {best_value_str} to increase your salary by approximately $ {int(best_salary_increase)}."
        elif feature == 'YearsCode' :
            recommendation = f"Your years of coding experience should be {best_value_str} to increase your salary by approximately $ {int(best_salary_increase)}."
        elif feature == 'YearsCodePro' :
            recommendation = f"Your years of professional coding experience should be {best_value_str} to increase your salary by approximately $ {int(best_salary_increase)}."
        elif feature == 'JobSat' :
            recommendation = f"Working in a job which give you {best_value_str} satisfaction out of 10 will increase your salary by approximately $ {int(best_salary_increase)}."
        elif feature == 'WorkExp' :
            recommendation = f"Your work experience should be {best_value_str} years to increase your salary by approximately $ {int(best_salary_increase)}."
        elif isEmployment :
            if best_value_str == 1:
                recommendation = f"You should have {feature} in your employment status to increase your salary by approximately $ {int(best_salary_increase)}."
            else :
                recommendation = f"You should not have {feature} in your employment status to increase your salary by approximately $ {int(best_salary_increase)}."
        else:
            recommendation = f"Change your {feature} to {best_value_str} to increase your salary by approximately ${int(best_salary_increase)}."
        
        if feature == 'Crystal' :
            isLanguage = False
        
        
        recommendations.append((best_value_str, best_salary_increase, recommendation, i, best_value))
        
    
    # Sort the recommendations by the salary increase, descending order
    recommendations.sort(key=lambda x: x[1], reverse=True)
    
    # Return the current salary and top N recommendations
    top_recommendations = [recommendation[2] for recommendation in recommendations[:top_n]]
    top = [recommendation for recommendation in recommendations[:top_n]]
    combined = ""
    user_profile_copy = user_profile.copy()
    for recommendation in top:
        index = recommendation[3]
        best_value = recommendation[4]
        user_profile_copy[index] = best_value
    prediction = model.predict(user_profile_copy.reshape(1, -1))[0]
    combined = f"By following this top recommendations, your salary could increase to approximately $ {int(prediction)}."
    
    recommendations = [recommendation[2] for recommendation in recommendations if ((recommendation[1] > 0) & (recommendation[0] != "nan"))]
    return top_recommendations,combined,recommendations

while True:
    try:
        # Read input data
        input_json = sys.stdin.readline().strip()
        request = json.loads(input_json)

        request_type = request.get("type")  # "predict" or "recommend"
        user_profile = request.get("data")
        df = np.zeros(70)
        #print(df)
        for key, value in user_profile.items():
            #print(key, value)
            index = X_columns.get_loc(key)
            #print(index)
            if key in label_encoder_dict:
                df[index] = label_encoder_dict[key].transform([value])[0]
            else:
                df[index] = value
            
        #print(df)
        #print(X_data.iloc[0].values)

        # Encode categorical features if necessary
        for col in categorical_columns:
            if col in df and col in label_encoder_dict:
                df[col] = label_encoder_dict[col].transform(df[col])

        if request_type == "predict":
            prediction = model.predict(df.reshape(1, -1))[0]
            
            # Send response
            response = {"prediction": float(prediction)}
            print(json.dumps(response), flush=True)

        elif request_type == "recommend":
            topRecommendations, combined,recommendations = recommend_skills_individual_with_best_value(df)

            # Send response
            response = {"topRecommendations": list(topRecommendations), "recommendations": list(recommendations), "combined": combined}
            print(json.dumps(response), flush=True)

        else:
            response = {"error": "Invalid request type"}

    except Exception as e:
        error_details = traceback.format_exc()  # Get full traceback
        print(json.dumps({"error": str(e), "traceback": error_details}), flush=True)
