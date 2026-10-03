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
        progress_message="Queued; waiting for the research worker.",
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
            job.progress_message = "Research worker started."

            await db.commit()

            loop = asyncio.get_running_loop()

            def publish_progress(message: str) -> None:
                asyncio.run_coroutine_threadsafe(
                    update_research_progress(job_id, message),
                    loop,
                ).result()

            result = await asyncio.to_thread(
                run_research_pipeline,
                topic,
                publish_progress,
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
            job.progress_message = "Research stopped because an error occurred."

            job.error_message = str(
                exc
            )

            await db.commit()


async def update_research_progress(
    job_id: int,
    message: str,
) -> None:
    async with AsyncSessionLocal() as db:
        job = await db.get(ResearchJob, job_id)
        if job is None:
            return
        job.progress_message = message
        await db.commit()