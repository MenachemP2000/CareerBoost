import pandas as pd
dtf = pd.read_csv("./survey_results_minimal.csv",index_col='ResponseId', encoding='utf-8')
employments = dtf['Employment'].str.split(';', expand=True).stack().unique()
print(employments)

export = pd.DataFrame(index=dtf.index)
for employment in employments:
    dtf[employment] = dtf['Employment'].str.contains(employment).fillna(False).astype(int)
    export[employment] = dtf[employment]
export.to_csv('model_preprocess.csv', index=True, header=True)
