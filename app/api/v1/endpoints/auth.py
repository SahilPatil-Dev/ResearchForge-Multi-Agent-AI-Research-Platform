from typing import Annotated

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)

from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.auth import (
    LoginRequest,
    RegisterRequest,
    TokenResponse,
    UserResponse,
)
from app.services.auth_service import (
    authenticate_user,
    create_user_token,
    register_user,
)


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
async def register(
    data: RegisterRequest,

    db: Annotated[
        AsyncSession,
        Depends(get_db),
    ],
):

    try:

        user = await register_user(
            db,
            data,
        )

        return user

    except ValueError as exc:

        raise HTTPException(
            status_code=409,
            detail=str(exc),
        )


@router.post(
    "/login",
    response_model=TokenResponse,
)
async def login(
    data: LoginRequest,

    db: Annotated[
        AsyncSession,
        Depends(get_db),
    ],
):

    user = await authenticate_user(
        db,
        data.email,
        data.password,
    )

    if not user:

        raise HTTPException(
            status_code=401,
            detail="Incorrect email or password",
            headers={
                "WWW-Authenticate": "Bearer"
            },
        )

    token = create_user_token(
        user
    )

    return TokenResponse(
        access_token=token,
        token_type="bearer",
    )


@router.get(
    "/me",
    response_model=UserResponse,
)
async def get_current_user_profile(
    current_user: Annotated[
        User,
        Depends(get_current_user),
    ],
):

    return current_user