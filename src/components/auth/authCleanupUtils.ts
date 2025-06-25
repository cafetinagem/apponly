import { supabase } from '@/integrations/supabase/client';

export const cleanupAuthState = () => {
  // Remove standard auth tokens
  localStorage.removeItem('supabase.auth.token');
  
  // Remove all Supabase auth keys from localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
  
  // Remove from sessionStorage if in use
  Object.keys(sessionStorage || {}).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      sessionStorage.removeItem(key);
    }
  });
};

export const forceAuthReset = async () => {
  // Execute cleanup first
  cleanupAuthState();
  
  // Additional cleanup for force reset
  try {
    // Clear any remaining auth state
    await supabase.auth.signOut({ scope: 'global' });
  } catch (error) {
    console.warn('⚠️ [AuthCleanup] Aviso no reset forçado:', error);
  }
};
