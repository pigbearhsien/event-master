from sqlalchemy import Column, String, Text, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from database import Base

class Todo(Base):
    __tablename__ = 'todo'
    __table_args__ = {'schema': 'public'}
    TodoID = Column(String(10), primary_key=True)
    GroupID = Column(String(10), ForeignKey('group.GroupID'), nullable=False)
    AssigneeID = Column(String(10), ForeignKey('user.UserID'), nullable=False)
    AssignerID = Column(String(10), ForeignKey('user.UserID'), nullable=False)
    Name = Column(String(20), nullable=False)
    Description = Column(Text, nullable=False)
    Completed = Column(Boolean, nullable=False)
    Deadline = Column(DateTime, nullable=False)
    group = relationship("Group", back_populates="todos")
    assignee = relationship("User", foreign_keys=[AssigneeID], back_populates="assigned_todos")
    assigner = relationship("User", foreign_keys=[AssignerID], back_populates="assigned_todos")
