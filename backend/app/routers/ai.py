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

    business_name = "your enterprise"
    from app.services.firebase import doc_get, is_firebase_ok, col_query
    if is_firebase_ok():
        user_docs = col_query("users", "uid", "==", uid)
        if user_docs:
            biz_id = user_docs[0].get("businessId")
            if biz_id:
                biz_doc = doc_get("businesses", biz_id)
                if biz_doc and biz_doc.get("name"):
                    business_name = biz_doc["name"]
    else:
        corpus = get_corpus()
        business_name = corpus.get("businessProfile", {}).get("name", "your enterprise")

    return ask_regulatory_question(query, business_name)
