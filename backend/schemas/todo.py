from typing import List, Optional
from pydantic import BaseModel, EmailStr, validator, HttpUrl


class Todo(BaseModel):
    todoId: str
    groupId: str
    assigneeId: str
    assignerId: str
    name: str
    description: str
    completed: bool
    deadline: str

    class Config:
        orm_mode = True