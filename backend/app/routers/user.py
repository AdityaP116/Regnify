"""
User Profile router

GET /api/user-profile — return profile for the authenticated user
PUT /api/user-profile — update profile for the authenticated user
"""

from __future__ import annotations
from fastapi import APIRouter, Depends

from app.auth import require_auth_token
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
async def get_user_profile(token: dict = Depends(require_auth_token)) -> UserProfile:
    """Return the user profile for the current authenticated user."""
    uid = str(token.get("uid", ""))
    if is_firebase_ok():
        doc = doc_get("users", uid)
        if doc:
            try:
                return UserProfile(**doc)
            except Exception:
                pass

    # Default profile construction for uid
    name = token.get("name") or "Elena Vance"
    email = token.get("email") or "elena.vance@precisionfab.in"
    
    default_profile = UserProfile(
        uid=uid,
        name=name,
        email=email,
        role="Compliance Lead",
        initials=_initials_of(name),
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
    token: dict = Depends(require_auth_token),
) -> UserProfile:
    """Update the user profile for the current user."""
    uid = str(token.get("uid", ""))
    current = await get_user_profile(token=token)
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
