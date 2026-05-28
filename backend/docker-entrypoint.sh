#!/bin/sh
set -e

echo "Ожидание готовности базы данных..."
python - <<'PY'
import os, time
from urllib.parse import urlparse
import psycopg2

url = os.environ.get('DATABASE_URL', '')
if not url:
    print("DATABASE_URL не задан — пропускаем ожидание.")
    raise SystemExit(0)

parsed = urlparse(url)
for attempt in range(30):
    try:
        conn = psycopg2.connect(
            dbname=parsed.path.lstrip('/'),
            user=parsed.username,
            password=parsed.password,
            host=parsed.hostname,
            port=parsed.port,
        )
        conn.close()
        print("База данных готова.")
        break
    except Exception as exc:
        print(f"Не готова ({attempt+1}/30): {exc}")
        time.sleep(2)
else:
    print("База данных так и не стала доступной, прерываем запуск.")
    raise SystemExit(1)
PY

echo "Применение миграций Alembic..."
cd /app && alembic -c backend/alembic.ini upgrade head || {
    echo "Alembic не справился — создаём таблицы напрямую через SQLAlchemy"
    python -c "from backend.db import Base, engine; from backend import models; Base.metadata.create_all(bind=engine)"
}

echo "Заполнение начальных данных..."
python -m backend.seed || echo "Сид завершился с предупреждением (возможно, данные уже есть)"

exec "$@"
