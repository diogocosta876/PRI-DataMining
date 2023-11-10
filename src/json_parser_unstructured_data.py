import os
import pdfplumber
import json
import re


def fetchMedicineData(name):

    print("Conversion complete. JSON saved as 'unstructured_data.json'")


    def save_converted_text(text_file: str, filename: str) -> None:
        with open(filename, "w+", encoding="utf8") as file_obj:
            file_obj.write(text_file)
        print(f"{text_file} has been successfully saved.")


    def extract_text_from_pdf(pdf_filename: str) -> str:
        with pdfplumber.open("downloaded_pdfs\Aas.pdf") as pdf:
            all_text = ""

            for page in pdf.pages:
                text = page.extract_text()
                if text:
                    all_text += text
        return all_text


    text = extract_text_from_pdf("downloaded_pdfs\Aas.pdf")
    save_converted_text(text, "unstructured_data\converted_text.txt")


    def parse_sections(text):
        pattern = re.compile(r"\n(\d+)\.\s(.+?)(?=\n\d+\.|\Z)", re.DOTALL)
        matches = pattern.findall(text)

        sections = {}

        for match in matches:
            section_number, section_content = match
            section_title = re.search(
                r"^[^\n]+", section_content
            ).group()  # Get the first line as the title
            sections[section_title.strip()] = section_content.strip()

        return sections


    with open("unstructured_data/converted_text.txt", "r", encoding="utf-8") as file:
        full_text = file.read()

    sections = parse_sections(full_text)

    first_key = next(iter(sections))
    removed_value = sections.pop(first_key)
    print(f"Removed {first_key}: {removed_value}")
    print(sections.keys())


    json_data = json.dumps(sections, indent=4, ensure_ascii=False)

    # Write the JSON data to a file
    with open("unstructured_data/unstructured_data.json", "w", encoding="utf-8") as file:
        file.write(json_data)

    print("Conversion complete. JSON saved as 'unstructured_data/unstructured_data_medicamentonome.json'")

    os.remove("unstructured_data/converted_text.txt")