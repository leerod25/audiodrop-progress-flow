
import { useState, useEffect } from 'react';
import { useUserContext } from '@/contexts/UserContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface NotificationSettings {
  email_notifications: boolean;
  marketing_emails: boolean;
  update_notifications: boolean;
}

interface Profile {
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

export const useProfile = () => {
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
      
      // Get professional details if available
      const { data: proDetails } = await supabase
        .from('professional_details')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
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
        notification_settings: mockNotificationSettings,
        ...(proDetails && {
          salary_expectation: proDetails.salary_expectation,
        })
      });
      
    } catch (err: any) {
      console.error('Error fetching profile:', err);
      setError(err.message);
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };
  
  const updateProfile = async (profileData: Partial<Profile>) => {
    if (!user) return false;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', user.id);
        
      if (error) throw error;
      
      // Update local state
      setProfile((prev) => prev ? { ...prev, ...profileData } : null);
      toast.success('Profile updated successfully');
      return true;
    } catch (err: any) {
      console.error('Error updating profile:', err);
      toast.error('Failed to update profile');
      return false;
    }
  };
  
  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw error;
      
      toast.success('Password changed successfully');
      return true;
    } catch (err: any) {
      console.error('Error changing password:', err);
      toast.error('Failed to change password');
      return false;
    }
  };
  
  const updateNotificationSettings = async (settings: NotificationSettings) => {
    if (!profile) return false;
    
    try {
      // In a real app, you'd save this to a notifications table
      // For now, we're just updating the local state
      setProfile((prev) => prev ? {
        ...prev,
        notification_settings: settings
      } : null);
      
      toast.success('Notification preferences updated');
      return true;
    } catch (err: any) {
      console.error('Error updating notification settings:', err);
      toast.error('Failed to update notification preferences');
      return false;
    }
  };
  
  return {
    profile,
    setProfile,
    loading,
    error,
    updateProfile,
    changePassword,
    updateNotificationSettings
  };
};
