# database.py
from fastapi import HTTPException
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import DeclarativeBase

SQLALCHEMY_DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/EventMaster" # postgresql://user:password@postgresserver/db

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
class Base(DeclarativeBase):
    __allow_unmapped__ = True
    pass

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


