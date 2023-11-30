from sqlalchemy import Column, String, Text, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from database import Base

class GroupEvent(Base):
    __tablename__ = 'group_event'
    __table_args__ = {'schema': 'public'}
    EventID = Column(String(10), primary_key=True)
    GroupID = Column(String(20), ForeignKey('group.GroupID'), nullable=False)
    name = Column(String(20), nullable=False)
    Description = Column(Text, nullable=False)
    Event_Start = Column(DateTime)
    Event_End = Column(DateTime)
    Status = Column(String(13), nullable=False)
    OrganizerID = Column(String(10), ForeignKey('user.UserID'), nullable=False)
    Vote_Start = Column(DateTime, nullable=False)
    Vote_End = Column(DateTime, nullable=False)
    VoteDeadline = Column(DateTime, nullable=False)
    HavePossibility = Column(Boolean, nullable=False)
    group = relationship("Group", back_populates="group_events")
    organizer = relationship("User", back_populates="organized_events")

    # __table_args__ = (CheckConstraint("Status IN ('In_Voting', 'End_Voting', 'Not_Start_Yet', 'On_Going', 'Closure')", name='check_status'))