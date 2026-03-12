from fastapi import APIRouter
from app.models.chat_model import ChatRequest , ChatResponse

router = APIRouter()

@router.post("/chat" , response_model=ChatResponse)
def chat_with_bot(request:ChatRequest):

    return ChatResponse(
        answer="Chatbot is working"
    )