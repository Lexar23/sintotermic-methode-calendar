'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import useSWR from 'swr';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import { User, ApiResponse } from '@/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const { data, error, mutate } = useSWR('/auth/me', async (url: string) => {
    const response = await api.get<ApiResponse<{ user: User }>>(url);
    return response.data;
  }, {
    revalidateOnFocus: false, // You can configure this as needed
    shouldRetryOnError: false
  });

  useEffect(() => {
    if (data?.success && data.data?.user) {
      setUser(data.data.user);
      setLoading(false);
    } else if (error || (data && !data.success)) {
      setUser(null);
      setLoading(false);
    }
  }, [data, error]);

  const login = async (email: string, password: string) => {
    const response = await api.post<ApiResponse<{ user: User; token: string }>>('/auth/login', {
      email,
      password,
    });
    if (response.data.success) {
      const { user } = response.data.data!;
      setUser(user);
      // Forzar recarga para asegurar que las cookies se procesen en móvil
      window.location.href = '/dashboard';
    }
  };

  const register = async (name: string, email: string, password: string) => {
    const response = await api.post<ApiResponse<{ user: User; token: string }>>('/auth/register', {
      name,
      email,
      password,
    });
    if (response.data.success) {
      const { user } = response.data.data!;
      setUser(user);
      // Forzar recarga para asegurar que las cookies se procesen en móvil
      window.location.href = '/dashboard';
    }
  };

  const logout = async () => {
    await api.post('/auth/logout');
    setUser(null);
    window.location.href = '/auth/login';
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
