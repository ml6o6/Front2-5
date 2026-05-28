// frontend/src/pages/DriverDetailPage.jsx
import { useParams, Link } from 'react-router-dom';
import { useDriver } from '../hooks/useDrivers';
import DriverDetail from '../components/drivers/DriverDetail';

export default function DriverDetailPage() {
  const { id } = useParams();
  const { driver, loading, error } = useDriver(Number(id));
  return (
    <div className="page">
      <Link to="/drivers" className="back-link">← К списку водителей</Link>
      {loading && <div>Загрузка…</div>}
      {error && <div className="error">{error}</div>}
      {driver && <DriverDetail driver={driver} />}
    </div>
  );
}
