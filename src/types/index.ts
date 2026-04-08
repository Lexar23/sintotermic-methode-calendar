export type FlowType =
  | 'menstruation'
  | 'spotting'
  | 'dry'
  | 'mucus_el'
  | 'mucus_es'
  | 'peak_day';

export interface User {
  id: number;
  email: string;
  name: string;
  created_at: string;
}

export interface UserPublic extends Omit<User, 'id'> {
  id: number;
}

export interface DailyRecord {
  id: number;
  user_id: number;
  date: string;
  basal_temp: number | null;
  flow_type: FlowType | null;
  cycle_day: number | null;
  had_sex: boolean;
  used_condom: boolean;
  notes: string | null;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: { field: string; message: string }[];
}
