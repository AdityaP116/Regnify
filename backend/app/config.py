"""
Application configuration loaded from environment variables.
Uses pydantic-settings so values can come from .env, environment, or defaults.
"""

from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Firebase Admin SDK — individual fields (alternative to GOOGLE_APPLICATION_CREDENTIALS)
    firebase_project_id: str = ""
    firebase_client_email: str = ""
    firebase_private_key: str = ""

    # Path to service account JSON (takes precedence over individual fields when set)
    google_application_credentials: str = ""

    # Gemini AI
    gemini_api_key: str = ""

    # CORS / frontend origin
    frontend_url: str = "http://localhost:5173"

    # When True the backend serves seed corpus without requiring Firebase credentials
    demo_mode: bool = False

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @property
    def firebase_configured(self) -> bool:
        """True when we have enough credentials to init Firebase Admin."""
        if self.google_application_credentials:
            return True
        return bool(
            self.firebase_project_id
            and self.firebase_client_email
            and self.firebase_private_key
        )

    @property
    def gemini_configured(self) -> bool:
        return bool(self.gemini_api_key)


@lru_cache
def get_settings() -> Settings:
    return Settings()
