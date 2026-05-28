// frontend/src/components/common/Pagination.jsx
export default function Pagination({ page, pageSize, total, onChange }) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  if (pages <= 1) return null;
  return (
    <div className="pagination">
      <button disabled={page <= 1} onClick={() => onChange(page - 1)}>← Назад</button>
      <span className="pagination__info">Страница {page} из {pages}</span>
      <button disabled={page >= pages} onClick={() => onChange(page + 1)}>Вперёд →</button>
    </div>
  );
}
