"""
AI Assistant router

POST /api/ai/query — answer a regulatory question grounded in official sources
"""

from __future__ import annotations
from fastapi import APIRouter, Depends

from app.auth import require_auth
from app.models import AiQueryRequest, AiResponse
from app.services.gemini import ask_regulatory_question
from app.services.seed import get_corpus

router = APIRouter(prefix="/api", tags=["AI Assistant"])


@router.post("/ai/query", response_model=AiResponse)
async def ai_query(
    body: AiQueryRequest,
    uid: str = Depends(require_auth),
) -> AiResponse:
    """
    Answer a regulatory compliance question.
    The response is grounded in official gazette data from the Regnify corpus.
    AI interpretation is clearly distinguished from official statutory text.
    """
    query = (body.query or "").strip()
    if not query:
        query = "What are our most urgent compliance obligations right now?"

    corpus = get_corpus()
    business_name = corpus.get("businessProfile", {}).get("name", "your enterprise")

    return ask_regulatory_question(query, business_name)
