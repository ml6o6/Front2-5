# backend/models/accident_car.py
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from ..db import Base


class AccidentCar(Base):
    __tablename__ = "accident_cars"

    accident_id = Column(Integer, ForeignKey("accidents.id", ondelete="CASCADE"), primary_key=True)
    car_reg_number = Column(String(32), ForeignKey("cars.reg_number"), primary_key=True)

    accident = relationship("Accident", back_populates="car_links")
    car = relationship("Car", back_populates="accident_links")
