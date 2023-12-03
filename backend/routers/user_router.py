# user_router.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.sql import text
from database import get_db
from models.models import User
router = APIRouter()

@router.get("/users")
def get_users(db: Session = Depends(get_db)):
    try: 
        user = db.query(User).all()
        return user
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")

@router.get("/users/{user_id}")
def get_user(user_id: str, db: Session = Depends(get_db)):
    try:
        user = db.query(User).filter(User.userid == user_id).first()
        return user
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")
    pass