
import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { InfoIcon } from "lucide-react";
import AgentCard from '@/components/agents/AgentCard';
import AgentsLoading from '@/components/agents/AgentsLoading';
import AgentsPagination from '@/components/agents/AgentsPagination';
import { getAvatarImage, getAvatarFallback } from '@/utils/avatarUtils';
import { User } from '@/hooks/users/useUserFetch';

interface AgentsListProps {
  users: User[];
  loading: boolean;
  error: string | null;
  userRole: string | null;
  canSeeAudio: boolean;
  currentPageUsers: User[];
  page: number;
  totalPages: number;
  fetchAllUsers: () => Promise<void>;
  setPage: (page: number) => void;
  viewAgentDetails: (userId: string) => void;
  toggleAvailability?: (userId: string, currentStatus: boolean) => Promise<void>;
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
  toggleAvailability
}) => {
  const isAdmin = userRole === 'admin';
  
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

  if (loading) {
    return <AgentsLoading />;
  }

  if (users.length === 0) {
    return (
      <Alert className="my-4">
        <InfoIcon className="h-5 w-5" />
        <AlertDescription>
          No agent profiles found. Please try refreshing or check back later.
        </AlertDescription>
        <Button 
          onClick={() => fetchAllUsers()} 
          className="mt-4"
        >
          Refresh
        </Button>
      </Alert>
    );
  }

  return (
    <>
      {/* Display agent cards */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-6">
        {currentPageUsers.map((user) => {
          const avatarImage = getAvatarImage(user.gender);
          
          return (
            <AgentCard 
              key={user.id}
              user={user}
              canSeeAudio={canSeeAudio}
              avatarImage={avatarImage}
              getAvatarFallback={getAvatarFallback}
              onViewProfile={() => viewAgentDetails(user.id)}
              toggleAvailability={toggleAvailability}
              isAdminView={isAdmin}
            />
          );
        })}
      </div>
      
      {/* Pagination component */}
      {users.length > 0 && (
        <AgentsPagination 
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}
    </>
  );
};

export default AgentsList;
