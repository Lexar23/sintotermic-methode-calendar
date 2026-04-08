'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background flex flex-col justify-center px-6 max-w-lg mx-auto">
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <div className="w-24 h-24 bg-menstruation/10 rounded-[32px] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-menstruation/5 border border-menstruation/10">
            <div className="w-12 h-12 bg-menstruation rounded-full blur-[1px]" />
          </div>
          <h1 className="text-5xl font-black tracking-tight text-slate-900">Amara Flow</h1>
          <p className="text-slate-500 font-medium">Tu seguimiento natural del ciclo</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative group">
            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-menstruation transition-colors" size={20} />
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-14 pr-4 py-5 bg-slate-50 border-slate-100 text-slate-900 rounded-[24px] focus:bg-white focus:border-menstruation/30 transition-all outline-none font-medium"
              required
            />
          </div>
          <div className="relative group">
            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-menstruation transition-colors" size={20} />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-14 pr-4 py-5 bg-slate-50 border-slate-100 text-slate-900 rounded-[24px] focus:bg-white focus:border-menstruation/30 transition-all outline-none font-medium"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center font-semibold bg-red-50 p-3 rounded-xl border border-red-100">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl text-lg flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-lg"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Iniciar Sesión'}
          </button>
        </form>

        <p className="text-center text-slate-500 font-medium">
          ¿No tienes una cuenta?{' '}
          <Link href="/auth/register" className="text-menstruation font-bold hover:underline">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </main>
  );
}
