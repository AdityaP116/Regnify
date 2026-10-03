"""
Firebase Admin SDK initialisation and Firestore helper utilities.

Design:
- Firebase Admin is initialised once (lazy, thread-safe via module-level guard).
- When Firebase credentials are absent the module degrades gracefully so the
  backend can still serve seed data without crashing.
- All Firestore reads/writes go through the helpers below so callers never
  touch the SDK directly.
"""

from __future__ import annotations
import json
import logging
import os
from pathlib import Path
from typing import Any

import firebase_admin
from firebase_admin import credentials, firestore, auth as fb_auth
from google.cloud.firestore_v1 import Client

from app.config import get_settings

logger = logging.getLogger(__name__)

_db: Client | None = None
_firebase_ok = False


def _init_firebase() -> bool:
    """Attempt to initialise Firebase Admin SDK. Returns True on success."""
    global _db, _firebase_ok

    if firebase_admin._apps:  # already initialised
        _db = firestore.client()
        _firebase_ok = True
        return True

    settings = get_settings()

    try:
        # Prefer GOOGLE_APPLICATION_CREDENTIALS path
        if settings.google_application_credentials and Path(
            settings.google_application_credentials
        ).exists():
            cred = credentials.Certificate(settings.google_application_credentials)
        elif settings.firebase_project_id and settings.firebase_client_email and settings.firebase_private_key:
            # Build credential dict from individual env vars
            private_key = settings.firebase_private_key.replace("\\n", "\n")
            cred = credentials.Certificate(
                {
                    "type": "service_account",
                    "project_id": settings.firebase_project_id,
                    "client_email": settings.firebase_client_email,
                    "private_key": private_key,
                    "token_uri": "https://oauth2.googleapis.com/token",
                }
            )
        else:
            logger.warning(
                "[firebase] No credentials found — running in demo/seed mode."
            )
            return False

        firebase_admin.initialize_app(cred)
        _db = firestore.client()
        _firebase_ok = True
        logger.info("[firebase] Admin SDK initialised successfully.")
        return True

    except Exception as exc:
        logger.warning("[firebase] Init failed (%s) — demo/seed mode active.", exc)
        return False


# Initialise on import
_firebase_ok = _init_firebase()


def is_firebase_ok() -> bool:
    return _firebase_ok


def get_db() -> Client | None:
    return _db


# ─── Auth ─────────────────────────────────────────────────────────────────────

def verify_id_token(token: str) -> dict[str, Any]:
    """
    Verify a Firebase ID token and return the decoded claims dict.
    Raises firebase_admin.auth.InvalidIdTokenError on failure.
    """
    return fb_auth.verify_id_token(token)


# ─── Firestore helpers ────────────────────────────────────────────────────────

def col_list(collection: str) -> list[dict[str, Any]]:
    """Return all documents in *collection* as plain dicts."""
    if not _firebase_ok or _db is None:
        return []
    try:
        docs = _db.collection(collection).stream()
        return [{"id": d.id, **d.to_dict()} for d in docs]
    except Exception as exc:
        logger.error("[firestore] col_list(%s) failed: %s", collection, exc)
        return []


def doc_get(collection: str, doc_id: str) -> dict[str, Any] | None:
    """Return a single document or None if not found."""
    if not _firebase_ok or _db is None:
        return None
    try:
        doc = _db.collection(collection).document(doc_id).get()
        if doc.exists:
            return {"id": doc.id, **doc.to_dict()}
        return None
    except Exception as exc:
        logger.error("[firestore] doc_get(%s/%s) failed: %s", collection, doc_id, exc)
        return None


def doc_set(collection: str, doc_id: str, data: dict[str, Any]) -> bool:
    """Create or overwrite a document. Returns True on success."""
    if not _firebase_ok or _db is None:
        return False
    try:
        _db.collection(collection).document(doc_id).set(data)
        return True
    except Exception as exc:
        logger.error("[firestore] doc_set(%s/%s) failed: %s", collection, doc_id, exc)
        return False


def doc_update(collection: str, doc_id: str, data: dict[str, Any]) -> bool:
    """Merge-update a document. Returns True on success."""
    if not _firebase_ok or _db is None:
        return False
    try:
        _db.collection(collection).document(doc_id).update(data)
        return True
    except Exception as exc:
        logger.error(
            "[firestore] doc_update(%s/%s) failed: %s", collection, doc_id, exc
        )
        return False


def col_query(
    collection: str,
    field: str,
    op: str,
    value: Any,
) -> list[dict[str, Any]]:
    """Simple single-field query."""
    if not _firebase_ok or _db is None:
        return []
    try:
        docs = _db.collection(collection).where(field, op, value).stream()
        return [{"id": d.id, **d.to_dict()} for d in docs]
    except Exception as exc:
        logger.error("[firestore] col_query(%s) failed: %s", collection, exc)
        return []
