"""Health check router."""
from fastapi import APIRouter

router = APIRouter()


@router.get("/health", tags=["System"])
async def health():
    """Simple health check — used by the frontend to verify backend connectivity."""
    return {"status": "ok", "service": "regnify-api"}
