# backend/models/__init__.py
from .user import User, UserRole
from .driver import Driver
from .car import Car
from .accident import Accident, AccidentType, AccidentCause
from .accident_car import AccidentCar

__all__ = [
    "User",
    "UserRole",
    "Driver",
    "Car",
    "Accident",
    "AccidentType",
    "AccidentCause",
    "AccidentCar",
]
