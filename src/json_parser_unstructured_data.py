import os
import pdfplumber
import json
import re

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
            return ""

    def parse_sections(text):
        pattern = re.compile(r"\n(\d+)\.\s(.+?)(?=\n\d+\.|\Z)", re.DOTALL)
        matches = pattern.findall(text)
        sections = {}
        for match in matches:
            section_number, section_content = match
            section_title = re.search(r"^[^\n]+", section_content).group()
            sections[section_title.strip()] = section_content.strip()
        return sections

    extracted_text = extract_text_from_pdf(pdf_filename)
    sections = parse_sections(extracted_text)

    if sections:
        first_key = next(iter(sections))
        sections.pop(first_key)

    json_data = json.dumps(sections, indent=4, ensure_ascii=False)
    json_filename = os.path.splitext(os.path.basename(pdf_filename))[0] + '.json'
    output_path = os.path.join('unstructured_data/', json_filename)

    with open(output_path, 'w', encoding='utf-8') as json_file:
        json_file.write(json_data)

    print(f"Conversion complete. JSON saved as '{output_path}'")

def process_all_pdfs(pdf_dir):
    os.makedirs('unstructured_data/', exist_ok=True)
    pdf_files = [f for f in os.listdir(pdf_dir) if f.lower().endswith('.pdf')]

    for pdf_file in pdf_files:
        pdf_path = os.path.join(pdf_dir, pdf_file)
        fetchMedicineData(pdf_path)

pdf_dir = 'downloaded_pdfs/'
process_all_pdfs(pdf_dir)
