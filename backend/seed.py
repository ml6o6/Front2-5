# backend/seed.py
"""Заполняет БД начальными данными.

Запуск:  python -m backend.seed
"""
from datetime import date
import random

from .db import Base, SessionLocal, engine
from .models.user import User, UserRole
from .models.driver import Driver
from .models.car import Car
from .models.accident import Accident, AccidentType, AccidentCause
from .models.accident_car import AccidentCar
from .dependencies.auth import hash_password


CAR_DATA = [
    ("Lada", "Vesta", "седан", "А001АА777"),
    ("Lada", "Granta", "седан", "В002ВВ777"),
    ("Toyota", "Camry", "седан", "С003СС777"),
    ("Toyota", "RAV4", "внедорожник", "Е004ЕЕ777"),
    ("Volkswagen", "Polo", "седан", "К005КК777"),
    ("Volkswagen", "Tiguan", "внедорожник", "М006ММ777"),
    ("BMW", "X5", "внедорожник", "Н007НН777"),
    ("Hyundai", "Solaris", "седан", "О008ОО777"),
    ("KIA", "Rio", "седан", "Р009РР777"),
    ("KIA", "Sportage", "внедорожник", "Т010ТТ777"),
    ("Renault", "Logan", "седан", "У011УУ777"),
    ("Renault", "Duster", "внедорожник", "Х012ХХ777"),
    ("Mercedes-Benz", "E-Class", "седан", "А013АА777"),
    ("Skoda", "Octavia", "хэтчбек", "В014ВВ777"),
    ("Ford", "Focus", "хэтчбек", "С015СС777"),
]

DRIVER_NAMES = [
    "Иванов Иван Иванович",
    "Петров Пётр Петрович",
    "Сидоров Сидор Сидорович",
    "Кузнецов Алексей Михайлович",
    "Смирнов Дмитрий Викторович",
    "Васильев Николай Сергеевич",
    "Попов Олег Андреевич",
    "Соколов Артём Павлович",
    "Михайлов Игорь Романович",
    "Новикова Анна Юрьевна",
]

LOCATIONS = [
    ("ул. Ленина, 12", 55.7558, 37.6176),
    ("Тверская ул., 7", 55.7656, 37.6055),
    ("пр-т Мира, 102", 55.8003, 37.6347),
    ("Садовое кольцо, 25", 55.7707, 37.5894),
    ("Кутузовский пр-т, 30", 55.7416, 37.5388),
    ("Ленинградский пр-т, 78", 55.8045, 37.5108),
    ("ул. Арбат, 14", 55.7494, 37.5928),
    ("ул. Тверская-Ямская, 1", 55.7777, 37.5908),
    ("Варшавское шоссе, 56", 55.6500, 37.6200),
    ("МКАД, 45 км", 55.7350, 37.8500),
]


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # --- USERS ---
        if not db.query(User).filter(User.username == "admin").first():
            db.add(User(
                username="admin",
                password_hash=hash_password("admin123"),
                role=UserRole.admin,
                is_active=True,
            ))
        if not db.query(User).filter(User.username == "user").first():
            db.add(User(
                username="user",
                password_hash=hash_password("user123"),
                role=UserRole.user,
                is_active=True,
            ))
        db.commit()

        # --- CARS ---
        cars = []
        for company, model, body, reg in CAR_DATA:
            car = db.query(Car).filter(Car.reg_number == reg).first()
            if not car:
                car = Car(brand_company=company, brand_model=model, body_type=body, reg_number=reg)
                db.add(car)
            cars.append(car)
        db.commit()
        for c in cars:
            db.refresh(c)

        # --- DRIVERS ---
        drivers = []
        for i, name in enumerate(DRIVER_NAMES):
            license_number = f"77AB{100000 + i}"
            driver = db.query(Driver).filter(Driver.license_number == license_number).first()
            if not driver:
                driver = Driver(
                    full_name=name,
                    experience=random.randint(1, 25),
                    car_reg_number=cars[i % len(cars)].reg_number,
                    license_number=license_number,
                    license_date=date(2010 + (i % 10), 1 + (i % 12), 1 + (i % 28)),
                    act_number=None,
                )
                db.add(driver)
            drivers.append(driver)
        db.commit()
        for d in drivers:
            db.refresh(d)

        # --- ACCIDENTS (25 актов в пределах одного месяца) ---
        existing = db.query(Accident).count()
        if existing >= 25:
            print(f"Уже есть {existing} актов ДТП — пропускаем")
            return

        types = list(AccidentType)
        causes = list(AccidentCause)
        # Гарантируем не менее 3 наездов на пешехода (для отчёта 5)
        type_pool = (
            [AccidentType.pedestrian] * 4
            + [AccidentType.collision] * 6
            + [AccidentType.obstacle] * 4
            + [AccidentType.rollover] * 3
            + [AccidentType.off_road] * 3
            + [AccidentType.cyclist] * 3
            + [AccidentType.other] * 2
        )
        random.shuffle(type_pool)

        year, month = 2025, 6
        for i in range(25):
            act_number = f"АКТ-2025-{1000 + i}"
            if db.query(Accident).filter(Accident.act_number == act_number).first():
                continue
            loc = LOCATIONS[i % len(LOCATIONS)]
            # некоторые водители (например, индексы 0,1,2) получают по 3+ ДТП
            if i < 6:
                driver = drivers[i % 3]
            else:
                driver = random.choice(drivers)
            car = cars[i % len(cars)]
            extra_car = cars[(i + 3) % len(cars)]

            jitter_lat = random.uniform(-0.01, 0.01)
            jitter_lon = random.uniform(-0.01, 0.01)

            acc = Accident(
                department_name=f"Отдел ГИБДД №{1 + (i % 5)}",
                act_number=act_number,
                driver_id=driver.id,
                car_reg_number=car.reg_number,
                accident_date=date(year, month, 1 + (i % 28)),
                location=loc[0],
                latitude=loc[1] + jitter_lat,
                longitude=loc[2] + jitter_lon,
                victims_count=random.choice([0, 0, 1, 1, 2, 2, 3, 4]),
                accident_type=type_pool[i].value,
                accident_cause=random.choice(causes).value,
            )
            db.add(acc)
            db.flush()
            db.add(AccidentCar(accident_id=acc.id, car_reg_number=car.reg_number))
            if extra_car.reg_number != car.reg_number and random.random() < 0.4:
                db.add(AccidentCar(accident_id=acc.id, car_reg_number=extra_car.reg_number))
        db.commit()
        print("Seed выполнен: пользователи, авто, водители и 25 актов ДТП созданы.")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
