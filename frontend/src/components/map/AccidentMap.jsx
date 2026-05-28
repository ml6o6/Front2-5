// frontend/src/components/map/AccidentMap.jsx
import { useEffect, useRef, useState } from 'react';

const YANDEX_KEY = import.meta.env.VITE_YANDEX_MAPS_KEY || '';

let ymapsLoader = null;
function loadYmaps() {
  if (window.ymaps && window.ymaps.Map) return Promise.resolve(window.ymaps);
  if (ymapsLoader) return ymapsLoader;
  ymapsLoader = new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = `https://api-maps.yandex.ru/2.1/?apikey=${YANDEX_KEY}&lang=ru_RU`;
    s.async = true;
    s.onload = () => {
      window.ymaps.ready(() => resolve(window.ymaps));
    };
    s.onerror = () => reject(new Error('Не удалось загрузить скрипт карты'));
    document.head.appendChild(s);
  });
  return ymapsLoader;
}

// --- Утилиты ---

// Экранирование HTML, чтобы текст из БД не интерпретировался как разметка
function escapeHtml(value) {
  if (value === null || value === undefined) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Перевод старых английских/битых значений в русский текст
const TYPE_DICT = {
  pedestrian: 'Наезд на пешехода',
  obstacle: 'Наезд на препятствие',
  collision: 'Столкновение',
  rollover: 'Опрокидывание',
  off_road: 'Съезд с дороги',
  cyclist: 'Наезд на велосипедиста',
  other: 'Прочее',
};
const CAUSE_DICT = {
  oncoming: 'Выезд на полосу встречного движения',
  driver_state: 'Состояние водителя',
  car_fault: 'Неисправность автомобиля',
  rule_violation: 'Нарушение ПДД',
  speeding: 'Превышение скорости',
  road_conditions: 'Плохие дорожные условия',
  other: 'Прочее',
};
function displayText(value) {
  if (value === null || value === undefined || value === '') return '—';
  const v = String(value);
  return TYPE_DICT[v] || CAUSE_DICT[v] || v;
}

// Форматирование даты "2025-06-10" → "10.06.2025"
function formatDate(value) {
  if (!value) return '—';
  const s = String(value);
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) return `${m[3]}.${m[2]}.${m[1]}`;
  return s;
}

// Цвет preset по числу пострадавших
function presetFor(victimsCount) {
  if (victimsCount >= 3) return 'islands#redIcon';
  if (victimsCount >= 1) return 'islands#orangeIcon';
  return 'islands#greenIcon';
}

// --- Компонент ---

export default function AccidentMap({ points = [], center = [55.7558, 37.6176], zoom = 11 }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const objectManagerRef = useRef(null);
  const [err, setErr] = useState(null);
  const [ready, setReady] = useState(false);

  // Инициализация карты
  useEffect(() => {
    if (!YANDEX_KEY) {
      setErr('Не задан VITE_YANDEX_MAPS_KEY');
      return;
    }
    let cancelled = false;
    loadYmaps()
      .then((ymaps) => {
        if (cancelled || !containerRef.current) return;
        const map = new ymaps.Map(containerRef.current, {
          center,
          zoom,
          controls: ['zoomControl', 'fullscreenControl', 'typeSelector'],
        });
        mapRef.current = map;
        setReady(true);
      })
      .catch((e) => setErr(e.message || 'Ошибка загрузки карты'));

    return () => {
      cancelled = true;
      try { mapRef.current?.destroy?.(); } catch (_) {}
      mapRef.current = null;
    };
    // eslint-disable-next-line
  }, []);

  // Перерисовка точек
  useEffect(() => {
    if (!ready || !mapRef.current || !window.ymaps) return;
    const ymaps = window.ymaps;
    const map = mapRef.current;

    // Удаляем старый ObjectManager
    if (objectManagerRef.current) {
      try { map.geoObjects.remove(objectManagerRef.current); } catch (_) {}
      objectManagerRef.current = null;
    }

    if (!points.length) return;

    const objectManager = new ymaps.ObjectManager({
      clusterize: true,
      gridSize: 64,
      clusterDisableClickZoom: false,
    });
    objectManager.clusters.options.set('preset', 'islands#darkBlueClusterIcons');

    // Для каждого ДТП — Feature с тремя стандартными свойствами
    const features = points.map((accident) => ({
      type: 'Feature',
      id: accident.id,
      geometry: { type: 'Point', coordinates: [accident.lat, accident.lon] },
      properties: {
        balloonContentHeader: escapeHtml(displayText(accident.accident_type)),
        balloonContentBody: [
          escapeHtml(displayText(accident.location)),
          formatDate(accident.accident_date),
          `Пострадавших: ${escapeHtml(accident.victims_count)}`,
        ].join('<br />'),
        hintContent: escapeHtml(displayText(accident.location)),
      },
      options: {
        preset: presetFor(accident.victims_count),
        iconContent: String(accident.victims_count ?? 0),
      },
    }));

    objectManager.add({ type: 'FeatureCollection', features });
    map.geoObjects.add(objectManager);
    objectManagerRef.current = objectManager;

    // Автоподгон карты под все точки
    if (features.length > 1) {
      const bounds = objectManager.getBounds();
      if (bounds) {
        map.setBounds(bounds, { checkZoomRange: true, zoomMargin: 30 });
      }
    }
  }, [points, ready]);

  if (err) return <div className="map-error">Карта недоступна: {err}</div>;

  return (
    <div className="map-wrapper">
      <div ref={containerRef} className="map-container" />
    </div>
  );
}

// Совместимость с тем, что markerColor мог использоваться где-то ещё
export function markerColor(victimsCount) {
  if (victimsCount >= 3) return '#e74c3c';
  if (victimsCount >= 1) return '#f1c40f';
  return '#27ae60';
}
