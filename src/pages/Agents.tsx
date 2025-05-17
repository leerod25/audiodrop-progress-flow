
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { useUserContext } from '@/contexts/UserContext';
import { useUsersData } from '@/hooks/useUsersData';
import UsersList from '@/components/agents/UsersList';
import UsersError from '@/components/agents/UsersError';

const Agents: React.FC = () => {
  const { user } = useUserContext();
  
  const {
    users,
    loading,
    error,
    expandedUser,
    playingAudio,
    fetchAllUsers,
    toggleUserExpand,
    handleAudioPlay,
  } = useUsersData(user);

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">All Users ({users.length})</h1>
      
      {error ? (
        <UsersError error={error} isLoggedIn={!!user} />
      ) : loading ? (
        <div className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : (
        <UsersList 
          users={users}
          loading={loading}
          expandedUser={expandedUser}
          playingAudio={playingAudio}
          toggleUserExpand={toggleUserExpand}
          handleAudioPlay={handleAudioPlay}
          fetchAllUsers={fetchAllUsers}
        />
      )}
    </div>
  );
};

export default Agents;
