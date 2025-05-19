
import { useState, useEffect } from 'react';
import { useUserContext } from '@/contexts/UserContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface NotificationSettings {
  email_notifications: boolean;
  marketing_emails: boolean;
  update_notifications: boolean;
}

export interface Profile {
  id: string;
  email?: string;
  full_name?: string;
  bio?: string;
  country?: string;
  city?: string;
  gender?: string;
  years_experience?: string;
  phone?: string;
  whatsapp?: string;
  role?: string;
  is_verified?: boolean;
  subscription?: {
    plan: string;
    status: string;
    next_billing_date?: string;
  };
  notification_settings?: NotificationSettings;
}

export const useProfileFetch = () => {
  const { user } = useUserContext();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [user]);
  
  const fetchProfile = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Get profile data
      const { data, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (profileError) throw profileError;
      
      // Create a mock subscription for demonstration
      const mockSubscription = {
        plan: 'Free',
        status: 'active',
        next_billing_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      };
      
      // Create mock notification settings
      const mockNotificationSettings = {
        email_notifications: true,
        marketing_emails: false,
        update_notifications: true
      };
      
      setProfile({
        ...data,
        subscription: mockSubscription,
        notification_settings: mockNotificationSettings
      });
      
    } catch (err: any) {
      console.error('Error fetching profile:', err);
      setError(err.message);
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };
  
  return {
    profile,
    setProfile,
    loading,
    error,
    fetchProfile
  };
};
