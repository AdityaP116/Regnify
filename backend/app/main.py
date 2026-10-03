"""
Regnify FastAPI backend — main application entry point.

Start with:
    uvicorn app.main:app --reload --port 8000

The backend serves all /api/* routes used by the React frontend.
It initialises Firebase Admin and seeds Firestore on startup.
When credentials are absent it operates in seed/demo mode, returning
the deterministic corpus so the frontend always has a working data path.
"""

import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.routers import health, dashboard, regulations, alerts, compliance, calendar, business, notifications, ai, user
from app.services.seed import seed_firestore

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)

settings = get_settings()

app = FastAPI(
    title="Regnify API",
    description=(
        "AI-powered regulatory intelligence and compliance monitoring backend. "
        "All /api/* endpoints consumed by the Regnify React frontend."
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# ─── CORS ─────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.frontend_url,
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Routers ─────────────────────────────────────────────────────────────────
app.include_router(health.router)
app.include_router(user.router)
app.include_router(dashboard.router)
app.include_router(regulations.router)
app.include_router(alerts.router)
app.include_router(compliance.router)
app.include_router(calendar.router)
app.include_router(business.router)
app.include_router(notifications.router)
app.include_router(ai.router)



# ─── Startup ─────────────────────────────────────────────────────────────────
@app.on_event("startup")
async def startup_event() -> None:
    logger.info("Regnify API starting up…")
    logger.info(
        "Firebase configured: %s | Gemini configured: %s | Demo mode: %s",
        settings.firebase_configured,
        settings.gemini_configured,
        settings.demo_mode,
    )
    # Seed Firestore with the corpus on startup (idempotent)
    seed_firestore()
    logger.info("Regnify API ready. Swagger: http://localhost:8000/docs")
