from typing import List, Optional
from pydantic import BaseModel, EmailStr, validator, HttpUrl
from datetime import datetime

class Todo(BaseModel):
    todoId: str
    groupId: str
    assigneeId: str
    assignerId: str
    name: str
    description: str
    completed: bool
    deadline: datetime

    class Config:
        orm_mode = True