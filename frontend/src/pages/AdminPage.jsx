// frontend/src/pages/AdminPage.jsx
import { useEffect, useState } from 'react';
import { authApi } from '../api/authApi';

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newUser, setNewUser] = useState({ username: '', password: '', role: 'user' });

  async function load() {
    setLoading(true);
    try {
      const data = await authApi.listUsers();
      setUsers(data);
      setError(null);
    } catch (e) {
      setError(e?.response?.data?.detail || e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function setRole(u, role) {
    await authApi.setRole(u.id, role);
    await load();
  }

  async function register(e) {
    e.preventDefault();
    try {
      await authApi.register(newUser);
      setNewUser({ username: '', password: '', role: 'user' });
      await load();
    } catch (e) {
      setError(e?.response?.data?.detail || e.message);
    }
  }

  return (
    <div className="page">
      <h1>Управление пользователями</h1>
      {error && <div className="error">{error}</div>}

      <section className="card">
        <h3>Создать пользователя</h3>
        <form className="inline-form" onSubmit={register}>
          <input placeholder="username" required value={newUser.username} onChange={(e) => setNewUser({ ...newUser, username: e.target.value })} />
          <input placeholder="пароль" required value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} />
          <select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}>
            <option value="user">user</option>
            <option value="admin">admin</option>
          </select>
          <button className="btn btn--primary" type="submit">Создать</button>
        </form>
      </section>

      {loading ? <div>Загрузка…</div> : (
        <table className="data-table">
          <thead>
            <tr><th>ID</th><th>Username</th><th>Роль</th><th>Активен</th><th>Действия</th></tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.username}</td>
                <td><span className={`role role--${u.role}`}>{u.role}</span></td>
                <td>{u.is_active ? '✓' : '×'}</td>
                <td>
                  {u.role === 'admin' ? (
                    <button className="btn btn--ghost btn--sm" onClick={() => setRole(u, 'user')}>Сделать user</button>
                  ) : (
                    <button className="btn btn--primary btn--sm" onClick={() => setRole(u, 'admin')}>Сделать admin</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
