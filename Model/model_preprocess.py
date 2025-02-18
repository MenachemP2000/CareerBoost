import pandas as pd
dtf = pd.read_csv("./survey_results.csv",index_col='ResponseId', encoding='utf-8')
dtf= dtf.fillna("No AI Search Dev")
AISearchDevHaveWorkedWith = dtf['AISearchDevHaveWorkedWith'].str.split(';', expand=True).stack().unique()
print(AISearchDevHaveWorkedWith)

export = pd.DataFrame(index=dtf.index)
for AISearchDev in AISearchDevHaveWorkedWith:
    dtf[AISearchDev] = dtf['AISearchDevHaveWorkedWith'].str.contains(AISearchDev    , regex=False).fillna(False).astype(int)
    export[AISearchDev] = dtf[AISearchDev]
export.to_csv('model_preprocess.csv', index=True, header=True)
