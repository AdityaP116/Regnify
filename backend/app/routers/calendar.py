"""Calendar deadlines router — GET /api/calendar"""

from __future__ import annotations
from fastapi import APIRouter, Depends

from app.auth import require_auth
from app.models import CalendarDeadline
from app.services.firebase import col_list, is_firebase_ok
from app.services.seed import get_corpus

router = APIRouter(prefix="/api", tags=["Calendar"])


@router.get("/calendar", response_model=list[CalendarDeadline])
async def list_calendar(uid: str = Depends(require_auth)) -> list[CalendarDeadline]:
    """Return upcoming compliance deadlines."""
    if is_firebase_ok():
        docs = col_list("calendarDeadlines")
        result = []
        for d in docs:
            try:
                result.append(CalendarDeadline(**d))
            except Exception:
                pass
        if result:
            return result

    corpus = get_corpus()
    return [CalendarDeadline(**d) for d in corpus.get("calendarDeadlines", [])]
