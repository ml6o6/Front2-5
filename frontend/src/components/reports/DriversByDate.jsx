// frontend/src/components/reports/DriversByDate.jsx
import { useState } from 'react';
import ReportCard from './ReportCard';
import Badge from '../common/Badge';
import { reportsApi } from '../../api/reportsApi';

export default function DriversByDate() {
  const [date, setDate] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function run(e) {
    e?.preventDefault();
    if (!date) return;
    setLoading(true);
    try {
      const r = await reportsApi.driversByDate(date);
      setData(r);
      setError(null);
    } catch (e) {
      setError(e?.response?.data?.detail || e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ReportCard
      number={3}
      title="Водители, попавшие в ДТП в указанную дату"
    >
      <form className="inline-form" onSubmit={run}>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <button className="btn btn--primary" type="submit" disabled={loading}>Поиск</button>
      </form>
      {error && <div className="error">{error}</div>}
      {data && (
        <table className="data-table">
          <thead>
            <tr><th>ФИО</th><th>Стаж</th><th>Удостоверение</th><th>Место</th><th>Вид</th></tr>
          </thead>
          <tbody>
            {data.map((r, i) => (
              <tr key={`${r.driver_id}-${i}`}>
                <td>{r.full_name}</td>
                <td>{r.experience}</td>
                <td>{r.license_number}</td>
                <td>{r.location}</td>
                <td><Badge value={r.accident_type} kind="type" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </ReportCard>
  );
}
