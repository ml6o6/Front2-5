// frontend/src/components/cars/CarList.jsx
import { IconEdit, IconTrash } from '../common/Icons';
import { useAuth } from '../../hooks/useAuth';

export default function CarList({ cars, onEdit, onDelete }) {
  const { isAdmin } = useAuth();
  if (!cars.length) return <div className="empty">Автомобилей нет</div>;
  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>ID</th><th>Фирма</th><th>Марка</th><th>Тип кузова</th><th>Гос. номер</th>
          {isAdmin && <th>Действия</th>}
        </tr>
      </thead>
      <tbody>
        {cars.map((c) => (
          <tr key={c.id}>
            <td>{c.id}</td>
            <td>{c.brand_company}</td>
            <td>{c.brand_model}</td>
            <td>{c.body_type}</td>
            <td><b>{c.reg_number}</b></td>
            {isAdmin && (
              <td className="actions">
                <button className="btn btn--icon" onClick={() => onEdit(c)}><IconEdit /></button>
                <button className="btn btn--icon btn--danger" onClick={() => onDelete(c)}><IconTrash /></button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
