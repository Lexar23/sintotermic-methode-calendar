'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Key, ArrowLeft, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

function VerifyCodeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get('email') || '';
  
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length === 6) {
      router.push(`/auth/reset-password?email=${encodeURIComponent(email)}&code=${encodeURIComponent(code)}`);
    } else {
      setError('El código debe tener 6 dígitos');
    }
  };

  return (
    <main className="min-h-screen bg-background flex flex-col justify-center px-6 max-w-lg mx-auto">
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <Link 
            href="/auth/forgot-password" 
            className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-medium text-sm mb-4"
          >
            <ArrowLeft size={16} /> Cambiar correo
          </Link>
          
          <div className="w-20 h-20 bg-menstruation/10 rounded-[28px] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-menstruation/5 border border-menstruation/10">
            <Key className="text-menstruation" size={32} />
          </div>
          
          <h1 className="text-4xl font-black tracking-tight text-slate-900">Verifica tu identidad</h1>
          <p className="text-slate-500 font-medium">Ingresa el código enviado a <span className="text-slate-900 font-bold">{email}</span></p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative group flex items-center">
            <Key className="text-slate-400 group-focus-within:text-menstruation transition-colors" size={20} />
            <input
              type="text"
              maxLength={6}
              placeholder="Código de 6 dígitos"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              className="w-full pl-4 pr-4 py-5 bg-slate-50 border-slate-100 text-slate-900 rounded-[24px] focus:bg-white focus:border-menstruation/30 transition-all outline-none font-medium tracking-[0.5em] text-center"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center font-bold bg-red-50 p-3 rounded-xl border border-red-100">{error}</p>}
          <button
            type="submit"
            className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl text-lg flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-lg"
          >
            Verificar código
          </button>
        </form>
      </div>
    </main>
  );
}

export default function VerifyCodePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-menstruation" size={40} /></div>}>
      <VerifyCodeContent />
    </Suspense>
  );
}
