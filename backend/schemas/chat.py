from typing import List, Optional
from pydantic import BaseModel, EmailStr, validator, HttpUrl


class ChatBase(BaseModel):
    Timing: str
    Content: str


class ChatCreate(ChatBase):
    pass


class Chat(ChatBase):
    GroupID: str
    SpeakerID: str

    class Config:
        orm_mode = True
