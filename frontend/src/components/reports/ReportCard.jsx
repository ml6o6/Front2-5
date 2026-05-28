// frontend/src/components/reports/ReportCard.jsx
export default function ReportCard({ number, title, description, children }) {
  return (
    <section className="report-card">
      <header className="report-card__header">
        <span className="report-card__num">№{number}</span>
        <div>
          <h3>{title}</h3>
          {description && <p className="muted">{description}</p>}
        </div>
      </header>
      <div className="report-card__body">{children}</div>
    </section>
  );
}
