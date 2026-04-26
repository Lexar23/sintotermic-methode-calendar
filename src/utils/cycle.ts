import { DailyRecord, FlowType } from '@/types';
import { differenceInDays, format, parseISO, isAfter, isBefore, startOfDay } from 'date-fns';

/**
 * Calculates the cycle day for a given date based on all available records.
 * A new cycle starts when 'menstruation' is recorded after a non-menstruation period
 * or if it's the very first record.
 */
export const calculateCycleDay = (targetDate: Date, allRecords: DailyRecord[]): number | null => {
  if (allRecords.length === 0) return null;

  // Sort records by date ascending
  const sortedRecords = [...allRecords].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Find all cycle start dates (Day 1)
  // A cycle starts on the first day of menstruation.
  // If there are multiple consecutive days of menstruation, only the first one is Day 1.
  const cycleStartDates: Date[] = [];
  let isPreviousMenstruation = false;

  sortedRecords.forEach((record, index) => {
    const isMenstruation = record.flow_type === 'menstruation';
    const recordDate = startOfDay(new Date(record.date));

    if (isMenstruation && !isPreviousMenstruation) {
      cycleStartDates.push(recordDate);
    }
    isPreviousMenstruation = isMenstruation;
  });

  if (cycleStartDates.length === 0) return null;

  // Find the latest cycle start that is before or on the target date
  const targetStartOfDay = startOfDay(targetDate);
  const relevantStart = [...cycleStartDates]
    .reverse()
    .find(startDate => !isAfter(startDate, targetStartOfDay));

  if (!relevantStart) return null;

  const diff = differenceInDays(targetStartOfDay, relevantStart);
  return diff + 1; // Cycle day is 1-indexed
};

/**
 * Provides a recommendation based on the cycle day.
 */
export const getCycleRecommendation = (cycleDay: number) => {
  if (cycleDay >= 1 && cycleDay <= 5) {
    return {
      phase: 'Menstruación',
      recommendation: 'Periodo de limpieza y renovación. Prioriza el descanso y la hidratación.',
      color: '#FF5A5F' // --status-menst
    };
  } else if (cycleDay <= 10) {
    return {
      phase: 'Fase Folicular (Pre-ovulatoria)',
      recommendation: 'Tus estrógenos suben. Es un buen momento para ser creativa y socializar.',
      color: '#9E9E9E' // --status-dry
    };
  } else if (cycleDay <= 18) {
    return {
      phase: 'Ventana Fértil',
      recommendation: 'Alta probabilidad de fertilidad. Observa la calidad de tu moco cervical.',
      color: '#007BFF' // --status-mucus-es
    };
  } else if (cycleDay <= 28) {
    return {
      phase: 'Fase Luteal',
      recommendation: 'Tus energías bajan. Progesterona en aumento. Momento de introspección.',
      color: '#A66CFF' // --status-post-peak
    };
  } else {
    return {
      phase: 'Fin del Ciclo',
      recommendation: 'Tu ciclo ha superado los 28 días. Atenta a señales de un nuevo ciclo.',
      color: '#FF5A5F',
      isResetSuggestion: true
    };
  }
};

/**
 * Validates basal temperature.
 */
export const isTemperatureValid = (temp: number | null): { valid: boolean; message?: string } => {
  if (temp === null) return { valid: true };
  if (temp < 35.0 || temp > 38.0) {
    return { 
      valid: false, 
      message: 'La temperatura basal suele estar entre 35.0°C y 38.0°C.' 
    };
  }
  return { valid: true };
};
