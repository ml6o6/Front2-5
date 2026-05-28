# backend/services/report_service.py
from datetime import date
from fastapi import HTTPException
from sqlalchemy import func, desc
from sqlalchemy.orm import Session

from ..models.accident import Accident, AccidentType
from ..models.driver import Driver


def multi_accident_drivers(db: Session) -> list[dict]:
    rows = (
        db.query(
            Driver.id.label("driver_id"),
            Driver.full_name,
            Driver.experience,
            func.count(Accident.id).label("accidents_count"),
            func.max(Accident.accident_date).label("last_accident_date"),
        )
        .join(Accident, Accident.driver_id == Driver.id)
        .group_by(Driver.id, Driver.full_name, Driver.experience)
        .having(func.count(Accident.id) > 1)
        .order_by(desc("accidents_count"))
        .all()
    )
    return [
        {
            "driver_id": r.driver_id,
            "full_name": r.full_name,
            "experience": r.experience,
            "accidents_count": r.accidents_count,
            "last_accident_date": r.last_accident_date,
        }
        for r in rows
    ]


def drivers_by_location(db: Session, location: str) -> list[dict]:
    if not location:
        raise HTTPException(status_code=400, detail="Параметр location обязателен")
    rows = (
        db.query(
            Driver.id.label("driver_id"),
            Driver.full_name,
            Accident.car_reg_number,
            Accident.accident_date,
            Accident.location,
            Accident.accident_type,
            Accident.accident_cause,
        )
        .join(Accident, Accident.driver_id == Driver.id)
        .filter(Accident.location.ilike(f"%{location}%"))
        .order_by(Accident.accident_date.desc())
        .all()
    )
    return [dict(r._mapping) for r in rows]


def drivers_by_date(db: Session, target_date: date) -> list[dict]:
    rows = (
        db.query(
            Driver.id.label("driver_id"),
            Driver.full_name,
            Driver.experience,
            Driver.license_number,
            Accident.location,
            Accident.accident_type,
        )
        .join(Accident, Accident.driver_id == Driver.id)
        .filter(Accident.accident_date == target_date)
        .order_by(Driver.full_name)
        .all()
    )
    return [dict(r._mapping) for r in rows]


def max_victims_accident(db: Session) -> dict | None:
    row = (
        db.query(
            Accident.act_number,
            Accident.accident_date,
            Accident.location,
            Accident.victims_count,
            Driver.full_name.label("driver_name"),
            Accident.accident_type,
            Accident.accident_cause,
        )
        .join(Driver, Driver.id == Accident.driver_id)
        .order_by(Accident.victims_count.desc())
        .first()
    )
    if not row:
        return None
    return dict(row._mapping)


def pedestrian_drivers(db: Session) -> list[dict]:
    rows = (
        db.query(
            Driver.id.label("driver_id"),
            Driver.full_name,
            Driver.experience,
            Accident.car_reg_number,
            Accident.accident_date,
            Accident.location,
        )
        .join(Accident, Accident.driver_id == Driver.id)
        .filter(Accident.accident_type == AccidentType.pedestrian.value)
        .order_by(Accident.accident_date.desc())
        .all()
    )
    return [dict(r._mapping) for r in rows]


def causes_by_frequency(db: Session) -> list[dict]:
    total = db.query(func.count(Accident.id)).scalar() or 0
    rows = (
        db.query(
            Accident.accident_cause.label("cause"),
            func.count(Accident.id).label("count"),
        )
        .group_by(Accident.accident_cause)
        .order_by(desc("count"))
        .all()
    )
    out = []
    for r in rows:
        pct = round((r.count / total) * 100, 2) if total else 0.0
        out.append({"cause": r.cause, "count": r.count, "percentage": pct})
    return out
