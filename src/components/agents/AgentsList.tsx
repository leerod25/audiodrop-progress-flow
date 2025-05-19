
import React from 'react';
import { User } from '@/hooks/users/useUserFetch';
import AgentsLoading from './AgentsLoading';
import UsersError from './UsersError';
import AgentsPagination from './AgentsPagination';
import { Card } from '@/components/ui/card';
import UserCard from './UserCard';

interface AgentsListProps {
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
  toggleAvailability: (userId: string, currentStatus: boolean) => void;
  team?: string[];
  toggleTeamMember?: (id: string) => void;
}

const AgentsList: React.FC<AgentsListProps> = ({
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
  toggleAvailability,
  team = [],
  toggleTeamMember
}) => {
  // Show loading state
  if (loading) {
    return <AgentsLoading />;
  }

  // Show error state
  if (error) {
    return <UsersError error={error} onRetry={fetchAllUsers} />;
  }

  // Show no results
  if (users.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="text-lg font-medium">No agent profiles found</p>
        <p className="text-gray-500 mt-2">
          There are no agent profiles available at this time.
        </p>
      </Card>
    );
  }

  return (
    <div>
      {/* Agents Grid */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-8">
        {currentPageUsers.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            userRole={userRole}
            canSeeAudio={canSeeAudio}
            onViewDetails={() => viewAgentDetails(user.id)}
            onToggleAvailability={() => toggleAvailability(user.id, user.is_available || false)}
            inTeam={team?.includes(user.id)}
            onToggleTeam={toggleTeamMember ? () => toggleTeamMember(user.id) : undefined}
          />
        ))}
      </div>

      {/* Pagination */}
      <AgentsPagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
};

export default AgentsList;
