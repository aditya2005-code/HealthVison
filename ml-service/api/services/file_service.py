import requests
import os

def download_pdf(file_url:str):
    os.makedirs("temp_reports" , exist_ok=True)
    file_path = "temp_reports/report.pdf"
    response = requests.get(file_url)

    if response.status_code != 200:
        raise Exception("Failed to download pdf")
    
    with open(file_path,"wb") as f:
        f.write(response.content)

    return file_path