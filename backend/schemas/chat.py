from typing import List, Optional
from pydantic import BaseModel, EmailStr, validator, HttpUrl


class Chat(BaseModel):
    GroupID: str
    SpeakerID: str
    Timing: str
    Content: str

    class Config:
        orm_mode = True
