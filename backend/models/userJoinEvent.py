from sqlalchemy import Column, String, Text, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from database import Base

class UserJoinEvent(Base):
    __tablename__ = 'user_join_event'
    __table_args__ = {'schema': 'public'}
    UserID = Column(String(10), ForeignKey('user.UserID'), primary_key=True)
    EventID = Column(String(10), ForeignKey('group_event.EventID'), primary_key=True)
    IsAccepted = Column(Boolean, nullable=False)
    user = relationship("User", back_populates="joined_events")
    group_event = relationship("GroupEvent", back_populates="users_joined")

    # __table_args__ = (CheckConstraint("Status IN ('In_Voting', 'End_Voting', 'Not_Start_Yet', 'On_Going', 'Closure')", name='check_status'))