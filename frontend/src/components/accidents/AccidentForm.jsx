// frontend/src/components/accidents/AccidentForm.jsx
import { useEffect, useState } from 'react';
import { driversApi } from '../../api/driversApi';
import { carsApi } from '../../api/carsApi';

const TYPES = [
  'Наезд на пешехода', 'Наезд на препятствие', 'Столкновение',
  'Опрокидывание', 'Съезд с дороги', 'Наезд на велосипедиста', 'Прочее',
];
const CAUSES = [
  'Выезд на полосу встречного движения',
  'Состояние водителя',
  'Неисправность автомобиля',
  'Нарушение ПДД',
  'Превышение скорости',
  'Плохие дорожные условия',
  'Прочее',
];

const EMPTY = {
  department_name: '',
  act_number: '',
  driver_id: '',
  car_reg_number: '',
  accident_date: '',
  location: '',
  latitude: '',
  longitude: '',
  victims_count: 0,
  accident_type: 'Столкновение',
  accident_cause: 'Нарушение ПДД',
  car_reg_numbers: [],
};

export default function AccidentForm({ initial, onSubmit, onCancel }) {
  const [form, setForm] = useState(EMPTY);
  const [drivers, setDrivers] = useState([]);
  const [cars, setCars] = useState([]);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    driversApi.getDrivers().then(setDrivers);
    carsApi.getCars().then(setCars);
  }, []);

  useEffect(() => {
    if (initial) {
      setForm({
        ...EMPTY,
        ...initial,
        driver_id: initial.driver_id || '',
        car_reg_number: initial.car_reg_number || '',
        latitude: initial.latitude ?? '',
        longitude: initial.longitude ?? '',
        car_reg_numbers: initial.cars || [],
      });
    } else setForm(EMPTY);
  }, [initial]);

  function change(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function toggleCar(reg) {
    setForm((f) => {
      const set = new Set(f.car_reg_numbers || []);
      if (set.has(reg)) set.delete(reg);
      else set.add(reg);
      return { ...f, car_reg_numbers: [...set] };
    });
  }

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        driver_id: Number(form.driver_id),
        car_reg_number: form.car_reg_number || null,
        latitude: form.latitude === '' ? null : Number(form.latitude),
        longitude: form.longitude === '' ? null : Number(form.longitude),
        victims_count: Number(form.victims_count) || 0,
      };
      await onSubmit(payload);
      setError(null);
    } catch (e) {
      setError(e?.response?.data?.detail || e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="form form--wide" onSubmit={submit}>
      <h3>{initial?.id ? 'Редактирование акта ДТП' : 'Новый акт ДТП'}</h3>
      <div className="form__grid">
        <label><span>Отдел ГИБДД</span>
          <input required value={form.department_name} onChange={(e) => change('department_name', e.target.value)} />
        </label>
        <label><span>№ акта</span>
          <input required value={form.act_number} onChange={(e) => change('act_number', e.target.value)} />
        </label>
        <label><span>Водитель</span>
          <select required value={form.driver_id} onChange={(e) => change('driver_id', e.target.value)}>
            <option value="">— выберите —</option>
            {drivers.map((d) => <option key={d.id} value={d.id}>{d.full_name}</option>)}
          </select>
        </label>
        <label><span>Гос. номер (основной)</span>
          <select value={form.car_reg_number} onChange={(e) => change('car_reg_number', e.target.value)}>
            <option value="">—</option>
            {cars.map((c) => <option key={c.id} value={c.reg_number}>{c.reg_number} ({c.brand_model})</option>)}
          </select>
        </label>
        <label><span>Дата ДТП</span>
          <input required type="date" value={form.accident_date} onChange={(e) => change('accident_date', e.target.value)} />
        </label>
        <label><span>Место</span>
          <input required value={form.location} onChange={(e) => change('location', e.target.value)} />
        </label>
        <label><span>Широта</span>
          <input type="number" step="0.000001" value={form.latitude} onChange={(e) => change('latitude', e.target.value)} />
        </label>
        <label><span>Долгота</span>
          <input type="number" step="0.000001" value={form.longitude} onChange={(e) => change('longitude', e.target.value)} />
        </label>
        <label><span>Кол-во пострадавших</span>
          <input type="number" min="0" value={form.victims_count} onChange={(e) => change('victims_count', e.target.value)} />
        </label>
        <label><span>Вид ДТП</span>
          <select value={form.accident_type} onChange={(e) => change('accident_type', e.target.value)}>
            {TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </label>
        <label><span>Причина</span>
          <select value={form.accident_cause} onChange={(e) => change('accident_cause', e.target.value)}>
            {CAUSES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </label>
      </div>

      <fieldset className="form__multi">
        <legend>Все автомобили — участники ДТП</legend>
        <div className="checkbox-grid">
          {cars.map((c) => (
            <label key={c.id} className="checkbox">
              <input
                type="checkbox"
                checked={(form.car_reg_numbers || []).includes(c.reg_number)}
                onChange={() => toggleCar(c.reg_number)}
              />
              <span>{c.reg_number} — {c.brand_company} {c.brand_model}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {error && <div className="error">{error}</div>}
      <div className="form__actions">
        <button type="button" className="btn btn--ghost" onClick={onCancel}>Отмена</button>
        <button type="submit" className="btn btn--primary" disabled={saving}>{saving ? '…' : 'Сохранить'}</button>
      </div>
    </form>
  );
}
