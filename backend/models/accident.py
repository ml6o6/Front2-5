# backend/models/accident.py
import enum
from sqlalchemy import Column, Integer, String, Date, Float, ForeignKey
from sqlalchemy.orm import relationship
from ..db import Base


class AccidentType(str, enum.Enum):
    pedestrian = "Наезд на пешехода"
    obstacle = "Наезд на препятствие"
    collision = "Столкновение"
    rollover = "Опрокидывание"
    off_road = "Съезд с дороги"
    cyclist = "Наезд на велосипедиста"
    other = "Прочее"


class AccidentCause(str, enum.Enum):
    oncoming = "Выезд на полосу встречного движения"
    driver_state = "Состояние водителя"
    car_fault = "Неисправность автомобиля"
    rule_violation = "Нарушение ПДД"
    speeding = "Превышение скорости"
    road_conditions = "Плохие дорожные условия"
    other = "Прочее"


class Accident(Base):
    __tablename__ = "accidents"

    id = Column(Integer, primary_key=True, index=True)
    department_name = Column(String(255), nullable=False)
    act_number = Column(String(64), unique=True, nullable=False, index=True)
    driver_id = Column(Integer, ForeignKey("drivers.id"), nullable=False)
    car_reg_number = Column(String(32), ForeignKey("cars.reg_number"), nullable=True)
    accident_date = Column(Date, nullable=False, index=True)
    location = Column(String(512), nullable=False)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    victims_count = Column(Integer, nullable=False, default=0)
    accident_type = Column(String(64), nullable=False)
    accident_cause = Column(String(128), nullable=False)

    driver = relationship(
        "Driver",
        foreign_keys=[driver_id],
        back_populates="accidents",
    )
    car = relationship("Car", foreign_keys=[car_reg_number])
    car_links = relationship(
        "AccidentCar",
        back_populates="accident",
        cascade="all, delete-orphan",
    )
