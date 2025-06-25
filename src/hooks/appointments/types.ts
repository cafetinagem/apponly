
export interface ModelAppointment {
  id: string;
  user_id: string;
  model_id: string;
  title: string;
  date: string;
  start_time: string;
  end_time: string;
  is_recurring: boolean;
  recurrence_type?: string | null;
  recurrence_end?: string | null;
  notes?: string | null;
  attachment_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateAppointmentData {
  model_id: string;
  title: string;
  date: string;
  start_time: string;
  end_time: string;
  is_recurring: boolean;
  recurrence_type?: 'daily' | 'weekly' | 'monthly';
  recurrence_end?: string;
  notes?: string;
  attachment_url?: string;
}
