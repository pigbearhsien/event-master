# user_router.py
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from sqlalchemy.sql import text
from database import get_db
from models.models import (
    Group as GroupModel,
    GroupHasManager as GroupHasManagerModel,
    GroupHasUser as GroupHasUserModel,
)
import logging
from schemas.group import Group as GroupSchema
from schemas.groupHasManager import GroupHasManager as GroupHasManagerSchema

from schemas.groupHasUser import GroupHasUser as GroupHasUserSchema


from models.models import Todo as TodoModel
from schemas.todo import Todo as TodoSchema

logging.basicConfig(level=logging.DEBUG)


router = APIRouter()


# 新增團隊
@router.post("/createGroup/{manager_id}", response_model=GroupSchema)
async def create_group(
    manager_id: str, group: GroupSchema, db: Session = Depends(get_db)
):
    try:
        # 1. Add Group
        db_group = GroupModel(groupid=group.GroupId, name=group.name)
        logging.info(db_group)
        db.add(db_group)

        # 2. Add Manager to Group
        db_manager = GroupHasManagerModel(groupid=group.GroupId, userid=manager_id)
        db.add(db_manager)
        db.commit()

        # 3. Add User to Group
        db_user = GroupHasUserModel(groupid=group.GroupId, userid=manager_id)
        db.add(db_user)
        db.commit()

        return group
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")


# 新增團隊成員
@router.post("/insertUserToGroup", response_model=GroupHasUserSchema)
async def insert_user_to_group(
    group_has_user: GroupHasUserSchema, db: Session = Depends(get_db)
):
    try:
        db_group_has_user = GroupHasUserModel(
            groupid=group_has_user.groupid, userid=group_has_user.userid
        )
        db.add(db_group_has_user)
        db.commit()
        return group_has_user
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")


# 踢出團隊成員
@router.delete("/deleteUserFromGroup/{group_id}/{user_id}")
async def delete_user_from_group(
    group_id: str, user_id: str, db: Session = Depends(get_db)
):
    try:
        db.query(GroupHasUserModel).filter(
            GroupHasUserModel.groupid == group_id, GroupHasUserModel.userid == user_id
        ).delete()
        db.commit()
        return f'{"message": "User {user_id} is deleted from the group"}'
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")


# 指派團隊成員為管理員
@router.post("/insertManagerToGroup", response_model=GroupHasManagerSchema)
async def add_admin(
    group_has_manager: GroupHasManagerSchema, db: Session = Depends(get_db)
):
    try:
        db_group_has_manager = GroupHasManagerModel(
            groupid=group_has_manager.groupid, userid=group_has_manager.userid
        )
        db.add(db_group_has_manager)
        db.commit()
        return group_has_manager
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")


# 分析團隊成員投票狀況
@router.get("/groupMemberVoteStatus/{group_id}/{user_id}")
async def get_group_member_vote_status(
    group_id: str, user_id: str, db: Session = Depends(get_db)
):
    try:
        # TODO: Write SQL query
        return
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")


# 分析團隊成員的投票可能性
@router.get("/groupMemberVotePossibility/{group_id}")
async def get_group_member_vote_possibility(
    group_id: str, db: Session = Depends(get_db)
):
    try:
        # TODO: Write SQL query
        return
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")


# 指派團隊成員待辦事項TODO
@router.post("/insertTodoToGroup", response_model=TodoSchema)
async def insert_todo_to_group(todo: TodoSchema, db: Session = Depends(get_db)):
    try:
        db_todo = TodoModel(
            todoid=todo.todoId,
            groupid=todo.groupId,
            assigneeid=todo.assigneeId,
            assignerid=todo.assignerId,
            name=todo.name,
            description=todo.description,
            completed=todo.completed,
            deadline=todo.deadline,
        )
        db.add(db_todo)
        db.commit()
        return todo
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")
