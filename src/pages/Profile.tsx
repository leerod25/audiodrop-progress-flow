
import React, { useEffect } from 'react';
import { useLatestAudio } from '@/hooks/useLatestAudio';
import { useUserAudios } from '@/hooks/useUserAudios';
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useUserContext } from '@/contexts/UserContext';
import ProfileSkeleton from '@/components/profile/ProfileSkeleton';
import AgentProfileView from '@/components/profile/AgentProfileView';
import BusinessProfileView from '@/components/profile/BusinessProfileView';
import { useProfileCompletion } from '@/hooks/useProfileCompletion';

export default function Profile() {
  const { user, userRole } = useUserContext();
  const { audio } = useLatestAudio(user);
  const { audios, loading: loadingAll, deleteAudio, renameAudio } = useUserAudios(user);
  const navigate = useNavigate();
  
  const { 
    profileCompleted, 
    loading, 
    checkAgentProfileCompletion, 
    checkBusinessProfileCompletion 
  } = useProfileCompletion();

  useEffect(() => {
    // Check if user is logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) {
        toast.error('You must be logged in to view your profile');
        navigate('/auth');
      } else {
        // Check if profile is completed based on user role
        if (userRole === 'business') {
          checkBusinessProfileCompletion(session.user.id);
        } else {
          // Default to agent profile
          checkAgentProfileCompletion(session.user.id);
        }
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!session?.user) {
          navigate('/auth');
        } else if (event === 'SIGNED_IN') {
          if (userRole === 'business') {
            checkBusinessProfileCompletion(session.user.id);
          } else {
            checkAgentProfileCompletion(session.user.id);
          }
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate, userRole, checkAgentProfileCompletion, checkBusinessProfileCompletion]);

  // If still loading, show a skeleton loader
  if (loading) {
    return <ProfileSkeleton />;
  }

  // Adapter functions for type compatibility with ProfileAudioList
  const handleDeleteAudio = async (id: string) => {
    await deleteAudio(id);
    return true;
  };

  const handleRenameAudio = async (id: string, newTitle: string) => {
    await renameAudio(id, newTitle);
    return true;
  };

  // Render the appropriate profile view based on user role
  if (userRole === 'business') {
    return (
      <BusinessProfileView
        user={user}
        profileCompleted={profileCompleted}
        checkProfileCompletion={checkBusinessProfileCompletion}
      />
    );
  }

  // Default to agent profile view
  return (
    <AgentProfileView
      user={user}
      profileCompleted={profileCompleted}
      checkProfileCompletion={checkAgentProfileCompletion}
      audios={audios}
      loadingAudios={loadingAll}
      handleDeleteAudio={handleDeleteAudio}
      handleRenameAudio={handleRenameAudio}
    />
  );
}
