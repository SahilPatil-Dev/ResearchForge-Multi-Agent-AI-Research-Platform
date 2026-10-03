from sqlalchemy import inspect, text
from sqlalchemy.ext.asyncio import AsyncEngine

from app.db.base import Base

from app.models.user import User
from app.models.research import ResearchJob


async def init_db(engine: AsyncEngine) -> None:
    async with engine.begin() as conn:
        await conn.run_sync(
            Base.metadata.create_all
        )
        columns = await conn.run_sync(
            lambda sync_conn: {
                column["name"]
                for column in inspect(sync_conn).get_columns(
                    "research_jobs"
                )
            }
        )
        if "progress_message" not in columns:
            await conn.execute(
                text(
                    "ALTER TABLE research_jobs "
                    "ADD COLUMN progress_message TEXT"
                )
            )