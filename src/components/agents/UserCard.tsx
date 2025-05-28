
import React from 'react';
import { User } from '@/hooks/users/useUserFetch';
import { Card, CardContent } from "@/components/ui/card";
import UserCardHeader from './UserCardHeader';
import UserCardDetails from './UserCardDetails';
import UserCardActions from './UserCardActions';
import UserExpandedDetails from './UserExpandedDetails';

interface UserCardProps {
  user: User & { average_rating?: number | null };
  userRole?: string;
  canSeeAudio?: boolean;
  onViewDetails?: () => void;
  onToggleAvailability?: () => void;
  inTeam?: boolean;
  onToggleTeam?: () => void;
  isExpanded?: boolean;
  playingAudio?: string;
  toggleExpand?: () => void;
  onAudioPlay?: (audioId: string) => void;
  showLoginPrompt?: boolean;
}

const UserCard: React.FC<UserCardProps> = ({
  user,
  userRole = 'agent',
  canSeeAudio = false,
  onViewDetails = () => {},
  onToggleAvailability,
  inTeam = false,
  onToggleTeam,
  isExpanded = false,
  playingAudio = "",
  toggleExpand = () => {},
  onAudioPlay = () => {},
  showLoginPrompt = false
}) => {
  const isAdmin = userRole === 'admin';
  const isPriorityAgent = user.id.includes('3a067ecc');
  
  // Check if user has audio files
  const hasAudio = user.audio_files && user.audio_files.length > 0;
  
  return (
    <Card className={`overflow-hidden ${isPriorityAgent ? 'border-2 border-blue-500' : ''}`}>
      <div className="relative">
        {/* Availability Badge */}
        {user.is_available && (
          <div className="absolute top-2 right-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
            Available
          </div>
        )}
        
        {/* User Header with Avatar */}
        <UserCardHeader
          user={user}
          isPriorityAgent={isPriorityAgent}
          hasAudio={hasAudio}
          inTeam={inTeam}
          onToggleTeam={onToggleTeam}
          isExpanded={isExpanded}
          toggleExpand={toggleExpand}
        />
        
        {/* User Details and Actions */}
        <CardContent className="p-4">
          <UserCardDetails user={user} />
          
          <UserCardActions
            isAdmin={isAdmin}
            userIsAvailable={user.is_available || false}
            inTeam={inTeam}
            onViewDetails={onViewDetails}
            onToggleAvailability={onToggleAvailability}
            onToggleTeam={onToggleTeam}
          />
        </CardContent>
        
        {/* Expanded section with audio files */}
        {isExpanded && (
          <UserExpandedDetails
            isAdmin={isAdmin}
            userId={user.id}
            email={user.email}
            languages={user.languages}
            audioFiles={user.audio_files || []}
            playingAudio={playingAudio || null}
            onAudioPlay={onAudioPlay}
            showLoginPrompt={showLoginPrompt}
          />
        )}
      </div>
    </Card>
  );
};

export default UserCard;
