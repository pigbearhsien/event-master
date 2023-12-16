from typing import List, Optional
from pydantic import BaseModel, EmailStr, validator, HttpUrl
from datetime import datetime


class PrivateEvent(BaseModel):
    eventid: str
    userid: str
    event_start: datetime
    event_end: datetime
    name: str
    description: Optional[str]

    class Config:
        orm_mode = True