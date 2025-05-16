
import React, { useState, useEffect } from 'react';
import { useLatestAudio } from '@/hooks/useLatestAudio';
import { useUserAudios } from '@/hooks/useUserAudios';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { User } from '@supabase/supabase-js';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Mic } from 'lucide-react';
import AudioRecordingItem from '@/components/AudioRecordingItem';
import { Skeleton } from '@/components/ui/skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import ProfileForm from '@/components/ProfileForm';
import ProfessionalDetailsForm from '@/components/ProfessionalDetailsForm';

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [profileCompleted, setProfileCompleted] = useState<boolean>(false);
  const { audio, loading: loadingSingle } = useLatestAudio(user);
  const { audios, loading: loadingAll, deleteAudio, renameAudio } = useUserAudios(user);
  const navigate = useNavigate();

  useEffect(() => {
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
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, phone, city, country')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      
      // Check if essential fields are completed
      const isCompleted = data && data.full_name && data.phone && data.city && data.country;
      setProfileCompleted(!!isCompleted);
    } catch (error) {
      console.error('Error checking profile completion:', error);
      setProfileCompleted(false);
    }
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
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl font-bold">Create Profile</CardTitle>
            {profileCompleted && (
              <Button asChild variant="outline" size="sm" className="transition-colors duration-200 hover:bg-accent focus:outline-none focus:ring-2 focus:ring-purple-300">
                <Link to="/upload">
                  <Mic className="mr-2 h-4 w-4" />
                  Record New Audio
                </Link>
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            {user && (
              <>
                {!profileCompleted && (
                  <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-md">
                    <p className="text-amber-800 font-medium">Please complete your profile to continue as an agent.</p>
                  </div>
                )}
                <ProfileForm userId={user.id} onProfileUpdate={() => checkProfileCompletion(user.id)} />
              </>
            )}
          </CardContent>
        </Card>

        {(profileCompleted || true) && (
          <>
            <Card className="bg-white shadow-md">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Professional Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {user && <ProfessionalDetailsForm userId={user.id} />}
              </CardContent>
            </Card>

            <Card className="bg-white shadow-md">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Your Recordings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {loadingAll && (
                  <div className="space-y-4">
                    {[0, 1, 2].map(i => (
                      <div key={i} className="p-4 border rounded-md space-y-3">
                        <div className="flex justify-between">
                          <Skeleton className="h-6 w-1/3" />
                          <div className="flex gap-2">
                            <Skeleton className="h-8 w-8 rounded-md" />
                            <Skeleton className="h-8 w-8 rounded-md" />
                            <Skeleton className="h-8 w-24 rounded-md" />
                          </div>
                        </div>
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-4 w-40" />
                      </div>
                    ))}
                  </div>
                )}

                {!loadingAll && audios.length === 0 && (
                  <div className="text-center p-6">
                    <p className="mb-4 text-gray-600">You haven't saved any audio yet.</p>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button asChild className="transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-300">
                        <Link to="/upload">Record Your First Audio</Link>
                      </Button>
                    </motion.div>
                  </div>
                )}

                {!loadingAll && audios.length > 0 && (
                  <AnimatePresence>
                    <div className="space-y-4">
                      {audios.map((item) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                        >
                          <AudioRecordingItem
                            id={item.id}
                            title={item.title}
                            audioUrl={item.audio_url}
                            createdAt={item.created_at}
                            onDelete={deleteAudio}
                            onRename={renameAudio}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </AnimatePresence>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </motion.div>
  );
}
