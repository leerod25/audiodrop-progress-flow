
import React from 'react';
import { User } from '@supabase/supabase-js';
import { Card, CardContent } from "@/components/ui/card";
import { motion } from 'framer-motion';
import ProfileForm from '@/components/ProfileForm';
import ProfessionalDetailsForm from '@/components/ProfessionalDetailsForm';
import UserProfileHeader from '@/components/profile/UserProfileHeader';
import ProfileIncompleteAlert from '@/components/profile/ProfileIncompleteAlert';
import ProfileAudioList from '@/components/profile/ProfileAudioList';

interface AgentProfileViewProps {
  user: User | null;
  profileCompleted: boolean;
  checkProfileCompletion: (userId: string) => void;
  audios: any[];
  loadingAudios: boolean;
  handleDeleteAudio: (id: string) => Promise<boolean>;
  handleRenameAudio: (id: string, newTitle: string) => Promise<boolean>;
}

const AgentProfileView = ({
  user,
  profileCompleted,
  checkProfileCompletion,
  audios,
  loadingAudios,
  handleDeleteAudio,
  handleRenameAudio
}: AgentProfileViewProps) => {
  if (!user) return null;
  
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
            <ProfileIncompleteAlert isVisible={!profileCompleted} />
            <ProfileForm 
              userId={user.id} 
              onProfileUpdate={() => checkProfileCompletion(user.id)} 
            />
          </CardContent>
        </Card>

        {profileCompleted && (
          <>
            <Card className="bg-white shadow-md">
              <CardContent className="space-y-6">
                <ProfessionalDetailsForm userId={user.id} />
              </CardContent>
            </Card>

            <ProfileAudioList 
              audios={audios} 
              loading={loadingAudios} 
              deleteAudio={handleDeleteAudio} 
              renameAudio={handleRenameAudio} 
            />
          </>
        )}
      </div>
    </motion.div>
  );
};

export default AgentProfileView;
