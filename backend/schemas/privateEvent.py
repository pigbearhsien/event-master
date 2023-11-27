from typing import List, Optional
from pydantic import BaseModel, EmailStr, validator, HttpUrl


class PrivateEventBase(BaseModel):
    Event_Start: str
    Event_End: str
    Name: str
    Description: str


class PrivateEventCreate(PrivateEventBase):
    pass


class PrivateEvent(PrivateEventBase):
    EventID: str
    UserID: str

    class Config:
        orm_mode = True