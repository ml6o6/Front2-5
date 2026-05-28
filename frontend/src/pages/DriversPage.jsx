// frontend/src/pages/DriversPage.jsx
import { useState } from 'react';
import { useDrivers } from '../hooks/useDrivers';
import DriverList from '../components/drivers/DriverList';
import DriverForm from '../components/drivers/DriverForm';
import ConfirmModal from '../components/common/ConfirmModal';
import { driversApi } from '../api/driversApi';
import { useAuth } from '../hooks/useAuth';
import { IconPlus } from '../components/common/Icons';

export default function DriversPage() {
  const [search, setSearch] = useState('');
  const { drivers, loading, error, reload } = useDrivers(search || undefined);
  const { isAdmin } = useAuth();
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  async function onSubmit(payload) {
    if (editing) await driversApi.updateDriver(editing.id, payload);
    else await driversApi.createDriver(payload);
    setShowForm(false);
    setEditing(null);
    await reload();
  }

  async function confirmDelete() {
    await driversApi.deleteDriver(toDelete.id);
    setToDelete(null);
    await reload();
  }

  return (
    <div className="page">
      <div className="page__header">
        <h1>Водители</h1>
        <div className="page__actions">
          <input
            className="search"
            placeholder="Поиск по ФИО"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {isAdmin && (
            <button className="btn btn--primary" onClick={() => { setEditing(null); setShowForm(true); }}>
              <IconPlus /> Добавить
            </button>
          )}
        </div>
      </div>
      {loading && <div>Загрузка…</div>}
      {error && <div className="error">{error}</div>}
      {!loading && <DriverList drivers={drivers} onEdit={(d) => { setEditing(d); setShowForm(true); }} onDelete={setToDelete} />}

      {showForm && (
        <div className="modal-backdrop" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <DriverForm initial={editing} onSubmit={onSubmit} onCancel={() => setShowForm(false)} />
          </div>
        </div>
      )}
      <ConfirmModal
        open={!!toDelete}
        message={`Удалить водителя «${toDelete?.full_name}»?`}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
