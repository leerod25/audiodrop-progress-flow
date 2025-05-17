
import React from 'react';
import { Card } from '@/components/ui/card';
import UserCard from './UserCard';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

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
}

interface AudioFile {
  id: string;
  title: string;
  audio_url: string;
  created_at: string;
}

interface UsersListProps {
  users: User[];
  loading: boolean;
  expandedUser: string | null;
  playingAudio: string | null;
  toggleUserExpand: (userId: string) => void;
  handleAudioPlay: (audioId: string) => void;
  fetchAllUsers: () => Promise<void>;
  showLoginPrompt?: boolean;
}

const UsersList: React.FC<UsersListProps> = ({
  users,
  loading,
  expandedUser,
  playingAudio,
  toggleUserExpand,
  handleAudioPlay,
  fetchAllUsers,
  showLoginPrompt = false
}) => {
  const handleRefresh = () => {
    fetchAllUsers();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between mb-4">
        <p className="text-gray-500">{users.length} agent profiles found</p>
        <Button variant="outline" size="sm" onClick={handleRefresh} className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {users.length > 0 ? (
        users.map(user => (
          <Card key={user.id} className="overflow-hidden">
            <UserCard
              user={user}
              isExpanded={expandedUser === user.id}
              playingAudio={playingAudio}
              toggleExpand={() => toggleUserExpand(user.id)}
              onAudioPlay={handleAudioPlay}
              showLoginPrompt={showLoginPrompt}
            />
          </Card>
        ))
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">No agent profiles found</p>
        </div>
      )}
    </div>
  );
};

export default UsersList;
