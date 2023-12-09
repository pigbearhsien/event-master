from typing import List, Optional
from pydantic import BaseModel, EmailStr, validator, HttpUrl
from datetime import datetime


class PrivateEvent(BaseModel):
    eventId: str
    userId: str
    eventStart: Optional[datetime]
    eventEnd: Optional[datetime]
    name: Optional[str]
    description: Optional[str]

    class Config:
        orm_mode = True