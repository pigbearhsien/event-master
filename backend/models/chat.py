from sqlalchemy import Column, String, Text, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from database import Base

class Chat(Base):
    __tablename__ = 'chat'
    __table_args__ = {'schema': 'public'}
    GroupID = Column(String(10), ForeignKey('group.GroupID'), primary_key=True)
    SpeakerID = Column(String(10), ForeignKey('user.UserID'), primary_key=True)
    Timing = Column(DateTime, primary_key=True)
    Content = Column(Text, nullable=False)
    group = relationship("Group", back_populates="chats")
    speaker = relationship("User", back_populates="chats")
