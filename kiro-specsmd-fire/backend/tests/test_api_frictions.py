"""Integration tests for Frictions API."""


def test_create_friction(client, sample_friction_data):
    """POST /api/v1/frictions creates friction with calculated fields."""
    r = client.post("/api/v1/frictions", json=sample_friction_data)
    assert r.status_code == 201
    data = r.json()
    assert data["title"] == "Reporte manual de ventas"
    assert data["monthly_hours_lost"] == 24.0
    assert data["estimated_monthly_cost"] == 600.0
    assert data["automation_potential"] == "high"
    assert data["priority"] == "high"


def test_list_frictions_empty(client):
    """GET /api/v1/frictions returns empty list initially."""
    r = client.get("/api/v1/frictions")
    assert r.status_code == 200
    assert r.json() == []


def test_get_friction_by_id(client, sample_friction_data):
    """GET /api/v1/frictions/{id} returns the friction."""
    create_r = client.post("/api/v1/frictions", json=sample_friction_data)
    friction_id = create_r.json()["id"]

    r = client.get(f"/api/v1/frictions/{friction_id}")
    assert r.status_code == 200
    assert r.json()["id"] == friction_id


def test_get_friction_not_found(client):
    """GET /api/v1/frictions/999 returns 404."""
    r = client.get("/api/v1/frictions/999")
    assert r.status_code == 404


def test_update_friction(client, sample_friction_data):
    """PUT /api/v1/frictions/{id} updates and recalculates."""
    create_r = client.post("/api/v1/frictions", json=sample_friction_data)
    friction_id = create_r.json()["id"]

    r = client.put(f"/api/v1/frictions/{friction_id}", json={"frequency": 8})
    assert r.status_code == 200
    # 120 * 8 * 3 / 60 = 48 hours
    assert r.json()["monthly_hours_lost"] == 48.0


def test_delete_friction(client, sample_friction_data):
    """DELETE /api/v1/frictions/{id} removes the friction."""
    create_r = client.post("/api/v1/frictions", json=sample_friction_data)
    friction_id = create_r.json()["id"]

    r = client.delete(f"/api/v1/frictions/{friction_id}")
    assert r.status_code == 204

    r = client.get(f"/api/v1/frictions/{friction_id}")
    assert r.status_code == 404


def test_create_friction_validation_error(client):
    """POST with invalid data returns 422."""
    r = client.post("/api/v1/frictions", json={"title": ""})
    assert r.status_code == 422


def test_create_and_list_comments(client, sample_friction_data):
    """Comments can be added and listed."""
    create_r = client.post("/api/v1/frictions", json=sample_friction_data)
    friction_id = create_r.json()["id"]

    # Add comment
    r = client.post(
        f"/api/v1/frictions/{friction_id}/comments",
        json={"comment": "Esto es urgente"},
    )
    assert r.status_code == 201

    # List comments
    r = client.get(f"/api/v1/frictions/{friction_id}/comments")
    assert r.status_code == 200
    assert len(r.json()) == 1
    assert r.json()[0]["comment"] == "Esto es urgente"
