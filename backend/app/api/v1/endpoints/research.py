import asyncio
import json
from typing import Annotated

from fastapi import (
    APIRouter,
    BackgroundTasks,
    Depends,
    HTTPException,
    status,
)
from fastapi.responses import StreamingResponse

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.db.session import AsyncSessionLocal, get_db
from app.models.research import ResearchJob
from app.models.user import User
from app.schemas.research import (
    ResearchCreate,
    ResearchResponse,
)
from app.services.research_service import (
    create_research_job,
    execute_research,
)


router = APIRouter(
    prefix="/research",
    tags=["Research"],
)


@router.get("/{research_id}/events")
async def stream_research_events(
    research_id: int,
    current_user: Annotated[
        User,
        Depends(get_current_user),
    ],
    db: Annotated[
        AsyncSession,
        Depends(get_db),
    ],
):
    result = await db.execute(
        select(ResearchJob).where(
            ResearchJob.id == research_id,
            ResearchJob.user_id == current_user.id,
        )
    )
    if result.scalar_one_or_none() is None:
        raise HTTPException(
            status_code=404,
            detail="Research not found",
        )
    await db.close()

    async def events():
        previous: tuple[str, str | None] | None = None
        last_heartbeat = 0.0
        while True:
            async with AsyncSessionLocal() as event_db:
                job = await event_db.get(
                    ResearchJob,
                    research_id,
                )
                if job is None:
                    return
                snapshot = (job.status, job.progress_message)

            if snapshot != previous:
                yield f"data: {json.dumps({'status': snapshot[0], 'progress_message': snapshot[1]})}\n\n"
                previous = snapshot
                last_heartbeat = asyncio.get_running_loop().time()
            elif (
                asyncio.get_running_loop().time() - last_heartbeat
                >= 15
            ):
                yield ": keep-alive\n\n"
                last_heartbeat = asyncio.get_running_loop().time()

            if snapshot[0] in {"completed", "failed"}:
                return

            await asyncio.sleep(1)

    return StreamingResponse(
        events(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )


@router.post(
    "",
    response_model=ResearchResponse,
    status_code=status.HTTP_202_ACCEPTED,
)
async def create_research(
    data: ResearchCreate,

    background_tasks: BackgroundTasks,

    current_user: Annotated[
        User,
        Depends(get_current_user),
    ],

    db: Annotated[
        AsyncSession,
        Depends(get_db),
    ],
):

    job = await create_research_job(
        db=db,
        user_id=current_user.id,
        topic=data.topic,
    )

    background_tasks.add_task(
        execute_research,
        job.id,
        job.topic,
    )

    return job


@router.get(
    "",
    response_model=list[ResearchResponse],
)
async def list_research(
    current_user: Annotated[
        User,
        Depends(get_current_user),
    ],

    db: Annotated[
        AsyncSession,
        Depends(get_db),
    ],
):

    result = await db.execute(
        select(ResearchJob)
        .where(
            ResearchJob.user_id
            == current_user.id
        )
        .order_by(
            ResearchJob.created_at.desc()
        )
    )

    return result.scalars().all()


@router.get(
    "/{research_id}",
    response_model=ResearchResponse,
)
async def get_research(
    research_id: int,

    current_user: Annotated[
        User,
        Depends(get_current_user),
    ],

    db: Annotated[
        AsyncSession,
        Depends(get_db),
    ],
):

    result = await db.execute(
        select(ResearchJob).where(
            ResearchJob.id == research_id,
            ResearchJob.user_id
            == current_user.id,
        )
    )

    research = (
        result.scalar_one_or_none()
    )

    if not research:

        raise HTTPException(
            status_code=404,
            detail="Research not found",
        )

    return research


@router.delete(
    "/{research_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_research(
    research_id: int,

    current_user: Annotated[
        User,
        Depends(get_current_user),
    ],

    db: Annotated[
        AsyncSession,
        Depends(get_db),
    ],
):

    result = await db.execute(
        select(ResearchJob).where(
            ResearchJob.id == research_id,
            ResearchJob.user_id
            == current_user.id,
        )
    )

    research = (
        result.scalar_one_or_none()
    )

    if not research:

        raise HTTPException(
            status_code=404,
            detail="Research not found",
        )

    await db.delete(
        research
    )

    await db.commit()