from typing import List, Optional
from pydantic import BaseModel, EmailStr, validator, HttpUrl


class GroupEventBase(BaseModel):
    Event_Start: str
    Event_End: str
    Name: str
    Description: str
    Status: str
    OrganizerID: str
    Vote_Start: str
    Vote_End: str
    VoteDeadline: str
    HavePossibility: bool


class GroupEventCreate(GroupEventBase):
    pass


class GroupEvent(GroupEventBase):
    EventID: str
    GroupID: str

    class Config:
        orm_mode = True