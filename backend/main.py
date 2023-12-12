# main.py
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.sql import text
from routers import manager_router, user_router, organizer_router, admin_router, crud_router
from database import SessionLocal, get_db
import logging
from fastapi.middleware.cors import CORSMiddleware

import os
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(level=logging.DEBUG)

app = FastAPI()

origins = ["http://localhost:5173", "http://127.0.0.1:5173"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
    

# Verify that the database is connected by testing get_db()
# Try `curl localhost:8000` to see the result
@app.get("/")
def root(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
        return {"message": "Database is connected"}
    except Exception as e:
        logging.error(e)
        raise HTTPException(status_code=500, detail="Database is not connected")

app.include_router(user_router.router, prefix="/api", tags=["user"], dependencies=[Depends(get_db)])
app.include_router(manager_router.router, prefix="/api", tags=["manager"], dependencies=[Depends(get_db)])
app.include_router(organizer_router.router, prefix="/api", tags=["organizer"], dependencies=[Depends(get_db)])
app.include_router(admin_router.router, prefix="/api", tags=["admin"], dependencies=[Depends(get_db)])
app.include_router(crud_router.router, prefix="/api", tags=["crud"], dependencies=[Depends(get_db)])



