from typing import List, Optional
from pydantic import BaseModel, EmailStr, validator, HttpUrl


class GroupHasUser(BaseModel):
    groupId: str
    userId: str
    userName: str
    class Config:
        orm_mode = True