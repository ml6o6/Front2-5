// frontend/src/components/reports/CausesByFrequency.jsx
import ReportCard from './ReportCard';
import { useReport } from '../../hooks/useReports';
import { reportsApi } from '../../api/reportsApi';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

export default function CausesByFrequency() {
  const { data, loading, error } = useReport(reportsApi.causesByFrequency);
  return (
    <ReportCard
      number={6}
      title="Причины ДТП в порядке убывания"
    >
      {loading && <div>Загрузка…</div>}
      {error && <div className="error">{error}</div>}
      {data && (
        <>
          <table className="data-table">
            <thead>
              <tr><th>Причина</th><th>Кол-во</th><th>% от общего</th></tr>
            </thead>
            <tbody>
              {data.map((r) => (
                <tr key={r.cause}>
                  <td>{r.cause}</td>
                  <td><b>{r.count}</b></td>
                  <td>{r.percentage}%</td>
                </tr>
              ))}
            </tbody>
          </table>
          <ResponsiveContainer width="100%" height={Math.max(220, data.length * 38)}>
            <BarChart data={data} layout="vertical" margin={{ left: 80 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" allowDecimals={false} />
              <YAxis type="category" dataKey="cause" width={260} />
              <Tooltip />
              <Bar dataKey="count" fill="#34495e" />
            </BarChart>
          </ResponsiveContainer>
        </>
      )}
    </ReportCard>
  );
}
