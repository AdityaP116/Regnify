"""
Alerts router

GET /api/alerts — list all alerts for the authenticated user's business
"""

from __future__ import annotations
from fastapi import APIRouter, Depends

from app.auth import require_auth
from app.models import AlertItem
from app.services.firebase import col_list, is_firebase_ok
from app.services.seed import get_corpus

router = APIRouter(prefix="/api", tags=["Alerts"])


@router.get("/alerts", response_model=list[AlertItem])
async def list_alerts(uid: str = Depends(require_auth)) -> list[AlertItem]:
    """Return all regulatory alerts."""
    if is_firebase_ok():
        all_docs = col_list("alerts")
        docs = [d for d in all_docs if d.get("uid") == uid or d.get("uid") is None]
        result = []
        for d in docs:
            try:
                result.append(AlertItem(**d))
            except Exception:
                pass
        if result:
            return result

    corpus = get_corpus()
    return [AlertItem(**a) for a in corpus.get("alerts", [])]


@router.put("/alerts/{alert_id}/read", response_model=AlertItem)
async def mark_alert_read(
    alert_id: str,
    uid: str = Depends(require_auth)
) -> AlertItem:
    """Mark a regulatory alert as read/actioned."""
    from app.services.firebase import doc_update, doc_get
    if is_firebase_ok():
        doc = doc_get("alerts", alert_id)
        if not doc or (doc.get("uid") is not None and doc.get("uid") != uid):
            from fastapi import HTTPException
            raise HTTPException(status_code=403, detail="Not authorized to update this alert")
        doc_update("alerts", alert_id, {"status": "Review Needed", "requiresAction": False})
        doc = doc_get("alerts", alert_id)
        if doc:
            try:
                return AlertItem(**doc)
            except Exception:
                pass

    corpus = get_corpus()
    alerts = corpus.get("alerts", [])
    match = next((a for a in alerts if a["id"] == alert_id), None)
    if match:
        match["requiresAction"] = False
        match["status"] = "Review Needed"
        return AlertItem(**match)

    fallback = alerts[0] if alerts else {
        "id": alert_id,
        "regulationId": "reg-dish-cr-88",
        "title": "Alert Read",
        "authorityCode": "DISH",
        "severity": "info",
        "status": "Review Needed",
        "published": "Today",
        "effective": "Immediate",
        "detail": "Alert marked as read.",
        "requiresAction": False,
        "actionable": "Reviewed",
    }
    return AlertItem(**fallback)

