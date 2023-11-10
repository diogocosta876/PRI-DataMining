import pdfplumber
import json

with pdfplumber.open('downloaded_pdfs\Aas.pdf') as pdf:
    all_text = []
    
    for page in pdf.pages:
        text = page.extract_text()
        if text:
            all_text.append(text)

data = {'pages': all_text}

json_data = json.dumps(data, indent=4)

with open('data/unstructured_data.json', 'w') as file:
    file.write(json_data)

print("Conversion complete. JSON saved as 'unstructured_data.json'")