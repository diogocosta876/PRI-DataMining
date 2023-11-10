import os
import pdfplumber
import json
import re

# Adjusted function to process any given PDF file name
def fetchMedicineData(pdf_filename):
    def extract_text_from_pdf(pdf_filename):
        with pdfplumber.open(pdf_filename) as pdf:
            all_text = ""
            for page in pdf.pages:
                text = page.extract_text()
                if text:
                    all_text += text
        return all_text

    def parse_sections(text):
        pattern = re.compile(r"\n(\d+)\.\s(.+?)(?=\n\d+\.|\Z)", re.DOTALL)
        matches = pattern.findall(text)
        sections = {}
        for match in matches:
            section_number, section_content = match
            section_title = re.search(r"^[^\n]+", section_content).group()
            sections[section_title.strip()] = section_content.strip()
        
        return sections

    # Extract and parse text from PDF
    extracted_text = extract_text_from_pdf(pdf_filename)
    sections = parse_sections(extracted_text)

    # Remove the first section entry
    if sections:
        first_key = next(iter(sections))
        sections.pop(first_key)

    # Convert the sections to JSON
    json_data = json.dumps(sections, indent=4, ensure_ascii=False)

    # Define the JSON filename
    json_filename = os.path.splitext(os.path.basename(pdf_filename))[0] + '.json'
    output_path = os.path.join('unstructured_data/', json_filename)

    # Write the JSON data to a file
    with open(output_path, 'w', encoding='utf-8') as json_file:
        json_file.write(json_data)

    print(f"Conversion complete. JSON saved as '{output_path}'")

# Directory where the PDF files are located
pdf_dir = 'downloaded_pdfs/'

# Function to process all PDFs in the directory
def process_all_pdfs(pdf_dir):
    # Ensure the output directory exists
    output_dir = '/mnt/data/unstructured_data/'
    os.makedirs(output_dir, exist_ok=True)

    # List all PDF files in the specified directory
    pdf_files = [f for f in os.listdir(pdf_dir) if f.lower().endswith('.pdf')]

    # Process each PDF file and convert to JSON
    for pdf_file in pdf_files:
        pdf_path = os.path.join(pdf_dir, pdf_file)
        fetchMedicineData(pdf_path)

# You can call this function when the PDFs are in the folder
process_all_pdfs(pdf_dir)
