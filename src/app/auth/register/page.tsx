'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, User as UserIcon, Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register(name, email, password);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background flex flex-col justify-center px-6 max-w-lg mx-auto">
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-black tracking-tight text-slate-900">Crea tu cuenta</h1>
          <p className="text-slate-500 font-medium">Únete a Amara Flow hoy mismo</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative group">
            <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-menstruation transition-colors" size={20} />
            <input
              type="text"
              placeholder="Nombre completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-14 pr-4 py-5 bg-slate-50 border-slate-100 text-slate-900 rounded-[24px] focus:bg-white focus:border-menstruation/30 transition-all outline-none font-medium"
              required
            />
          </div>
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
            className="w-full bg-menstruation text-white font-black py-4 rounded-2xl text-lg flex items-center justify-center gap-2 hover:bg-red-500 transition-all shadow-lg"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Crear Cuenta'}
          </button>
        </form>

        <p className="text-center text-slate-500 font-medium">
          ¿Ya tienes una cuenta?{' '}
          <Link href="/auth/login" className="text-slate-900 font-bold hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </main>
  );
}
