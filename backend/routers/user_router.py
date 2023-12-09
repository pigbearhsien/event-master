# user_router.py
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
)

import logging

logging.basicConfig(level=logging.DEBUG)

router = APIRouter()


# 創建使用者
@router.post("/createUser", response_model=UserSchema)
def create_user(user: UserSchema, db: Session = Depends(get_db)):
    try:
        db_user = UserModel(
            userid=user.userId,
            name=user.name,
            account=user.account,
            password=user.password,
            profile_pic_url=user.profilePicUrl,
        )
        db.add(db_user)
        db.commit()
        return user
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")

# 發起團隊活動
@router.post("/createGroupEvent", response_model=GroupEventSchema)
def create_group_event(group_event: GroupEventSchema, db: Session = Depends(get_db)):
    try:
        db_group_event = GroupEventModel(
            eventid=group_event.eventId,
            groupid=group_event.groupId,
            name=group_event.name,
            description=group_event.description,
            status=group_event.status,
            organizerid=group_event.organizerId,
            vote_start=group_event.voteStart,
            vote_end=group_event.voteEnd,
            vote_deadline=group_event.voteDeadline,
            have_possibility=group_event.havePossibility,
        )
        db.add(db_group_event)
        db.commit()
        return group_event
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")

# 顯示某團隊活動的投票結果
@router.get("/getGroupEventVoteResult/{event_id}", response_model=List[AvailableTimeSchema])
def get_group_event_vote_result(event_id: str, db: Session = Depends(get_db)):
    try:
        db_available_time = db.query(AvailableTimeModel).filter(AvailableTimeModel.eventid == event_id).all()

        if db_available_time is [] or db_available_time is None:
            raise HTTPException(status_code=404, detail="Event not found")
        
        return db_available_time
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")
    
# 查詢使用者的所有團隊
@router.get("/getUserGroups/{user_id}", response_model=List[GroupSchema])
def get_user_groups(user_id: str, db: Session = Depends(get_db)):
    try:
        db_group = db.query(GroupModel).join(GroupHasUserModel, GroupModel.groupid == GroupHasUserModel.groupid).filter(GroupHasUserModel.userid == user_id).all()

        if db_group is [] or db_group is None:
            raise HTTPException(status_code=404, detail="Group not found")
        
        return db_group
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")
    
# 查詢自己所有確認參加的團隊活動
@router.get("/getUserJoinEvents/{user_id}", response_model=List[GroupEventSchema])
def get_user_join_events(user_id: str, db: Session = Depends(get_db)):
    try:
        db_group_event = db.query(GroupEventModel).join(UserJoinEventModel, GroupEventModel.eventid == UserJoinEventModel.eventid).filter(UserJoinEventModel.userid == user_id).all()

        if db_group_event is [] or db_group_event is None:
            raise HTTPException(status_code=404, detail="Event not found")
        
        return db_group_event
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")
    
# 查詢自己所有TODO
@router.get("/getUserTodos/{user_id}", response_model=List[TodoSchema])
def get_user_todos(user_id: str, db: Session = Depends(get_db)):
    try:
        db_todo = db.query(TodoModel).filter(TodoModel.userid == user_id).all()

        if db_todo is [] or db_todo is None:
            raise HTTPException(status_code=404, detail="Todo not found")
        
        return db_todo
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")
    
# 查詢自己所有私人活動
@router.get("/getUserPrivateEvents/{user_id}", response_model=List[PrivateEventSchema])
def get_user_private_events(user_id: str, db: Session = Depends(get_db)):
    try:
        db_private_event = db.query(PrivateEventModel).filter(PrivateEventModel.userid == user_id).all()

        if db_private_event is [] or db_private_event is None:
            raise HTTPException(status_code=404, detail="Private Event not found")
        
        return db_private_event
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")
    
# 查詢使用者在特定團隊活動的可以時間和程度
@router.get("/getUserAvailableTime/{event_id}/{user_id}", response_model=List[AvailableTimeSchema])
def get_user_available_time(event_id: str, user_id: str, db: Session = Depends(get_db)):
    try:
        db_available_time = db.query(AvailableTimeModel).filter(AvailableTimeModel.eventid == event_id, AvailableTimeModel.userid == user_id).all()

        if db_available_time is [] or db_available_time is None:
            raise HTTPException(status_code=404, detail="Available Time not found")
        
        return db_available_time
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")
    
# 用戶在特定團隊裡說的話
@router.get("/getMessages/{group_id}", response_model=List[ChatSchema])
def get_user_chat(group_id: str, db: Session = Depends(get_db)):
    try:
        db_chat = db.query(ChatModel).filter(ChatModel.groupid == group_id).all()

        if db_chat is [] or db_chat is None:
            raise HTTPException(status_code=404, detail="Chat not found")
        
        return db_chat
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")