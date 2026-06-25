"""Integration tests for Initiatives API."""


def test_create_initiative(client, sample_friction_data):
    """POST /api/v1/initiatives creates initiative from friction."""
    # Create friction first
    fr = client.post("/api/v1/frictions", json=sample_friction_data)
    friction_id = fr.json()["id"]

    # Create initiative
    r = client.post("/api/v1/initiatives", json={
        "friction_id": friction_id,
        "title": "Automatizar reporte",
        "proposed_solution": "Script que extrae datos automáticamente",
        "expected_reduction_percent": 80,
        "complexity": "medium",
    })
    assert r.status_code == 201
    data = r.json()
    assert data["title"] == "Automatizar reporte"
    assert data["friction_id"] == friction_id
    assert data["status"] == "proposed"


def test_create_initiative_invalid_friction(client):
    """POST with non-existent friction_id returns 404."""
    r = client.post("/api/v1/initiatives", json={
        "friction_id": 999,
        "title": "Algo",
    })
    assert r.status_code == 404


def test_list_initiatives(client, sample_friction_data):
    """GET /api/v1/initiatives returns all."""
    fr = client.post("/api/v1/frictions", json=sample_friction_data)
    friction_id = fr.json()["id"]
    client.post("/api/v1/initiatives", json={
        "friction_id": friction_id, "title": "Init 1"
    })

    r = client.get("/api/v1/initiatives")
    assert r.status_code == 200
    assert len(r.json()) == 1


def test_update_initiative_status(client, sample_friction_data):
    """PUT can update initiative status."""
    fr = client.post("/api/v1/frictions", json=sample_friction_data)
    friction_id = fr.json()["id"]
    ir = client.post("/api/v1/initiatives", json={
        "friction_id": friction_id, "title": "Init"
    })
    init_id = ir.json()["id"]

    r = client.put(f"/api/v1/initiatives/{init_id}", json={"status": "in_progress"})
    assert r.status_code == 200
    assert r.json()["status"] == "in_progress"


def test_delete_initiative(client, sample_friction_data):
    """DELETE removes initiative."""
    fr = client.post("/api/v1/frictions", json=sample_friction_data)
    friction_id = fr.json()["id"]
    ir = client.post("/api/v1/initiatives", json={
        "friction_id": friction_id, "title": "Init"
    })
    init_id = ir.json()["id"]

    r = client.delete(f"/api/v1/initiatives/{init_id}")
    assert r.status_code == 204
