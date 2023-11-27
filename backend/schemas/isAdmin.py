from typing import List, Optional
from pydantic import BaseModel, EmailStr, validator, HttpUrl


class IsAdmin(BaseModel):
    UserID: str

