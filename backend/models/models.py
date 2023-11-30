# models.py

from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, Text, DateTime, CheckConstraint
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = 'user'
    userid = Column(String(10), primary_key=True)
    name = Column(String(40), nullable=False)
    account = Column(String(40), nullable=False)
    password = Column(String(10), nullable=False)
    profile_pid_url = Column(Text)

class IsAdmin(Base):
    __tablename__ = 'isAdmin'
    UserID = Column(String(10), ForeignKey('public.user.userid'), primary_key=True)

class PrivateEvent(Base):
    __tablename__ = 'private_event'
    EventID = Column(String(10), primary_key=True)
    UserID = Column(String(10), ForeignKey('public.user.UserID'), nullable=False)
    Event_Start = Column(DateTime, nullable=False)
    Event_End = Column(DateTime, nullable=False)
    Name = Column(String(10), nullable=False)
    Description = Column(Text, nullable=False)

class Group(Base):
    __tablename__ = 'group'
    GroupID = Column(String(10), primary_key=True)
    name = Column(String(20), nullable=False)

class GroupHasUser(Base):
    __tablename__ = 'group_has_user'
    GroupID = Column(String(10), ForeignKey('group.GroupID'), primary_key=True)
    UserID = Column(String(10), ForeignKey('public.user.UserID'), primary_key=True)

class GroupHasManager(Base):
    __tablename__ = 'group_has_manager'
    GroupID = Column(String(10), ForeignKey('group.GroupID'), primary_key=True)
    UserID = Column(String(10), ForeignKey('public.user.UserID'), primary_key=True)

class GroupEvent(Base):
    __tablename__ = 'group_event'
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

    # __table_args__ = (CheckConstraint("Status IN ('In_Voting', 'End_Voting', 'Not_Start_Yet', 'On_Going', 'Closure')", name='check_status'))

class UserJoinEvent(Base):
    __tablename__ = 'user_join_event'
    UserID = Column(String(10), ForeignKey('user.UserID'), primary_key=True)
    EventID = Column(String(10), ForeignKey('group_event.EventID'), primary_key=True)
    IsAccepted = Column(Boolean, nullable=False)

class AvailableTime(Base):
    __tablename__ = 'available_time'
    UserID = Column(String(10), ForeignKey('user.UserID'), primary_key=True)
    EventID = Column(String(10), ForeignKey('group_event.EventID'), primary_key=True)
    Available_Start = Column(DateTime, primary_key=True)
    Possibility_level = Column(String(10), nullable=False)
    # __table_args__ = (CheckConstraint("Possibility_level IN ('Definitely', 'Maybe')", name='check_possibility'))

class Todo(Base):
    __tablename__ = 'todo'
    TodoID = Column(String(10), primary_key=True)
    GroupID = Column(String(10), ForeignKey('group.GroupID'), nullable=False)
    AssigneeID = Column(String(10), ForeignKey('user.UserID'), nullable=False)
    AssignerID = Column(String(10), ForeignKey('user.UserID'), nullable=False)
    Name = Column(String(20), nullable=False)
    Description = Column(Text, nullable=False)
    Completed = Column(Boolean, nullable=False)
    Deadline = Column(DateTime, nullable=False)

class Chat(Base):
    __tablename__ = 'chat'
    GroupID = Column(String(10), ForeignKey('group.GroupID'), primary_key=True)
    SpeakerID = Column(String(10), ForeignKey('user.UserID'), primary_key=True)
    Timing = Column(DateTime, primary_key=True)
    Content = Column(Text, nullable=False)