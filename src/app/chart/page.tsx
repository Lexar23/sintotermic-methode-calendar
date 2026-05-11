'use client';

import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';
import { DailyRecord, ApiResponse } from '@/types';
import { getStatusColor } from '@/utils/calendar';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Scatter,
  ComposedChart
} from 'recharts';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ArrowLeft, BarChart2, Calendar as CalendarIcon, Settings } from 'lucide-react';
import Link from 'next/link';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function ChartPage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState<'1' | '2'>('1');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const { data: responseData, isValidating: swrLoading } = useSWR(`/records/chart?months=${filter}`, async (url) => {
    const response = await api.get<ApiResponse<{ chart: any[] }>>(url);
    return response.data;
  }, {
    revalidateOnFocus: true,
  });

  useEffect(() => {
    if (responseData?.success) {
      const formatted = responseData.data!.chart.map(r => {
        const dateStr = typeof r.date === 'string' ? r.date.split('T')[0] : format(new Date(r.date), 'yyyy-MM-dd');
        const validDate = new Date(dateStr + 'T12:00:00');

        return {
          ...r,
          displayDate: format(validDate, 'd MMM', { locale: es }),
          temp: parseFloat(r.basal_temp),
          color: getStatusColor(r.flow_type)
        };
      });
      setData(formatted);
    }
  }, [responseData]);

  useEffect(() => {
    setLoading(swrLoading && !data.length);
  }, [swrLoading, data.length]);


  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#1A1F26] border border-white/10 p-4 rounded-2xl shadow-2xl backdrop-blur-md">
          <p className="text-sm font-bold mb-1">{data.displayDate}</p>
          <p className="text-xl font-black text-white">{data.temp} °C</p>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: data.color }} />
            <span className="text-xs text-gray-400 capitalize">{data.flow_type || 'Sin registro'}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <main className="min-h-screen bg-background pb-24 px-4 pt-8 max-w-lg mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard" className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 shadow-sm transition-all">
          <ArrowLeft size={24} strokeWidth={3} />
        </Link>
        <div className="space-y-1">
          <span className="text-xs font-black text-slate-300 uppercase tracking-widest">ANÁLISIS</span>
          <h1 className="text-2xl font-black text-slate-900">Tu Curva Térmica</h1>
        </div>

        <div className="ml-auto flex bg-slate-100 p-1 rounded-2xl">
          <button
            onClick={() => setFilter('1')}
            className={cn(
              "px-4 py-2 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all",
              filter === '1' ? "bg-white text-slate-900 shadow-sm" : "text-slate-400"
            )}
          >
            1 Ciclo
          </button>
          <button
            onClick={() => setFilter('2')}
            className={cn(
              "px-4 py-2 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all",
              filter === '2' ? "bg-white text-slate-900 shadow-sm" : "text-slate-400"
            )}
          >
            2 Ciclos
          </button>
        </div>
      </div>

      <div className="bg-card rounded-[40px] p-6 border border-slate-100 shadow-xl shadow-slate-200/50 h-[450px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
            <XAxis 
              dataKey="displayDate" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 700 }}
              interval="preserveStartEnd"
              dy={10}
            />
            <YAxis 
              domain={[35.5, 37.5]} 
              axisLine={false} 
              tickLine={false}
              tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 700 }}
              dx={-5}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#F1F5F9', strokeWidth: 20 }} />
            
            <Line 
              type="monotone" 
              dataKey="temp" 
              stroke="#FF5A5F" 
              strokeWidth={5} 
              dot={false}
              activeDot={{ r: 10, strokeWidth: 6, stroke: '#FFFFFF', fill: '#FF5A5F' }}
              animationDuration={1500}
            />
            
            <Scatter 
              dataKey="temp" 
              name="Temperatura"
              shape={(props: any) => {
                const { cx, cy, payload } = props;
                return (
                  <circle 
                    cx={cx} 
                    cy={cy} 
                    r={6} 
                    fill={payload.color || '#FF5A5F'} 
                    strokeWidth={4} 
                    stroke="#FFFFFF" 
                    className="shadow-sm"
                  />
                );
              }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-8 space-y-4 pb-12">
        <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">Leyenda de Estados</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { color: '#FF5A5F', label: 'Menstruación' },
            { color: '#FF8BA0', label: 'Spotting' },
            { color: '#38BDF8', label: 'Moco EL' },
            { color: '#0284C7', label: 'Moco ES' },
            { color: '#8B5CF6', label: 'Post-Peak' },
            { color: '#94A3B8', label: 'Sequedad' },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 bg-card p-4 rounded-2xl border border-slate-50 shadow-sm">
              <div className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: item.color }} />
              <span className="text-xs font-black text-slate-600 uppercase tracking-tight">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Bottom */}
      <nav className="fixed bottom-6 left-6 right-6 bg-card/70 backdrop-blur-2xl border border-white px-8 py-4 z-40 rounded-[32px] shadow-2xl shadow-slate-200/50">
        <div className="flex items-center justify-around max-w-lg mx-auto">
          <Link href="/dashboard" className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-900 transition-colors">
            <CalendarIcon size={24} strokeWidth={2.5} />
            <span className="text-[10px] font-bold uppercase tracking-tighter">Ciclo</span>
          </Link>
          <Link href="/chart" className="flex flex-col items-center gap-1 text-menstruation">
            <BarChart2 size={24} strokeWidth={3} />
            <span className="text-[10px] font-black uppercase tracking-tighter">Gráfico</span>
          </Link>
          <Link href="/settings" className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-900 transition-colors">
            <Settings size={24} strokeWidth={2.5} />
            <span className="text-[10px] font-bold uppercase tracking-tighter">Ajustes</span>
          </Link>
        </div>
      </nav>
    </main>
  );
}
