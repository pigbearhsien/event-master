from typing import List, Optional
from pydantic import BaseModel, EmailStr, validator, HttpUrl


class PrivateEvent(BaseModel):
    EventID: str
    UserID: str
    Event_Start: str
    Event_End: str
    Name: str
    Description: str

    class Config:
        orm_mode = True