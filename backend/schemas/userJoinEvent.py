from typing import List, Optional
from pydantic import BaseModel, EmailStr, validator, HttpUrl


class UserJoinEventBase(BaseModel):
    IsAccepted: bool


class UserJoinEventCreate(UserJoinEventBase):
    pass


class UserJoinEvent(UserJoinEventBase):
    UserID: str
    EventID: str

    class Config:
        orm_mode = True