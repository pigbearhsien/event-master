from sqlalchemy import Column, String, Text, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from database import Base

class Group(Base):
    __tablename__ = 'group'
    __table_args__ = {'schema': 'public'}
    GroupID = Column(String(10), primary_key=True)
    name = Column(String(20), nullable=False)
    group_has_user = relationship("GroupHasUser", back_populates="group")
    group_has_manager = relationship("GroupHasManager", back_populates="group")
    group_events = relationship("GroupEvent", back_populates="group")