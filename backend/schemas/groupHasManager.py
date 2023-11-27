from typing import List, Optional
from pydantic import BaseModel, EmailStr, validator, HttpUrl


class GroupHasManagerBase(BaseModel):
    GroupID: str
    UserID: str


class GroupHasManagerCreate(GroupHasManagerBase):
    pass


class GroupHasManager(GroupHasManagerBase):
    pass