"""Backend API tests for AV Simulation portfolio."""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://autonomous-ai-sim.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"
PASSCODE = "paras-av-2026"


@pytest.fixture(scope="session")
def s():
    sess = requests.Session()
    sess.headers.update({"Content-Type": "application/json"})
    return sess


# ----- Health -----
def test_root_status(s):
    r = s.get(f"{API}/")
    assert r.status_code == 200
    data = r.json()
    assert data.get("status") == "online"


# ----- Training Logs Seed -----
def test_training_logs_seeded(s):
    r = s.get(f"{API}/training-logs")
    assert r.status_code == 200
    data = r.json()
    assert isinstance(data, list)
    assert len(data) >= 6
    for f in ["title", "description", "thumbnail_url", "episode", "duration", "metric"]:
        assert f in data[0]


# ----- Admin verification -----
def test_admin_verify_correct(s):
    r = s.post(f"{API}/admin/verify", headers={"X-Admin-Passcode": PASSCODE})
    assert r.status_code == 200
    assert r.json().get("ok") is True


def test_admin_verify_wrong(s):
    r = s.post(f"{API}/admin/verify", headers={"X-Admin-Passcode": "wrong"})
    assert r.status_code == 401


# ----- Auth on training-logs POST -----
def test_create_training_log_no_auth(s):
    payload = {"title": "TEST_x", "description": "x", "thumbnail_url": "https://x"}
    r = s.post(f"{API}/training-logs", json=payload)
    assert r.status_code == 401


def test_create_and_delete_training_log(s):
    payload = {
        "title": "TEST_Episode_999",
        "description": "TEST entry for automated test",
        "thumbnail_url": "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg",
        "episode": "EP-999",
        "duration": "00:42",
        "metric": "TEST",
    }
    r = s.post(f"{API}/training-logs", json=payload, headers={"X-Admin-Passcode": PASSCODE})
    assert r.status_code == 200, r.text
    created = r.json()
    assert created["title"] == payload["title"]
    assert "id" in created
    new_id = created["id"]

    # Verify in list
    r2 = s.get(f"{API}/training-logs")
    assert any(l["id"] == new_id for l in r2.json())

    # Delete without auth
    r3 = s.delete(f"{API}/training-logs/{new_id}")
    assert r3.status_code == 401

    # Delete with auth
    r4 = s.delete(f"{API}/training-logs/{new_id}", headers={"X-Admin-Passcode": PASSCODE})
    assert r4.status_code == 200

    # Verify removed
    r5 = s.get(f"{API}/training-logs")
    assert not any(l["id"] == new_id for l in r5.json())


# ----- Contact form -----
def test_contact_valid(s):
    payload = {"name": "TEST User", "email": "test@example.com", "message": "Hello"}
    r = s.post(f"{API}/contact", json=payload)
    assert r.status_code == 200, r.text
    data = r.json()
    assert data["email"] == "test@example.com"
    assert "id" in data


def test_contact_invalid_email(s):
    payload = {"name": "TEST", "email": "not-an-email", "message": "x"}
    r = s.post(f"{API}/contact", json=payload)
    assert r.status_code == 422


def test_contact_missing_email(s):
    payload = {"name": "TEST", "message": "x"}
    r = s.post(f"{API}/contact", json=payload)
    assert r.status_code == 422
