# backend/schemas/accident.py
from datetime import date
from pydantic import BaseModel, Field
from ..models.accident import AccidentType, AccidentCause


class AccidentBase(BaseModel):
    department_name: str = Field(..., max_length=255)
    act_number: str = Field(..., max_length=64)
    driver_id: int
    car_reg_number: str | None = Field(None, max_length=32)
    accident_date: date
    location: str = Field(..., max_length=512)
    latitude: float | None = None
    longitude: float | None = None
    victims_count: int = Field(0, ge=0)
    accident_type: AccidentType
    accident_cause: AccidentCause


class AccidentCreate(AccidentBase):
    car_reg_numbers: list[str] = Field(default_factory=list)


class AccidentUpdate(BaseModel):
    department_name: str | None = None
    act_number: str | None = None
    driver_id: int | None = None
    car_reg_number: str | None = None
    accident_date: date | None = None
    location: str | None = None
    latitude: float | None = None
    longitude: float | None = None
    victims_count: int | None = Field(None, ge=0)
    accident_type: AccidentType | None = None
    accident_cause: AccidentCause | None = None
    car_reg_numbers: list[str] | None = None


class AccidentListItem(BaseModel):
    id: int
    act_number: str
    accident_date: date
    location: str
    accident_type: str
    accident_cause: str
    victims_count: int
    driver_id: int
    driver_name: str | None = None
    car_reg_number: str | None = None

    model_config = {"from_attributes": True}


class AccidentResponse(AccidentBase):
    id: int
    cars: list[str] = []
    model_config = {"from_attributes": True}


class AccidentDetail(AccidentResponse):
    driver_name: str | None = None
    department_name: str
    cars: list[str] = []


class AccidentFilter(BaseModel):
    date_from: date | None = None
    date_to: date | None = None
    accident_type: str | None = None
    accident_cause: str | None = None
    location: str | None = None


class AccidentMapPoint(BaseModel):
    id: int
    lat: float
    lon: float
    accident_type: str
    accident_cause: str
    accident_date: date
    location: str
    victims_count: int
    driver_name: str | None = None
    car_reg_number: str | None = None
