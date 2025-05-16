
import React, { useState, useEffect } from 'react';
import { useLatestAudio } from '@/hooks/useLatestAudio';
import { useUserAudios } from '@/hooks/useUserAudios';
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { User } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import ProfileForm from '@/components/ProfileForm';
import ProfessionalDetailsForm from '@/components/ProfessionalDetailsForm';
import UserProfileHeader from '@/components/profile/UserProfileHeader';
import ProfileSkeleton from '@/components/profile/ProfileSkeleton';
import ProfileAudioList from '@/components/profile/ProfileAudioList';
import ProfileIncompleteAlert from '@/components/profile/ProfileIncompleteAlert';
import BusinessProfileForm from '@/components/BusinessProfileForm';
import BusinessProfileHeader from '@/components/profile/BusinessProfileHeader';
import BusinessProfileIncompleteAlert from '@/components/profile/BusinessProfileIncompleteAlert';
import { useUserContext } from '@/contexts/UserContext';

export default function Profile() {
  const [profileCompleted, setProfileCompleted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const { user, userRole } = useUserContext();
  const { audio, loading: loadingSingle } = useLatestAudio(user);
  const { audios, loading: loadingAll, deleteAudio, renameAudio } = useUserAudios(user);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
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
      setLoading(false);
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
  }, [navigate, userRole]);

  const checkAgentProfileCompletion = async (userId: string) => {
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
  };

  const checkBusinessProfileCompletion = async (userId: string) => {
    try {
      setLoading(true);
      // Using type assertion to work around the TypeScript error
      const { data, error } = await supabase
        .from('business_profiles' as any)
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
                        data.business_name && 
                        data.phone && 
                        data.city && 
                        data.country &&
                        data.industry;
      
      setProfileCompleted(!!isCompleted);
    } catch (error) {
      console.error('Error checking business profile completion:', error);
      setProfileCompleted(false);
    } finally {
      setLoading(false);
    }
  };

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

  // Business profile view
  if (userRole === 'business') {
    return (
      <motion.div 
        className="container mx-auto py-10 px-4 md:px-6 max-w-3xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="space-y-8">
          <Card className="bg-white shadow-md">
            <BusinessProfileHeader profileCompleted={profileCompleted} />
            <CardContent className="space-y-6">
              {user && (
                <>
                  <BusinessProfileIncompleteAlert isVisible={!profileCompleted} />
                  <BusinessProfileForm 
                    userId={user.id} 
                    onProfileUpdate={() => checkBusinessProfileCompletion(user.id)} 
                  />
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </motion.div>
    );
  }

  // Agent profile view (default)
  return (
    <motion.div 
      className="container mx-auto py-10 px-4 md:px-6 max-w-3xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="space-y-8">
        <Card className="bg-white shadow-md">
          <UserProfileHeader profileCompleted={profileCompleted} />
          <CardContent className="space-y-6">
            {user && (
              <>
                <ProfileIncompleteAlert isVisible={!profileCompleted} />
                <ProfileForm userId={user.id} onProfileUpdate={() => checkAgentProfileCompletion(user.id)} />
              </>
            )}
          </CardContent>
        </Card>

        {profileCompleted && (
          <>
            <Card className="bg-white shadow-md">
              <CardContent className="space-y-6">
                {user && <ProfessionalDetailsForm userId={user.id} />}
              </CardContent>
            </Card>

            <ProfileAudioList 
              audios={audios} 
              loading={loadingAll} 
              deleteAudio={handleDeleteAudio} 
              renameAudio={handleRenameAudio} 
            />
          </>
        )}
      </div>
    </motion.div>
  );
}
