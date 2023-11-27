from typing import List, Optional
from pydantic import BaseModel, EmailStr, validator, HttpUrl


class Todo(BaseModel):
    TodoID: str
    GroupID: str
    AssigneeID: str
    AssignerID: str
    Name: str
    Description: str
    Completed: bool
    Deadline: str

    class Config:
        orm_mode = True