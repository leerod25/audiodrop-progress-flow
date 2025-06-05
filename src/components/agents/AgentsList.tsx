
import React, { useState } from 'react';
import { User } from '@/hooks/users/useUserFetch';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import AgentsGrid from './AgentsGrid';
import UsersError from './UsersError';
import AgentsLoading from './AgentsLoading';
import AgentsPagination from './AgentsPagination';
import AgentDetailsDialog from './AgentDetailsDialog';

interface UsersListProps {
  users: User[];
  loading: boolean;
  error: string | null;
  userRole: string;
  canSeeAudio: boolean;
  currentPageUsers: User[];
  page: number;
  totalPages: number;
  fetchAllUsers: () => Promise<void>;
  setPage: (page: number) => void;
  viewAgentDetails: (userId: string) => void;
  toggleAvailability?: (userId: string, currentStatus: boolean) => Promise<void>;
}

const AgentsList: React.FC<UsersListProps> = ({
  users,
  loading,
  error,
  userRole,
  canSeeAudio,
  currentPageUsers,
  page,
  totalPages,
  fetchAllUsers,
  setPage,
  viewAgentDetails,
  toggleAvailability
}) => {
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);

  const handleViewProfile = (userId: string) => {
    console.log('View details for user:', userId);
    setSelectedAgentId(userId);
  };

  const handleAudioPlay = (audioId: string) => {
    if (playingAudio === audioId) {
      setPlayingAudio(null);
    } else {
      setPlayingAudio(audioId);
    }
  };

  const handleRefresh = () => {
    fetchAllUsers();
  };

  if (loading) {
    return <AgentsLoading />;
  }

  if (error) {
    return <UsersError error={error} onRetry={fetchAllUsers} />;
  }

  return (
    <div className="space-y-6">
      {/* Header with count and refresh */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          {users.length} agent{users.length !== 1 ? 's' : ''} found
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Agents Grid */}
      <AgentsGrid
        users={currentPageUsers}
        userRole={userRole}
        canSeeAudio={canSeeAudio}
        onViewProfile={handleViewProfile}
        toggleAvailability={toggleAvailability}
        playingAudio={playingAudio}
        onPlayAudio={handleAudioPlay}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <AgentsPagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}

      {/* Agent Details Dialog */}
      <AgentDetailsDialog
        selectedAgentId={selectedAgentId}
        onClose={() => setSelectedAgentId(null)}
      />
    </div>
  );
};

export default AgentsList;
