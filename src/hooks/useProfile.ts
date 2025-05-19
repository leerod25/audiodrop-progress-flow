
import { useProfileFetch, Profile } from './profile/useProfileFetch';
import { useProfessionalDetails, ProfessionalDetails } from './profile/useProfessionalDetails';
import { useProfileActions } from './profile/useProfileActions';

export const useProfile = () => {
  const { 
    profile,
    setProfile,
    loading,
    error 
  } = useProfileFetch();

  const {
    professionalDetails,
    loading: loadingProfessional,
    updateProfessionalDetails
  } = useProfessionalDetails();

  const {
    updateProfile,
    changePassword,
    updateNotificationSettings
  } = useProfileActions(setProfile);

  return {
    profile,
    setProfile,
    loading,
    error,
    updateProfile,
    changePassword,
    updateNotificationSettings,
    professionalDetails,
    updateProfessionalDetails,
    loadingProfessional
  };
};

// Re-export types for convenience
export type { Profile } from './profile/useProfileFetch';
export type { ProfessionalDetails } from './profile/useProfessionalDetails';
