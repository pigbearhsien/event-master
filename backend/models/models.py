# models.py

from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, Text, DateTime, CheckConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class User(Base):
    __tablename__ = 'user'
    UserID = Column(String(10), primary_key=True)
    Name = Column(String(40), nullable=False)
    Account = Column(String(40), nullable=False)
    Password = Column(String(10), nullable=False)
    Profile_pid_url = Column(Text)
    isAdmin = relationship("IsAdmin", back_populates="user")

class IsAdmin(Base):
    __tablename__ = 'isadmin'
    UserID = Column(String(10), ForeignKey('user.UserID'), primary_key=True)
    user = relationship("User", back_populates="isAdmin")

class PrivateEvent(Base):
    __tablename__ = 'private_event'
    EventID = Column(String(10), primary_key=True)
    UserID = Column(String(10), ForeignKey('user.UserID'), nullable=False)
    Event_Start = Column(DateTime, nullable=False)
    Event_End = Column(DateTime, nullable=False)
    Name = Column(String(10), nullable=False)
    Description = Column(Text, nullable=False)
    user = relationship("User", back_populates="private_events")

class Group(Base):
    __tablename__ = 'group'
    GroupID = Column(String(10), primary_key=True)
    name = Column(String(20), nullable=False)
    group_has_user = relationship("GroupHasUser", back_populates="group")
    group_has_manager = relationship("GroupHasManager", back_populates="group")
    group_events = relationship("GroupEvent", back_populates="group")

class GroupHasUser(Base):
    __tablename__ = 'group_has_user'
    GroupID = Column(String(10), ForeignKey('group.GroupID'), primary_key=True)
    UserID = Column(String(10), ForeignKey('user.UserID'), primary_key=True)
    group = relationship("Group", back_populates="group_has_user")
    user = relationship("User", back_populates="group_has_user")

class GroupHasManager(Base):
    __tablename__ = 'group_has_manager'
    GroupID = Column(String(10), ForeignKey('group.GroupID'), primary_key=True)
    UserID = Column(String(10), ForeignKey('user.UserID'), primary_key=True)
    group = relationship("Group", back_populates="group_has_manager")
    user = relationship("User", back_populates="group_has_manager")

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
    group = relationship("Group", back_populates="group_events")
    organizer = relationship("User", back_populates="organized_events")

    __table_args__ = CheckConstraint("Status IN ('In_Voting', 'End_Voting', 'Not_Start_Yet', 'On_Going', 'Closure')", name='check_status')

class UserJoinEvent(Base):
    __tablename__ = 'user_join_event'
    UserID = Column(String(10), ForeignKey('user.UserID'), primary_key=True)
    EventID = Column(String(10), ForeignKey('group_event.EventID'), primary_key=True)
    IsAccepted = Column(Boolean, nullable=False)
    user = relationship("User", back_populates="joined_events")
    group_event = relationship("GroupEvent", back_populates="users_joined")

class AvailableTime(Base):
    __tablename__ = 'available_time'
    UserID = Column(String(10), ForeignKey('user.UserID'), primary_key=True)
    EventID = Column(String(10), ForeignKey('group_event.EventID'), primary_key=True)
    Available_Start = Column(DateTime, primary_key=True)
    Possibility_level = Column(String(10), nullable=False)
    user = relationship("User", back_populates="available_times")
    group_event = relationship("GroupEvent", back_populates="available_times")
    __table_args__ = CheckConstraint("Possibility_level IN ('Definitely', 'Maybe')", name='check_possibility')

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
    group = relationship("Group", back_populates="todos")
    assignee = relationship("User", foreign_keys=[AssigneeID], back_populates="assigned_todos")
    assigner = relationship("User", foreign_keys=[AssignerID], back_populates="assigned_todos")

class Chat(Base):
    __tablename__ = 'chat'
    GroupID = Column(String(10), ForeignKey('group.GroupID'), primary_key=True)
    SpeakerID = Column(String(10), ForeignKey('user.UserID'), primary_key=True)
    Timing = Column(DateTime, primary_key=True)
    Content = Column(Text, nullable=False)
    group = relationship("Group", back_populates="chats")
    speaker = relationship("User", back_populates="chats")
