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
from database import metaData

import logging

logging.basicConfig(level=logging.DEBUG)

router = APIRouter()


# 列出所有table
@router.get("/listAllTable")
def list_all_table_in_db(db: Session = Depends(get_db)):
    try:
        logging.info(metaData.tables.keys())
        # parse table name
        table_name_list = []
        for table_name in metaData.tables.keys():
            table_name_list.append(table_name)
        return table_name_list
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")


# 列出所有使用者
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
                    profilePicUrl=user.profile_pid_url,
                )
            )

        return users
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")


# 列出所有團隊
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
