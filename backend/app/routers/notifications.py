"""Notifications router — GET /api/notifications"""

from __future__ import annotations
from fastapi import APIRouter, Depends

from app.auth import require_auth
from app.models import NotificationItem
from app.services.firebase import col_list, col_query, is_firebase_ok
from app.services.seed import get_corpus

router = APIRouter(prefix="/api", tags=["Notifications"])


@router.get("/notifications", response_model=list[NotificationItem])
async def list_notifications(uid: str = Depends(require_auth)) -> list[NotificationItem]:
    """Return notifications for the current user."""
    if is_firebase_ok():
        docs = col_query("notifications", "uid", "==", uid)
        if not docs:
            docs = col_list("notifications")
        result = []
        for d in docs:
            try:
                result.append(NotificationItem(**d))
            except Exception:
                pass
        if result:
            return result

    corpus = get_corpus()
    return [NotificationItem(**n) for n in corpus.get("notifications", [])]


@router.put("/notifications/{notification_id}/read", response_model=NotificationItem)
async def mark_notification_read(
    notification_id: str,
    uid: str = Depends(require_auth)
) -> NotificationItem:
    """Mark a notification as read."""
    from app.services.firebase import doc_update, doc_get
    if is_firebase_ok():
        doc_update("notifications", notification_id, {"read": True})
        doc = doc_get("notifications", notification_id)
        if doc:
            try:
                return NotificationItem(**doc)
            except Exception:
                pass

    corpus = get_corpus()
    notes = corpus.get("notifications", [])
    match = next((n for n in notes if n["id"] == notification_id), None)
    if match:
        match["read"] = True
        return NotificationItem(**match)

    fallback = {
        "id": notification_id,
        "title": "Notification Read",
        "body": "Notification marked as read.",
        "category": "system",
        "timestamp": "Just now",
        "read": True,
    }
    return NotificationItem(**fallback)

