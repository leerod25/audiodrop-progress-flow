
import React from 'react';
import { Separator } from '@/components/ui/separator';
import UserAudioFiles, { AudioFile } from './UserAudioFiles';

interface UserExpandedDetailsProps {
  isAdmin: boolean;
  userId: string;
  email: string;
  languages?: string[] | null;
  audioFiles: AudioFile[];
  playingAudio: string | null;
  onAudioPlay: (audioId: string) => void;
  showLoginPrompt?: boolean;
}

const UserExpandedDetails: React.FC<UserExpandedDetailsProps> = ({
  isAdmin,
  userId,
  email,
  languages,
  audioFiles,
  playingAudio,
  onAudioPlay,
  showLoginPrompt = false
}) => {
  return (
    <div className="mt-4">
      <Separator className="my-4" />
      
      {/* Full view with additional details */}
      <div className="grid grid-cols-1 gap-4 mb-4">
        <div>
          {/* Only show full ID and email for admin */}
          {isAdmin && (
            <>
              <p className="font-medium">User ID</p>
              <p className="text-sm text-gray-600 break-all">{userId}</p>
              <p className="font-medium">Email</p>
              <p className="text-sm text-gray-600 break-all">{email}</p>
            </>
          )}
          <p className="font-medium">Languages Spoken</p>
          <p className="text-sm text-gray-600">
            {languages && languages.length > 0 
              ? languages.join(', ') 
              : 'Not specified'}
          </p>
        </div>
      </div>
      
      {/* Audio files section */}
      <div className="mt-4">
        <h4 className="text-sm font-medium mb-2">Audio Samples:</h4>
        
        {audioFiles && audioFiles.length > 0 ? (
          <UserAudioFiles 
            audioFiles={audioFiles}
            playingAudio={playingAudio}
            onPlay={onAudioPlay}
            showLoginPrompt={showLoginPrompt}
          />
        ) : (
          <p className="text-sm text-gray-500">No audio samples available.</p>
        )}
      </div>
    </div>
  );
};

export default UserExpandedDetails;
