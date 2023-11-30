from sqlalchemy import Column, String, Text, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from database import Base

class GroupHasManager(Base):
    __tablename__ = 'group_has_manager'
    __table_args__ = {'schema': 'public'}
    GroupID = Column(String(10), ForeignKey('group.GroupID'), primary_key=True)
    UserID = Column(String(10), ForeignKey('user.UserID'), primary_key=True)
    group = relationship("Group", back_populates="group_has_manager")
    user = relationship("User", back_populates="group_has_manager")
