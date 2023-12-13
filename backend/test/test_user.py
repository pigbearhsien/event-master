from fastapi import FastAPI
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_updateUser():
    response = client.put(
        "/api/updateUser",
        json={
            "userId": "string",
            "name": "string",
            "account": "string",
            "password": "string",
            "profilePicUrl": "string",
        },
    )
    assert response.status_code == 200

def test_getUserGroups():
    response = client.get(
        "/api/getUserGroups",
        params={ "userId": "string" },
    )

    assert response.status_code == 200
