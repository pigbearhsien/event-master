from typing import List, Optional
from pydantic import BaseModel, EmailStr, validator, HttpUrl


class UserJoinEvent(BaseModel):
    UserID: str
    EventID: str
    IsAccepted: bool

    class Config:
        orm_mode = True