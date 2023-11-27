from typing import List, Optional
from pydantic import BaseModel, EmailStr, validator, HttpUrl


class UserBase(BaseModel):
    Name: str
    Account: str
    Password: str
    Profile_pid_url: Optional[HttpUrl]

class UserCreate(UserBase):
    pass

class User(UserBase):
    UserID: str

    class Config:
        orm_mode = True