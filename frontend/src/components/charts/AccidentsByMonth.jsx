// frontend/src/components/charts/AccidentsByMonth.jsx
import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { useStatsByDay } from '../../hooks/useStats';

const now = new Date();

export default function AccidentsByMonth() {
  const [year, setYear] = useState(2025);
  const [month, setMonth] = useState(6);
  const data = useStatsByDay(year, month);

  // Заполняем пропуски
  const filled = Array.from({ length: 31 }, (_, i) => {
    const day = i + 1;
    const row = data.find((d) => d.day === day);
    return { day, count: row ? row.count : 0 };
  });

  return (
    <div className="chart-card">
      <h3>ДТП по дням месяца</h3>
      <div className="chart-controls">
        <label>Год
          <input type="number" min="2000" max="2100" value={year} onChange={(e) => setYear(Number(e.target.value))} />
        </label>
        <label>Месяц
          <input type="number" min="1" max="12" value={month} onChange={(e) => setMonth(Number(e.target.value))} />
        </label>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={filled}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Line type="monotone" dataKey="count" stroke="#2980b9" strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
