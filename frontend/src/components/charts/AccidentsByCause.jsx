// frontend/src/components/charts/AccidentsByCause.jsx
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function AccidentsByCause({ data }) {
  if (!data?.length) return <div className="empty">Нет данных</div>;
  const sorted = [...data].sort((a, b) => b.count - a.count);
  return (
    <div className="chart-card">
      <h3>Причины ДТП (по убыванию)</h3>
      <ResponsiveContainer width="100%" height={Math.max(280, sorted.length * 40)}>
        <BarChart data={sorted} layout="vertical" margin={{ left: 60 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" allowDecimals={false} />
          <YAxis type="category" dataKey="cause" width={260} />
          <Tooltip />
          <Bar dataKey="count" fill="#e67e22" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
