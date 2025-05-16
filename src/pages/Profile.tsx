
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

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [profileCompleted, setProfileCompleted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const { audio, loading: loadingSingle } = useLatestAudio(user);
  const { audios, loading: loadingAll, deleteAudio, renameAudio } = useUserAudios(user);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    // Check if user is logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        toast.error('You must be logged in to view your profile');
        navigate('/auth');
      } else {
        // Check if profile is completed
        checkProfileCompletion(session.user.id);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        if (!session?.user) {
          navigate('/auth');
        } else if (event === 'SIGNED_IN') {
          checkProfileCompletion(session.user.id);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const checkProfileCompletion = async (userId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, phone, city, country, computer_skill_level')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      
      // Check if essential fields are completed
      const isCompleted = data && data.full_name && data.phone && data.city && data.country && data.computer_skill_level;
      setProfileCompleted(!!isCompleted);
    } catch (error) {
      console.error('Error checking profile completion:', error);
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
                <ProfileForm userId={user.id} onProfileUpdate={() => checkProfileCompletion(user.id)} />
              </>
            )}
          </CardContent>
        </Card>

        {(profileCompleted || true) && (
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
