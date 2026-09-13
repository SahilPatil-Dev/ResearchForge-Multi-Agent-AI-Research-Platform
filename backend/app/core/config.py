from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):

    APP_NAME: str = "ResearchForge API"
    APP_VERSION: str = "1.0.0"

    DATABASE_URL: str

    MISTRAL_API_KEY: str
    TAVILY_API_KEY: str

    MISTRAL_MODEL: str = "codestral-2508"

    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"

    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    FRONTEND_URL: str = "http://localhost:5173"

    MAX_SEARCH_RESULTS: int = 5
    MAX_SOURCES_TO_READ: int = 3
    MAX_SCRAPED_CHARS: int = 8000
    MAX_REVISIONS: int = 1

    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True,
        extra="ignore",
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()