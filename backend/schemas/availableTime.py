from typing import List, Optional
from pydantic import BaseModel, EmailStr, validator, HttpUrl
from datetime import datetime
class AvailableTime(BaseModel):
    userId: str
    eventId: str
    availableStart: datetime
    possibilityLevel: Optional[str]

    class Config:
        orm_mode = True
