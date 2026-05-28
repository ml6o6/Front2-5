// frontend/src/components/reports/PedestrianDrivers.jsx
import ReportCard from './ReportCard';
import { useReport } from '../../hooks/useReports';
import { reportsApi } from '../../api/reportsApi';

export default function PedestrianDrivers() {
  const { data, loading, error } = useReport(reportsApi.pedestrianDrivers);
  return (
    <ReportCard
      number={5}
      title='Водители с ДТП типа "Наезд на пешехода"'
    >
      {loading && <div>Загрузка…</div>}
      {error && <div className="error">{error}</div>}
      {data && (
        <table className="data-table">
          <thead>
            <tr><th>ФИО</th><th>Стаж</th><th>Гос. номер</th><th>Дата</th><th>Место</th></tr>
          </thead>
          <tbody>
            {data.map((r, i) => (
              <tr key={`${r.driver_id}-${i}`}>
                <td>{r.full_name}</td>
                <td>{r.experience}</td>
                <td>{r.car_reg_number || '—'}</td>
                <td>{r.accident_date}</td>
                <td>{r.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </ReportCard>
  );
}
