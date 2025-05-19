
import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { InfoIcon } from "lucide-react";
import UsersList from '@/components/agents/UsersList';
import { User } from '@/hooks/users/useUserFetch';

interface AdminUsersListProps {
  users: User[];
  loading: boolean;
  error: string | null;
  expandedUser: string | null;
  playingAudio: string | null;
  toggleUserExpand: (userId: string) => void;
  handleAudioPlay: (audioId: string) => void;
  fetchAllUsers: () => Promise<void>;
  toggleAvailability?: (userId: string, currentStatus: boolean) => Promise<void>;
}

const AdminUsersList: React.FC<AdminUsersListProps> = ({
  users,
  loading,
  error,
  expandedUser,
  playingAudio,
  toggleUserExpand,
  handleAudioPlay,
  fetchAllUsers,
  toggleAvailability
}) => {
  if (error) {
    return (
      <div className="text-center py-8">
        <Alert variant="destructive">
          <InfoIcon className="h-5 w-5" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button 
          onClick={() => fetchAllUsers()} 
          className="mt-4"
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <UsersList
      users={users}
      loading={loading}
      expandedUser={expandedUser}
      playingAudio={playingAudio}
      toggleUserExpand={toggleUserExpand}
      handleAudioPlay={handleAudioPlay}
      fetchAllUsers={fetchAllUsers}
      toggleAvailability={toggleAvailability}
    />
  );
};

export default AdminUsersList;
