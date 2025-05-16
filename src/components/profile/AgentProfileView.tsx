
import React from 'react';
import { User } from '@supabase/supabase-js';
import { Card, CardContent } from "@/components/ui/card";
import { motion } from 'framer-motion';
import ProfileForm from '@/components/ProfileForm';
import ProfessionalDetailsForm from '@/components/ProfessionalDetailsForm';
import UserProfileHeader from '@/components/profile/UserProfileHeader';
import ProfileIncompleteAlert from '@/components/profile/ProfileIncompleteAlert';
import ProfileAudioList from '@/components/profile/ProfileAudioList';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User as UserIcon } from 'lucide-react';

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
            <div className="flex items-center justify-center mb-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src="/lovable-uploads/photo-1581092795360-fd1ca04f0952.jpg" alt="Profile" />
                <AvatarFallback>
                  <UserIcon className="h-12 w-12 text-gray-400" />
                </AvatarFallback>
              </Avatar>
            </div>
            
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
