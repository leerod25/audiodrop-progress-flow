
import { useState, useEffect } from 'react';
import { useUserContext } from '@/contexts/UserContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ProfessionalDetails {
  languages: string[];
  specialized_skills: string[];
  additional_skills: string[];
  years_experience: string;
  availability: string[];
  computer_skill_level: string;
}

export const useProfessionalDetails = () => {
  const { user } = useUserContext();
  const [professionalDetails, setProfessionalDetails] = useState<ProfessionalDetails | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (user) {
      fetchProfessionalDetails();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchProfessionalDetails = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Get professional details data
      const { data, error: detailsError } = await supabase
        .from('professional_details')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (detailsError && detailsError.code !== 'PGRST116') {
        console.error('Error fetching professional details:', detailsError);
      }

      if (data) {
        setProfessionalDetails({
          languages: data.languages || [],
          specialized_skills: data.specialized_skills || [],
          additional_skills: data.additional_skills || [],
          years_experience: data.years_experience || '',
          availability: data.availability || [],
          computer_skill_level: data.computer_skill_level || ''
        });
      } else {
        // Set default values if no professional details exist
        setProfessionalDetails({
          languages: [],
          specialized_skills: [],
          additional_skills: [],
          years_experience: '',
          availability: [],
          computer_skill_level: ''
        });
      }
    } catch (err: any) {
      console.error('Error fetching professional details:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const updateProfessionalDetails = async (detailsData: Partial<ProfessionalDetails>) => {
    if (!user) return false;

    try {
      // Check if professional details exist for this user
      const { data: existing } = await supabase
        .from('professional_details')
        .select('id')
        .eq('user_id', user.id)
        .single();

      let result;
      if (existing) {
        // Update existing professional details
        result = await supabase
          .from('professional_details')
          .update(detailsData)
          .eq('user_id', user.id);
      } else {
        // Insert new professional details
        result = await supabase
          .from('professional_details')
          .insert({
            user_id: user.id,
            ...detailsData
          });
      }

      if (result.error) throw result.error;

      // Update local state
      setProfessionalDetails((prev) => prev ? { ...prev, ...detailsData } : detailsData as ProfessionalDetails);
      toast.success('Professional details updated successfully');
      return true;
    } catch (err: any) {
      console.error('Error updating professional details:', err);
      toast.error('Failed to update professional details');
      return false;
    }
  };

  return {
    professionalDetails,
    setProfessionalDetails,
    loading,
    updateProfessionalDetails
  };
};
