// frontend/src/components/reports/MultiAccidentDrivers.jsx
import ReportCard from './ReportCard';
import { useReport } from '../../hooks/useReports';
import { reportsApi } from '../../api/reportsApi';

export default function MultiAccidentDrivers() {
  const { data, loading, error } = useReport(reportsApi.multiAccidentDrivers);
  return (
    <ReportCard
      number={1}
      title="Водители, участвовавшие в более чем одном ДТП"
    >
      {loading && <div>Загрузка…</div>}
      {error && <div className="error">{error}</div>}
      {data && (
        <table className="data-table">
          <thead>
            <tr><th>ФИО</th><th>Стаж</th><th>Кол-во ДТП</th><th>Последняя дата</th></tr>
          </thead>
          <tbody>
            {data.map((r) => (
              <tr key={r.driver_id}>
                <td>{r.full_name}</td>
                <td>{r.experience}</td>
                <td><b>{r.accidents_count}</b></td>
                <td>{r.last_accident_date || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </ReportCard>
  );
}
