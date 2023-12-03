from typing import List, Optional
from pydantic import BaseModel, EmailStr, validator, HttpUrl

class AvailableTime(BaseModel):
    userId: str
    eventId: str
    available_start: str
    possibilityLevel: str

    class Config:
        orm_mode = True
    

    