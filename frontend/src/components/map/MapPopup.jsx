// frontend/src/components/map/MapPopup.jsx
import { Link } from 'react-router-dom';

export default function MapPopup({ point, onClose }) {
  if (!point) return null;
  return (
    <div className="map-popup">
      <button className="map-popup__close" onClick={onClose}>×</button>
      <h4>Акт ДТП</h4>
      <div className="map-popup__row"><b>Место:</b> {point.location}</div>
      <div className="map-popup__row"><b>Дата:</b> {point.accident_date}</div>
      <div className="map-popup__row"><b>Вид:</b> {point.accident_type}</div>
      <div className="map-popup__row"><b>Причина:</b> {point.accident_cause}</div>
      <div className="map-popup__row"><b>Пострадавших:</b> {point.victims_count}</div>
      {point.driver_name && <div className="map-popup__row"><b>Водитель:</b> {point.driver_name}</div>}
      {point.car_reg_number && <div className="map-popup__row"><b>Авто:</b> {point.car_reg_number}</div>}
      <Link className="btn btn--primary btn--sm" to={`/accidents/${point.id}`}>Подробнее →</Link>
    </div>
  );
}
