
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface InviteTokenData {
  id: string;
  email: string;
  expires_at: string;
  is_valid: boolean;
}

export const useInviteToken = (token: string | null) => {
  const [inviteData, setInviteData] = useState<InviteTokenData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (!token) {
      setInviteData(null);
      setIsValid(false);
      return;
    }

    const validateToken = async () => {
      setIsLoading(true);
      
      try {
        const { data, error } = await supabase
          .rpc('validate_invitation_token', { token_param: token });

        if (error) {
          console.error('Error validating token:', error);
          toast.error("Invalid invitation token");
          setIsValid(false);
          return;
        }

        if (data && data.length > 0) {
          const tokenData = data[0] as InviteTokenData;
          setInviteData(tokenData);
          setIsValid(tokenData.is_valid);
          
          if (!tokenData.is_valid) {
            if (new Date(tokenData.expires_at) < new Date()) {
              toast.error("This invitation has expired");
            } else {
              toast.error("This invitation has already been used");
            }
          } else {
            toast.success(`Welcome! You have access via invitation to ${tokenData.email}`);
          }
        } else {
          toast.error("Invalid invitation token");
          setIsValid(false);
        }
      } catch (err) {
        console.error('Error validating invitation:', err);
        toast.error("Failed to validate invitation");
        setIsValid(false);
      } finally {
        setIsLoading(false);
      }
    };

    validateToken();
  }, [token]);

  const markTokenAsUsed = async () => {
    if (!token || !inviteData) return;

    try {
      const { error } = await supabase
        .from('business_invitations')
        .update({ used_at: new Date().toISOString() })
        .eq('token', token);

      if (error) {
        console.error('Error marking token as used:', error);
      }
    } catch (err) {
      console.error('Error updating token:', err);
    }
  };

  return {
    inviteData,
    isLoading,
    isValid,
    markTokenAsUsed
  };
};
