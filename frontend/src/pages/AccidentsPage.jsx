// frontend/src/pages/AccidentsPage.jsx
import { useState } from 'react';
import { useAccidents } from '../hooks/useAccidents';
import AccidentList from '../components/accidents/AccidentList';
import AccidentFilters from '../components/accidents/AccidentFilters';
import AccidentForm from '../components/accidents/AccidentForm';
import ConfirmModal from '../components/common/ConfirmModal';
import { accidentsApi } from '../api/accidentsApi';
import { useAuth } from '../hooks/useAuth';
import { IconPlus } from '../components/common/Icons';

export default function AccidentsPage() {
  const [filters, setFilters] = useState({});
  const { accidents, loading, error, reload } = useAccidents(filters);
  const { isAdmin } = useAuth();
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  async function openEdit(a) {
    const full = await accidentsApi.getAccident(a.id);
    setEditing(full);
    setShowForm(true);
  }

  async function onSubmit(payload) {
    if (editing) await accidentsApi.updateAccident(editing.id, payload);
    else await accidentsApi.createAccident(payload);
    setShowForm(false);
    setEditing(null);
    await reload();
  }

  async function confirmDelete() {
    await accidentsApi.deleteAccident(toDelete.id);
    setToDelete(null);
    await reload();
  }

  return (
    <div className="page">
      <div className="page__header">
        <h1>Акты ДТП</h1>
        {isAdmin && (
          <button className="btn btn--primary" onClick={() => { setEditing(null); setShowForm(true); }}>
            <IconPlus /> Новый акт
          </button>
        )}
      </div>
      <AccidentFilters value={filters} onChange={setFilters} onReset={() => setFilters({})} />
      {loading && <div>Загрузка…</div>}
      {error && <div className="error">{error}</div>}
      {!loading && (
        <AccidentList
          accidents={accidents}
          onEdit={openEdit}
          onDelete={setToDelete}
        />
      )}

      {showForm && (
        <div className="modal-backdrop" onClick={() => setShowForm(false)}>
          <div className="modal modal--wide" onClick={(e) => e.stopPropagation()}>
            <AccidentForm initial={editing} onSubmit={onSubmit} onCancel={() => setShowForm(false)} />
          </div>
        </div>
      )}
      <ConfirmModal
        open={!!toDelete}
        message={`Удалить акт ДТП «${toDelete?.act_number}»?`}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
