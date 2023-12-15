from fastapi import FastAPI
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_db():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Database is connected"}