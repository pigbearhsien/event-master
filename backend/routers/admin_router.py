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

from sqlalchemy import MetaData, Table
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db

@router.get("/listAllTableSchema")
def list_all_table_schema(db: Session = Depends(get_db)):
    try:
        metadata = MetaData()
        metadata.reflect(bind=db.get_bind())
        table_schemas = {}
        for table_name in metadata.tables.keys():
            table = Table(table_name, metadata, autoload_with=db.get_bind())
            table_schemas[table_name] = {
                column.name: str(column.type)
                for column in table.columns
            }
        return table_schemas
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")


@router.get("/listAllModelSchemas")
def list_all_model_schemas():
    schemas = {
        "UserSchema": UserSchema.schema(),
        "GroupSchema": GroupSchema.schema(),
        "GroupEventSchema": GroupEventSchema.schema(),
        "AvailableTimeSchema": AvailableTimeSchema.schema(),
        "UserJoinEventSchema": UserJoinEventSchema.schema(),
        "GroupHasUserSchema": GroupHasUserSchema.schema(),
        "TodoSchema": TodoSchema.schema(),
        "PrivateEventSchema": PrivateEventSchema.schema(),
        "ChatSchema": ChatSchema.schema(),
    }
    return schemas



