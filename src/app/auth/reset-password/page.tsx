'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Lock, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get('email') || '';
  const code = searchParams.get('code') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Las contraseñas no coinciden' });
      return;
    }

    if (password.length < 8) {
      setMessage({ type: 'error', text: 'La contraseña debe tener al menos 8 caracteres' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Tu contraseña ha sido restablecida correctamente.' });
        setTimeout(() => {
          router.push('/auth/login');
        }, 3000);
      } else {
        setMessage({ type: 'error', text: data.error || 'Algo salió mal' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Error al conectar con el servidor' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background flex flex-col justify-center px-6 max-w-lg mx-auto">
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-menstruation/10 rounded-[28px] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-menstruation/5 border border-menstruation/10">
            <Lock className="text-menstruation" size={32} />
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">Nueva contraseña</h1>
          <p className="text-slate-500 font-medium">Ingresa tu nueva clave para acceder a tu cuenta</p>
        </div>

        {message?.type === 'success' ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 border border-green-100 p-6 rounded-[24px] text-center space-y-4"
          >
            <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="text-green-600" size={24} />
            </div>
            <p className="text-green-800 font-semibold">{message.text}</p>
            <p className="text-slate-500 text-sm">Redirigiendo al inicio de sesión...</p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative group flex items-center">
              <Lock className="text-slate-400 group-focus-within:text-menstruation transition-colors" size={20} />
              <input
                type="password"
                placeholder="Nueva contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-4 pr-4 py-5 bg-slate-50 border-slate-100 text-slate-900 rounded-[24px] focus:bg-white focus:border-menstruation/30 transition-all outline-none font-medium"
                required
              />
            </div>

            <div className="relative group flex items-center">
              <Lock className="text-slate-400 group-focus-within:text-menstruation transition-colors" size={20} />
              <input
                type="password"
                placeholder="Confirmar nueva contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-4 pr-4 py-5 bg-slate-50 border-slate-100 text-slate-900 rounded-[24px] focus:bg-white focus:border-menstruation/30 transition-all outline-none font-medium"
                required
              />
            </div>

            {message?.type === 'error' && (
              <div className="flex items-center gap-2 text-red-500 text-sm font-semibold bg-red-50 p-4 rounded-xl border border-red-100">
                <AlertCircle size={18} />
                <p>{message.text}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl text-lg flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-lg"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : 'Restablecer contraseña'}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-menstruation" size={40} /></div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
