'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import api from '@/services/api';
import { ApiResponse, User } from '@/types';
import { 
  ArrowLeft, 
  User as UserIcon, 
  Mail, 
  Palette, 
  LogOut, 
  Check, 
  Moon, 
  Sun,
  Calendar as CalendarIcon,
  BarChart2,
  Settings as SettingsIcon,
  Save,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    try {
      await api.put('/auth/profile', { name, email });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const themes = [
    { id: 'pink', name: 'Rosa Natural', color: '#FF5A5F' },
    { id: 'lilac', name: 'Lila Suave', color: '#A66CFF' },
    { id: 'emerald', name: 'Esmeralda', color: '#10B981' },
    { id: 'ocean', name: 'Océano', color: '#0EA5E9' },
    { id: 'amber', name: 'Ámbar', color: '#F59E0B' },
    { id: 'rose', name: 'Fucsia', color: '#E11D48' },
    { id: 'slate', name: 'Pizarra', color: '#64748B' },
    { id: 'midnight', name: 'Medianoche', color: '#38BDF8' },
    { id: 'dark', name: 'Noche Profunda', color: '#1A2129' },
    { id: 'white', name: 'Blanco Puro', color: '#000000' },
  ] as const;

  return (
    <main className="min-h-screen bg-background pb-32 px-4 pt-8 max-w-lg mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard" className="p-3 bg-card border border-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 shadow-sm transition-all">
          <ArrowLeft size={24} strokeWidth={3} />
        </Link>
        <div className="space-y-1">
          <span className="text-xs font-black text-slate-300 uppercase tracking-widest">PERSONALIZACIÓN</span>
          <h1 className="text-2xl font-black text-slate-900">Configuración</h1>
        </div>
      </div>

      <div className="space-y-8">
        {/* Perfil */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-2">
            <UserIcon size={18} className="text-menstruation" />
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">Mi Perfil</h2>
          </div>
          
          <form onSubmit={handleUpdateProfile} className="bg-card rounded-[40px] p-8 border border-slate-100 shadow-xl shadow-slate-200/50 space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest ml-1">Nombre</label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border-transparent py-4 px-6 rounded-2xl text-slate-900 font-bold focus:bg-white focus:border-menstruation/20 transition-all outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest ml-1">Correo Electrónico</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border-transparent py-4 px-6 rounded-2xl text-slate-900 font-bold focus:bg-white focus:border-menstruation/20 transition-all outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className={cn(
                "w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all",
                success ? "bg-green-500 text-white" : "bg-slate-900 text-white hover:bg-slate-800"
              )}
            >
              {saving ? <Loader2 className="animate-spin" size={18} /> : success ? <Check size={18} /> : <Save size={18} />}
              {saving ? 'Guardando...' : success ? 'Actualizado' : 'Guardar Cambios'}
            </button>
          </form>
        </section>

        {/* Temas */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-2">
            <Palette size={18} className="text-menstruation" />
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">Tema Visual</h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={cn(
                  "p-6 rounded-[32px] border-2 transition-all flex flex-col items-center gap-3 relative overflow-hidden",
                  theme === t.id 
                    ? "border-menstruation bg-card shadow-lg" 
                    : "border-slate-100 bg-slate-50 opacity-60 grayscale hover:grayscale-0 hover:opacity-100"
                )}
              >
                <div 
                  className="w-10 h-10 rounded-full shadow-inner" 
                  style={{ backgroundColor: t.color }}
                />
                <span className="text-[11px] font-black tracking-tighter uppercase">{t.name}</span>
                {theme === t.id && (
                  <div className="absolute top-2 right-2 bg-menstruation text-white rounded-full p-1 scale-75">
                    <Check size={14} strokeWidth={4} />
                  </div>
                )}
              </button>
            ))}
          </div>
        </section>

        {/* Peligro */}
        <section className="pt-4">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-3 p-6 rounded-[32px] border-2 border-red-50 bg-red-50/10 text-red-500 font-bold hover:bg-slate-100 transition-all shadow-sm"
          >
            <LogOut size={20} />
            <span className="uppercase tracking-widest text-xs font-black">Cerrar Sesión</span>
          </button>
        </section>
      </div>

      {/* Navigation Bottom */}
      <nav className="fixed bottom-6 left-6 right-6 bg-card/70 backdrop-blur-2xl border border-white px-8 py-4 z-40 rounded-[32px] shadow-2xl shadow-slate-200/50">
        <div className="flex items-center justify-around max-w-lg mx-auto">
          <Link href="/dashboard" className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-900 transition-colors">
            <CalendarIcon size={24} strokeWidth={2.5} />
            <span className="text-[10px] font-bold uppercase tracking-tighter">Ciclo</span>
          </Link>
          <Link href="/chart" className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-900 transition-colors">
            <BarChart2 size={24} strokeWidth={2.5} />
            <span className="text-[10px] font-bold uppercase tracking-tighter">Gráfico</span>
          </Link>
          <Link href="/settings" className="flex flex-col items-center gap-1 text-menstruation">
            <SettingsIcon size={24} strokeWidth={3} />
            <span className="text-[10px] font-black uppercase tracking-tighter">Ajustes</span>
          </Link>
        </div>
      </nav>
    </main>
  );
}
