from typing import List, Optional
from pydantic import BaseModel, EmailStr, validator, HttpUrl
from datetime import datetime


class PrivateEvent(BaseModel):
    eventId: str
    userId: str
    eventStart: datetime
    eventEnd: datetime
    name: str
    description: Optional[str]

    class Config:
        orm_mode = True