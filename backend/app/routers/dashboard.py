"""
Dashboard router — GET /api/dashboard

Returns the DashboardSnapshot for the authenticated user's business.
Falls back to seed corpus when Firebase is not configured.
"""

from __future__ import annotations
from fastapi import APIRouter, Depends

from app.auth import require_auth
from app.models import DashboardSnapshot
from app.services.firebase import col_query, is_firebase_ok
from app.services.seed import get_corpus

router = APIRouter(prefix="/api", tags=["Dashboard"])


@router.get("/dashboard", response_model=DashboardSnapshot)
async def get_dashboard(uid: str = Depends(require_auth)) -> DashboardSnapshot:
    """Return the compliance dashboard snapshot for the current user."""
    corpus = get_corpus()
    base_snapshot = dict(corpus["dashboardSnapshot"])

    # Fetch user name if available
    user_name = "Elena"
    if is_firebase_ok():
        from app.services.firebase import doc_get
        user_doc = doc_get("users", uid)
        business_id = "default"
        if user_doc:
            if user_doc.get("name"):
                user_name = user_doc["name"].split()[0]
                base_snapshot["greetingName"] = user_name
            business_id = user_doc.get("businessId", "default")

        doc = doc_get("dashboardSnapshot", business_id)
        if doc:
            data = dict(doc)
            data["greetingName"] = user_name
            try:
                return DashboardSnapshot(**data)
            except Exception:
                pass

    return DashboardSnapshot(**base_snapshot)

