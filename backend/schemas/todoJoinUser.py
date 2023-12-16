from typing import List, Optional
from pydantic import BaseModel, EmailStr, validator, HttpUrl
from datetime import datetime

class TodoJoinUser(BaseModel):
    todoId: str
    groupId: str
    assigneeId: str
    assigneeName: str
    assigneeAccount: str
    assigneeProfilePicUrl: str
    assignerId: str
    assignerName: str
    assignerAccount: str
    assignerProfilePicUrl: str
    name: str
    description: str
    completed: bool
    deadline: datetime

    class Config:
        orm_mode = True