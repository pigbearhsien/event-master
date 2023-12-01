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
    __tablename__ = 'isadmin'
    userid = Column(String(10), ForeignKey('user.userid'), primary_key=True)

class PrivateEvent(Base):
    __tablename__ = 'privateevent'
    eventid = Column(String(10), primary_key=True)
    userid = Column(String(10), ForeignKey('user.userid'), nullable=False)
    event_start = Column(DateTime, nullable=False)
    event_end = Column(DateTime, nullable=False)
    name = Column(String(10), nullable=False)
    description = Column(Text, nullable=False)

class Group(Base):
    __tablename__ = 'group'
    groupid = Column(String(10), primary_key=True)
    name = Column(String(20), nullable=False)

class GroupHasUser(Base):
    __tablename__ = 'grouphasuser'
    groupid = Column(String(10), ForeignKey('group.groupid'), primary_key=True)
    userid = Column(String(10), ForeignKey('user.userid'), primary_key=True)

class GroupHasManager(Base):
    __tablename__ = 'grouphasmanager'
    groupid = Column(String(10), ForeignKey('group.groupid'), primary_key=True)
    userid = Column(String(10), ForeignKey('user.userid'), primary_key=True)

class GroupEvent(Base):
    __tablename__ = 'groupevent'
    eventid = Column(String(10), primary_key=True)
    groupid = Column(String(20), ForeignKey('group.groupid'), nullable=False)
    name = Column(String(20), nullable=False)
    description = Column(Text, nullable=False)
    event_start = Column(DateTime)
    event_end = Column(DateTime)
    status = Column(String(13), nullable=False)
    organizerid = Column(String(10), ForeignKey('user.userid'), nullable=False)
    vote_start = Column(DateTime, nullable=False)
    vote_end = Column(DateTime, nullable=False)
    votedeadline = Column(DateTime, nullable=False)
    havepossibility = Column(Boolean, nullable=False)

    # __table_args__ = (CheckConstraint("status IN ('In_Voting', 'End_Voting', 'Not_Start_Yet', 'On_Going', 'Closure')", name='check_status'))

class UserJoinEvent(Base):
    __tablename__ = 'userjoinevent'
    userid = Column(String(10), ForeignKey('user.userid'), primary_key=True)
    eventid = Column(String(10), ForeignKey('groupevent.eventid'), primary_key=True)
    isaccepted = Column(Boolean, nullable=False)

class AvailableTime(Base):
    __tablename__ = 'availabletime'
    userid = Column(String(10), ForeignKey('user.userid'), primary_key=True)
    eventid = Column(String(10), ForeignKey('groupevent.eventid'), primary_key=True)
    available_start = Column(DateTime, primary_key=True)
    possibility_level = Column(String(10), nullable=False)
    # __table_args__ = (CheckConstraint("possibility_level IN ('Definitely', 'Maybe')", name='check_possibility'))

class Todo(Base):
    __tablename__ = 'todo'
    todoid = Column(String(10), primary_key=True)
    groupid = Column(String(10), ForeignKey('group.groupid'), nullable=False)
    assigneeid = Column(String(10), ForeignKey('user.userid'), nullable=False)
    assignerid = Column(String(10), ForeignKey('user.userid'), nullable=False)
    name = Column(String(20), nullable=False)
    description = Column(Text, nullable=False)
    completed = Column(Boolean, nullable=False)
    deadline = Column(DateTime, nullable=False)

class Chat(Base):
    __tablename__ = 'chat'
    groupid = Column(String(10), ForeignKey('group.groupid'), primary_key=True)
    speakerid = Column(String(10), ForeignKey('user.userid'), primary_key=True)
    timing = Column(DateTime, primary_key=True)
    content = Column(Text, nullable=False)
