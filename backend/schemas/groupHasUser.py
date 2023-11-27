from typing import List, Optional
from pydantic import BaseModel, EmailStr, validator, HttpUrl


class GroupHasUserBase(BaseModel):
    GroupID: str
    UserID: str


class GroupHasUserCreate(GroupHasUserBase):
    pass


class GroupHasUser(GroupHasUserBase):
    pass