from sqlalchemy.ext.asyncio import AsyncEngine

from app.db.base import Base

from app.models.user import User
from app.models.research import ResearchJob


async def init_db(engine: AsyncEngine) -> None:
    async with engine.begin() as conn:
        await conn.run_sync(
            Base.metadata.create_all
        )