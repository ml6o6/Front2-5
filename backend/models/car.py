# backend/models/car.py
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from ..db import Base


class Car(Base):
    __tablename__ = "cars"

    id = Column(Integer, primary_key=True, index=True)
    brand_company = Column(String(128), nullable=False)
    brand_model = Column(String(128), nullable=False)
    body_type = Column(String(64), nullable=False)
    reg_number = Column(String(32), unique=True, nullable=False, index=True)

    drivers = relationship(
        "Driver",
        foreign_keys="Driver.car_reg_number",
        back_populates="car",
    )
    accident_links = relationship(
        "AccidentCar",
        back_populates="car",
        cascade="all, delete-orphan",
    )
