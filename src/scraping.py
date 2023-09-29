import pandas as pd

# Specify the path of your CSV file
file_path = '../data/medication-data.xlsx'

# Load the Excel file into a DataFrame
# By default, it reads the first sheet. To read a different sheet, specify the sheet_name parameter.
df = pd.read_excel(file_path, skiprows=19, engine='openpyxl')

# Display the first few rows of the DataFrame
print(df.head())