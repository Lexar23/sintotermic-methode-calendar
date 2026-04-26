'use client';

import React from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths
} from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { DailyRecord } from '@/types';
import { getStatusColor } from '@/utils/calendar';
import { calculateCycleDay } from '@/utils/cycle';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CalendarProps {
  records: DailyRecord[];
  onDayClick: (date: Date) => void;
}

export const Calendar: React.FC<CalendarProps> = ({ records, onDayClick }) => {
  const [currentDate, setCurrentDate] = React.useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const getRecordForDay = (day: Date) => {
    const dayStr = format(day, 'yyyy-MM-dd');
    return records.find(r => {
      // Normalizar la fecha del registro (sacar solo YYYY-MM-DD si viene como ISO)
      const recordDate = typeof r.date === 'string' ? r.date.split('T')[0] : format(new Date(r.date), 'yyyy-MM-dd');
      return recordDate === dayStr;
    });
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 px-2">
        <div className="flex flex-col">
          <h1 className="text-3xl sm:text-4xl font-black capitalize text-slate-900 tracking-tight">
            {format(currentDate, 'MMMM', { locale: es })}
          </h1>
          <span className="text-slate-400 font-bold uppercase tracking-widest text-xs">
            {format(currentDate, 'yyyy')}
          </span>
        </div>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all shadow-sm">
            <ChevronLeft size={24} />
          </button>
          <button onClick={nextMonth} className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all shadow-sm">
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 mb-4">
        {['lun', 'mar', 'mié', 'jue', 'vie', 'sáb', 'dom'].map((day, idx) => (
          <div key={idx} className="text-center text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
            {day}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {calendarDays.map((day, idx) => {
          const record = getRecordForDay(day);
          const isCurrentMonth = isSameMonth(day, monthStart);
          const isToday = isSameDay(day, new Date());
          const cycleDay = calculateCycleDay(day, records);
          const statusColor = record ? getStatusColor(record.flow_type) : null;

          return (
            <button
              key={idx}
              onClick={() => onDayClick(day)}
              className={cn(
                "relative aspect-3/4 rounded-[15px] p-1 flex flex-col items-center justify-center transition-all duration-300",
                !isCurrentMonth && "opacity-10 grayscale",
                isCurrentMonth ? "bg-card border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-1.5" : "bg-transparent",
                isToday && "ring-4 ring-menstruation/20 border-menstruation/50 border-2"
              )}
            >
              {/* Fecha (Top-Left Mini) */}
              <div className={cn(
                "absolute top-0 center w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black border transition-all",
                isToday
                  ? "bg-menstruation border-white text-white shadow-lg shadow-menstruation/30"
                  : "bg-slate-50 border-white text-slate-300 shadow-sm"
              )}>
                {format(day, 'd')}
              </div>

              {/* Centro: Temperatura (Mini) */}
              <div className="flex flex-col items-center justify-center -mt-1">
                {(record?.basal_temp !== null && record?.basal_temp !== undefined) ? (
                  <span className="text-[10px] sm:text-xs font-black text-slate-900 tracking-tighter">
                    {Number(record.basal_temp).toFixed(2)}
                    <span className="text-[8px] text-menstruation ml-0.5">°</span>
                  </span>
                ) : (
                  <div className="w-1 h-1 bg-slate-100 rounded-full" />
                )}
              </div>

              {/* Parte Inferior: Día del Ciclo y Barra (Superpuestos) */}
              <div className="absolute bottom-2 left-0 right-0 px-2 flex flex-col items-center">
                <div className="w-full h-3 relative rounded-full overflow-hidden bg-slate-100/50 flex items-center justify-center">
                  {statusColor && (
                    <div
                      className="absolute inset-0"
                      style={{ backgroundColor: statusColor }}
                    />
                  )}
                  {cycleDay && (
                    <span className="relative z-10 text-[7px] font-black text-white uppercase tracking-tighter shadow-sm">
                      D.{cycleDay}
                    </span>
                  )}
                </div>
              </div>

              {/* Iconos (Top-Right) */}
              <div className="absolute top-2.5 right-2.5 flex flex-col gap-1 items-end">
                {record?.flow_type === 'peak_day' && (
                  <div className="w-4 h-4 bg-menstruation rounded-full flex items-center justify-center shadow-lg shadow-menstruation/20">
                    <span className="text-[8px] font-black text-white">P</span>
                  </div>
                )}
                {record?.had_sex && (
                  <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100">
                    <Heart size={10} className="text-menstruation fill-menstruation" />
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
