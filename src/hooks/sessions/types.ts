
export interface ModelSession {
  id: string;
  user_id: string;
  model_id: string;
  title: string;
  description?: string;
  date: string;
  start_time: string;
  end_time?: string;
  location: string;
  meeting_link?: string;
  session_type?: string;
  status: 'scheduled' | 'completed' | 'canceled' | 'in-progress';
  client_name?: string;
  client_contact?: string;
  payment?: number;
  rating?: number;
  notes?: string;
  created_at: string;
}

export interface CreateSessionData {
  model_id: string;
  title: string;
  description?: string;
  date: string;
  start_time: string;
  end_time?: string;
  location: string;
  meeting_link?: string;
  session_type?: string;
  status?: 'scheduled' | 'completed' | 'canceled' | 'in-progress';
  client_name?: string;
  client_contact?: string;
  payment?: number;
  notes?: string;
}
