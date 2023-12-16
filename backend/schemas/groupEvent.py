from typing import List, Optional
from pydantic import BaseModel, EmailStr, validator, HttpUrl
from datetime import datetime


class GroupEvent(BaseModel):
    eventId: str
    groupId: str
    eventStart: Optional[datetime]
    eventEnd: Optional[datetime]
    name: str
    description: str
    status: str
    organizerId: str
    voteStart: datetime
    voteEnd: datetime
    voteDeadline: Optional[datetime]
    havePossibility: Optional[bool]

    class Config:
        orm_mode = True
