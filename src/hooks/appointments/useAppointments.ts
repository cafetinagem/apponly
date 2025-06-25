
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ModelAppointment, CreateAppointmentData } from './types';

export function useAppointments() {
  const [appointments, setAppointments] = useState<ModelAppointment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('model_appointments')
        .select('*')
        .order('date', { ascending: true })
        .order('start_time', { ascending: true });

      if (error) throw error;
      setAppointments(data || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const createAppointment = async (appointmentData: CreateAppointmentData): Promise<void> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('model_appointments')
        .insert([{
          ...appointmentData,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;
      
      // Update local state
      setAppointments(prev => [...prev, data as ModelAppointment].sort((a, b) => {
        const dateCompare = new Date(a.date).getTime() - new Date(b.date).getTime();
        if (dateCompare === 0) {
          return a.start_time.localeCompare(b.start_time);
        }
        return dateCompare;
      }));
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  };

  const updateAppointment = async (id: string, updates: Partial<CreateAppointmentData>): Promise<void> => {
    try {
      const { data, error } = await supabase
        .from('model_appointments')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setAppointments(prev => prev.map(apt => apt.id === id ? data as ModelAppointment : apt));
    } catch (error) {
      console.error('Error updating appointment:', error);
      throw error;
    }
  };

  const deleteAppointment = async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('model_appointments')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      // Update local state immediately
      setAppointments(prev => prev.filter(apt => apt.id !== id));
    } catch (error) {
      console.error('Error deleting appointment:', error);
      throw error;
    }
  };

  const getModelAppointments = (modelId: string) => {
    return appointments.filter(apt => apt.model_id === modelId);
  };

  const getNextAppointment = (modelId: string) => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const currentTime = now.toTimeString().slice(0, 5);
    
    const modelAppointments = getModelAppointments(modelId)
      .filter(apt => {
        const appointmentDate = apt.date;
        const appointmentTime = apt.start_time;
        
        // If appointment is in the future date, include it
        if (appointmentDate > today) return true;
        
        // If appointment is today, check if time is in the future
        if (appointmentDate === today) {
          return appointmentTime > currentTime;
        }
        
        // Past appointments are excluded
        return false;
      })
      .sort((a, b) => {
        const dateCompare = new Date(a.date).getTime() - new Date(b.date).getTime();
        if (dateCompare === 0) {
          return a.start_time.localeCompare(b.start_time);
        }
        return dateCompare;
      });
    
    return modelAppointments[0] || null;
  };

  const getModelAppointmentsCount = (modelId: string) => {
    return getModelAppointments(modelId).length;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  // Initial load
  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  // Fixed real-time subscription with unique channel name and stable dependencies
  useEffect(() => {
    // Create a unique channel name to avoid conflicts
    const channelName = `model_appointments_realtime_${Date.now()}`;
    
    const channel = supabase
      .channel(channelName)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'model_appointments' }, 
        (payload) => {
          console.log('Real-time appointment update:', payload);
          // Refresh appointments on any change
          fetchAppointments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []); // Empty dependency array to prevent re-subscription

  return {
    appointments,
    loading,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    getModelAppointments,
    getNextAppointment,
    getModelAppointmentsCount,
    formatDate,
    refreshAppointments: fetchAppointments
  };
}
