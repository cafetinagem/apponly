
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface UserProfile {
  id: string;
  user_id: string;
  status_conta: 'pendente' | 'aprovado' | 'rejeitado';
  email: string;
  nome: string | null;
  data_cadastro: string;
  data_aprovacao: string | null;
  aprovado_por: string | null;
}

export function useUserApproval() {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [notificationSent, setNotificationSent] = useState(false);

  useEffect(() => {
    if (user) {
      loadUserProfile();
    } else {
      setUserProfile(null);
      setLoading(false);
    }
  }, [user]);

  const loadUserProfile = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Use maybeSingle to handle missing records gracefully
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('❌ [UserApproval] Error loading profile:', error);
        setUserProfile(null);
        return;
      }

      // Type-safe conversion of status_conta
      if (data) {
        const typedProfile: UserProfile = {
          ...data,
          status_conta: data.status_conta as 'pendente' | 'aprovado' | 'rejeitado'
        };
        setUserProfile(typedProfile);

        // Send notification if user is pending and notification hasn't been sent
        if (typedProfile.status_conta === 'pendente' && !notificationSent) {
          try {
            await sendApprovalNotification(user.email, typedProfile.nome || user.email);
            setNotificationSent(true);
          } catch (notificationError) {
            console.warn('⚠️ [UserApproval] Notification failed:', notificationError);
            // Don't block the flow if notification fails
          }
        }
      } else {
        setUserProfile(null);
      }

    } catch (err) {
      console.error('❌ [UserApproval] Unexpected error:', err);
      setUserProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const sendApprovalNotification = async (email: string, name: string) => {
    try {
      const { error } = await supabase.functions.invoke('send-approval-notification', {
        body: { email, name }
      });

      if (error) {
        throw error;
      }

      console.log('✅ [UserApproval] Notification sent successfully');
    } catch (error) {
      console.error('❌ [UserApproval] Failed to send notification:', error);
      throw error;
    }
  };

  const isApproved = userProfile?.status_conta === 'aprovado';
  const isPending = userProfile?.status_conta === 'pendente' || !userProfile;
  const isRejected = userProfile?.status_conta === 'rejeitado';

  return {
    userProfile,
    loading,
    isApproved,
    isPending,
    isRejected,
    notificationSent,
    reload: loadUserProfile
  };
}
