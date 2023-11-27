from typing import List, Optional
from pydantic import BaseModel, EmailStr, validator, HttpUrl


class GroupEvent(BaseModel):
    EventID: str
    GroupID: str
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

    class Config:
        orm_mode = True
