// frontend/src/pages/AccidentDetailPage.jsx
import { useParams, Link } from 'react-router-dom';
import { useAccident } from '../hooks/useAccidents';
import AccidentDetail from '../components/accidents/AccidentDetail';

export default function AccidentDetailPage() {
  const { id } = useParams();
  const { accident, loading, error } = useAccident(Number(id));
  return (
    <div className="page">
      <Link to="/accidents" className="back-link">← К списку ДТП</Link>
      {loading && <div>Загрузка…</div>}
      {error && <div className="error">{error}</div>}
      {accident && <AccidentDetail accident={accident} />}
    </div>
  );
}
