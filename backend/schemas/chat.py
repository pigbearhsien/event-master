from typing import List, Optional
from pydantic import BaseModel, EmailStr, validator, HttpUrl
from datetime import datetime


class Chat(BaseModel):
    groupId: str
    speakerId: str
    timing: datetime
    content: str

    class Config:
        orm_mode = True
