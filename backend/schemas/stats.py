# backend/schemas/stats.py
from pydantic import BaseModel


class TypeStatRow(BaseModel):
    type: str
    count: int


class CauseStatRow(BaseModel):
    cause: str
    count: int


class DayStatRow(BaseModel):
    day: int
    count: int


class LocationStatRow(BaseModel):
    location: str
    total_victims: int


class SummaryResponse(BaseModel):
    total_accidents: int
    total_victims: int
    top_type: str | None = None
    top_cause: str | None = None
