# backend/tests/test_reports.py
def _seed_accidents(client, admin_headers):
    client.post("/api/cars", json={"brand_company": "Lada", "brand_model": "Vesta", "body_type": "седан", "reg_number": "А001АА777"}, headers=admin_headers)
    d1 = client.post("/api/drivers", json={"full_name": "Иванов", "experience": 10, "car_reg_number": "А001АА777", "license_number": "L1", "license_date": "2010-01-01"}, headers=admin_headers).json()["id"]
    d2 = client.post("/api/drivers", json={"full_name": "Петров", "experience": 2, "car_reg_number": "А001АА777", "license_number": "L2", "license_date": "2020-01-01"}, headers=admin_headers).json()["id"]

    payloads = [
        ("АКТ-1", d1, "Наезд на пешехода", "Превышение скорости", 1, "2025-06-01", "ул. Ленина"),
        ("АКТ-2", d1, "Столкновение", "Нарушение ПДД", 3, "2025-06-05", "ул. Ленина"),
        ("АКТ-3", d2, "Столкновение", "Нарушение ПДД", 0, "2025-06-10", "ул. Мира"),
        ("АКТ-4", d1, "Наезд на пешехода", "Превышение скорости", 2, "2025-06-15", "ул. Мира"),
    ]
    for act, did, t, c, v, dt, loc in payloads:
        client.post("/api/accidents", json={
            "department_name": "ГИБДД", "act_number": act, "driver_id": did, "car_reg_number": "А001АА777",
            "accident_date": dt, "location": loc, "latitude": 55.7, "longitude": 37.6,
            "victims_count": v, "accident_type": t, "accident_cause": c, "car_reg_numbers": [],
        }, headers=admin_headers)
    return d1, d2


def test_multi_accident_drivers(client, admin_headers):
    d1, d2 = _seed_accidents(client, admin_headers)
    r = client.get("/api/reports/multi-accident-drivers", headers=admin_headers)
    assert r.status_code == 200
    data = r.json()
    ids = [row["driver_id"] for row in data]
    assert d1 in ids
    assert d2 not in ids  # only 1 accident


def test_max_victims(client, admin_headers):
    _seed_accidents(client, admin_headers)
    r = client.get("/api/reports/max-victims-accident", headers=admin_headers)
    assert r.status_code == 200
    assert r.json()["victims_count"] == 3
    assert r.json()["act_number"] == "АКТ-2"


def test_pedestrian_drivers(client, admin_headers):
    _seed_accidents(client, admin_headers)
    r = client.get("/api/reports/pedestrian-drivers", headers=admin_headers)
    assert r.status_code == 200
    assert len(r.json()) == 2


def test_causes_by_frequency(client, admin_headers):
    _seed_accidents(client, admin_headers)
    r = client.get("/api/reports/causes-by-frequency", headers=admin_headers)
    assert r.status_code == 200
    rows = r.json()
    assert rows[0]["count"] >= rows[-1]["count"]
    assert sum(r["percentage"] for r in rows) > 99


def test_drivers_by_date(client, admin_headers):
    _seed_accidents(client, admin_headers)
    r = client.get("/api/reports/drivers-by-date?date=2025-06-01", headers=admin_headers)
    assert r.status_code == 200
    assert len(r.json()) == 1


def test_drivers_by_location(client, admin_headers):
    _seed_accidents(client, admin_headers)
    r = client.get("/api/reports/drivers-by-location?location=Мира", headers=admin_headers)
    assert r.status_code == 200
    assert len(r.json()) == 2
