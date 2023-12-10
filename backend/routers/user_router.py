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
@router.get(
    "/getGroupEventVoteResult/{event_id}", response_model=List[AvailableTimeSchema]
)
def get_group_event_vote_result(event_id: str, db: Session = Depends(get_db)):
    try:
        db_available_time = (
            db.query(AvailableTimeModel)
            .filter(AvailableTimeModel.eventid == event_id)
            .all()
        )

        # convert to schema
        available_times = []
        for time in db_available_time:
            available_times.append(
                AvailableTimeSchema(
                    userId=time.userid,
                    eventId=time.eventid,
                    availableStart=time.available_start,
                    possibilityLevel=time.possibility_level,
                )
            )

        # if available_times is empty, return 404
        if not available_times:
            raise HTTPException(status_code=404, detail="Available Time not found")

        return available_times
    except HTTPException as e:
        raise e
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")


# 查詢使用者的所有團隊
@router.get("/getUserGroups/{user_id}", response_model=List[GroupSchema])
def get_user_groups(user_id: str, db: Session = Depends(get_db)):
    try:
        db_group = (
            db.query(GroupModel)
            .join(GroupHasUserModel, GroupModel.groupid == GroupHasUserModel.groupid)
            .filter(GroupHasUserModel.userid == user_id)
            .all()
        )

        # convert to schema
        groups = []
        for group in db_group:
            groups.append(
                GroupSchema(
                    groupId=group.groupid,
                    name=group.name,
                )
            )

        if not groups:
            raise HTTPException(status_code=404, detail="Group not found")
        return groups

    except HTTPException as e:
        raise e
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")


# 查詢自己所有確認參加的團隊活動
@router.get("/getUserJoinEvents/{user_id}", response_model=List[GroupEventSchema])
def get_user_join_events(user_id: str, db: Session = Depends(get_db)):
    try:
        logging.info(user_id)
        db_group_event = (
            db.query(GroupEventModel)
            .join(
                UserJoinEventModel,
                GroupEventModel.eventid == UserJoinEventModel.eventid,
            )
            .filter(UserJoinEventModel.userid == user_id)
            .all()
        )

        # convert to schema
        group_events = []
        for event in db_group_event:
            group_events.append(
                GroupEventSchema(
                    eventId=event.eventid,
                    groupId=event.groupid,
                    name=event.name,
                    description=event.description,
                    status=event.status,
                    organizerId=event.organizerid,
                    voteStart=event.vote_start,
                    voteEnd=event.vote_end,
                    voteDeadline=event.votedeadline,
                    havePossibility=event.havepossibility,
                    eventStart=event.event_start,
                    eventEnd=event.event_end,
                )
            )

        if not group_events:
            raise HTTPException(status_code=404, detail="Event not found")

        return group_events
    except HTTPException as e:
        raise e
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")


# 查詢自己所有TODO
@router.get("/getUserTodos/{user_id}", response_model=List[TodoSchema])
def get_user_todos(user_id: str, db: Session = Depends(get_db)):
    try:
        db_todo = db.query(TodoModel).filter(TodoModel.assigneeid == user_id).all()

        # convert to schema
        todos = []
        for todo in db_todo:
            todos.append(
                TodoSchema(
                    todoId=todo.todoid,
                    groupId=todo.groupid,
                    assigneeId=todo.assigneeid,
                    assignerId=todo.assignerid,
                    name=todo.name,
                    description=todo.description,
                    completed=todo.completed,
                    deadline=todo.deadline,
                )
            )

        if not todos:
            raise HTTPException(status_code=404, detail="Todo not found")

        return todos

    except HTTPException as e:
        raise e

    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")


# 查詢自己所有私人活動
@router.get("/getUserPrivateEvents/{user_id}", response_model=List[PrivateEventSchema])
def get_user_private_events(user_id: str, db: Session = Depends(get_db)):
    try:
        db_private_event = (
            db.query(PrivateEventModel)
            .filter(PrivateEventModel.userid == user_id)
            .all()
        )

        # convert to schema
        private_events = []
        for event in db_private_event:
            private_events.append(
                PrivateEventSchema(
                    eventId=event.eventid,
                    userId=event.userid,
                    name=event.name,
                    description=event.description,
                    eventStart=event.event_start,
                    eventEnd=event.event_end,
                )
            )

        if not private_events:
            raise HTTPException(status_code=404, detail="Private Event not found")
        return private_events

    except HTTPException as e:
        raise e

    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")


# 查詢使用者在特定團隊活動的可以時間和程度
@router.get(
    "/getUserAvailableTime/{event_id}/{user_id}",
    response_model=List[AvailableTimeSchema],
)
def get_user_available_time(event_id: str, user_id: str, db: Session = Depends(get_db)):
    try:
        db_available_time = (
            db.query(AvailableTimeModel)
            .filter(
                AvailableTimeModel.eventid == event_id,
                AvailableTimeModel.userid == user_id,
            )
            .all()
        )

        # convert to schema
        available_times = []
        for time in db_available_time:
            available_times.append(
                AvailableTimeSchema(
                    userId=time.userid,
                    eventId=time.eventid,
                    availableStart=time.available_start,
                    possibilityLevel=time.possibility_level,
                )
            )
        if not available_times:
            raise HTTPException(status_code=404, detail="Available Time not found")

        return available_times
    except HTTPException as e:
        raise e
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")


# 用戶在特定團隊裡說的話
@router.get("/getMessages/{group_id}", response_model=List[ChatSchema])
def get_user_chat(group_id: str, db: Session = Depends(get_db)):
    try:
        db_chat = db.query(ChatModel).filter(ChatModel.groupid == group_id).all()

        # convert to schema
        chats = []
        for chat in db_chat:
            chats.append(
                ChatSchema(
                    speakerId=chat.speakerid,
                    groupId=chat.groupid,
                    content=chat.content,
                    timing=chat.timing,
                )
            )
        if not chats:
            raise HTTPException(status_code=404, detail="Chat not found")
        return chats
    except HTTPException as e:
        raise e
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")

# 獲得指定使用者的資料
@router.get("/getUser/{user_id}", response_model=UserSchema)
def get_user(user_id: str, db: Session = Depends(get_db)):
    try:
        db_user = db.query(UserModel).filter(UserModel.userid == user_id).first()
        if not db_user:
            raise HTTPException(status_code=404, detail="User not found")

        return UserSchema(
            userId=db_user.userid,
            name=db_user.name,
            account=db_user.account,
            password=db_user.password,
            profilePicUrl=db_user.profile_pic_url,
        )
    except HTTPException as e:
        raise e
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")
    
# 獲得指定團隊的資料
@router.get("/getGroup/{group_id}", response_model=GroupSchema)
def get_group(group_id: str, db: Session = Depends(get_db)):
    try:
        db_group = db.query(GroupModel).filter(GroupModel.groupid == group_id).first()
        if not db_group:
            raise HTTPException(status_code=404, detail="Group not found")

        return GroupSchema(
            groupId=db_group.groupid,
            name=db_group.name,
        )
    except HTTPException as e:
        raise e
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")
    
# 獲得指定團隊活動的資料
@router.get("/getGroupEvent/{event_id}", response_model=GroupEventSchema)
def get_group_event(event_id: str, db: Session = Depends(get_db)):
    try:
        db_group_event = db.query(GroupEventModel).filter(GroupEventModel.eventid == event_id).first()
        if not db_group_event:
            raise HTTPException(status_code=404, detail="Group Event not found")

        return GroupEventSchema(
            eventId=db_group_event.eventid,
            groupId=db_group_event.groupid,
            name=db_group_event.name,
            description=db_group_event.description,
            status=db_group_event.status,
            organizerId=db_group_event.organizerid,
            voteStart=db_group_event.vote_start,
            voteEnd=db_group_event.vote_end,
            voteDeadline=db_group_event.votedeadline,
            havePossibility=db_group_event.havepossibility,
            eventStart=db_group_event.event_start,
            eventEnd=db_group_event.event_end,
        )
    except HTTPException as e:
        raise e
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")



