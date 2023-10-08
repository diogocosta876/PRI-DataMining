import os
import time
import pandas as pd
import requests
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


def download_bula(pdf_url):
    global downloaded_count
    response = requests.get(pdf_url)

    if response.status_code == 200:
        # Assume the downloaded file is the only file
        file_name = f"{medication_name}.pdf"
        file_path = os.path.join(download_dir, file_name)

        with open(file_path, "wb") as pdf_file:
            pdf_file.write(response.content)
        downloaded_count += 1
        print(f"Successfull Downloads: {downloaded_count}")
    else:
        raise Exception("Failed to download the PDF")


input_file_path = "data/processed_medication_data.xlsx"
df = pd.read_excel(input_file_path, engine="openpyxl")

search_url = "https://extranet.infarmed.pt/INFOMED-fo/pesquisa-avancada.xhtml"

download_dir = "downloaded_pdfs"
os.makedirs(download_dir, exist_ok=True)

driver = webdriver.Chrome()
driver.set_window_size(1200, 1000)

error_count = 0
downloaded_count = 0

for index, row in df.iterrows():
    try:
        medication_name = row["Product name"]

        file_name = f"{medication_name}.pdf"
        file_path = os.path.join(download_dir, file_name)

        # Check if the Price is already scraped
        if os.path.exists(file_path):
            print(f"Metadata for {medication_name} already scrapped, skipping...")
            continue

        driver.get("https://extranet.infarmed.pt/INFOMED-fo/pesquisa-avancada.xhtml")

        input_element = WebDriverWait(driver, 3).until(
            EC.element_to_be_clickable((By.ID, "mainForm:medicamento_input"))
        )
        driver.execute_script(
            f"arguments[0].value = '{medication_name}';", input_element
        )

        driver.execute_script("window.scrollTo(0, 1000)")
        search_btn = WebDriverWait(driver, 3).until(
            EC.element_to_be_clickable((By.ID, "mainForm:btnDoSearch"))
        )
        search_btn.click()

        MAX_RETRIES = 3
        retries = 0
    except Exception as e:
        print(
            f"Failed to click search button: {medication_name}, error count: {error_count}"
        )
        print(e)
        error_count += 1
        continue

    next_item_flag = False
    while retries < MAX_RETRIES:
        try:
            medicamento = WebDriverWait(driver, 1).until(
                EC.element_to_be_clickable(
                    (By.ID, "mainForm:dt-medicamentos:0:linkNome")
                )
            )
            retries += 1
            medicamento.click()
            break
        except Exception as e:
            retries += 1
            if retries == MAX_RETRIES:
                print(
                    f"Failed to click search result: {medication_name}, error count: {error_count}"
                )
                print(e)
                error_count += 1
                next_item_flag = True
                break
    if next_item_flag:
        continue

    try:
        bula = WebDriverWait(driver, 3).until(
            EC.element_to_be_clickable(
                (By.ID, "detalheMedFiTopForm:detalheMedTopFiIcon")
            )
        )

        bula.click()

        pdf_url = driver.current_url

        # New tabs will be the last object in window_handles
        driver.switch_to.window(driver.window_handles[-1])

        driver.close()

        # switch to the main window
        driver.switch_to.window(driver.window_handles[0])

    except Exception as e:
        print(f"Failed to click leaflet: {medication_name}")
        error_count += 1
        continue

    try:
        download_bula(pdf_url)
    except Exception as e:
        print("error downloading leaflet")
        continue

    # get rest of meta data
    substanciaAtiva = ("j_idt107", "j_idt108")
    forma = ("j_idt109", "j_idt110")
    dosagem = ("j_idt112", "j_idt113")
    titular = ("j_idt114", "j_idt115")
    generico = ("j_idt116", "j_idt118")
    viaAdministração = ("viaLabel", "viasAdm:0:j_idt119")
    grupoProduto = ("j_idt121", "grpProd:0:j_idt122")
    numeroProcesso = ("j_idt124", "j_idt125")
    autorizado = ("j_idt130", "j_idt131")  # inside
    data = ("j_idt136", "j_idt137")
    classificação = ("j_idt142", "dispId:0:classifDispensa")  # inside
    duraçãoTratamento = ("j_idt162", "j_idt163")

    metadata_ids = [
        substanciaAtiva,
        forma,
        dosagem,
        titular,
        dosagem,
        generico,
        viaAdministração,
        grupoProduto,
        numeroProcesso,
        autorizado,
        data,
        classificação,
        duraçãoTratamento,
    ]

    for title_id, value_id in metadata_ids:
        try:
            title = WebDriverWait(driver, 5).until(
                EC.element_to_be_clickable((By.ID, title_id))
            )
            try:
                value = WebDriverWait(driver, 5).until(
                    EC.element_to_be_clickable((By.ID, value_id))
                )
                df.at[index, title.text] = value.text
            except Exception as e:
                # print(f"Failed to fetch metadata {value_id}: {medication_name}, defaulting to N\A")
                df.at[index, title.text] = "N/A"

            # print(title.text, value.text)
        except Exception as e:
            print(f"Failed to fetch metadata {title_id, value_id}: {medication_name}")
            error_count += 1
            continue

    pvp = (
        "carousel-tablet:j_idt404:0:j_idt406:0:j_idt444",
        "carousel-tablet:j_idt404:0:j_idt406:0:j_idt446",
    )
    min_price = 10000000
    for produto_n in range(0, 3):
        try:
            id = "carousel-tablet:j_idt404:0:j_idt406:" + str(produto_n) + ":j_idt446"
            min_price = min(
                min_price,
                WebDriverWait(driver, 1).until(EC.element_to_be_clickable((By.ID, id))),
            )
        except Exception as e:
            print(e)
            continue

    if min_price == 10000000:
        min_price = "N/A"
    # print(f"lowestprice: {min_price}")
    df.at[index, "Lowest PVP"] = min_price

    if index % 20 == 0:
        print("outputting to excel")
        df.to_excel(input_file_path, index=False)


print(f"Finished scraping with {x} downloads and {error_count} errors")
