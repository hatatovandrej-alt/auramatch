"""FastAPI entry point."""
from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import compatibility, health, matrix
from app.core.config import settings


def create_app() -> FastAPI:
    app = FastAPI(
        title="AuraMatch API",
        description="Destiny Matrix calculations and compatibility analysis.",
        version="0.1.0",
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=list(settings.cors_origins),
        allow_credentials=True,
        allow_methods=["GET", "POST", "OPTIONS"],
        allow_headers=["*"],
    )

    app.include_router(health.router)
    app.include_router(matrix.router)
    app.include_router(compatibility.router)
    return app


app = create_app()
