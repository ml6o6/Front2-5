// frontend/src/hooks/useAuth.js
import { useAuthCtx } from '../context/AuthContext';

export function useAuth() {
  return useAuthCtx();
}
