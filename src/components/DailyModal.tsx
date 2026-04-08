'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Thermometer, Droplets, MessageSquare, Calendar as CalendarIcon } from 'lucide-react';
import { DailyRecord, FlowType } from '@/types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface DailyModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date;
  record: Partial<DailyRecord> | null;
  onSave: (data: Partial<DailyRecord>) => void;
  allRecords: DailyRecord[];
}

const FLOW_OPTIONS = [
  { value: 'menstruation', label: 'Menstruación', color: 'bg-menstruation' },
  { value: 'spotting', label: 'Manchado', color: 'bg-spotting' },
  { value: 'dry', label: 'Sequedad', color: 'bg-dry' },
  { value: 'mucus_el', label: 'Moco EL', color: 'bg-mucus-el' },
  { value: 'mucus_es', label: 'Moco ES', color: 'bg-mucus-es' },
  { value: 'peak_day', label: 'Día Pico', color: 'bg-mucus-es', marker: 'P' },
];

export const DailyModal: React.FC<DailyModalProps> = ({ isOpen, onClose, date, record, onSave, allRecords }) => {
  const [formData, setFormData] = React.useState<Partial<DailyRecord>>({
    basal_temp: 36.40,
    flow_type: null,
    cycle_day: null,
    had_sex: false,
    used_condom: false,
    notes: '',
  });

  React.useEffect(() => {
    if (record) {
      setFormData({
        basal_temp: record.basal_temp || 36.40,
        flow_type: record.flow_type || null,
        cycle_day: record.cycle_day || null,
        had_sex: !!record.had_sex,
        used_condom: !!record.used_condom,
        notes: record.notes || '',
      });
    } else {
      // Intentar calcular el día del ciclo automáticamente basándose en el registro anterior
      const prevDate = new Date(date);
      prevDate.setDate(prevDate.getDate() - 1);
      const prevDateStr = prevDate.toISOString().split('T')[0];
      const prevRecord = allRecords.find(r => r.date.split('T')[0] === prevDateStr);

      setFormData({
        basal_temp: 36.40,
        flow_type: null,
        cycle_day: prevRecord?.cycle_day ? prevRecord.cycle_day + 1 : null,
        had_sex: false,
        used_condom: false,
        notes: '',
      });
    }
  }, [record, isOpen, date, allRecords]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 z-40 backdrop-blur-md"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 350 }}
            className="fixed bottom-0 left-0 right-0 bg-card rounded-t-[40px] z-50 p-8 pb-12 max-h-[92vh] overflow-y-auto shadow-[0_-20px_40px_-15px_rgba(0,0,0,0.1)] border-t border-white/10"
          >
            <div className="w-12 h-1.5 bg-slate-100/10 rounded-full mx-auto mb-8" />
            
            <div className="flex justify-between items-center mb-8">
              <div className="space-y-1">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">REGISTRO DIARIO</span>
                <h2 className="text-2xl font-black text-slate-900">
                  {date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}
                </h2>
              </div>
              <button onClick={onClose} className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-100 hover:text-slate-900 transition-all">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Temperatura y Día de Ciclo */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-wider">
                    <Thermometer size={14} strokeWidth={3} className="text-menstruation" /> Temp (°C)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      placeholder="36.40"
                      value={formData.basal_temp || ''}
                      onChange={(e) => setFormData({ ...formData, basal_temp: parseFloat(e.target.value) || null })}
                      className="w-full bg-slate-50 border-transparent text-xl font-black py-5 pl-6 focus:bg-card focus:border-menstruation/20 transition-all text-slate-900"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-wider">
                    <CalendarIcon size={14} strokeWidth={3} className="text-slate-400" /> Día Ciclo
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="1"
                      value={formData.cycle_day || ''}
                      onChange={(e) => setFormData({ ...formData, cycle_day: parseInt(e.target.value) || null })}
                      className="w-full bg-slate-50 border-transparent text-xl font-black py-5 pl-6 focus:bg-card focus:border-slate-200 transition-all text-slate-900"
                    />
                  </div>
                </div>
              </div>

              {/* Flujo */}
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-wider">
                  <Droplets size={14} strokeWidth={3} className="text-blue-500" /> Estado del Ciclo / Flujo
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {FLOW_OPTIONS.map((opt) => {
                    const isSelected = formData.flow_type === opt.value;
                    const colorVar = opt.color.replace('bg-', '');
                    
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, flow_type: opt.value as FlowType })}
                        className={cn(
                          "flex items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-300",
                          isSelected
                            ? "border-transparent text-white shadow-lg"
                            : "border-slate-100 bg-card text-slate-400 hover:border-slate-200"
                        )}
                        style={isSelected ? { backgroundColor: `var(--color-${colorVar})` } : {}}
                      >
                        <div 
                          className={cn(
                            "w-5 h-5 rounded-full border-2",
                            isSelected ? "bg-white border-white/20" : "border-transparent"
                          )} 
                          style={!isSelected ? { backgroundColor: `var(--color-${colorVar})` } : {}}
                        />
                        <span className="text-sm font-black">{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Relaciones */}
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-wider">
                  <Heart size={14} strokeWidth={3} className="text-red-400" /> Relaciones Sexuales
                </label>
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, had_sex: !formData.had_sex })}
                    className={cn(
                      "flex items-center justify-between w-full p-5 rounded-2xl border-2 transition-all",
                      formData.had_sex 
                        ? "border-menstruation/20 bg-menstruation/5 text-menstruation" 
                        : "border-slate-100 bg-card text-slate-400"
                    )}
                  >
                    <span className="font-black">¿Hubo relaciones?</span>
                    <div className={cn(
                      "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                      formData.had_sex ? "bg-menstruation border-menstruation" : "border-slate-200"
                    )}>
                      {formData.had_sex && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                  </button>

                  <AnimatePresence>
                    {formData.had_sex && (
                      <motion.button
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        type="button"
                        onClick={() => setFormData({ ...formData, used_condom: !formData.used_condom })}
                        className={cn(
                          "flex items-center justify-between w-full p-5 rounded-2xl border-2 transition-all",
                          formData.used_condom 
                            ? "border-blue-200 bg-blue-50 text-blue-600" 
                            : "border-slate-100 bg-card text-slate-400"
                        )}
                      >
                        <span className="font-black">¿Usaste protección?</span>
                        <div className={cn(
                          "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                          formData.used_condom ? "bg-blue-500 border-blue-500" : "border-slate-200"
                        )}>
                          {formData.used_condom && <div className="w-2 h-2 bg-white rounded-full" />}
                        </div>
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Comentarios */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-wider">
                  <MessageSquare size={14} strokeWidth={3} className="text-slate-400" /> Notas adicionales
                </label>
                <textarea
                  placeholder="¿Algún síntoma o nota importante?"
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-slate-50 border-transparent rounded-[24px] p-6 h-32 resize-none font-medium text-slate-900 focus:bg-card focus:border-slate-200 transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-slate-900 text-white hover:bg-slate-800 py-6 rounded-[24px] font-black text-xl shadow-2xl shadow-slate-300 transition-all active:scale-[0.98]"
              >
                Guardar Registro
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
