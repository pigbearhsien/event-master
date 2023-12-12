from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from sqlalchemy.sql import text
from database import get_db
from models import (
    Group as GroupModel,
    GroupEvent as GroupEventModel,
    GroupHasUser as GroupHasUserModel,
)
from schemas import (
    Group as GroupSchema,
    GroupEvent as GroupEventSchema,
    GroupHasUser as GroupHasUserSchema,
)

import logging

logging.basicConfig(level=logging.DEBUG)

router = APIRouter()


# 確認活動成立以及時間
@router.post("/setGroupEventTime", response_model=GroupEventSchema)
def set_group_event_time(group_event: GroupEventSchema, db: Session = Depends(get_db)):
    try:
        db_group_event = (
            db.query(GroupEventModel)
            .filter(GroupEventModel.eventid == group_event.eventId)
            .first()
        )

        if not db_group_event:
            raise HTTPException(status_code=404, detail="Event not found")

        db_group_event.event_start = group_event.eventStart
        db_group_event.event_end = group_event.eventEnd
        db_group_event.status = group_event.status

        db.commit()
        return group_event
    except HTTPException as e:
        raise e
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")


# 確認活動不成立（刪除）
@router.delete("/deleteGroupEvent/{event_id}", response_model=GroupEventSchema)
def delete_group_event(event_id: str, db: Session = Depends(get_db)):
    try:
        db_group_event = (
            db.query(GroupEventModel)
            .filter(GroupEventModel.eventid == event_id)
            .first()
        )

        if not db_group_event:
            raise HTTPException(status_code=404, detail="Event not found")

        db.delete(db_group_event)
        db.commit()
        return {"message": "Delete Success"}
    except HTTPException as e:
        raise e
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")


# 新增活動參與者
@router.post("/insertUserToGroupEvent", response_model=GroupHasUserSchema)
def insert_user_to_group_event(
    group_has_user: GroupHasUserSchema, db: Session = Depends(get_db)
):
    try:
        db_group_has_user = GroupHasUserModel(
            groupid=group_has_user.groupId, userid=group_has_user.userId
        )

        db.add(db_group_has_user)
        db.commit()
        return group_has_user
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")


# 刪除活動參與者
@router.delete("/deleteUserFromGroupEvent/{group_id}/{user_id}")
def delete_user_from_group_event(
    group_id: str, user_id: str, db: Session = Depends(get_db)
):
    try:
        db.query(GroupHasUserModel).filter(
            GroupHasUserModel.groupid == group_id, GroupHasUserModel.userid == user_id
        ).delete()
        db.commit()
        return {"message": "Delete Success"}
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")
    
# 更新團隊活動
@router.put("/updateGroupEvent", response_model=GroupEventSchema)
def update_group_event(group_event: GroupEventSchema, db: Session = Depends(get_db)):
    try:
        db_group_event = (
            db.query(GroupEventModel)
            .filter(GroupEventModel.eventid == group_event.eventId)
            .first()
        )
        if not db_group_event:
            raise HTTPException(status_code=404, detail="Group Event not found")
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
    
