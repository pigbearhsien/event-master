from sqlalchemy import Column, String, Text
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = 'user'
    __table_args__ = {'schema': 'public'}
    UserID = Column(String(10), primary_key=True)
    Name = Column(String(40), nullable=False)
    Account = Column(String(40), nullable=False)
    Password = Column(String(10), nullable=False)
    Profile_pid_url = Column(Text)
    isAdmin = relationship("IsAdmin", back_populates="user")