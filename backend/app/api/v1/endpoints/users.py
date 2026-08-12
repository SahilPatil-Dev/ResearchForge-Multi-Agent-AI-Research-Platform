from typing import Annotated

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.core.security import hash_password
from app.db.session import get_db
from app.models.user import User
from app.schemas.auth import UserResponse


router = APIRouter(
    prefix="/users",
    tags=["Users"],
)


# ============================================================
# CURRENT USER
# ============================================================

@router.get(
    "/me",
    response_model=UserResponse,
)
async def get_my_profile(
    current_user: Annotated[
        User,
        Depends(get_current_user),
    ],
):

    return current_user


# ============================================================
# UPDATE CURRENT USER
# ============================================================

@router.patch(
    "/me",
    response_model=UserResponse,
)
async def update_my_profile(
    full_name: str | None = None,

    current_user: Annotated[
        User,
        Depends(get_current_user),
    ] = None,

    db: AsyncSession = Depends(
        get_db
    ),
):

    if full_name is not None:

        full_name = full_name.strip()

        if len(full_name) < 2:

            raise HTTPException(
                status_code=400,
                detail=(
                    "Full name must contain "
                    "at least 2 characters."
                ),
            )

        current_user.full_name = (
            full_name
        )

    await db.commit()

    await db.refresh(
        current_user
    )

    return current_user


# ============================================================
# CHANGE PASSWORD
# ============================================================

@router.patch(
    "/me/password",
)
async def change_password(
    current_password: str,
    new_password: str,

    current_user: Annotated[
        User,
        Depends(get_current_user),
    ],

    db: Annotated[
        AsyncSession,
        Depends(get_db),
    ],
):

    from app.core.security import (
        verify_password,
    )

    if not verify_password(
        current_password,
        current_user.hashed_password,
    ):

        raise HTTPException(
            status_code=400,
            detail="Current password is incorrect.",
        )

    if len(new_password) < 8:

        raise HTTPException(
            status_code=400,
            detail=(
                "New password must contain "
                "at least 8 characters."
            ),
        )

    current_user.hashed_password = (
        hash_password(
            new_password
        )
    )

    await db.commit()

    return {
        "message": "Password updated successfully."
    }