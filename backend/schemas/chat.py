from typing import List, Optional
from pydantic import BaseModel, EmailStr, validator, HttpUrl


class Chat(BaseModel):
    groupId: str
    speakerId: str
    timing: str
    content: str

    class Config:
        orm_mode = True
