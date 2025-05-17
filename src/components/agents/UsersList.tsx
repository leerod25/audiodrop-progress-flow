
import React from 'react';
import { Button } from "@/components/ui/button";
import UserCard from './UserCard';

interface User {
  id: string;
  email: string | null;
  app_metadata: Record<string, any>;
  user_metadata: Record<string, any>;
  created_at: string;
  last_sign_in_at?: string | null;
  audio_files?: AudioFile[];
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
}

const UsersList: React.FC<UsersListProps> = ({
  users,
  loading,
  expandedUser,
  playingAudio,
  toggleUserExpand,
  handleAudioPlay,
  fetchAllUsers
}) => {
  return (
    <div className="space-y-6">
      {users.length === 0 ? (
        <div className="text-center py-8 border rounded-lg">
          <p className="text-xl text-gray-500">No agent profiles found matching your filters</p>
        </div>
      ) : (
        <>
          <div className="mb-4 text-sm text-gray-500">
            Displaying {users.length} agent profile{users.length !== 1 ? 's' : ''}
          </div>
          {users.map(user => (
            <UserCard
              key={user.id}
              user={user}
              expandedUser={expandedUser}
              playingAudio={playingAudio}
              toggleUserExpand={toggleUserExpand}
              handleAudioPlay={handleAudioPlay}
            />
          ))}
        </>
      )}
      
      <div className="flex justify-center mt-6">
        <Button 
          onClick={fetchAllUsers}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          {loading ? 'Loading...' : 'Refresh Agent List'}
        </Button>
      </div>
    </div>
  );
};

export default UsersList;
