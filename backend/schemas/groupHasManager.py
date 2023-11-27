from typing import List, Optional
from pydantic import BaseModel, EmailStr, validator, HttpUrl


class GroupHasManager(BaseModel):
    GroupID: str
    UserID: str