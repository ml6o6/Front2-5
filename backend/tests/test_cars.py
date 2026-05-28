# backend/tests/test_cars.py
def test_create_unique_reg(client, admin_headers):
    body = {"brand_company": "Lada", "brand_model": "Vesta", "body_type": "седан", "reg_number": "А999АА777"}
    r = client.post("/api/cars", json=body, headers=admin_headers)
    assert r.status_code == 201
    r2 = client.post("/api/cars", json=body, headers=admin_headers)
    assert r2.status_code == 400


def test_user_cannot_modify(client, user_headers):
    r = client.post(
        "/api/cars",
        json={"brand_company": "X", "brand_model": "Y", "body_type": "седан", "reg_number": "B000BB777"},
        headers=user_headers,
    )
    assert r.status_code == 403


def test_update_and_delete(client, admin_headers):
    r = client.post(
        "/api/cars",
        json={"brand_company": "X", "brand_model": "Y", "body_type": "седан", "reg_number": "Z000ZZ777"},
        headers=admin_headers,
    )
    cid = r.json()["id"]
    r2 = client.put(f"/api/cars/{cid}", json={"body_type": "хэтчбек"}, headers=admin_headers)
    assert r2.status_code == 200
    assert r2.json()["body_type"] == "хэтчбек"
    r3 = client.delete(f"/api/cars/{cid}", headers=admin_headers)
    assert r3.status_code == 204
