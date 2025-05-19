
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useUserContext } from '@/contexts/UserContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ShieldCheckIcon } from 'lucide-react';

const AdminPromotionButton = () => {
  const { user } = useUserContext();
  const [loading, setLoading] = useState(false);

  const handlePromoteToAdmin = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        toast.error("Authentication error");
        return;
      }
      
      const { data, error } = await supabase.functions.invoke('promote-admin', {
        body: { 
          email: user.email,
          targetUserId: user.id
        }
      });
      
      if (error) {
        console.error('Error promoting to admin:', error);
        toast.error(error.message || "Failed to promote to admin");
        return;
      }
      
      if (data.success) {
        toast.success("Successfully promoted to admin!");
        // Force reload to update the UI with new admin status
        setTimeout(() => window.location.reload(), 1000);
      } else {
        toast.error(data.error || "Something went wrong");
      }
    } catch (err: any) {
      console.error('Unexpected error:', err);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };
  
  // Only show for admin user with specific email
  if (user?.email !== 'leerod25@hotmail.com') {
    return null;
  }

  // Admin badge only, no longer showing the promotion button
  return null;
};

export default AdminPromotionButton;
