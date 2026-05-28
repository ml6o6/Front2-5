// frontend/src/pages/LoginPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function LoginPage() {
  const { login, loading } = useAuth();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    try {
      await login(username, password);
      navigate('/');
    } catch (e) {
      setError(e?.response?.data?.detail || e.message);
    }
  }

  return (
    <form className="form" onSubmit={onSubmit}>
      <label>
        <span>Логин</span>
        <input value={username} onChange={(e) => setUsername(e.target.value)} required />
      </label>
      <label>
        <span>Пароль</span>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </label>
      {error && <div className="error">{error}</div>}
      <button type="submit" className="btn btn--primary btn--full" disabled={loading}>
        {loading ? 'Вход…' : 'Войти'}
      </button>
      <small className="muted">
        Тестовые аккаунты: <b>admin / admin123</b>, <b>user / user123</b>
      </small>
    </form>
  );
}
