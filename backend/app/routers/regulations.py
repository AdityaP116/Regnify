"""
Regulations router

GET  /api/regulations           — list all regulations
GET  /api/regulations/domains   — domain concentration (NOTE: must be before /{id})
GET  /api/regulations/{id}      — single regulation
GET  /api/sources               — government sources
"""

from __future__ import annotations
from fastapi import APIRouter, Depends, HTTPException

from app.auth import require_auth
from app.models import DomainConcentration, GovernmentSource, Regulation
from app.services.firebase import col_list, doc_get, is_firebase_ok
from app.services.seed import get_corpus

router = APIRouter(prefix="/api", tags=["Regulations"])


def _regs_from_firestore() -> list[Regulation]:
    docs = col_list("regulations")
    result = []
    for d in docs:
        try:
            result.append(Regulation(**d))
        except Exception:
            pass
    return result


def _regs_from_seed() -> list[Regulation]:
    corpus = get_corpus()
    return [Regulation(**r) for r in corpus.get("regulations", [])]


@router.get("/regulations", response_model=list[Regulation])
async def list_regulations(uid: str = Depends(require_auth)) -> list[Regulation]:
    """Return all regulations (Firestore first, seed fallback)."""
    if is_firebase_ok():
        regs = _regs_from_firestore()
        if regs:
            return regs
    return _regs_from_seed()


@router.get("/regulations/domains", response_model=list[DomainConcentration])
async def list_domains(uid: str = Depends(require_auth)) -> list[DomainConcentration]:
    """Return domain concentration data."""
    if is_firebase_ok():
        docs = col_list("domainConcentration")
        result = []
        for d in docs:
            try:
                result.append(DomainConcentration(**d))
            except Exception:
                pass
        if result:
            return result
    corpus = get_corpus()
    return [DomainConcentration(**d) for d in corpus.get("domainConcentration", [])]


@router.get("/regulations/{reg_id}", response_model=Regulation)
async def get_regulation(reg_id: str, uid: str = Depends(require_auth)) -> Regulation:
    """Return a single regulation by ID."""
    if is_firebase_ok():
        data = doc_get("regulations", reg_id)
        if data:
            try:
                return Regulation(**data)
            except Exception:
                pass

    # Seed fallback
    corpus = get_corpus()
    regs = corpus.get("regulations", [])
    match = next((r for r in regs if r["id"] == reg_id), None)
    if match:
        return Regulation(**match)

    raise HTTPException(status_code=404, detail=f"Regulation '{reg_id}' not found.")


@router.get("/sources", response_model=list[GovernmentSource])
async def list_sources(uid: str = Depends(require_auth)) -> list[GovernmentSource]:
    """Return monitored government sources."""
    if is_firebase_ok():
        docs = col_list("governmentSources")
        result = []
        for d in docs:
            try:
                result.append(GovernmentSource(**d))
            except Exception:
                pass
        if result:
            return result
    corpus = get_corpus()
    return [GovernmentSource(**s) for s in corpus.get("governmentSources", [])]
