'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Calendar } from '@/components/Calendar';
import { DailyModal } from '@/components/DailyModal';
import api from '@/services/api';
import { DailyRecord, ApiResponse } from '@/types';
import { format } from 'date-fns';
import { LogOut, BarChart2, Calendar as CalendarIcon, Settings } from 'lucide-react';
import Link from 'next/link';
import { CycleStatus } from '@/components/CycleStatus';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [records, setRecords] = useState<DailyRecord[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<Partial<DailyRecord> | null>(null);

  const fetchRecords = async () => {
    try {
      const response = await api.get<ApiResponse<{ records: DailyRecord[] }>>('/records');
      if (response.data.success) {
        setRecords(response.data.data!.records);
      }
    } catch (error) {
      console.error('Error fetching records:', error);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleDayClick = (date: Date) => {
    const record = records.find(r => r.date.split('T')[0] === format(date, 'yyyy-MM-dd'));
    setSelectedDate(date);
    setSelectedRecord(record || null);
    setIsModalOpen(true);
  };

  const handleStartNewCycle = () => {
    const today = new Date();
    const record = records.find(r => r.date.split('T')[0] === format(today, 'yyyy-MM-dd'));
    setSelectedDate(today);
    setSelectedRecord(record || { flow_type: 'menstruation' as any });
    setIsModalOpen(true);
  };

  const handleSaveRecord = async (data: Partial<DailyRecord>) => {
    if (!selectedDate) return;
    
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    try {
      await api.put(`/records/${dateStr}`, {
        ...data,
        date: dateStr,
      });
      fetchRecords(); // Refresh data
    } catch (error) {
      console.error('Error saving record:', error);
    }
  };

  return (
    <main className="min-h-screen pb-24 px-3 pt-8 max-w-2xl mx-auto bg-background">
      {/* Navbar top */}
      <div className="flex items-center justify-between mb-10 px-2 leading-tight">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-menstruation/10 flex items-center justify-center border border-menstruation/5 shadow-sm">
            <span className="text-menstruation font-black uppercase text-xl">{user?.name[0]}</span>
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Bienvenida,</p>
            <p className="font-black text-slate-900 text-lg">{user?.name}</p>
          </div>
        </div>
        <button onClick={logout} className="p-3 bg-card border border-slate-100 rounded-xl text-slate-400 hover:text-slate-900 shadow-sm transition-all">
          <LogOut size={20} />
        </button>
      </div>

      {/* Cycle Status Card */}
      <div className="px-2 mb-8">
        <CycleStatus records={records} onStartNewCycle={handleStartNewCycle} />
      </div>

      {/* Calendar Area */}
      <Calendar records={records} onDayClick={handleDayClick} />

      {/* Navigation Bottom */}
      <nav className="fixed bottom-6 left-6 right-6 bg-card/70 backdrop-blur-2xl border border-white px-8 py-4 z-40 rounded-[32px] shadow-2xl shadow-slate-200/50">
        <div className="flex items-center justify-around max-w-lg mx-auto">
          <Link href="/dashboard" className="flex flex-col items-center gap-1 text-menstruation">
            <CalendarIcon size={24} strokeWidth={3} />
            <span className="text-[10px] font-black uppercase tracking-tighter">Ciclo</span>
          </Link>
          <Link href="/chart" className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-900 transition-colors">
            <BarChart2 size={24} strokeWidth={2.5} />
            <span className="text-[10px] font-bold uppercase tracking-tighter">Gráfico</span>
          </Link>
          <Link href="/settings" className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-900 transition-colors">
            <Settings size={24} strokeWidth={2.5} />
            <span className="text-[10px] font-bold uppercase tracking-tighter">Ajustes</span>
          </Link>
        </div>
      </nav>

      {/* Modal */}
      {selectedDate && (
        <DailyModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          date={selectedDate}
          record={selectedRecord}
          onSave={handleSaveRecord}
          allRecords={records}
        />
      )}
    </main>
  );
}
