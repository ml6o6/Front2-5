# backend/schemas/reports.py
from datetime import date
from pydantic import BaseModel


class MultiAccidentDriverRow(BaseModel):
    driver_id: int
    full_name: str
    experience: int
    accidents_count: int
    last_accident_date: date | None = None


class DriversByLocationRow(BaseModel):
    driver_id: int
    full_name: str
    car_reg_number: str | None = None
    accident_date: date
    location: str
    accident_type: str
    accident_cause: str


class DriversByDateRow(BaseModel):
    driver_id: int
    full_name: str
    experience: int
    license_number: str
    location: str
    accident_type: str


class MaxVictimsAccidentResponse(BaseModel):
    act_number: str
    accident_date: date
    location: str
    victims_count: int
    driver_name: str
    accident_type: str
    accident_cause: str


class PedestrianDriverRow(BaseModel):
    driver_id: int
    full_name: str
    experience: int
    car_reg_number: str | None = None
    accident_date: date
    location: str


class CauseFrequencyRow(BaseModel):
    cause: str
    count: int
    percentage: float
