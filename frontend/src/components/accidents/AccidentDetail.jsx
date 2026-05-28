// frontend/src/components/accidents/AccidentDetail.jsx
import Badge from '../common/Badge';

export default function AccidentDetail({ accident }) {
  if (!accident) return null;
  return (
    <div className="detail-card">
      <h2>Акт ДТП {accident.act_number}</h2>
      <dl className="detail-card__list">
        <dt>Отдел ГИБДД</dt><dd>{accident.department_name}</dd>
        <dt>Дата</dt><dd>{accident.accident_date}</dd>
        <dt>Место</dt><dd>{accident.location}</dd>
        <dt>Координаты</dt><dd>{accident.latitude}, {accident.longitude}</dd>
        <dt>Водитель</dt><dd>{accident.driver_name || `ID ${accident.driver_id}`}</dd>
        <dt>Гос. номер</dt><dd>{accident.car_reg_number || '—'}</dd>
        <dt>Все авто</dt><dd>{accident.cars?.join(', ') || '—'}</dd>
        <dt>Вид ДТП</dt><dd><Badge value={accident.accident_type} kind="type" /></dd>
        <dt>Причина</dt><dd><Badge value={accident.accident_cause} kind="cause" /></dd>
        <dt>Пострадавшие</dt><dd>{accident.victims_count}</dd>
      </dl>
    </div>
  );
}
