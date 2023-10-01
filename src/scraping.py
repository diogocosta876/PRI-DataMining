import os
import time
import pandas as pd
import requests
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By

# Load the processed medication data from the Excel file
input_file_path = "data/processed_medication_data.xlsx"
df = pd.read_excel(input_file_path, engine="openpyxl")

# Base URL for Infomed search
search_url = "https://extranet.infarmed.pt/INFOMED-fo/pesquisa-avancada.xhtml"

# Create a directory to store the downloaded PDFs
download_dir = "downloaded_pdfs"
os.makedirs(download_dir, exist_ok=True)

driver = webdriver.Chrome()
driver.set_window_size(1200, 1000)

for index, row in df.iterrows():
    medication_name = row["Product name"]
    print(f"fetching {medication_name}")

    driver.get("https://extranet.infarmed.pt/INFOMED-fo/pesquisa-avancada.xhtml")

    input_element = driver.find_element(By.ID, "mainForm:medicamento_input")
    driver.execute_script(f"arguments[0].value = '{medication_name}';", input_element)

    driver.execute_script("window.scrollTo(0, 1000)")
    search_btn = driver.find_element(By.ID, "mainForm:btnDoSearch").click()

    time.sleep(2)
    bula = driver.find_element(
        By.ID, "mainForm:dt-medicamentos:0:pesqAvancadaDatableFiIcon"
    )
    bula.click()

    pdf_url = driver.current_url

    # New tabs will be the last object in window_handles
    driver.switch_to.window(driver.window_handles[-1])

    # close the tab
    driver.close()

    # switch to the main window
    driver.switch_to.window(driver.window_handles[0])

    # Download the PDF using requests
    response = requests.get(pdf_url)

    if response.status_code == 200:
        # Assume the downloaded file is the only file
        file_name = f"{medication_name}.pdf"
        file_path = os.path.join(download_dir, file_name)

        with open(file_path, "wb") as pdf_file:
            pdf_file.write(response.content)

        print(f"Downloaded: {file_name}")
    else:
        print(f"Failed to download: {medication_name}")

print("Finished scraping.")
