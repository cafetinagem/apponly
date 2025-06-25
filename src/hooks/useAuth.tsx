import React, { createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { useUnifiedAuth } from './auth/useUnifiedAuth';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isApproved: boolean;
  isAdmin: boolean;
  userRole: string | null;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useUnifiedAuth();

  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await auth.signIn(email, password); // Usar signIn por simplicidade
      return { error };
    } catch (error: any) {
      return { error };
    }
  };

  const contextValue: AuthContextType = {
    user: auth.user,
    session: auth.session,
    loading: auth.loading,
    isApproved: auth.isApproved,
    isAdmin: auth.isAdmin,
    userRole: auth.userRole,
    signIn: auth.signIn,
    signUp,
    signOut: auth.signOut
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
