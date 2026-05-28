// frontend/src/components/reports/MaxVictimsAccident.jsx
import ReportCard from './ReportCard';
import Badge from '../common/Badge';
import { useReport } from '../../hooks/useReports';
import { reportsApi } from '../../api/reportsApi';

export default function MaxVictimsAccident() {
  const { data, loading, error } = useReport(reportsApi.maxVictimsAccident);
  return (
    <ReportCard
      number={4}
      title="ДТП с максимальным числом пострадавших"
    >
      {loading && <div>Загрузка…</div>}
      {error && <div className="error">{error}</div>}
      {data && (
        <dl className="detail-card__list">
          <dt>№ акта</dt><dd>{data.act_number}</dd>
          <dt>Дата</dt><dd>{data.accident_date}</dd>
          <dt>Место</dt><dd>{data.location}</dd>
          <dt>Пострадавших</dt><dd><b>{data.victims_count}</b></dd>
          <dt>Водитель</dt><dd>{data.driver_name}</dd>
          <dt>Вид</dt><dd><Badge value={data.accident_type} kind="type" /></dd>
          <dt>Причина</dt><dd><Badge value={data.accident_cause} kind="cause" /></dd>
        </dl>
      )}
    </ReportCard>
  );
}
