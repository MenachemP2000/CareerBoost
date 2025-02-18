import pandas as pd
dtf = pd.read_csv("./survey_results.csv",index_col='ResponseId', encoding='utf-8')
dtf= dtf.fillna("NoDataBase")
DatabaseHaveWorkedWith = dtf['DatabaseHaveWorkedWith'].str.split(';', expand=True).stack().unique()
print(DatabaseHaveWorkedWith)

export = pd.DataFrame(index=dtf.index)
for Database in DatabaseHaveWorkedWith:
    dtf[Database] = dtf['DatabaseHaveWorkedWith'].str.contains(Database).fillna(False).astype(int)
    export[Database] = dtf[Database]
export.to_csv('model_preprocess.csv', index=True, header=True)
