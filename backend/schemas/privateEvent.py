from typing import List, Optional
from pydantic import BaseModel, EmailStr, validator, HttpUrl


class PrivateEvent(BaseModel):
    eventId: str
    userId: str
    eventStart: str
    eventEnd: str
    name: str
    description: str

    class Config:
        orm_mode = True