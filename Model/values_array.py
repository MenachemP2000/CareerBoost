""" import pandas as pd
dtf = pd.read_csv("./values.csv", encoding='utf-8')
for col in dtf.columns:
    uniuqe_values = dtf[col].unique().sort()
    print(f"const {col} = [") 
    print(", ".join(f'"{str(value)}"' for value in sorted(dtf[col].unique())))
    print("];") """
    
import pandas as pd
dtf = pd.read_csv("./survey_results.csv",index_col='ResponseId', encoding='utf-8')
dtf= dtf.fillna("OpSysProfessional use")
OpSysProfessionaluse = dtf['OpSysProfessional use'].str.split(';', expand=True).stack().unique()
print("const OpSys = ")
print(sorted(filter(lambda x: x != "OpSysProfessional use", OpSysProfessionaluse)))

