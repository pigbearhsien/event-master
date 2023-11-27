from typing import List, Optional
from pydantic import BaseModel, EmailStr, validator, HttpUrl

class AvailableTimeBase(BaseModel):
    Available_Start: str
    Possibility_level: str


class AvailableTimeCreate(AvailableTimeBase):
    pass


class AvailableTime(AvailableTimeBase):
    UserID: str
    EventID: str

    class Config:
        orm_mode = True