"""
Business Profile router

GET /api/business-profile — return profile for the authenticated user
"""

from __future__ import annotations
from fastapi import APIRouter, Depends

from app.auth import require_auth
from app.models import BusinessProfile
from app.services.firebase import col_query, is_firebase_ok
from app.services.seed import get_corpus

router = APIRouter(prefix="/api", tags=["Business"])


@router.get("/business-profile", response_model=BusinessProfile)
async def get_business_profile(uid: str = Depends(require_auth)) -> BusinessProfile:
    """Return the business profile for the current user."""
    if is_firebase_ok():
        # Try user-linked business first
        user_docs = col_query("users", "uid", "==", uid)
        if user_docs:
            business_id = user_docs[0].get("businessId", "")
            if business_id:
                biz_docs = col_query("businesses", "id", "==", business_id)
                if biz_docs:
                    try:
                        return BusinessProfile(**biz_docs[0])
                    except Exception:
                        pass

        # Fall back to first business in Firestore
        from app.services.firebase import col_list
        docs = col_list("businesses")
        if docs:
            try:
                return BusinessProfile(**docs[0])
            except Exception:
                pass

    corpus = get_corpus()
    return BusinessProfile(**corpus["businessProfile"])


@router.put("/business-profile", response_model=BusinessProfile)
async def update_business_profile(
    profile: BusinessProfile,
    uid: str = Depends(require_auth)
) -> BusinessProfile:
    """Update the business profile for the current user."""
    from app.services.firebase import doc_set
    
    if is_firebase_ok():
        # Update the business profile
        doc_set("businesses", profile.id, profile.model_dump())
        
        # Ensure the user document is linked to this business
        user_docs = col_query("users", "uid", "==", uid)
        if user_docs:
            user_doc = user_docs[0]
            if user_doc.get("businessId") != profile.id:
                user_doc["businessId"] = profile.id
                doc_set("users", uid, user_doc)
        else:
            # Create a basic user doc if it doesn't exist
            doc_set("users", uid, {"uid": uid, "businessId": profile.id})
            
    return profile
