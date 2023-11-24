import pandas as pd

input_file_path = "data/medication-data.xlsx"
df = pd.read_excel(input_file_path, skiprows=19, engine="openpyxl")

# Filter the DataFrame to include only rows where "Product authorisation country" is "Portugal"
df = df[df["Product authorisation country"] == "Portugal"]

df.reset_index(drop=True, inplace=True)

output_file_path = "data/processed_medication_data.xlsx"
df.to_excel(output_file_path, index=False)

print(df.head())
