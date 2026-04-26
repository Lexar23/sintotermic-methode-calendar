'use client';

import React from 'react';
import { DailyRecord } from '@/types';
import { calculateCycleDay, getCycleRecommendation } from '@/utils/cycle';
import { Sparkles, AlertCircle } from 'lucide-react';

interface CycleStatusProps {
  records: DailyRecord[];
  onStartNewCycle?: () => void;
}

export const CycleStatus: React.FC<CycleStatusProps> = ({ records }) => {
  const today = new Date();
  const cycleDay = calculateCycleDay(today, records);

  if (cycleDay === null) {
    return (
      <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 flex flex-col items-center justify-center text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm">
          <Sparkles className="text-slate-300" size={24} />
        </div>
        <h3 className="font-black text-slate-900 text-lg mb-1">¡Comienza tu viaje!</h3>
        <p className="text-slate-400 text-sm font-medium px-4">
          Registra tu menstruación para empezar a contar los días de tu ciclo.
        </p>
      </div>
    );
  }

  const rec = getCycleRecommendation(cycleDay);

  return (
    <div 
      className="relative overflow-hidden rounded-[32px] p-8 border shadow-sm transition-all duration-500 animate-in fade-in slide-in-from-bottom-4"
      style={{ 
        backgroundColor: `${rec.color}08`, // 5% opacity background
        borderColor: `${rec.color}30` // 20% opacity border
      }}
    >
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-1">
            <span 
              className="text-[10px] font-black uppercase tracking-[0.2em]"
              style={{ color: rec.color }}
            >
              {rec.phase}
            </span>
            <div className="flex items-baseline gap-2">
              <h2 className="text-5xl font-black text-slate-900 tracking-tighter">
                Día {cycleDay}
              </h2>
              <span className="text-slate-400 font-bold text-sm tracking-tight">del ciclo</span>
            </div>
          </div>
          <div 
            className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3"
            style={{ backgroundColor: rec.color }}
          >
            <span className="text-white font-black text-2xl tracking-tighter">
              {cycleDay}
            </span>
          </div>
        </div>

        <div className="flex items-start gap-4 bg-white/60 backdrop-blur-md border border-white p-5 rounded-2xl">
          <div 
            className="mt-1 p-1.5 rounded-lg"
            style={{ backgroundColor: `${rec.color}15`, color: rec.color }}
          >
            {rec.isResetSuggestion ? <AlertCircle size={18} /> : <Sparkles size={18} />}
          </div>
          <p className="text-slate-700 text-sm font-bold leading-relaxed">
            {rec.recommendation}
          </p>
        </div>
        
        {rec.isResetSuggestion && (
          <div className="mt-2 flex justify-center">
            <button 
              onClick={onStartNewCycle}
              className="bg-slate-900 text-white text-[11px] font-black uppercase tracking-widest px-6 py-3 rounded-2xl shadow-xl hover:-translate-y-1 transition-all active:scale-95"
            >
              Iniciar Nuevo Ciclo
            </button>
          </div>
        )}
      </div>

      {/* Decorative background circle */}
      <div 
        className="absolute -top-12 -right-12 w-48 h-48 rounded-full blur-[60px] opacity-20 pointer-events-none"
        style={{ backgroundColor: rec.color }}
      />
    </div>
  );
};
