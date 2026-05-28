// frontend/src/components/charts/AccidentsByType.jsx
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#e74c3c', '#e67e22', '#c0392b', '#8e44ad', '#2980b9', '#d35400', '#7f8c8d'];

export default function AccidentsByType({ data }) {
  if (!data?.length) return <div className="empty">Нет данных</div>;
  return (
    <div className="chart-card">
      <h3>Виды ДТП</h3>
      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="type"
            cx="50%"
            cy="50%"
            outerRadius={110}
            label={(e) => `${e.type}: ${e.count}`}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
