// frontend/src/layouts/AuthLayout.jsx
import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="auth-layout">
      <div className="auth-layout__card">
        <h1 className="auth-layout__title">Система анализа ДТП</h1>
        <p className="auth-layout__subtitle">Авторизация</p>
        <Outlet />
      </div>
    </div>
  );
}
