"""
Firebase token verification dependency for FastAPI.

Usage:
    @router.get("/protected")
    async def protected(uid: str = Depends(require_auth)):
        ...

When Firebase is not configured (demo mode), the dependency resolves to
a fixed demo UID so protected routes remain reachable during development.
"""

from __future__ import annotations
import logging

from fastapi import Depends, Header, HTTPException, status
from firebase_admin.auth import InvalidIdTokenError

from app.services.firebase import is_firebase_ok, verify_id_token

logger = logging.getLogger(__name__)

DEMO_UID = "demo-user-001"


async def require_auth(authorization: str | None = Header(default=None)) -> str:
    """
    Extract and verify the Firebase Bearer token.
    Returns the verified uid on success.
    Raises HTTP 401 if the token is missing/invalid (and Firebase is configured).
    In demo mode (Firebase unconfigured) returns DEMO_UID unconditionally.
    """
    if not is_firebase_ok():
        # Demo / seed-only mode — accept any request
        return DEMO_UID

    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or malformed Authorization header.",
        )

    token = authorization[7:]  # strip "Bearer "
    try:
        decoded = verify_id_token(token)
        return decoded["uid"]
    except InvalidIdTokenError as exc:
        logger.warning("[auth] Invalid token: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired Firebase token.",
        )
    except Exception as exc:
        logger.error("[auth] Token verification error: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token verification failed.",
        )


# Alias for routes that are optionally authenticated
optional_auth = require_auth
