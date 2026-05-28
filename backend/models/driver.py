# backend/models/driver.py
from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship
from ..db import Base


class Driver(Base):
    __tablename__ = "drivers"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(255), nullable=False)
    experience = Column(Integer, nullable=False, default=0)
    car_reg_number = Column(String(32), ForeignKey("cars.reg_number"), nullable=True)
    license_number = Column(String(64), unique=True, nullable=False)
    license_date = Column(Date, nullable=False)
    act_number = Column(String(64), ForeignKey("accidents.act_number"), nullable=True)

    car = relationship("Car", foreign_keys=[car_reg_number], back_populates="drivers")
    accidents = relationship(
        "Accident",
        foreign_keys="Accident.driver_id",
        back_populates="driver",
    )
    primary_accident = relationship(
        "Accident",
        foreign_keys=[act_number],
        primaryjoin="Driver.act_number==Accident.act_number",
        viewonly=True,
    )
