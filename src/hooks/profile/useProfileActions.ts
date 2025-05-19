
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useUserContext } from '@/contexts/UserContext';
import { Profile } from './useProfileFetch';

interface NotificationSettings {
  email_notifications: boolean;
  marketing_emails: boolean;
  update_notifications: boolean;
}

export const useProfileActions = (setProfile: React.Dispatch<React.SetStateAction<Profile | null>>) => {
  const { user } = useUserContext();

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
    if (!user) return false;
    
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
    updateProfile,
    changePassword,
    updateNotificationSettings
  };
};
