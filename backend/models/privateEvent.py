from sqlalchemy import Column, String, Text, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from database import Base

class PrivateEvent(Base):
    __tablename__ = 'private_event'
    __table_args__ = {'schema': 'public'}
    EventID = Column(String(10), primary_key=True)
    UserID = Column(String(10), ForeignKey('user.UserID'), nullable=False)
    Event_Start = Column(DateTime, nullable=False)
    Event_End = Column(DateTime, nullable=False)
    Name = Column(String(10), nullable=False)
    Description = Column(Text, nullable=False)
    user = relationship("User", back_populates="private_events")