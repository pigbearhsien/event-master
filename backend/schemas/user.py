from typing import List, Optional
from pydantic import BaseModel, EmailStr, validator, HttpUrl

class User(BaseModel):
    UserID: str
    Name: str
    Account: str
    Password: str
    Profile_pid_url: Optional[HttpUrl]

    class Config:
        orm_mode = True

    