import pdfplumber
import pytesseract
from pdf2image import convert_from_path
import cv2
import numpy as np
import os

import pytesseract


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
        pass

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

    full_text = ""

    try:
        with pdfplumber.open(pdf_path) as pdf:

            total_pages = len(pdf.pages)

            for i in range(total_pages):
                # convert only ONE page at a time (memory safe)
                images = convert_from_path(
                    pdf_path,
                    dpi=200,
                    first_page=i + 1,
                    last_page=i + 1
                )

                image = images[0]

                processed = preprocess_image(image)

                text = pytesseract.image_to_string(
                    processed,
                    config="--oem 3 --psm 4"
                )

                full_text += text + "\n"

    except Exception as e:
        pass

    return full_text


def extract_text_from_image(image_path):
    try:
        image = cv2.imread(image_path)
        if image is None:
            raise Exception("Failed to load image with OpenCV")
            
        processed = preprocess_image(image)
        text = pytesseract.image_to_string(processed, config="--oem 3 --psm 4")
        return text
    except Exception as e:
        return ""

# -----------------------------
# Hybrid extractor
# -----------------------------
def extract_text(file_path):
    ext = os.path.splitext(file_path)[1].lower()
    
    if ext == ".pdf":
        text = extract_text_from_pdf(file_path)

        if text.strip():
            return text

        text = extract_text_with_ocr(file_path)
    else:
        text = extract_text_from_image(file_path)

    return text