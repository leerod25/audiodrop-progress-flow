
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from '@/utils/dateUtils';
import UserAudioFiles from './UserAudioFiles';
import { useUserContext } from '@/contexts/UserContext';

interface User {
  id: string;
  email: string | null;
  app_metadata: Record<string, any>;
  user_metadata: Record<string, any>;
  created_at: string;
  last_sign_in_at?: string | null;
  audio_files?: AudioFile[];
  country?: string | null;
  city?: string | null;
  gender?: string | null;
  years_experience?: string | null;
}

interface AudioFile {
  id: string;
  title: string;
  audio_url: string;
  created_at: string;
}

interface UserCardProps {
  user: User;
  expandedUser: string | null;
  playingAudio: string | null;
  toggleUserExpand: (userId: string) => void;
  handleAudioPlay: (audioId: string) => void;
}

const UserCard: React.FC<UserCardProps> = ({
  user,
  expandedUser,
  playingAudio,
  toggleUserExpand,
  handleAudioPlay
}) => {
  const { userRole } = useUserContext();
  const isAgent = userRole === "agent";
  
  // Generate a profile ID from the first 6 characters of the user ID
  const profileId = user.id.substring(0, 6).toUpperCase();
  
  return (
    <Card className="shadow-sm overflow-hidden">
      <CardHeader 
        className="cursor-pointer bg-gray-50" 
        onClick={() => toggleUserExpand(user.id)}
      >
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">Profile ID: {profileId}</CardTitle>
          <div className="text-sm text-blue-600 hover:underline">
            {expandedUser === user.id ? 'Hide Details' : 'Show Details'}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className={expandedUser === user.id ? "block" : "hidden"}>
        {isAgent ? (
          // Limited view for agents - only show message that preview is not available
          <div className="p-4 text-center text-gray-500">
            <p>NO PREVIEW AVAILABLE</p>
          </div>
        ) : (
          // Full view for business and admin users
          <div className="grid grid-cols-1 gap-4 mb-4">
            <div>
              <p className="font-medium">User ID</p>
              <p className="text-sm text-gray-600 break-all">{user.id}</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="font-medium">Location</p>
                <p className="text-sm text-gray-600">
                  {user.country || 'Unknown'}{user.city ? `, ${user.city}` : ''}
                </p>
              </div>
              <div>
                <p className="font-medium">Gender</p>
                <p className="text-sm text-gray-600">{user.gender || 'Not specified'}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="font-medium">Experience</p>
                <p className="text-sm text-gray-600">{user.years_experience || 'Not specified'} years</p>
              </div>
              <div>
                <p className="font-medium">Last Sign In</p>
                <p className="text-sm text-gray-600">{formatDate(user.last_sign_in_at)}</p>
              </div>
            </div>
            
            <UserAudioFiles 
              audioFiles={user.audio_files} 
              playingAudio={playingAudio}
              handleAudioPlay={handleAudioPlay}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserCard;
