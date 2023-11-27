from typing import List, Optional
from pydantic import BaseModel, EmailStr, validator, HttpUrl


class TodoBase(BaseModel):
    Name: str
    Description: str
    Completed: bool
    Deadline: str


class TodoCreate(TodoBase):
    pass


class Todo(TodoBase):
    TodoID: str
    GroupID: str
    AssigneeID: str
    AssignerID: str

    class Config:
        orm_mode = True