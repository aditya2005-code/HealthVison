from fastapi import FastAPI
from api.routes.analyze_report import router as analyze_router

app = FastAPI(title="ML Service of HealthVision",
              description="OCR + ML + LLM pipeline for disease prediction",
              version="1.0")

app.include_router(analyze_router)

@app.get("/")
def root():
    return {"status":"ML service is running"}