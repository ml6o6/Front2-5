# backend/tests/test_drivers.py
def test_list_requires_auth(client):
    r = client.get("/api/drivers")
    assert r.status_code == 401


def test_create_driver_admin_only(client, admin_headers, user_headers):
    # car first
    client.post(
        "/api/cars",
        json={"brand_company": "Lada", "brand_model": "Vesta", "body_type": "седан", "reg_number": "А001АА777"},
        headers=admin_headers,
    )
    payload = {
        "full_name": "Иванов И.И.",
        "experience": 5,
        "car_reg_number": "А001АА777",
        "license_number": "77AB000001",
        "license_date": "2018-01-15",
        "act_number": None,
    }
    r = client.post("/api/drivers", json=payload, headers=user_headers)
    assert r.status_code == 403

    r = client.post("/api/drivers", json=payload, headers=admin_headers)
    assert r.status_code == 201, r.text
    assert r.json()["full_name"] == "Иванов И.И."


def test_list_and_get(client, admin_headers):
    client.post(
        "/api/cars",
        json={"brand_company": "Lada", "brand_model": "Vesta", "body_type": "седан", "reg_number": "А001АА777"},
        headers=admin_headers,
    )
    client.post(
        "/api/drivers",
        json={
            "full_name": "Петров П.П.",
            "experience": 3,
            "car_reg_number": "А001АА777",
            "license_number": "77AB000002",
            "license_date": "2020-01-01",
        },
        headers=admin_headers,
    )
    r = client.get("/api/drivers", headers=admin_headers)
    assert r.status_code == 200
    data = r.json()
    assert len(data) == 1
    did = data[0]["id"]
    r = client.get(f"/api/drivers/{did}", headers=admin_headers)
    assert r.status_code == 200
    assert "accidents" in r.json()
