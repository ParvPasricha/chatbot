import { useState } from 'react';
import { api } from '../lib/api';

export const useAuth = () => {
  const [token, setToken] = useState<string | null>(null);

  const login = async (tenantId: string, email: string, password: string) => {
    const { token: newToken } = await api.post('/auth/login', { tenantId, email, password });
    setToken(newToken);
    return newToken;
  };

  return { token, login };
};
