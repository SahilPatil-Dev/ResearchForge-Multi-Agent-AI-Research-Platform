from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import (
    create_access_token,
    hash_password,
    verify_password,
)
from app.models.user import User
from app.schemas.auth import (
    RegisterRequest,
)


async def register_user(
    db: AsyncSession,
    data: RegisterRequest,
) -> User:

    result = await db.execute(
        select(User).where(
            User.email == data.email
        )
    )

    existing_user = (
        result.scalar_one_or_none()
    )

    if existing_user:
        raise ValueError(
            "Email already registered"
        )

    user = User(
        email=data.email,
        full_name=data.full_name,
        hashed_password=hash_password(
            data.password
        ),
    )

    db.add(user)

    await db.commit()

    await db.refresh(user)

    return user


async def authenticate_user(
    db: AsyncSession,
    email: str,
    password: str,
) -> User | None:

    result = await db.execute(
        select(User).where(
            User.email == email
        )
    )

    user = result.scalar_one_or_none()

    if not user:
        return None

    if not verify_password(
        password,
        user.hashed_password,
    ):
        return None

    return user


def create_user_token(
    user: User,
) -> str:

    return create_access_token(
        user.id
    )