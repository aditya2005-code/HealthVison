from fastapi import FastAPI
from app.routes.chat  import router as chat_router

app = FastAPI(
    title="HealthVision chatbot api",
    description="AI chatbot for answering medical report queries",
    version = "1.0"
)

app.include_router(chat_router)

@app.get("/health")
def health_check():
    return {"status" : "ok"}