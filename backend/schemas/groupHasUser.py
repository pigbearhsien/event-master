from typing import List, Optional
from pydantic import BaseModel, EmailStr, validator, HttpUrl


class GroupHasUser(BaseModel):
    GroupID: str
    UserID: str
