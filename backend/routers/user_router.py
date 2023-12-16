# user_router.py
from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect
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
    GroupEventJoinUser as GroupEventJoinUserSchema,
)

import json
from datetime import datetime
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

# 更新使用者
@router.put("/updateUser", response_model=UserSchema)
def update_user(user: UserSchema, db: Session = Depends(get_db)):
    try:
        db_user = (
            db.query(UserModel)
            .filter(UserModel.userid == user.userId)
            .first()
        )
        if not db_user:
            raise HTTPException(status_code=404, detail="User not found")
        db_user.name = user.name
        db_user.account = user.account
        db_user.password = user.password
        db_user.profile_pic_url = user.profilePicUrl
        db.commit()
        return user
    except HTTPException as e:
        raise e
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
@router.get("/getUserJoinEvents/{user_id}", response_model=List)
def get_user_join_events(user_id: str, db: Session = Depends(get_db)):
    try:
        query = text(
            """
            SELECT * FROM group_event
            JOIN user_join_event ON group_event.eventid = user_join_event.eventid
            WHERE user_join_event.userid = :user_id
            """
        )
        db_group_event = db.execute(query, {"user_id": user_id}).all()
        logging.info(db_group_event)

        # modify status according to current time
        for event in db_group_event:
            if event.vote_start:
                if datetime.now() < event.votedeadline:
                    event.status = 'In_Voting'
                else: 
                    event.status = 'End_Voting'
                    
                if event.status == 'End_Voting':
                    if datetime.now() < event.event_start:
                        event.status = 'Not_Start_Yet'
                    elif datetime.now() < event.event_end:
                        event.status = 'On_Going'
                    else:
                        event.status = 'Closure'

        # parse db_group_event to schema
        group_events = []
        for event in db_group_event:
            group_events.append(
                {
                    "eventId": event.eventid,
                    "groupId": event.groupid,
                    "name": event.name,
                    "description": event.description,
                    "status": event.status,
                    "organizerId": event.organizerid,
                    "voteStart": event.vote_start,
                    "voteEnd": event.vote_end,
                    "voteDeadline": event.votedeadline,
                    "havePossibility": event.havepossibility,
                    "eventStart": event.event_start,
                    "eventEnd": event.event_end,
                    "userId": event.userid,
                    "isAccepted": event.isaccepted,
                }
            )
        
        return group_events
    except HTTPException as e:
        raise e
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")

# 獲取User Join Event
@router.get("/getUserJoinEvent/{event_id}/{user_id}", response_model=UserJoinEventSchema)
def get_user_join_event(event_id: str, user_id: str, db: Session = Depends(get_db)):
    try:
        db_user_join_event = (
            db.query(UserJoinEventModel)
            .filter(
                UserJoinEventModel.eventid == event_id,
                UserJoinEventModel.userid == user_id,
            )
            .first()
        )
        if not db_user_join_event:
            return UserJoinEventSchema(
                eventId=event_id,
                userId=user_id,
                isAccepted=None,
            )

        return UserJoinEventSchema(
            eventId=db_user_join_event.eventid,
            userId=db_user_join_event.userid,
            isAccepted=db_user_join_event.isaccepted,
        )
    except HTTPException as e:
        raise e
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error:{e}")


# 查詢自己所有TODO
@router.get("/getUserTodos/{user_id}", response_model=List)
def get_user_todos(user_id: str, db: Session = Depends(get_db)):
    try:

        query = text(
            """
            SELECT todo.name as name, todoid, groupid, assigneeid, u1.name as assigneeName, assignerid, groupId, u2.name as assignerName, description, completed, deadline FROM todo
            JOIN user_table AS u1 ON todo.assigneeid = u1.userid
            JOIN user_table AS u2 ON todo.assignerid = u2.userid
            WHERE assigneeid = :user_id or assignerid = :user_id

            """
        )
        db_todo = db.execute(query, {"user_id": user_id}).all()

        # convert to schema
        todos = []
        for todo in db_todo:
            todos.append({
                "todoId": todo.todoid,
                "assigneeId": todo.assigneeid,
                "assigneeName": todo.assigneename,
                "assignerId": todo.assignerid,
                "assignerName": todo.assignername,
                "description": todo.description,
                "deadline": todo.deadline,
                "completed": todo.completed,
                "groupId": todo.groupid,
                "name": todo.name
            })

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
    

# Dictionary to store active WebSocket connections for each group
active_connections_by_group = {}
# 送給上線團隊使用者訊息
# Function to broadcast a message to all users in a group
async def broadcast_message(group_id: str, message: dict):
    if group_id in active_connections_by_group:
        connections = active_connections_by_group[group_id]
        message = json.dumps(message)
        for connection in connections:
            try:
                await connection.send_text(message)
            except Exception as e:
                print(f"Error broadcasting message to {group_id}: {e}")

# 使用WebSocket接收訊息
@router.websocket("/ws/{group_id}")
async def websocket_endpoint(websocket: WebSocket, group_id: str, db: Session = Depends(get_db)):
    await websocket.accept()
    if group_id not in active_connections_by_group:
        active_connections_by_group[group_id] = []

    active_connections_by_group[group_id].append(websocket)
    try: 
        while True:
            message = await websocket.receive_text()
            message = json.loads(message)
            message = {
                "speakerId": message.get("speakerId"),
                "speakerName": message.get("speakerName"),
                "groupId": message.get("groupId"),
                "content": message.get("content"),
                "timing": message.get("timing"),
            }
            try:
                await broadcast_message(group_id, message)
                db_chat = ChatModel(
                    speakerid=message.get("speakerId"),
                    groupid=message.get("groupId"),
                    content=message.get("content"),
                    timing=message.get("timing"),
                )
                db.add(db_chat)
                db.commit()
                
            except Exception as e:
                print(f"Error broadcasting message to {group_id}: {e}")
            
    except WebSocketDisconnect:
        # Remove the WebSocket connection when disconnected
        active_connections_by_group[group_id].remove(websocket)
        print(f"WebSocket connection with {group_id} closed")


    

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

@router.post("/createMessage", response_model=ChatSchema)
def create_message(chat: ChatSchema, db: Session = Depends(get_db)):
    try:
        db_chat = ChatModel(
            speakerid=chat.speakerId,
            groupid=chat.groupId,
            content=chat.content,
            timing=chat.timing,
        )
        db.add(db_chat)
        db.commit()
        return chat
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")

# 用戶在特定團隊裡說的話
@router.get("/getMessages/{group_id}", response_model=List)
def get_user_chat(group_id: str, db: Session = Depends(get_db)):
    try:

        query = text(
            """
            SELECT name, groupId, content, timing, speakerId FROM chat
            JOIN user_table ON chat.speakerid = user_table.userid
            WHERE groupId = :group_id
            ORDER BY timing ASC
            """
        )
        db_chat = db.execute(query, {"group_id": group_id}).all()

        # convert to schema
        chats = []
        for chat in db_chat:
            chats.append(
                {
                    "speakerId": chat.speakerid,
                    "speakerName": chat.name,
                    "groupId": chat.groupid,
                    "content": chat.content,
                    "timing": chat.timing,
                }
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
        
        # modify status according to current time
        if db_group_event.vote_start:
            if datetime.now() < db_group_event.deadline:
                db_group_event.status = 'In_Voting'
            else: 
                db_group_event.status = 'End_Voting'
                
            if db_group_event.status == 'End_Voting':
                if datetime.now() < db_group_event.event_start:
                    db_group_event.status = 'Not_Start_Yet'
                elif datetime.now() < db_group_event.event_end:
                    db_group_event.status = 'On_Going'
                else:
                    db_group_event.status = 'Closure'
        

                

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



@router.get("/listAllVoteCountByEventId/{event_id}", response_model=List )
def list_all_vote_count_by_event_id(event_id: str, db: Session = Depends(get_db)):
    try:
        query = text("Select available_start, count(*) as count, possibility_level FROM available_time WHERE eventid = :event_id group by available_start, possibility_level")

        db_available_times = db.execute(query, {"event_id": event_id}).fetchall()
        
        if not db_available_times:
            raise HTTPException(status_code=404, detail="Available Time not found")
        # parse available time
        available_times = []
        for available_time in db_available_times:
            available_times.append(
                {
                    "availableStart": available_time.available_start,
                    "availableAmount": available_time.count,
                    "possibilityLevel": available_time.possibility_level
                }
            )
        return available_times
    except HTTPException as e:
        raise e
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error:{e}")
    
# 查詢管理員
@router.get("/listGroupHasManager/{group_id}", response_model=List)
def list_group_has_manager(group_id: str, db: Session = Depends(get_db)):
    try:
        query = text("SELECT u.userid, u.name, u.account, u.profile_pic_url FROM group_has_manager gm JOIN user_table  u ON gm.userid = u.userid WHERE gm.groupid = :group_id")

        db_group_has_managers = db.execute(query, {"group_id": group_id}).fetchall()
        
        if not db_group_has_managers:
            raise HTTPException(status_code=404, detail="Group Has Manager not found")
        
        # parse
        group_has_managers = []
        for group_has_manager in db_group_has_managers:
            group_has_managers.append(
                {
                    "userId": group_has_manager.userid,
                    "name": group_has_manager.name,
                    "account": group_has_manager.account,
                    "profilePicUrl": group_has_manager.profile_pic_url
                }
            )
        return group_has_managers
    except HTTPException as e:
        raise e
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error:{e}")
    
# 查詢團隊成員
@router.get("/listGroupHasUser/{group_id}", response_model=List)
def list_group_has_user(group_id: str, db: Session = Depends(get_db)):
    try:
        query = text("SELECT u.userid, u.name, u.account, u.profile_pic_url FROM group_has_user gm JOIN user_table  u ON gm.userid = u.userid WHERE gm.groupid = :group_id")

        db_group_has_users = db.execute(query, {"group_id": group_id}).fetchall()
        
        if not db_group_has_users:
            raise HTTPException(status_code=404, detail="Group Has User not found")
        
        # parse
        group_has_users = []
        for group_has_user in db_group_has_users:
            group_has_users.append(
                {
                    "userId": group_has_user.userid,
                    "name": group_has_user.name,
                    "account": group_has_user.account,
                    "profilePicUrl": group_has_user.profile_pic_url
                }
            )
        return group_has_users
    except HTTPException as e:
        raise e
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error:{e}")
    

# List group event by group id
@router.get("/listGroupEventByGroupId/{group_id}", response_model=List[GroupEventJoinUserSchema])
def list_group_event_by_group_id(group_id: str, db: Session = Depends(get_db)):
    try:
        query = text("SELECT ge.*, u.name AS organizer_name, u.account AS organizer_account, u.profile_pic_url AS organizer_profile_pic_url FROM group_event ge JOIN user_table u ON ge.organizerid = u.userid WHERE ge.groupid = :group_id")

        db_group_events = db.execute(query, {"group_id": group_id}).fetchall()
        
        if not db_group_events:
            raise HTTPException(status_code=404, detail="Group Event not found")
        # parse group event
        group_events = []
        for group_event in db_group_events:
            group_events.append(
                GroupEventJoinUserSchema(
                    eventId=group_event.eventid,
                    groupId=group_event.groupid,
                    name=group_event.name,
                    description=group_event.description,
                    status=group_event.status,
                    organizerId=group_event.organizerid,
                    voteStart=group_event.vote_start,
                    voteEnd=group_event.vote_end,
                    voteDeadline=group_event.votedeadline,
                    havePossibility=group_event.havepossibility,
                    eventStart=group_event.event_start,
                    eventEnd=group_event.event_end,
                    organizerName=group_event.organizer_name,
                    organizerAccount=group_event.organizer_account,
                    organizerProfilePicUrl=group_event.organizer_profile_pic_url,
                )
            )
        return group_events
    except HTTPException as e:
        raise e
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")
    
@router.get("/getPrivateEventsByUserId", response_model=List[PrivateEventSchema])
def get_private_events_by_user_id(user_id: str, db: Session = Depends(get_db)):
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
    
from sqlalchemy import and_

@router.post("/createAvailableTime", response_model=List[AvailableTimeSchema])
def create_available_time(available_time: List[AvailableTimeSchema], db: Session = Depends(get_db)):
    try:
        for time in available_time:
            # Check if a record with the same userid, eventid, and available_start exists
            existing_record = db.query(AvailableTimeModel).filter(
                and_(
                    AvailableTimeModel.userid == time.userId,
                    AvailableTimeModel.eventid == time.eventId,
                    AvailableTimeModel.available_start == time.availableStart
                )
            ).first()

            # If it does, delete it
            if existing_record:
                db.delete(existing_record)
                db.commit()

            # Create a new record
            db_available_time = AvailableTimeModel(
                userid=time.userId,
                eventid=time.eventId,
                available_start=time.availableStart,
                possibility_level=time.possibilityLevel,
            )
            db.add(db_available_time)
            db.commit()
        return available_time
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")


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
