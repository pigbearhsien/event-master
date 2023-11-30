# main.py
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.sql import text
from routers import user_router
from database import SessionLocal, get_db
import logging

logging.basicConfig(level=logging.DEBUG)

app = FastAPI()


app.include_router(user_router.router, prefix="/api", tags=["users"], dependencies=[Depends(get_db)])
