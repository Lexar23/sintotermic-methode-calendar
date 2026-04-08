import { FlowType } from '@/types';

export const getStatusColor = (status: FlowType | null | string) => {
  switch (status) {
    case 'menstruation': return 'var(--color-menst)';
    case 'spotting': return 'var(--color-spotting)';
    case 'dry': return 'var(--color-dry)';
    case 'mucus_el': return 'var(--color-mucus-el)';
    case 'mucus_es': return 'var(--color-mucus-es)';
    case 'peak_day': return 'var(--color-menst)'; 
    case 'post_peak': return 'var(--color-post-peak)';
    default: return 'transparent';
  }
};

export const getStatusLabel = (status: FlowType | null) => {
  switch (status) {
    case 'menstruation': return 'Menstruación';
    case 'spotting': return 'Manchado';
    case 'dry': return 'Sequedad';
    case 'mucus_el': return 'Moco EL';
    case 'mucus_es': return 'Moco ES';
    case 'peak_day': return 'Día Pico';
    default: return '';
  }
};
