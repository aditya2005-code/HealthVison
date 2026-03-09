from fastapi import APIRouter, HTTPException
from api.schemas.request_schema import ReportRequest
from api.services.mongo_service import get_report_by_id
from api.services.file_service import download_pdf
from api.services.ocr_service import extract_text

router = APIRouter()


@router.post("/analyze-report")
def analyze_report(request: ReportRequest):

    # 1 Get report metadata from MongoDB
    report = get_report_by_id(request.report_id)

    if report is None:
        raise HTTPException(status_code=404, detail="Report Not Found")

    file_url = report["fileUrl"]

    # 2 Download PDF
    pdf_path = download_pdf(file_url)

    # 3 Extract text
    extracted_text = extract_text(pdf_path)

    return {
        "message": "OCR completed",
        "text_preview": extracted_text[:500]
    }