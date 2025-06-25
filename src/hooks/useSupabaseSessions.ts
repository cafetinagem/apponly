
import { useSessionData } from './sessions/useSessionData';
import { useSessionOperations } from './sessions/useSessionOperations';

export function useSupabaseSessions() {
  const { sessions, loading, refreshSessions } = useSessionData();
  const { createSession, updateSession, deleteSession } = useSessionOperations();

  return {
    sessions,
    loading,
    createSession,
    updateSession,
    deleteSession,
    refreshSessions
  };
}

// Re-export types for convenience
export type { ModelSession, CreateSessionData } from './sessions/types';
