"""Runtime configuration. Pulled from env so the same image runs in dev/prod."""
from __future__ import annotations

import os
from dataclasses import dataclass


@dataclass(frozen=True)
class Settings:
    cors_origins: tuple[str, ...]
    bot_token: str | None
    environment: str

    @classmethod
    def from_env(cls) -> "Settings":
        raw_origins = os.getenv(
            "CORS_ORIGINS",
            "http://localhost:5173,https://web.telegram.org",
        )
        origins = tuple(o.strip() for o in raw_origins.split(",") if o.strip())
        return cls(
            cors_origins=origins,
            bot_token=os.getenv("BOT_TOKEN"),
            environment=os.getenv("ENVIRONMENT", "development"),
        )


settings = Settings.from_env()
