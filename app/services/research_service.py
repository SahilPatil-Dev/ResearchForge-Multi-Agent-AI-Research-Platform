import asyncio
from datetime import datetime

from app.agents.pipeline import (
    run_research_pipeline,
)
from app.db.session import (
    AsyncSessionLocal,
)
from app.models.research import ResearchJob


async def create_research_job(
    db,
    user_id: int,
    topic: str,
):

    job = ResearchJob(
        user_id=user_id,
        topic=topic,
        status="pending",
    )

    db.add(job)

    await db.commit()

    await db.refresh(job)

    return job


async def execute_research(
    job_id: int,
    topic: str,
):

    async with AsyncSessionLocal() as db:

        job = await db.get(
            ResearchJob,
            job_id,
        )

        if not job:
            return

        try:

            job.status = "running"

            await db.commit()

            result = await asyncio.to_thread(
                run_research_pipeline,
                topic,
            )

            job.status = "completed"

            job.report = result.get(
                "report"
            )

            job.feedback = result.get(
                "feedback"
            )

            job.score = result.get(
                "score"
            )

            job.completed_at = (
                datetime.utcnow()
            )

            await db.commit()

        except Exception as exc:

            job.status = "failed"

            job.error_message = str(
                exc
            )

            await db.commit()