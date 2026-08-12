from pydantic import BaseModel, EmailStr, Field


class RegisterRequest(BaseModel):

    email: EmailStr

    full_name: str = Field(
        min_length=2,
        max_length=100,
    )

    password: str = Field(
        min_length=8,
        max_length=128,
    )



class TokenResponse(BaseModel):

    access_token: str

    token_type: str = "bearer"


class UserResponse(BaseModel):

    id: int
    email: EmailStr
    full_name: str
    is_active: bool

    model_config = {
        "from_attributes": True
    }

class UserUpdateRequest(BaseModel):

    full_name: str | None = Field(
        default=None,
        min_length=2,
        max_length=100,
    )


class PasswordChangeRequest(BaseModel):

    current_password: str

    new_password: str = Field(
        min_length=8,
        max_length=128,
    )