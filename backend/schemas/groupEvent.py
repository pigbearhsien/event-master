from typing import List, Optional
from pydantic import BaseModel, EmailStr, validator, HttpUrl


class GroupEvent(BaseModel):
    eventId: str
    groupId: str
    eventStart: str
    eventEnd: str
    name: str
    description: str
    status: str
    organizerId: str
    voteStart: str
    voteEnd: str
    voteDeadline: str
    havePossibility: bool

    class Config:
        orm_mode = True
