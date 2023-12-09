# database.py
from fastapi import HTTPException
from sqlalchemy import create_engine, MetaData
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import DeclarativeBase
import os
from dotenv import load_dotenv
import logging

logging.basicConfig(level=logging.DEBUG)

load_dotenv()

SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL") # postgresql://user:password@postgresserver/db

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
metaData = MetaData()
metaData.reflect(bind=engine)

class Base(DeclarativeBase):
    __allow_unmapped__ = True
    pass

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


