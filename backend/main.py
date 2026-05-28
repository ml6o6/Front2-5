# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .db import Base, engine
from . import models  # noqa: F401 — register models for create_all
from .routers import auth, drivers, cars, accidents, reports, stats, users


def create_app() -> FastAPI:
    app = FastAPI(
        title="Система анализа ДТП",
        version="1.0.0",
        docs_url="/api/docs",
        openapi_url="/api/openapi.json",
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    Base.metadata.create_all(bind=engine)

    api_prefix = "/api"
    app.include_router(auth.router, prefix=api_prefix)
    app.include_router(drivers.router, prefix=api_prefix)
    app.include_router(cars.router, prefix=api_prefix)
    app.include_router(accidents.router, prefix=api_prefix)
    app.include_router(reports.router, prefix=api_prefix)
    app.include_router(stats.router, prefix=api_prefix)
    app.include_router(users.router, prefix=api_prefix)

    @app.get("/api/health", tags=["health"])
    def health():
        return {"status": "ok"}

    return app


app = create_app()
