'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, ArrowLeft, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        router.push(`/auth/verify-code?email=${encodeURIComponent(email)}`);
      } else {
        const data = await response.json();
        setError(data.error || 'Algo salió mal');
      }
    } catch (err) {
      setError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background flex flex-col justify-center px-6 max-w-lg mx-auto">
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-medium text-sm mb-4"
          >
            <ArrowLeft size={16} /> Volver al inicio
          </Link>

          <div className="w-20 h-20 bg-menstruation/10 rounded-[28px] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-menstruation/5 border border-menstruation/10">
            <Mail className="text-menstruation" size={32} />
          </div>

          <h1 className="text-4xl font-black tracking-tight text-slate-900">Recuperar acceso</h1>
          <p className="text-slate-500 font-medium">Te enviaremos un código de seguridad</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative group flex items-center">
            <Mail className="text-slate-400 group-focus-within:text-menstruation transition-colors" size={20} />
            <input
              type="email"
              placeholder="Tu correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-4 pr-4 py-5 bg-slate-50 border-slate-100 text-slate-900 rounded-[24px] focus:bg-white focus:border-menstruation/30 transition-all outline-none font-medium"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center font-bold bg-red-50 p-3 rounded-xl border border-red-100">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl text-lg flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-lg"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Enviar código'}
          </button>
        </form>
      </div>
    </main>
  );
}
