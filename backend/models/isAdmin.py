from sqlalchemy import Column, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class IsAdmin(Base):
    __tablename__ = 'isadmin'
    __table_args__ = {'schema': 'public'}
    UserID = Column(String(10), ForeignKey('user.UserID'), primary_key=True)
    user = relationship("User", back_populates="isAdmin")