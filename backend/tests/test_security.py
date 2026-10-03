import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch

from app.main import app

client = TestClient(app)

def mock_require_auth(uid="user_a"):
    return uid

@pytest.fixture
def override_auth():
    app.dependency_overrides = {}
    from app.auth import require_auth
    app.dependency_overrides[require_auth] = lambda: "user_a"
    yield
    app.dependency_overrides = {}

@pytest.fixture
def override_auth_user_b():
    app.dependency_overrides = {}
    from app.auth import require_auth
    app.dependency_overrides[require_auth] = lambda: "user_b"
    yield
    app.dependency_overrides = {}

@pytest.fixture
def mock_firebase():
    with patch("app.services.firebase.is_firebase_ok", return_value=True), \
         patch("app.services.firebase.doc_get") as mock_get, \
         patch("app.services.firebase.doc_update") as mock_update, \
         patch("app.services.firebase.col_query") as mock_col_query, \
         patch("app.services.firebase.doc_set") as mock_set, \
         patch("app.services.firebase.col_list") as mock_col_list:
        
        yield {
            "doc_get": mock_get,
            "doc_update": mock_update,
            "col_query": mock_col_query,
            "doc_set": mock_set,
            "col_list": mock_col_list
        }

def test_compliance_task_idor_allowed(override_auth, mock_firebase):
    task_id = "task_a"
    mock_firebase["doc_get"].return_value = {
        "id": task_id,
        "title": "Task A",
        "regulationId": "reg1",
        "regulationRef": "ref1",
        "status": "pending",
        "priority": "high",
        "assignedTo": "User A",
        "ownerInitials": "UA",
        "dueDate": "2025-10-10",
        "primaryCategory": "Safety",
        "actions": "action",
        "progress": 0,
        "uid": "user_a"
    }
    
    response = client.put(f"/api/compliance/tasks/{task_id}", json={"status": "completed"})
    assert response.status_code == 200
    assert response.json()["status"] == "completed"

def test_compliance_task_idor_blocked(override_auth_user_b, mock_firebase):
    task_id = "task_a"
    mock_firebase["doc_get"].return_value = {
        "id": task_id,
        "title": "Task A",
        "uid": "user_a",
        "status": "pending",
        "priority": "high",
        "assignedTo": "User A",
        "ownerInitials": "UA",
        "dueDate": "2025-10-10",
        "primaryCategory": "Safety",
        "actions": "action",
        "progress": 0,
        "regulationId": "reg1",
        "regulationRef": "ref1",
    }
    
    response = client.put(f"/api/compliance/tasks/{task_id}", json={"status": "completed"})
    assert response.status_code == 403

def test_business_profile_idor_blocked(override_auth_user_b, mock_firebase):
    mock_firebase["col_query"].return_value = [{"businessId": "business_b", "uid": "user_b"}]
    
    payload = {
        "id": "business_a",
        "name": "Business A",
        "entity": "LLC",
        "sector": "Tech",
        "jurisdiction": "Global",
        "location": "Earth",
        "employees": 10,
        "licenseNo": "123",
        "boilerCategory": "None",
        "pollutionCategory": "None",
        "turnover": "100",
        "shifts": "1",
        "taxRegime": "GST",
        "operatingMarket": "World",
        "logoInitials": "BA",
        "classification": [],
        "completion": 100
    }
    response = client.put("/api/business-profile", json=payload)
    assert response.status_code == 403

def test_notifications_idor_blocked(override_auth_user_b, mock_firebase):
    mock_firebase["doc_get"].return_value = {
        "id": "notif1",
        "title": "N1",
        "body": "B1",
        "category": "C1",
        "timestamp": "T1",
        "read": False,
        "uid": "user_a"
    }
    response = client.put("/api/notifications/notif1/read")
    assert response.status_code == 403

def test_alerts_idor_blocked(override_auth_user_b, mock_firebase):
    mock_firebase["doc_get"].return_value = {
        "id": "alert1",
        "title": "A1",
        "severity": "info",
        "status": "Review Needed",
        "published": "P1",
        "effective": "E1",
        "detail": "D1",
        "requiresAction": True,
        "actionable": "Act",
        "uid": "user_a",
        "regulationId": "r1",
        "authorityCode": "C1"
    }
    response = client.put("/api/alerts/alert1/read")
    assert response.status_code == 403

def test_list_tasks_data_exposure(override_auth, mock_firebase):
    mock_firebase["col_list"].return_value = [
        {"id": "t1", "uid": "user_a"},
        {"id": "t2", "uid": "user_b"},
        {"id": "t3", "uid": None}
    ]
    response = client.get("/api/compliance/tasks")
    assert response.status_code == 200
    ids = [t["id"] for t in response.json()]
    assert "t1" in ids
    assert "t3" in ids
    assert "t2" not in ids

def test_list_notifications_data_exposure(override_auth, mock_firebase):
    mock_firebase["col_list"].return_value = [
        {"id": "n1", "title": "N", "body": "B", "category": "C", "timestamp": "T", "read": False, "uid": "user_a"},
        {"id": "n2", "title": "N", "body": "B", "category": "C", "timestamp": "T", "read": False, "uid": "user_b"}
    ]
    response = client.get("/api/notifications")
    assert response.status_code == 200
    ids = [n["id"] for n in response.json()]
    assert "n1" in ids
    assert "n2" not in ids
