// frontend/src/components/drivers/DriverList.jsx
import { Link } from 'react-router-dom';
import { IconEdit, IconTrash } from '../common/Icons';
import { useAuth } from '../../hooks/useAuth';

export default function DriverList({ drivers, onEdit, onDelete }) {
  const { isAdmin } = useAuth();
  if (!drivers.length) return <div className="empty">Водителей нет</div>;

  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>ФИО</th>
          <th>Стаж (лет)</th>
          <th>Гос. номер</th>
          <th>Удостоверение</th>
          <th>Дата выдачи</th>
          <th>№ акта</th>
          {isAdmin && <th>Действия</th>}
        </tr>
      </thead>
      <tbody>
        {drivers.map((d) => (
          <tr key={d.id}>
            <td>{d.id}</td>
            <td><Link to={`/drivers/${d.id}`}>{d.full_name}</Link></td>
            <td>{d.experience}</td>
            <td>{d.car_reg_number || '—'}</td>
            <td>{d.license_number}</td>
            <td>{d.license_date}</td>
            <td>{d.act_number || '—'}</td>
            {isAdmin && (
              <td className="actions">
                <button className="btn btn--icon" onClick={() => onEdit(d)} title="Редактировать">
                  <IconEdit />
                </button>
                <button className="btn btn--icon btn--danger" onClick={() => onDelete(d)} title="Удалить">
                  <IconTrash />
                </button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
