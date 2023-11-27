from typing import List, Optional
from pydantic import BaseModel, EmailStr, validator, HttpUrl


class Group(BaseModel):
    GroupID: str
    name: str

    class Config:
        orm_mode = True

