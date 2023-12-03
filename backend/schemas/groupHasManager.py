from typing import List, Optional
from pydantic import BaseModel, EmailStr, validator, HttpUrl


class GroupHasManager(BaseModel):
    groupId: str
    userId: str
    
    class Config:
        orm_mode = True