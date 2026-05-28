// frontend/src/pages/CarsPage.jsx
import { useState } from 'react';
import { useCars } from '../hooks/useCars';
import CarList from '../components/cars/CarList';
import CarForm from '../components/cars/CarForm';
import ConfirmModal from '../components/common/ConfirmModal';
import { carsApi } from '../api/carsApi';
import { useAuth } from '../hooks/useAuth';
import { IconPlus } from '../components/common/Icons';

export default function CarsPage() {
  const [search, setSearch] = useState('');
  const { cars, loading, error, reload } = useCars(search || undefined);
  const { isAdmin } = useAuth();
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  async function onSubmit(payload) {
    if (editing) await carsApi.updateCar(editing.id, payload);
    else await carsApi.createCar(payload);
    setShowForm(false);
    setEditing(null);
    await reload();
  }

  async function confirmDelete() {
    await carsApi.deleteCar(toDelete.id);
    setToDelete(null);
    await reload();
  }

  return (
    <div className="page">
      <div className="page__header">
        <h1>Автомобили</h1>
        <div className="page__actions">
          <input
            className="search"
            placeholder="Поиск по марке / номеру"
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
      {!loading && <CarList cars={cars} onEdit={(c) => { setEditing(c); setShowForm(true); }} onDelete={setToDelete} />}

      {showForm && (
        <div className="modal-backdrop" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <CarForm initial={editing} onSubmit={onSubmit} onCancel={() => setShowForm(false)} />
          </div>
        </div>
      )}
      <ConfirmModal
        open={!!toDelete}
        message={`Удалить автомобиль «${toDelete?.reg_number}»?`}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
