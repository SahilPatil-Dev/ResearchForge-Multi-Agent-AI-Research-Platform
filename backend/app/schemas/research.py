from datetime import datetime

from pydantic import BaseModel, Field


class ResearchCreate(BaseModel):

    topic: str = Field(
        min_length=3,
        max_length=500,
    )


class ResearchResponse(BaseModel):

    id: int

    topic: str

    status: str

    error_message: str | None = None

    report: str | None = None

    feedback: str | None = None

    score: int | None = None

    created_at: datetime

    completed_at: datetime | None = None

    model_config = {
        "from_attributes": True
    }