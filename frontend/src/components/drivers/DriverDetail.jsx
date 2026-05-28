// frontend/src/components/drivers/DriverDetail.jsx
import { Link } from 'react-router-dom';
import Badge from '../common/Badge';

export default function DriverDetail({ driver }) {
  if (!driver) return null;
  return (
    <div className="detail-card">
      <h2>{driver.full_name}</h2>
      <dl className="detail-card__list">
        <dt>Стаж</dt><dd>{driver.experience} лет</dd>
        <dt>№ удостоверения</dt><dd>{driver.license_number}</dd>
        <dt>Дата выдачи</dt><dd>{driver.license_date}</dd>
        <dt>Гос. номер авто</dt><dd>{driver.car_reg_number || '—'}</dd>
        <dt>№ акта</dt><dd>{driver.act_number || '—'}</dd>
      </dl>
      <h3>История ДТП ({driver.accidents?.length || 0})</h3>
      {driver.accidents?.length ? (
        <table className="data-table">
          <thead>
            <tr>
              <th>Дата</th><th>№ акта</th><th>Место</th><th>Вид</th><th>Причина</th><th>Пострадавшие</th>
            </tr>
          </thead>
          <tbody>
            {driver.accidents.map((a) => (
              <tr key={a.id}>
                <td>{a.accident_date}</td>
                <td><Link to={`/accidents/${a.id}`}>{a.act_number}</Link></td>
                <td>{a.location}</td>
                <td><Badge value={a.accident_type} kind="type" /></td>
                <td><Badge value={a.accident_cause} kind="cause" /></td>
                <td>{a.victims_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : <p className="empty">ДТП не зарегистрировано</p>}
    </div>
  );
}
