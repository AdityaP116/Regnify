"""
User Profile router

GET /api/user-profile — return profile for the authenticated user
PUT /api/user-profile — update profile for the authenticated user
"""

from __future__ import annotations
from fastapi import APIRouter, Depends

from app.auth import require_auth
from app.models import UpdateUserProfileRequest, UserProfile
from app.services.firebase import doc_get, doc_set, is_firebase_ok

router = APIRouter(prefix="/api", tags=["User"])


def _initials_of(name: str) -> str:
    parts = [p for p in name.strip().split() if p]
    if not parts:
        return "EV"
    if len(parts) == 1:
        return parts[0][:2].upper()
    return (parts[0][0] + parts[-1][0]).upper()


@router.get("/user-profile", response_model=UserProfile)
async def get_user_profile(uid: str = Depends(require_auth)) -> UserProfile:
    """Return the user profile for the current authenticated user."""
    if is_firebase_ok():
        doc = doc_get("users", uid)
        if doc:
            try:
                return UserProfile(**doc)
            except Exception:
                pass

    # Default profile construction for uid
    default_profile = UserProfile(
        uid=uid,
        name="Elena Vance",
        email="elena.vance@precisionfab.in",
        role="Compliance Lead",
        initials="EV",
        provider="password",
        businessId="biz-precision-fab-pune",
        onboarded=True,
    )

    if is_firebase_ok():
        doc_set("users", uid, default_profile.model_dump())

    return default_profile


@router.put("/user-profile", response_model=UserProfile)
async def update_user_profile(
    payload: UpdateUserProfileRequest,
    uid: str = Depends(require_auth),
) -> UserProfile:
    """Update the user profile for the current user."""
    current = await get_user_profile(uid=uid)
    updated_dict = current.model_dump()

    if payload.name is not None:
        updated_dict["name"] = payload.name
        updated_dict["initials"] = _initials_of(payload.name)
    if payload.email is not None:
        updated_dict["email"] = payload.email
    if payload.role is not None:
        updated_dict["role"] = payload.role
    if payload.businessId is not None:
        updated_dict["businessId"] = payload.businessId
    if payload.onboarded is not None:
        updated_dict["onboarded"] = payload.onboarded

    updated_profile = UserProfile(**updated_dict)

    if is_firebase_ok():
        doc_set("users", uid, updated_profile.model_dump())

    return updated_profile
