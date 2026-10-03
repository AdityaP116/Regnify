"""
Seed service — loads backend/app/data/seed_corpus.json into Firestore on startup.

Collections populated:
  businessProfile  → businesses/{id}
  governmentSources → governmentSources/{id}
  regulations      → regulations/{id}
  alerts           → alerts/{id}
  complianceTasks  → complianceTasks/{id}
  domainConcentration → domainConcentration/{id}
  calendarDeadlines → calendarDeadlines/{id}
  notifications    → notifications/{id}
  dashboardSnapshot → dashboardSnapshot/{id}
  aiResponse       → aiSessions/{id}

The seed write is idempotent — it uses set() not create(), so re-running is safe.
"""

from __future__ import annotations
import json
import logging
from pathlib import Path

from app.services.firebase import doc_set, is_firebase_ok

logger = logging.getLogger(__name__)

SEED_PATH = Path(__file__).parent.parent / "data" / "seed_corpus.json"

# Mapping: JSON key → (Firestore collection name, id_field)
COLLECTION_MAP = {
    "governmentSources": ("governmentSources", "id"),
    "regulations": ("regulations", "id"),
    "alerts": ("alerts", "id"),
    "complianceTasks": ("complianceTasks", "id"),
    "domainConcentration": ("domainConcentration", "id"),
    "calendarDeadlines": ("calendarDeadlines", "id"),
    "notifications": ("notifications", "id"),
}


def load_seed() -> dict:
    """Load and return the seed corpus JSON."""
    with open(SEED_PATH, encoding="utf-8") as f:
        return json.load(f)


_corpus: dict | None = None


def get_corpus() -> dict:
    """Return the cached seed corpus, loading it on first call."""
    global _corpus
    if _corpus is None:
        _corpus = load_seed()
    return _corpus


def seed_firestore() -> None:
    """
    Write the seed corpus to Firestore if Firebase is configured.
    Safe to call multiple times — uses set() which is idempotent.
    """
    if not is_firebase_ok():
        logger.info("[seed] Firebase not configured — skipping Firestore seed.")
        return

    corpus = get_corpus()

    # Business profile (single document)
    bp = corpus.get("businessProfile", {})
    if bp:
        doc_set("businesses", bp["id"], bp)
        logger.info("[seed] Wrote businessProfile → businesses/%s", bp["id"])

    # Dashboard snapshot (keyed by business id)
    ds = corpus.get("dashboardSnapshot", {})
    if ds:
        doc_set("dashboardSnapshot", bp.get("id", "default"), ds)
        logger.info("[seed] Wrote dashboardSnapshot")

    # AI response session
    ai = corpus.get("aiResponse", {})
    if ai:
        doc_set("aiSessions", ai.get("id", "ai-session-001"), ai)
        logger.info("[seed] Wrote aiResponse → aiSessions/%s", ai.get("id"))

    # List collections
    for json_key, (collection, id_field) in COLLECTION_MAP.items():
        items = corpus.get(json_key, [])
        for item in items:
            doc_id = item.get(id_field, item.get("id"))
            if doc_id:
                doc_set(collection, doc_id, item)
        logger.info("[seed] Wrote %d docs → %s", len(items), collection)

    logger.info("[seed] Firestore seed complete.")
