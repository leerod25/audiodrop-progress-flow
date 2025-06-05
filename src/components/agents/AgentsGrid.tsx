
import React from 'react';
import { User } from '@/hooks/users/useUserFetch';
import AgentCard from './AgentCard';

interface AgentsGridProps {
  users: User[];
  userRole: string;
  canSeeAudio: boolean;
  onViewProfile: (userId: string) => void;
  toggleAvailability?: (userId: string, currentStatus: boolean) => Promise<void>;
  playingAudio?: string | null;
  onPlayAudio?: (audioId: string) => void;
}

const AgentsGrid: React.FC<AgentsGridProps> = ({
  users,
  userRole,
  canSeeAudio,
  onViewProfile,
  toggleAvailability,
  playingAudio,
  onPlayAudio
}) => {
  const getAvatarFallback = (email: string, gender: string | null | undefined) => {
    if (gender === 'male') return 'M';
    if (gender === 'female') return 'F';
    return email.charAt(0).toUpperCase();
  };

  const getAvatarImage = (gender: string | null | undefined) => {
    if (gender === 'male') return '/lovable-uploads/c0b61bad-4422-4420-80f6-543de749caec.png';
    if (gender === 'female') return '/lovable-uploads/26bccfed-a9f0-4888-8b2d-7c34fdfe37ed.png';
    return null;
  };

  if (users.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No agents found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {users.map((user) => (
        <AgentCard
          key={user.id}
          user={user}
          canSeeAudio={canSeeAudio}
          avatarImage={getAvatarImage(user.gender)}
          getAvatarFallback={getAvatarFallback}
          onViewProfile={() => onViewProfile(user.id)}
          toggleAvailability={toggleAvailability}
          isAdminView={userRole === 'admin'}
          playingAudio={playingAudio}
          onPlayAudio={onPlayAudio}
        />
      ))}
    </div>
  );
};

export default AgentsGrid;
