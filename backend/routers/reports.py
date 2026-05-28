# backend/routers/reports.py
from datetime import date
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from ..db import get_db
from ..schemas.reports import (
    MultiAccidentDriverRow,
    DriversByLocationRow,
    DriversByDateRow,
    MaxVictimsAccidentResponse,
    PedestrianDriverRow,
    CauseFrequencyRow,
)
from ..services import report_service
from ..dependencies.auth import get_current_user

router = APIRouter(prefix="/reports", tags=["reports"])


@router.get("/multi-accident-drivers", response_model=list[MultiAccidentDriverRow])
def multi_accident_drivers(db: Session = Depends(get_db), _=Depends(get_current_user)):
    return report_service.multi_accident_drivers(db)


@router.get("/drivers-by-location", response_model=list[DriversByLocationRow])
def drivers_by_location(
    location: str = Query(..., min_length=1),
    db: Session = Depends(get_db),
    _=Depends(get_current_user),
):
    return report_service.drivers_by_location(db, location)


@router.get("/drivers-by-date", response_model=list[DriversByDateRow])
def drivers_by_date(
    date: date = Query(...),
    db: Session = Depends(get_db),
    _=Depends(get_current_user),
):
    return report_service.drivers_by_date(db, date)


@router.get("/max-victims-accident", response_model=MaxVictimsAccidentResponse)
def max_victims_accident(db: Session = Depends(get_db), _=Depends(get_current_user)):
    row = report_service.max_victims_accident(db)
    if not row:
        raise HTTPException(status_code=404, detail="Нет данных")
    return row


@router.get("/pedestrian-drivers", response_model=list[PedestrianDriverRow])
def pedestrian_drivers(db: Session = Depends(get_db), _=Depends(get_current_user)):
    return report_service.pedestrian_drivers(db)


@router.get("/causes-by-frequency", response_model=list[CauseFrequencyRow])
def causes_by_frequency(db: Session = Depends(get_db), _=Depends(get_current_user)):
    return report_service.causes_by_frequency(db)
