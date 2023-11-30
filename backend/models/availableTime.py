from sqlalchemy import Column, String, Text, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from database import Base

class AvailableTime(Base):
    __tablename__ = 'available_time'
    __table_args__ = {'schema': 'public'}
    UserID = Column(String(10), ForeignKey('user.UserID'), primary_key=True)
    EventID = Column(String(10), ForeignKey('group_event.EventID'), primary_key=True)
    Available_Start = Column(DateTime, primary_key=True)
    Possibility_level = Column(String(10), nullable=False)
    user = relationship("User", back_populates="available_times")
    group_event = relationship("GroupEvent", back_populates="available_times")
    # __table_args__ = (CheckConstraint("Possibility_level IN ('Definitely', 'Maybe')", name='check_possibility'))