from typing import List, Optional
from pydantic import BaseModel, EmailStr, validator, HttpUrl


class Group(BaseModel):
    groupId: str
    name: str

    class Config:
        orm_mode = True

