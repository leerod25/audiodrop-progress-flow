
import { useState, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';

export function useProfileCompletion() {
  const [profileCompleted, setProfileCompleted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const checkAgentProfileCompletion = useCallback(async (userId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, phone, city, country, computer_skill_level')
        .eq('id', userId)
        .maybeSingle();
      
      if (error) {
        console.error('Error checking profile completion:', error);
        setProfileCompleted(false);
        return;
      }
      
      // Check if essential fields are completed
      const isCompleted = data && 
                        data.full_name && 
                        data.phone && 
                        data.city && 
                        data.country && 
                        data.computer_skill_level;
      
      setProfileCompleted(!!isCompleted);
    } catch (error) {
      console.error('Error checking profile completion:', error);
      setProfileCompleted(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const checkBusinessProfileCompletion = useCallback(async (userId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('business_profiles')
        .select('business_name, phone, city, country, industry')
        .eq('id', userId)
        .maybeSingle();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error checking business profile completion:', error);
        setProfileCompleted(false);
        return;
      }
      
      // Check if essential business fields are completed
      const isCompleted = data && 
                        typeof data === 'object' &&
                        'business_name' in data && data.business_name && 
                        'phone' in data && data.phone && 
                        'city' in data && data.city && 
                        'country' in data && data.country &&
                        'industry' in data && data.industry;
      
      setProfileCompleted(!!isCompleted);
    } catch (error) {
      console.error('Error checking business profile completion:', error);
      setProfileCompleted(false);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    profileCompleted,
    loading,
    checkAgentProfileCompletion,
    checkBusinessProfileCompletion
  };
}
