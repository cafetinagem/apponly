
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { CreateSessionData } from './types';

export function useSessionOperations() {
  const { user } = useAuth();

  const createSession = useCallback(async (sessionData: CreateSessionData) => {
    if (!user) {
      console.error('No user found');
      return null;
    }

    console.log('Creating session:', sessionData);

    try {
      const { data, error } = await supabase
        .from('model_sessions')
        .insert({
          user_id: user.id,
          model_id: sessionData.model_id,
          title: sessionData.title,
          description: sessionData.description,
          date: sessionData.date,
          start_time: sessionData.start_time,
          end_time: sessionData.end_time,
          location: sessionData.location,
          meeting_link: sessionData.meeting_link,
          session_type: sessionData.session_type,
          status: sessionData.status || 'scheduled',
          client_name: sessionData.client_name,
          client_contact: sessionData.client_contact,
          payment: sessionData.payment,
          notes: sessionData.notes
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating session:', error);
        throw error;
      }

      console.log('Session created successfully:', data);
      return data;
    } catch (error) {
      console.error('Error in createSession:', error);
      throw error;
    }
  }, [user]);

  const updateSession = useCallback(async (id: string, updates: Partial<CreateSessionData>) => {
    if (!user) return null;

    console.log('Updating session:', id, updates);

    try {
      const { data, error } = await supabase
        .from('model_sessions')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating session:', error);
        throw error;
      }

      console.log('Session updated successfully:', data);
      return data;
    } catch (error) {
      console.error('Error in updateSession:', error);
      throw error;
    }
  }, [user]);

  const deleteSession = useCallback(async (id: string) => {
    if (!user) return false;

    console.log('Deleting session:', id);

    try {
      const { error } = await supabase
        .from('model_sessions')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting session:', error);
        throw error;
      }

      console.log('Session deleted successfully');
      return true;
    } catch (error) {
      console.error('Error in deleteSession:', error);
      throw error;
    }
  }, [user]);

  return {
    createSession,
    updateSession,
    deleteSession
  };
}
