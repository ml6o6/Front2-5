// frontend/src/components/common/ConfirmModal.jsx
export default function ConfirmModal({ open, title = 'Подтвердите действие', message, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="modal__actions">
          <button className="btn btn--ghost" onClick={onCancel}>Отмена</button>
          <button className="btn btn--danger" onClick={onConfirm}>Подтвердить</button>
        </div>
      </div>
    </div>
  );
}
