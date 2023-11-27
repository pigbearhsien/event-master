from typing import List, Optional
from pydantic import BaseModel, EmailStr, validator, HttpUrl

class AvailableTime(BaseModel):
    UserID: str
    EventID: str
    Available_Start: str
    Possibility_level: str

    class Config:
        orm_mode = True
    

    