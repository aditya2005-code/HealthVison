import pdfplumber
import pytesseract
from pdf2image import convert_from_path
import cv2
import numpy as np


import pytesseract

pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
# -----------------------------
# Try extracting text directly
# -----------------------------
def extract_text_from_pdf(pdf_path):

    full_text = ""

    try:
        with pdfplumber.open(pdf_path) as pdf:

            for page in pdf.pages:

                text = page.extract_text()

                if text:
                    full_text += text + "\n"

    except Exception as e:
        print("PDF text extraction failed:", e)

    return full_text


# -----------------------------
# OCR preprocessing
# -----------------------------
def preprocess_image(image):

    img = np.array(image)

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    blur = cv2.GaussianBlur(gray, (5,5),0)

    thresh = cv2.adaptiveThreshold(
        blur,
        255,
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY,
        11,
        2
    )

    return thresh


# -----------------------------
# OCR fallback
# -----------------------------
def extract_text_with_ocr(pdf_path):

    images = convert_from_path(
        pdf_path,
        dpi=300,
        poppler_path=r"C:\poppler-25.12.0\Library\bin"
    )

    full_text = ""

    for i, image in enumerate(images):

        print(f"OCR processing page {i+1}")

        processed = preprocess_image(image)

        text = pytesseract.image_to_string(
            processed,
            config="--oem 3 --psm 4"
        )

        full_text += text + "\n"

    return full_text


# -----------------------------
# Hybrid extractor
# -----------------------------
def extract_text(pdf_path):

    print("Trying direct PDF extraction...")

    text = extract_text_from_pdf(pdf_path)

    # If enough text found, return it
    if len(text.strip()) > 500:

        print("Text layer detected — OCR not required")

        return text

    print("No text layer found — running OCR")

    text = extract_text_with_ocr(pdf_path)

    return text