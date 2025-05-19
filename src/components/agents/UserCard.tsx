
import React from 'react';
import { Button } from '@/components/ui/button';
import { CardContent, CardFooter } from '@/components/ui/card';
import { ChevronDown, ChevronUp } from 'lucide-react';
import UserAudioFiles, { AudioFile } from './UserAudioFiles';
import { useUserContext } from '@/contexts/UserContext';
import UserHeader from './UserHeader';
import UserProfile from './UserProfile';
import UserExpandedDetails from './UserExpandedDetails';
import UserFooter from './UserFooter';

interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
  audio_files: AudioFile[];
  country?: string | null;
  city?: string | null;
  gender?: string | null;
  years_experience?: string | null;
  languages?: string[] | null;
  is_available?: boolean;
}

interface UserCardProps {
  user: User;
  isExpanded: boolean;
  playingAudio: string | null;
  toggleExpand: () => void;
  onAudioPlay: (audioId: string) => void;
  showLoginPrompt?: boolean;
  toggleAvailability?: (userId: string, currentStatus: boolean) => Promise<void>;
}

const UserCard: React.FC<UserCardProps> = ({
  user,
  isExpanded,
  playingAudio,
  toggleExpand,
  onAudioPlay,
  showLoginPrompt = false,
  toggleAvailability
}) => {
  const { userRole } = useUserContext();
  const isAdmin = userRole === 'admin';
  
  return (
    <>
      <CardContent className="p-4">
        {/* User ID and Join Date */}
        <div className="flex justify-between items-start">
          <UserHeader
            id={user.id}
            email={user.email}
            fullName={user.full_name}
            gender={user.gender}
            createdAt={user.created_at}
            isAvailable={toggleAvailability ? user.is_available : undefined}
            isAdmin={isAdmin}
          />
          <Button variant="ghost" size="sm" onClick={toggleExpand} className="p-1">
            {isExpanded ? <ChevronUp /> : <ChevronDown />}
          </Button>
        </div>

        {/* Profile Information Section - Always Visible */}
        <UserProfile user={user} toggleAvailability={toggleAvailability} />

        {/* Show expanded content */}
        {isExpanded && (
          <UserExpandedDetails
            isAdmin={isAdmin}
            userId={user.id}
            email={user.email}
            languages={user.languages}
            audioFiles={user.audio_files}
            playingAudio={playingAudio}
            onAudioPlay={onAudioPlay}
            showLoginPrompt={showLoginPrompt}
          />
        )}
      </CardContent>
      
      <CardFooter className="bg-gray-50 px-4 py-2">
        <UserFooter
          isExpanded={isExpanded}
          toggleExpand={toggleExpand}
          audioFilesCount={user.audio_files?.length || 0}
          showLoginPrompt={showLoginPrompt}
        />
      </CardFooter>
    </>
  );
};

export default UserCard;
