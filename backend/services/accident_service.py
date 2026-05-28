# backend/services/accident_service.py
from datetime import date
from fastapi import HTTPException
from sqlalchemy.orm import Session, joinedload

from ..models.accident import Accident
from ..models.accident_car import AccidentCar
from ..models.driver import Driver
from ..models.car import Car
from ..schemas.accident import AccidentCreate, AccidentUpdate


def _validate_driver_car(db: Session, driver_id: int, car_reg: str | None, extra: list[str]):
    if not db.query(Driver).get(driver_id):
        raise HTTPException(status_code=400, detail="Указанный водитель не существует")
    regs = set(extra or [])
    if car_reg:
        regs.add(car_reg)
    for reg in regs:
        if not db.query(Car).filter(Car.reg_number == reg).first():
            raise HTTPException(status_code=400, detail=f"Автомобиль {reg} не найден")


def list_accidents(
    db: Session,
    date_from: date | None = None,
    date_to: date | None = None,
    accident_type: str | None = None,
    accident_cause: str | None = None,
    location: str | None = None,
) -> list[Accident]:
    q = db.query(Accident).options(joinedload(Accident.driver))
    if date_from:
        q = q.filter(Accident.accident_date >= date_from)
    if date_to:
        q = q.filter(Accident.accident_date <= date_to)
    if accident_type:
        q = q.filter(Accident.accident_type == accident_type)
    if accident_cause:
        q = q.filter(Accident.accident_cause == accident_cause)
    if location:
        q = q.filter(Accident.location.ilike(f"%{location}%"))
    return q.order_by(Accident.accident_date.desc(), Accident.id.desc()).all()


def get_accident(db: Session, accident_id: int) -> Accident:
    acc = (
        db.query(Accident)
        .options(joinedload(Accident.driver), joinedload(Accident.car_links))
        .filter(Accident.id == accident_id)
        .first()
    )
    if not acc:
        raise HTTPException(status_code=404, detail="Акт ДТП не найден")
    return acc


def create_accident(db: Session, payload: AccidentCreate) -> Accident:
    if db.query(Accident).filter(Accident.act_number == payload.act_number).first():
        raise HTTPException(status_code=400, detail="Акт с таким номером уже существует")
    _validate_driver_car(db, payload.driver_id, payload.car_reg_number, payload.car_reg_numbers)

    data = payload.model_dump(exclude={"car_reg_numbers"})
    if hasattr(data.get("accident_type"), "value"):
        data["accident_type"] = data["accident_type"].value
    if hasattr(data.get("accident_cause"), "value"):
        data["accident_cause"] = data["accident_cause"].value

    accident = Accident(**data)
    db.add(accident)
    db.flush()

    regs = set(payload.car_reg_numbers or [])
    if payload.car_reg_number:
        regs.add(payload.car_reg_number)
    for reg in regs:
        db.add(AccidentCar(accident_id=accident.id, car_reg_number=reg))

    db.commit()
    db.refresh(accident)
    return accident


def update_accident(db: Session, accident_id: int, payload: AccidentUpdate) -> Accident:
    accident = get_accident(db, accident_id)
    data = payload.model_dump(exclude_unset=True)
    car_regs = data.pop("car_reg_numbers", None)

    if "driver_id" in data or "car_reg_number" in data or car_regs is not None:
        driver_id = data.get("driver_id", accident.driver_id)
        car_reg = data.get("car_reg_number", accident.car_reg_number)
        _validate_driver_car(db, driver_id, car_reg, car_regs or [])

    for k, v in data.items():
        if hasattr(v, "value"):
            v = v.value
        setattr(accident, k, v)

    if car_regs is not None:
        db.query(AccidentCar).filter(AccidentCar.accident_id == accident.id).delete()
        regs = set(car_regs)
        if accident.car_reg_number:
            regs.add(accident.car_reg_number)
        for reg in regs:
            db.add(AccidentCar(accident_id=accident.id, car_reg_number=reg))

    db.commit()
    db.refresh(accident)
    return accident


def delete_accident(db: Session, accident_id: int) -> None:
    accident = get_accident(db, accident_id)
    db.delete(accident)
    db.commit()


def cars_of_accident(db: Session, accident: Accident) -> list[str]:
    regs = {link.car_reg_number for link in accident.car_links}
    if accident.car_reg_number:
        regs.add(accident.car_reg_number)
    return sorted(regs)


def map_points(
    db: Session,
    date_from: date | None = None,
    date_to: date | None = None,
    accident_type: str | None = None,
    location: str | None = None,
) -> list[dict]:
    q = db.query(Accident).options(joinedload(Accident.driver)).filter(
        Accident.latitude.isnot(None), Accident.longitude.isnot(None)
    )
    if date_from:
        q = q.filter(Accident.accident_date >= date_from)
    if date_to:
        q = q.filter(Accident.accident_date <= date_to)
    if accident_type:
        q = q.filter(Accident.accident_type == accident_type)
    if location:
        q = q.filter(Accident.location.ilike(f"%{location}%"))

    rows = []
    for a in q.all():
        rows.append(
            {
                "id": a.id,
                "lat": a.latitude,
                "lon": a.longitude,
                "accident_type": a.accident_type,
                "accident_cause": a.accident_cause,
                "accident_date": a.accident_date,
                "location": a.location,
                "victims_count": a.victims_count,
                "driver_name": a.driver.full_name if a.driver else None,
                "car_reg_number": a.car_reg_number,
            }
        )
    return rows
