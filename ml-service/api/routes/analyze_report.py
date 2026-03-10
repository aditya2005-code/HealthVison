from fastapi import APIRouter, HTTPException
from bson import ObjectId
from datetime import datetime

from api.schemas.request_schema import ReportRequest
from api.services.mongo_service import collection, get_report_by_id
from api.services.file_service import download_pdf
from api.services.ocr_service import extract_text
from api.services.llm_feature_extractor import extract_features_with_llm
from api.services.ml_predictor_service import predict_diseases


router = APIRouter()


@router.post("/analyze-report")
def analyze_report(request: ReportRequest):

    try:

        # 1️⃣ Fetch report from MongoDB
        report = get_report_by_id(request.report_id)

        if report is None:
            raise HTTPException(status_code=404, detail="Report Not Found")

        file_url = report["fileUrl"]

        print("PDF URL:", file_url)

        # 2️⃣ Download PDF
        pdf_path = download_pdf(file_url)

        print("PDF downloaded to:", pdf_path)

        # 3️⃣ OCR Extraction
        extracted_text = extract_text(pdf_path)

        if not extracted_text or len(extracted_text.strip()) == 0:
            raise HTTPException(status_code=500, detail="OCR extraction failed")

        print("OCR extraction complete")

        # 4️⃣ LLM Feature Extraction
        features = extract_features_with_llm(extracted_text)

        print("Extracted Features:", features)

        if "error" in features:
            raise HTTPException(status_code=500, detail="Feature extraction failed")

        # 5️⃣ ML Prediction
        predictions = predict_diseases(features)

        print("Predictions:", predictions)

        # 6️⃣ Save results to MongoDB
        analysis_result = {
            "features": features,
            "predictions": predictions,
            "analyzedAt": datetime.utcnow()
        }

        collection.update_one(
            {"_id": ObjectId(request.report_id)},
            {
                "$set": {
                    "analysisResult": analysis_result,
                    "status": "completed"
                }
            }
        )

        # 7️⃣ API Response
        return {
            "message": "Report analyzed successfully",
            "features": features,
            "predictions": predictions
        }

    except Exception as e:

        print("Analysis error:", e)

        raise HTTPException(
            status_code=500,
            detail="Report analysis failed"
        )


# Debug route
@router.get("/debug-report")
def debug():

    doc = collection.find_one()

    return {"doc": str(doc)}