// frontend/src/pages/StatisticsPage.jsx
import AccidentsByType from '../components/charts/AccidentsByType';
import AccidentsByCause from '../components/charts/AccidentsByCause';
import AccidentsByMonth from '../components/charts/AccidentsByMonth';
import VictimsHeatmap from '../components/charts/VictimsHeatmap';
import {
  useStatsByType,
  useStatsByCause,
  useStatsByLocation,
  useStatsSummary,
} from '../hooks/useStats';

export default function StatisticsPage() {
  const summary = useStatsSummary();
  const byType = useStatsByType();
  const byCause = useStatsByCause();
  const byLocation = useStatsByLocation(10);

  return (
    <div className="page">
      <h1>Статистика ДТП</h1>

      <div className="kpi-grid">
        <KPI title="Всего ДТП" value={summary?.total_accidents ?? '—'} />
        <KPI title="Всего пострадавших" value={summary?.total_victims ?? '—'} />
        <KPI title="Наиболее частый вид" value={summary?.top_type || '—'} />
        <KPI title="Топ-причина" value={summary?.top_cause || '—'} />
      </div>

      <div className="charts-grid">
        <AccidentsByType data={byType} />
        <AccidentsByCause data={byCause} />
        <AccidentsByMonth />
        <VictimsHeatmap data={byLocation} />
      </div>
    </div>
  );
}

function KPI({ title, value }) {
  return (
    <div className="kpi-card">
      <div className="kpi-card__title">{title}</div>
      <div className="kpi-card__value">{value}</div>
    </div>
  );
}
