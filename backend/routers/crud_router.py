# admin_router.py
from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.orm import Session
from sqlalchemy.sql import text
from database import get_db
from models import (
    User as UserModel,
    Group as GroupModel,
    GroupEvent as GroupEventModel,
    AvailableTime as AvailableTimeModel,
    UserJoinEvent as UserJoinEventModel,
    GroupHasUser as GroupHasUserModel,
    Todo as TodoModel,
    PrivateEvent as PrivateEventModel,
    Chat as ChatModel,
    GroupHasManager as GroupHasManagerModel,
)

from schemas import (
    User as UserSchema,
    Group as GroupSchema,
    GroupEvent as GroupEventSchema,
    AvailableTime as AvailableTimeSchema,
    UserJoinEvent as UserJoinEventSchema,
    GroupHasUser as GroupHasUserSchema,
    Todo as TodoSchema,
    PrivateEvent as PrivateEventSchema,
    Chat as ChatSchema,
    GroupHasManager as GroupHasManagerSchema,
)
from database import metaData

import logging

logging.basicConfig(level=logging.DEBUG)

router = APIRouter()

# User CRUD
# Create User
@router.post("/createUser", response_model=UserSchema, operation_id="create_user2")
def create_user(user: UserSchema, db: Session = Depends(get_db)):
    try:
        db_user = UserModel(
            userid=user.userId,
            name=user.name,
            account=user.account,
            password=user.password,
            profile_pic_url=user.profilePicUrl
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")

# Read User
# List all users
@router.get("/listAllUser", response_model=List[UserSchema])
def list_all_user(db: Session = Depends(get_db)):
    try:
        db_users = db.query(UserModel).all()
        logging.info(db_users[0])
        # parse user name
        users = []
        for user in db_users:
            users.append(
                UserSchema(
                    userId=user.userid,
                    name=user.name,
                    account=user.account,
                    password=user.password,
                    profilePicUrl=user.profile_pic_url,
                )
            )
        return users
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")
    
# List user by id
@router.get("/listUserById/{user_id}", response_model=UserSchema)
def list_user_by_id(user_id: str, db: Session = Depends(get_db)):
    try:
        db_user = db.query(UserModel).filter(UserModel.userid == user_id).first()
        if not db_user:
            raise HTTPException(status_code=404, detail="User not found")
        # parse user name
        user = UserSchema(
            userId=db_user.userid,
            name=db_user.name,
            account=db_user.account,
            password=db_user.password,
            profilePicUrl=db_user.profile_pic_url,
        )
        return user
    except HTTPException as e:
        raise e
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")
    
# List user by name
@router.get("/listUserByName/{user_name}", response_model=List[UserSchema])
def list_user_by_name(user_name: str, db: Session = Depends(get_db)):
    try:
        db_users = db.query(UserModel).filter(UserModel.username == user_name).all()
        if not db_users:
            raise HTTPException(status_code=404, detail="User not found")
        # parse user name
        users = []
        for user in db_users:
            users.append(
                UserSchema(
                    userId=user.userid,
                    name=user.name,
                    account=user.account,
                    password=user.password,
                    profilePicUrl=user.profile_pic_url,
                )
            )
        return users
    except HTTPException as e:
        raise e
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")
    
# Update User
# Update user by id
@router.put("/updateUserById/{user_id}", response_model=UserSchema)
def update_user_by_id(user_id: str, user: UserSchema, db: Session = Depends(get_db)):
    try:
        db_user = db.query(UserModel).filter(UserModel.userid == user_id).first()
        if not db_user:
            raise HTTPException(status_code=404, detail="User not found")
        db_user.name = user.name
        db_user.account = user.account
        db_user.password = user.password
        db_user.profile_pic_url = user.profilePicUrl
        db.commit()
        db.refresh(db_user)
        return db_user
    except HTTPException as e:
        raise e
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")
    
# Delete User
# Delete user by id
@router.delete("/deleteUserById/{user_id}")
def delete_user_by_id(user_id: str, db: Session = Depends(get_db)):
    try:
        db_user = db.query(UserModel).filter(UserModel.userid == user_id).first()
        if not db_user:
            raise HTTPException(status_code=404, detail="User not found")
        db.delete(db_user)
        db.commit()
        return {"message": "Delete Success"}
    except HTTPException as e:
        raise e
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")
    
# Group CRUD
# Create Group
@router.post("/createGroup", response_model=GroupSchema, operation_id="create_group2")
def create_group(group: GroupSchema, db: Session = Depends(get_db)):
    try:
        db_group = GroupModel(
            groupid=group.groupId,
            name=group.name
        )
        db.add(db_group)
        db.commit()
        db.refresh(db_group)
        return db_group
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")
    
# Read Group
# List all groups
@router.get("/listAllGroup", response_model=List[GroupSchema])
def list_all_group(db: Session = Depends(get_db)):
    try:
        db_groups = db.query(GroupModel).all()
        # parse group name
        groups = []
        for group in db_groups:
            groups.append(GroupSchema(groupId=group.groupid, name=group.name))
        return groups
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")
    
# List group by id
@router.get("/listGroupById/{group_id}", response_model=GroupSchema)
def list_group_by_id(group_id: str, db: Session = Depends(get_db)):
    try:
        db_group = db.query(GroupModel).filter(GroupModel.groupid == group_id).first()
        if not db_group:
            raise HTTPException(status_code=404, detail="Group not found")
        # parse group name
        group = GroupSchema(groupId=db_group.groupid, name=db_group.name)
        return group
    except HTTPException as e:
        raise e
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")

# List group by name
@router.get("/listGroupByName/{group_name}", response_model=List[GroupSchema])
def list_group_by_name(group_name: str, db: Session = Depends(get_db)):
    try:
        db_groups = db.query(GroupModel).filter(GroupModel.name == group_name).all()
        if not db_groups:
            raise HTTPException(status_code=404, detail="Group not found")
        # parse group name
        groups = []
        for group in db_groups:
            groups.append(GroupSchema(groupId=group.groupid, name=group.name))
        return groups
    except HTTPException as e:
        raise e
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")

# Update Group
# Update group by id
@router.put("/updateGroupById/{group_id}", response_model=GroupSchema)
def update_group_by_id(group_id: str, group: GroupSchema, db: Session = Depends(get_db)):
    try:
        db_group = db.query(GroupModel).filter(GroupModel.groupid == group_id).first()
        if not db_group:
            raise HTTPException(status_code=404, detail="Group not found")
        db_group.name = group.name
        db.commit()
        db.refresh(db_group)
        return db_group
    except HTTPException as e:
        raise e
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")

# Delete Group
# Delete group by id
@router.delete("/deleteGroupById/{group_id}")
def delete_group_by_id(group_id: str, db: Session = Depends(get_db)):
    try:
        db_group = db.query(GroupModel).filter(GroupModel.groupid == group_id).first()
        if not db_group:
            raise HTTPException(status_code=404, detail="Group not found")
        db.delete(db_group)
        db.commit()
        return {"message": "Delete Success"}
    except HTTPException as e:
        raise e
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")
    
# GroupEvent CRUD
# Create GroupEvent
@router.post("/createGroupEvent", response_model=GroupEventSchema)
def create_group_event(group_event: GroupEventSchema, db: Session = Depends(get_db)):
    try:
        db_group_event = GroupEventModel(
            eventid=group_event.eventId,
            groupid=group_event.groupId,
            name=group_event.name,
            description=group_event.description,
            event_start=group_event.eventStart,
            event_end=group_event.eventEnd,
            status=group_event.status,
            organizerid=group_event.organizerId,
            vote_start=group_event.voteStart,
            vote_end=group_event.voteEnd,
            votedeadline=group_event.voteDeadline,
            havepossibility=group_event.havePossibility
        )
        db.add(db_group_event)
        db.commit()
        db.refresh(db_group_event)
        return db_group_event
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")
    
# Read GroupEvent
# List all group events
@router.get("/listAllGroupEvent", response_model=List[GroupEventSchema])
def list_all_group_event(db: Session = Depends(get_db)):
    try:
        db_group_events = db.query(GroupEventModel).all()
        # parse group event
        group_events = []
        for group_event in db_group_events:
            group_events.append(
                GroupEventSchema(
                    eventId=group_event.eventid,
                    groupId=group_event.groupid,
                    name=group_event.name,
                    description=group_event.description,
                    eventStart=group_event.event_start,
                    eventEnd=group_event.event_end,
                    status=group_event.status,
                    organizerId=group_event.organizerid,
                    voteStart=group_event.vote_start,
                    voteEnd=group_event.vote_end,
                    voteDeadline=group_event.votedeadline,
                    havePossibility=group_event.havepossibility
                )
            )
        return group_events
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")

# List group event by id
@router.get("/listGroupEventById/{group_event_id}", response_model=GroupEventSchema)
def list_group_event_by_id(group_event_id: str, db: Session = Depends(get_db)):
    try:
        db_group_event = (
            db.query(GroupEventModel)
            .filter(GroupEventModel.eventid == group_event_id)
            .first()
        )
        if not db_group_event:
            raise HTTPException(status_code=404, detail="Group Event not found")
        # parse group event
        group_event = GroupEventSchema(
            eventId=db_group_event.eventid,
            groupId=db_group_event.groupid,
            name=db_group_event.name,
            description=db_group_event.description,
            eventStart=db_group_event.event_start,
            eventEnd=db_group_event.event_end,
            status=db_group_event.status,
            organizerId=db_group_event.organizerid,
            voteStart=db_group_event.vote_start,
            voteEnd=db_group_event.vote_end,
            voteDeadline=db_group_event.votedeadline,
            havePossibility=db_group_event.havepossibility
        )
        return group_event
    except HTTPException as e:
        raise e
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")

# List group event by group id
@router.get("/listGroupEventByGroupId/{group_id}", response_model=List[GroupEventSchema])
def list_group_event_by_group_id(group_id: str, db: Session = Depends(get_db)):
    try:
        db_group_events = (
            db.query(GroupEventModel)
            .filter(GroupEventModel.groupid == group_id)
            .all()
        )
        if not db_group_events:
            raise HTTPException(status_code=404, detail="Group Event not found")
        # parse group event
        group_events = []
        for group_event in db_group_events:
            group_events.append(
                GroupEventSchema(
                    eventId=group_event.eventid,
                    groupId=group_event.groupid,
                    name=group_event.name,
                    description=group_event.description,
                    eventStart=group_event.event_start,
                    eventEnd=group_event.event_end,
                    status=group_event.status,
                    organizerId=group_event.organizerid,
                    voteStart=group_event.vote_start,
                    voteEnd=group_event.vote_end,
                    voteDeadline=group_event.votedeadline,
                    havePossibility=group_event.havepossibility
                )
            )
        return group_events
    except HTTPException as e:
        raise e
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")

# Update GroupEvent
# Update group event by id
@router.put("/updateGroupEventById/{group_event_id}", response_model=GroupEventSchema)
def update_group_event_by_id(group_event_id: str, group_event: GroupEventSchema, db: Session = Depends(get_db)):
    try:
        db_group_event = (
            db.query(GroupEventModel)
            .filter(GroupEventModel.eventid == group_event_id)
            .first()
        )
        if not db_group_event:
            raise HTTPException(status_code=404, detail="Group Event not found")
        
        db_group_event.eventid = group_event.eventId
        db_group_event.groupid = group_event.groupId
        db_group_event.name = group_event.name
        db_group_event.description = group_event.description
        db_group_event.status = group_event.status
        db_group_event.organizerid = group_event.organizerId
        db_group_event.vote_start = group_event.voteStart
        db_group_event.vote_end = group_event.voteEnd
        db_group_event.vote_deadline = group_event.voteDeadline
        db_group_event.have_possibility = group_event.havePossibility
        db.commit()
        return group_event
    except HTTPException as e:
        raise e
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")

# Delete GroupEvent
# Delete group event by id
@router.delete("/deleteGroupEventById/{group_event_id}")
def delete_group_event_by_id(group_event_id: str, db: Session = Depends(get_db)):
    try:
        db_group_event = (
            db.query(GroupEventModel)
            .filter(GroupEventModel.eventid == group_event_id)
            .first()
        )
        if not db_group_event:
            raise HTTPException(status_code=404, detail="Group Event not found")
        db.delete(db_group_event)
        db.commit()
        return {"message": "Delete Success"}
    except HTTPException as e:
        raise e
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")

# AvailableTime CRUD
# Create AvailableTime
@router.post("/createAvailableTime", response_model=AvailableTimeSchema)
def create_available_time(available_time: AvailableTimeSchema, db: Session = Depends(get_db)):
    try:
        db_available_time = AvailableTimeModel(
            userid=available_time.userId,
            eventid=available_time.eventId,
            available_start=available_time.availableStart,
            possibility_level=available_time.possibilityLevel
        )
        db.add(db_available_time)
        db.commit()
        db.refresh(db_available_time)
        return db_available_time
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")
    
# Read AvailableTime
# List all available times
@router.get("/listAllAvailableTime", response_model=List[AvailableTimeSchema])
def list_all_available_time(db: Session = Depends(get_db)):
    try:
        db_available_times = db.query(AvailableTimeModel).all()
        # parse available time
        available_times = []
        for available_time in db_available_times:
            available_times.append(
                AvailableTimeSchema(
                    userId=available_time.userid,
                    eventId=available_time.eventid,
                    availableStart=available_time.available_start,
                    possibilityLevel=available_time.possibility_level
                )
            )
        return available_times
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")
    
# List available time by user id
@router.get("/listAvailableTimeByUserId/{user_id}", response_model=List[AvailableTimeSchema])
def list_available_time_by_user_id(user_id: str, db: Session = Depends(get_db)):
    try:
        db_available_times = (
            db.query(AvailableTimeModel)
            .filter(AvailableTimeModel.userid == user_id)
            .all()
        )
        if not db_available_times:
            raise HTTPException(status_code=404, detail="Available Time not found")
        # parse available time
        available_times = []
        for available_time in db_available_times:
            available_times.append(
                AvailableTimeSchema(
                    userId=available_time.userid,
                    eventId=available_time.eventid,
                    availableStart=available_time.available_start,
                    possibilityLevel=available_time.possibility_level
                )
            )
        return available_times
    except HTTPException as e:
        raise e
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")

# List available time by event id
@router.get("/listAvailableTimeByEventId/{event_id}", response_model=List[AvailableTimeSchema])
def list_available_time_by_event_id(event_id: str, db: Session = Depends(get_db)):
    try:
        db_available_times = (
            db.query(AvailableTimeModel)
            .filter(AvailableTimeModel.eventid == event_id)
            .all()
        )
        if not db_available_times:
            raise HTTPException(status_code=404, detail="Available Time not found")
        # parse available time
        available_times = []
        for available_time in db_available_times:
            available_times.append(
                AvailableTimeSchema(
                    userId=available_time.userid,
                    eventId=available_time.eventid,
                    availableStart=available_time.available_start,
                    possibilityLevel=available_time.possibility_level
                )
            )
        return available_times
    except HTTPException as e:
        raise e
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")
    
# Update AvailableTime
# Update available time by user id and event id
@router.put("/updateAvailableTimeByUserIdAndEventId/{user_id}/{event_id}", response_model=AvailableTimeSchema)
def update_available_time_by_user_id_and_event_id(user_id: str, event_id: str, available_time: AvailableTimeSchema, db: Session = Depends(get_db)):
    try:
        db_available_time = (
            db.query(AvailableTimeModel)
            .filter(AvailableTimeModel.userid == user_id)
            .filter(AvailableTimeModel.eventid == event_id)
            .first()
        )
        if not db_available_time:
            raise HTTPException(status_code=404, detail="Available Time not found")
        db_available_time.available_start = available_time.availableStart
        db_available_time.possibility_level = available_time.possibilityLevel
        db.commit()
        db.refresh(db_available_time)
        return db_available_time
    except HTTPException as e:
        raise e
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")

# Delete AvailableTime
# Delete available time by user id and event id
@router.delete("/deleteAvailableTimeByUserIdAndEventId/{user_id}/{event_id}")
def delete_available_time_by_user_id_and_event_id(user_id: str, event_id: str, db: Session = Depends(get_db)):
    try:
        db_available_time = (
            db.query(AvailableTimeModel)
            .filter(AvailableTimeModel.userid == user_id)
            .filter(AvailableTimeModel.eventid == event_id)
            .first()
        )
        if not db_available_time:
            raise HTTPException(status_code=404, detail="Available Time not found")
        db.delete(db_available_time)
        db.commit()
        return {"message": "Delete Success"}
    except HTTPException as e:
        raise e
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")

# UserJoinEvent CRUD
# Create UserJoinEvent
@router.post("/createUserJoinEvent", response_model=UserJoinEventSchema)
def create_user_join_event(user_join_event: UserJoinEventSchema, db: Session = Depends(get_db)):
    try:
        db_user_join_event = UserJoinEventModel(
            userid=user_join_event.userId,
            eventid=user_join_event.eventId,
            isaccepted=user_join_event.isAccepted
        )
        db.add(db_user_join_event)
        db.commit()
        db.refresh(db_user_join_event)
        return db_user_join_event
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")

# Read UserJoinEvent
# List all user join events
@router.get("/listAllUserJoinEvent", response_model=List[UserJoinEventSchema])
def list_all_user_join_event(db: Session = Depends(get_db)):
    try:
        db_user_join_events = db.query(UserJoinEventModel).all()
        # parse user join event
        user_join_events = []
        for user_join_event in db_user_join_events:
            user_join_events.append(
                UserJoinEventSchema(
                    userId=user_join_event.userid,
                    eventId=user_join_event.eventid,
                    isAccepted=user_join_event.isaccepted
                )
            )
        return user_join_events
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")

# List user join event by user id
@router.get("/listUserJoinEventByUserId/{user_id}", response_model=List[UserJoinEventSchema])
def list_user_join_event_by_user_id(user_id: str, db: Session = Depends(get_db)):
    try:
        db_user_join_events = (
            db.query(UserJoinEventModel)
            .filter(UserJoinEventModel.userid == user_id)
            .all()
        )
        if not db_user_join_events:
            raise HTTPException(status_code=404, detail="User Join Event not found")
        # parse user join event
        user_join_events = []
        for user_join_event in db_user_join_events:
            user_join_events.append(
                UserJoinEventSchema(
                    userId=user_join_event.userid,
                    eventId=user_join_event.eventid,
                    isAccepted=user_join_event.isaccepted
                )
            )
        return user_join_events
    except HTTPException as e:
        raise e
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")

# List user join event by event id
@router.get("/listUserJoinEventByEventId/{event_id}", response_model=List[UserJoinEventSchema])
def list_user_join_event_by_event_id(event_id: str, db: Session = Depends(get_db)):
    try:
        db_user_join_events = (
            db.query(UserJoinEventModel)
            .filter(UserJoinEventModel.eventid == event_id)
            .all()
        )
        if not db_user_join_events:
            raise HTTPException(status_code=404, detail="User Join Event not found")
        # parse user join event
        user_join_events = []
        for user_join_event in db_user_join_events:
            user_join_events.append(
                UserJoinEventSchema(
                    userId=user_join_event.userid,
                    eventId=user_join_event.eventid,
                    isAccepted=user_join_event.isaccepted
                )
            )
        return user_join_events
    except HTTPException as e:
        raise e
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")

# Update UserJoinEvent
# Update user join event by user id and event id
@router.put("/updateUserJoinEventByUserIdAndEventId/{user_id}/{event_id}", response_model=UserJoinEventSchema)
def update_user_join_event_by_user_id_and_event_id(user_id: str, event_id: str, user_join_event: UserJoinEventSchema, db: Session = Depends(get_db)):
    try:
        db_user_join_event = (
            db.query(UserJoinEventModel)
            .filter(UserJoinEventModel.userid == user_id)
            .filter(UserJoinEventModel.eventid == event_id)
            .first()
        )
        if not db_user_join_event:
            raise HTTPException(status_code=404, detail="User Join Event not found")
        db_user_join_event.isaccepted = user_join_event.isAccepted
        db.commit()
        db.refresh(db_user_join_event)
        return db_user_join_event
    except HTTPException as e:
        raise e
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")

# Delete UserJoinEvent
# Delete user join event by user id and event id
@router.delete("/deleteUserJoinEventByUserIdAndEventId/{user_id}/{event_id}")
def delete_user_join_event_by_user_id_and_event_id(user_id: str, event_id: str, db: Session = Depends(get_db)):
    try:
        db_user_join_event = (
            db.query(UserJoinEventModel)
            .filter(UserJoinEventModel.userid == user_id)
            .filter(UserJoinEventModel.eventid == event_id)
            .first()
        )
        if not db_user_join_event:
            raise HTTPException(status_code=404, detail="User Join Event not found")
        db.delete(db_user_join_event)
        db.commit()
        return {"message": "Delete Success"}
    except HTTPException as e:
        raise e
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")
    




# GroupHasUser CRUD
# Create GroupHasUser
@router.post("/createGroupHasUser", response_model=GroupHasUserSchema)
def create_group_has_user(group_has_user: GroupHasUserSchema, db: Session = Depends(get_db)):
    try:
        db_group_has_user = GroupHasUserModel(
            groupid=group_has_user.groupId,
            userid=group_has_user.userId
        )
        db.add(db_group_has_user)
        db.commit()
        db.refresh(db_group_has_user)
        return db_group_has_user
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")
    

# Read GroupHasUser
# List all group has users
@router.get("/listAllGroupHasUser", response_model=List[GroupHasUserSchema])
def list_all_group_has_user(db: Session = Depends(get_db)):
    try:
        db_group_has_users = db.query(GroupHasUserModel).all()
        # parse group has user
        group_has_users = []
        for group_has_user in db_group_has_users:
            group_has_users.append(
                GroupHasUserSchema(
                    groupId=group_has_user.groupid,
                    userId=group_has_user.userid
                )
            )
        return group_has_users
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")

# List group has user by group id
@router.get("/listGroupHasUserByGroupId/{group_id}", response_model=List[GroupHasUserSchema])
def list_group_has_user_by_group_id(group_id: str, db: Session = Depends(get_db)):
    try:
        db_group_has_users = (
            db.query(GroupHasUserModel)
            .filter(GroupHasUserModel.groupid == group_id)
            .all()
        )
        if not db_group_has_users:
            raise HTTPException(status_code=404, detail="Group Has User not found")
        # parse group has user
        group_has_users = []
        for group_has_user in db_group_has_users:
            group_has_users.append(
                GroupHasUserSchema(
                    groupId=group_has_user.groupid,
                    userId=group_has_user.userid
                )
            )
        return group_has_users
    except HTTPException as e:
        raise e
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")

# List group has user by user id
@router.get("/listGroupHasUserByUserId/{user_id}", response_model=List[GroupHasUserSchema])
def list_group_has_user_by_user_id(user_id: str, db: Session = Depends(get_db)):
    try:
        db_group_has_users = (
            db.query(GroupHasUserModel)
            .filter(GroupHasUserModel.userid == user_id)
            .all()
        )
        if not db_group_has_users:
            raise HTTPException(status_code=404, detail="Group Has User not found")
        # parse group has user
        group_has_users = []
        for group_has_user in db_group_has_users:
            group_has_users.append(
                GroupHasUserSchema(
                    groupId=group_has_user.groupid,
                    userId=group_has_user.userid
                )
            )
        return group_has_users
    except HTTPException as e:
        raise e
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")

# Update GroupHasUser
# Update group has user by group id and user id
@router.put("/updateGroupHasUserByGroupIdAndUserId/{group_id}/{user_id}", response_model=GroupHasUserSchema)
def update_group_has_user_by_group_id_and_user_id(group_id: str, user_id: str, group_has_user: GroupHasUserSchema, db: Session = Depends(get_db)):
    try:
        db_group_has_user = (
            db.query(GroupHasUserModel)
            .filter(GroupHasUserModel.groupid == group_id)
            .filter(GroupHasUserModel.userid == user_id)
            .first()
        )
        if not db_group_has_user:
            raise HTTPException(status_code=404, detail="Group Has User not found")
        db_group_has_user.groupid = group_has_user.groupId
        db_group_has_user.userid = group_has_user.userId
        db.commit()
        db.refresh(db_group_has_user)
        return db_group_has_user
    except HTTPException as e:
        raise e
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")

# Delete GroupHasUser
# Delete group has user by group id and user id
@router.delete("/deleteGroupHasUserByGroupIdAndUserId/{group_id}/{user_id}")
def delete_group_has_user_by_group_id_and_user_id(group_id: str, user_id: str, db: Session = Depends(get_db)):
    try:
        db_group_has_user = (
            db.query(GroupHasUserModel)
            .filter(GroupHasUserModel.groupid == group_id)
            .filter(GroupHasUserModel.userid == user_id)
            .first()
        )
        if not db_group_has_user:
            raise HTTPException(status_code=404, detail="Group Has User not found")
        db.delete(db_group_has_user)
        db.commit()
        return {"message": "Delete Success"}
    except HTTPException as e:
        raise e
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")
# GroupHasManager CRUD
# Create GroupHasManager
@router.post("/createGroupHasManager", response_model= GroupHasManagerSchema)
def create_group_has_manager(group_has_manager: GroupHasManagerSchema, db: Session = Depends(get_db)):
    try:
        db_group_has_manager = GroupHasManagerModel(
            groupid=group_has_manager.groupId,
            userid=group_has_manager.userId
        )
        db.add(db_group_has_manager)
        db.commit()
        db.refresh(db_group_has_manager)
        return db_group_has_manager
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")
    
    
# Read GroupHasManager
# List all group has managers
@router.get("/listAllGroupHasManager", response_model=List[GroupHasManagerSchema])
def list_all_group_has_manager(db: Session = Depends(get_db)):
    try:
        db_group_has_managers = db.query(GroupHasManagerModel).all()
        # parse group has manager
        group_has_managers = []
        for group_has_manager in db_group_has_managers:
            group_has_managers.append(
                GroupHasManagerSchema(
                    groupId=group_has_manager.groupid,
                    userId=group_has_manager.userid
                )
            )
        return group_has_managers
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")
    
# List group has manager by group id
@router.get("/listGroupHasManagerByGroupId/{group_id}", response_model=List[GroupHasManagerSchema])
def list_group_has_manager_by_group_id(group_id: str, db: Session = Depends(get_db)):
    try:
        db_group_has_managers = (
            db.query(GroupHasManagerModel)
            .filter(GroupHasManagerModel.groupid == group_id)
            .all()
        )
        if not db_group_has_managers:
            raise HTTPException(status_code=404, detail="Group Has Manager not found")
        # parse group has manager
        group_has_managers = []
        for group_has_manager in db_group_has_managers:
            group_has_managers.append(
                GroupHasManagerSchema(
                    groupId=group_has_manager.groupid,
                    userId=group_has_manager.userid
                )
            )
        return group_has_managers
    
    except HTTPException as e:
        raise e
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")

# List group has manager by user id
@router.get("/listGroupHasManagerByUserId/{user_id}", response_model=List[GroupHasManagerSchema])
def list_group_has_manager_by_user_id(user_id: str, db: Session = Depends(get_db)):
    try: 
        db_group_has_managers = (
            db.query(GroupHasManagerModel)
            .filter(GroupHasManagerModel.userid == user_id)
            .all()
        )
        if not db_group_has_managers:
            raise HTTPException(status_code=404, detail="Group Has Manager not found")
        # parse group has manager
        group_has_managers = []
        for group_has_manager in db_group_has_managers:
            group_has_managers.append(
                GroupHasManagerSchema(
                    groupId=group_has_manager.groupid,
                    userId=group_has_manager.userid
                )
            )
        return group_has_managers
    
    except HTTPException as e:
        raise e
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error:{e}")
    
# Update GroupHasManager
# Update group has manager by group id and user id
@router.put("/updateGroupHasManagerByGroupIdAndUserId/{group_id}/{user_id}", response_model=GroupHasManagerSchema)
def update_group_has_manager_by_group_id_and_user_id(group_id: str, user_id: str, group_has_manager: GroupHasManagerSchema, db: Session = Depends(get_db)):
    try:
        db_group_has_manager = (
            db.query(GroupHasManagerModel)
            .filter(GroupHasManagerModel.groupid == group_id)
            .filter(GroupHasManagerModel.userid == user_id)
            .first()
        )
        if not db_group_has_manager:
            raise HTTPException(status_code=404, detail="Group Has Manager not found")
        db_group_has_manager.groupid = group_has_manager.groupId
        db_group_has_manager.userid = group_has_manager.userId
        db.commit()
        db.refresh(db_group_has_manager)
        return db_group_has_manager
    
    except HTTPException as e:
        raise e
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error:{e}")
    
# Delete GroupHasManager
# Delete group has manager by group id and user id
@router.delete("/deleteGroupHasManagerByGroupIdAndUserId/{group_id}/{user_id}")
def delete_group_has_manager_by_group_id_and_user_id(group_id: str, user_id: str, db: Session = Depends(get_db)):
    try:
        db_group_has_manager = (
            db.query(GroupHasManagerModel)
            .filter(GroupHasManagerModel.groupid == group_id)
            .filter(GroupHasManagerModel.userid == user_id)
            .first()
        )
        if not db_group_has_manager:
            raise HTTPException(status_code=404, detail="Group Has Manager not found")
        db.delete(db_group_has_manager)
        db.commit()
        return {"message": "Delete Success"}
    
    except HTTPException as e:
        raise e
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error:{e}")

# Todo CRUD
# Create Todo
@router.post("/createTodo", response_model=TodoSchema)
def create_todo(todo: TodoSchema, db: Session = Depends(get_db)):
    try:
        db_todo = TodoModel(
            todoid=todo.todoId,
            groupid=todo.groupId,
            assigneeid=todo.assigneeId,
            assignerid=todo.assignerId,
            name=todo.name,
            description=todo.description,
            completed=todo.completed,
            deadline=todo.deadline
        )
        db.add(db_todo)
        db.commit()
        db.refresh(db_todo)
        return db_todo
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")

# Read Todo
# List all todos
@router.get("/listAllTodo", response_model=List[TodoSchema])
def list_all_todo(db: Session = Depends(get_db)):
    try:
        db_todos = db.query(TodoModel).all()
        # parse todo
        todos = []
        for todo in db_todos:
            todos.append(
                TodoSchema(
                    todoId=todo.todoid,
                    groupId=todo.groupid,
                    assigneeId=todo.assigneeid,
                    assignerId=todo.assignerid,
                    name=todo.name,
                    description=todo.description,
                    completed=todo.completed,
                    deadline=todo.deadline
                )
                
            )
        return todos
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")
    
# List todo by todo id
@router.get("/listTodoByTodoId/{todo_id}", response_model=TodoSchema)
def list_todo_by_todo_id(todo_id: str, db: Session = Depends(get_db)):
    try:
        db_todo = db.query(TodoModel).filter(TodoModel.todoid == todo_id).first()
        if not db_todo:
            raise HTTPException(status_code=404, detail="Todo not found")
        # parse todo
        todo = TodoSchema(
            todoId=db_todo.todoid,
            groupId=db_todo.groupid,
            assigneeId=db_todo.assigneeid,
            assignerId=db_todo.assignerid,
            name=db_todo.name,
            description=db_todo.description,
            completed=db_todo.completed,
            deadline=db_todo.deadline
        )
        return todo
    except HTTPException as e:
        raise e
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")

# List todo by user id
@router.get("/listTodoByUserId/{user_id}", response_model=List[TodoSchema])
def list_todo_by_user_id(user_id: str, db: Session = Depends(get_db)):
    try:
        db_todos = db.query(TodoModel).filter(TodoModel.userid == user_id).all()
        if not db_todos:
            raise HTTPException(status_code=404, detail="Todo not found")
        # parse todo
        todos = []
        for todo in db_todos:
            todos.append(
                TodoSchema(
                    todoId=todo.todoid,
                    groupId=todo.groupid,
                    assigneeId=todo.assigneeid,
                    assignerId=todo.assignerid,
                    name=todo.name,
                    description=todo.description,
                    completed=todo.completed,
                    deadline=todo.deadline
                )
            )
        return todos
    except HTTPException as e:
        raise e
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")
    
# List todo by event id
@router.get("/listTodoByEventId/{event_id}", response_model=List[TodoSchema])
def list_todo_by_event_id(event_id: str, db: Session = Depends(get_db)):
    try:
        db_todos = db.query(TodoModel).filter(TodoModel.eventid == event_id).all()
        if not db_todos:
            raise HTTPException(status_code=404, detail="Todo not found")
        # parse todo
        todos = []
        for todo in db_todos:
            todos.append(
                TodoSchema(
                    todoId=todo.todoid,
                    groupId=todo.groupid,
                    assigneeId=todo.assigneeid,
                    assignerId=todo.assignerid,
                    name=todo.name,
                    description=todo.description,
                    completed=todo.completed,
                    deadline=todo.deadline
                )

            )
        return todos
    except HTTPException as e:
        raise e
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")
    
# Update Todo
# Update todo by todo id
@router.put("/updateTodoByTodoId/{todo_id}", response_model=TodoSchema)
def update_todo_by_todo_id(todo_id: str, todo: TodoSchema, db: Session = Depends(get_db)):
    try:
        db_todo = db.query(TodoModel).filter(TodoModel.todoid == todo_id).first()
        if not db_todo:
            raise HTTPException(status_code=404, detail="Todo not found")
        db_todo.groupid = todo.groupId
        db_todo.assigneeid = todo.assigneeId
        db_todo.assignerid = todo.assignerId
        db_todo.name = todo.name
        db_todo.description = todo.description
        db_todo.completed = todo.completed
        db_todo.deadline = todo.deadline

        db.commit()
        db.refresh(db_todo)
        return db_todo
    except HTTPException as e:
        raise e
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")
    
# Delete Todo
# Delete todo by todo id
@router.delete("/deleteTodoByTodoId/{todo_id}")
def delete_todo_by_todo_id(todo_id: str, db: Session = Depends(get_db)):
    try:
        db_todo = db.query(TodoModel).filter(TodoModel.todoid == todo_id).first()
        if not db_todo:
            raise HTTPException(status_code=404, detail="Todo not found")
        db.delete(db_todo)
        db.commit()
        return {"message": "Delete Success"}
    except HTTPException as e:
        raise e
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")

# PrivateEvent CRUD
# Create PrivateEvent
@router.post("/createPrivateEvent", response_model=PrivateEventSchema)
def create_private_event(private_event: PrivateEventSchema, db: Session = Depends(get_db)):
    try:
        db_private_event = PrivateEventSchema(
                eventId=private_event.eventid,
                userId=private_event.userid,
                name=private_event.name,
                description=private_event.description,
                eventStart=private_event.event_start,
                eventEnd=private_event.event_end,
            )
        db.add(db_private_event)
        db.commit()
        db.refresh(db_private_event)
        return db_private_event
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")

# Read PrivateEvent
# List all private events
@router.get("/listAllPrivateEvent", response_model=List[PrivateEventSchema])
def list_all_private_event(db: Session = Depends(get_db)):
    try:
        db_private_events = db.query(PrivateEventModel).all()
        # parse private event
        private_events = []
        for private_event in db_private_events:
            private_events.append(
                PrivateEventSchema(
                eventId=private_event.eventid,
                userId=private_event.userid,
                name=private_event.name,
                description=private_event.description,
                eventStart=private_event.event_start,
                eventEnd=private_event.event_end,
            )
            )
        return private_events
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")
    
# List private event by id
@router.get("/listPrivateEventById/{private_event_id}", response_model=PrivateEventSchema)
def list_private_event_by_id(private_event_id: str, db: Session = Depends(get_db)):
    try:
        db_private_event = (
            db.query(PrivateEventModel)
            .filter(PrivateEventModel.eventid == private_event_id)
            .first()
        )
        if not db_private_event:
            raise HTTPException(status_code=404, detail="Private Event not found")
        # parse private event
        private_event = PrivateEventSchema(
            eventId=db_private_event.eventid,
            userId=db_private_event.userid,
            name=db_private_event.name,
            description=db_private_event.description,
            eventStart=db_private_event.event_start,
            eventEnd=db_private_event.event_end,
        )
        return private_event
    except HTTPException as e:
        raise e
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")

# Update PrivateEvent
# Update private event by id
@router.put("/updatePrivateEventById/{private_event_id}", response_model=PrivateEventSchema)
def update_private_event_by_id(private_event_id: str, private_event: PrivateEventSchema, db: Session = Depends(get_db)):
    try:
        db_private_event = (
            db.query(PrivateEventModel)
            .filter(PrivateEventModel.eventid == private_event_id)
            .first()
        )
        if not db_private_event:
            raise HTTPException(status_code=404, detail="Private Event not found")
        
        db_private_event.eventid = private_event.eventId
        db_private_event.userid = private_event.userId
        db_private_event.event_start = private_event.eventStart
        db_private_event.event_end = private_event.eventEnd
        db_private_event.name = private_event.name
        db_private_event.description = private_event.description
        db.commit()
        return private_event
    except HTTPException as e:
        raise e
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")

# Delete PrivateEvent
# Delete private event by id
@router.delete("/deletePrivateEventById/{private_event_id}")
def delete_private_event_by_id(private_event_id: str, db: Session = Depends(get_db)):
    try:
        db_private_event = (
            db.query(PrivateEventModel)
            .filter(PrivateEventModel.eventid == private_event_id)
            .first()
        )
        if not db_private_event:
            raise HTTPException(status_code=404, detail="Private Event not found")
        db.delete(db_private_event)
        db.commit()
        return {"message": "Delete Success"}
    except HTTPException as e:
        raise e
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")
    
