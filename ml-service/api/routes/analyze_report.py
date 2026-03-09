from fastapi import APIRouter , HTTPException
from api.schemas.request_schema import ReportRequest
from api.services.mongo_service import get_report_by_id
from api.services.file_service import download_pdf

router = APIRouter()

@router.post("/analyze-report")
def analyze_report(request:ReportRequest):
    report = get_report_by_id(request.report_id)

    if report is None:
        raise HTTPException(status_code=404, detail="Report Not Found")
    
    file_url = report["fileUrl"]

    pdf_path = download_pdf(file_url)

    return {
        "message": "PDF downloaded successfully",
        "pdf_path": pdf_path
    }