// frontend/src/components/charts/VictimsHeatmap.jsx
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

export default function VictimsHeatmap({ data }) {
  if (!data?.length) return <div className="empty">Нет данных</div>;
  return (
    <div className="chart-card">
      <h3>Пострадавшие по местам ДТП (топ-10)</h3>
      <ResponsiveContainer width="100%" height={Math.max(280, data.length * 40)}>
        <BarChart data={data} layout="vertical" margin={{ left: 60 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" allowDecimals={false} />
          <YAxis type="category" dataKey="location" width={220} />
          <Tooltip />
          <Bar dataKey="total_victims" fill="#c0392b" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
