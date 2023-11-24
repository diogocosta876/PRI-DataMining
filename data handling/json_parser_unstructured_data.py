import os
import pdfplumber
import json
import re

delimiters = [
    r"O que é (?:.)*? e para que é (?:utilizado|utilizada)",
    r"(?:O que precisa de saber )?antes de (?:utilizar|tomar|lhe ser administrado|lhe ser administrada|dar|lhe ser dado|lhe ser dada|usar)",
    r"Como (?:tomar|utilizar|(?:lhe )?é administrado|(?:lhe )?é administrada|é utilizado|é utilizada)",
    r"Efeitos (?:indesejáveis|secundários) (?:possíveis|possiveis)",
    r"Como (?:conservar|conserver)|Conservação de",
    r"(?:Conteúdo da embalagem e )?outras informações"
]


def fetchMedicineData(pdf_filename):
    def extract_text_from_pdf(pdf_filename):
        try:
            with pdfplumber.open(pdf_filename) as pdf:
                all_text = ""
                for page in pdf.pages:
                    text = page.extract_text()
                    if text:
                        all_text += text
            return all_text
        except:
            print(f"ERROR: in extract_text_from_pdf({pdf_filename})" )
            return "ERROR"


    extracted_text = extract_text_from_pdf(pdf_filename)
    if(extracted_text == "ERROR"): return ""

    # Remove newline characters
    #extracted_text = extracted_text.replace('\n', ' ')
    json_section = {"O que é e para que é utilizado": "", #O que é ________ e para que é utilizado
           "Antes de utilizar": "", #(O que precisa de saber)? Antes de utilizar/tomar  _____________
           "Como utilizar": "", #Como tomar/utilizar _______________
           "Efeitos secundários": "", #Efeitos indesejáveis/SECUNDÁRIOS  possíveis
           "Como conservar": "", #Como conservar (o)? ____________________
           "Outras informações": "" #(Conteúdo da embalagem e)? outras informações 
        }
    

    spans = []
    error = False

    start_i = 0
    for i, delim in enumerate(delimiters):
        if (i==0):
            first_ocurrence = re.search(delim, extracted_text, re.IGNORECASE | re.DOTALL)
            if(first_ocurrence == None): 
                print(f"Did not find first: o que é e para que serve for file {os.path.splitext(os.path.basename(pdf_filename))[0]}")
                error = True
                break
            
            start_i = first_ocurrence.end()
        
        first_ocurrence = re.search(delim, extracted_text[start_i:], re.IGNORECASE | re.DOTALL)
        if(first_ocurrence == None): 
            print(f"Did not find this delimitator {delim} for file {os.path.splitext(os.path.basename(pdf_filename))[0]}")
            print(spans)
            error = True
            break
        
        spans.append(start_i + first_ocurrence.start())
        start_i += first_ocurrence.end()
    
    if(not error):
        print(spans)
        json_section["O que é e para que é utilizado"] = extracted_text[spans[0]:spans[1]]
        json_section["Antes de utilizar"] = extracted_text[spans[1]:spans[2]]
        json_section["Como utilizar"] = extracted_text[spans[2]:spans[3]]
        json_section["Efeitos secundários"] = extracted_text[spans[3]:spans[4]]
        json_section["Como conservar"] = extracted_text[spans[4]:spans[5]]
        json_section["Outras informações"] = extracted_text[spans[5]:]
    else:
        json_section = {}
        json_section["Bula"] = extracted_text

    #print(json_section)

    json_data = json.dumps(json_section, indent=4, ensure_ascii=False)
    
    json_filename = os.path.splitext(os.path.basename(pdf_filename))[0] + '.json'
    output_path = os.path.join('unstructured_data/', json_filename)

    with open(output_path, 'w', encoding='utf-8') as json_file:
        json_file.write(json_data)

    print(f"Conversion complete. JSON saved as '{output_path}'")

def process_all_pdfs(pdf_dir):
    os.makedirs('unstructured_data/', exist_ok=True)
    pdf_files = [f for f in os.listdir(pdf_dir) if f.lower().endswith('.pdf')]

    #i = 0 #code for test

    for pdf_file in pdf_files:

        #if(i==200): break #code for test

        pdf_path = os.path.join(pdf_dir, pdf_file)
        fetchMedicineData(pdf_path)

        #i += 1 #code for test

pdf_dir = 'downloaded_pdfs/'
process_all_pdfs(pdf_dir)
