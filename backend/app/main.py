from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.router import api_router
from app.core.config import settings
from app.db.session import engine
from app.db.init_db import init_db


@asynccontextmanager
async def lifespan(app: FastAPI):

    # --------------------------------------------------------
    # STARTUP
    # --------------------------------------------------------

    print(
        f"Starting {settings.APP_NAME}"
    )

    # Create development database tables
    await init_db(engine)

    print(
        "Database initialized successfully."
    )

    yield

    # --------------------------------------------------------
    # SHUTDOWN
    # --------------------------------------------------------

    await engine.dispose()

    print(
        "Database connection closed."
    )


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description=(
        "Multi-agent AI research platform "
        "powered by Mistral Medium 3.5."
    ),
    lifespan=lifespan,
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://turbo-telegram-g4v657v959rp2p64q-5173.app.github.dev",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================
# API ROUTES
# ============================================================

app.include_router(
    api_router,
    prefix="/api/v1",
)


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get(
    "/health",
    tags=["System"],
)
async def health():

    return {
        "status": "healthy",
        "service": settings.APP_NAME,
        "version": settings.APP_VERSION,
    }