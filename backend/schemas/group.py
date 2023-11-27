from typing import List, Optional
from pydantic import BaseModel, EmailStr, validator, HttpUrl


class GroupBase(BaseModel):
    name: str


class GroupCreate(GroupBase):
    pass


class Group(GroupBase):
    GroupID: str

    class Config:
        orm_mode = True
