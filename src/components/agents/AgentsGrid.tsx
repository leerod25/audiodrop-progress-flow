
import React from 'react';
import { User } from '@/hooks/users/useUserFetch';
import { Agent } from '@/types/Agent';
import AgentListCard from '@/components/agent/AgentListCard';

interface AgentsGridProps {
  loading: boolean;
  currentPageUsers: User[];
  viewAgentDetails: (userId: string) => void;
  toggleTeamMember: (id: string) => void;
  convertToAgent: (user: User) => Agent;
}

const AgentsGrid: React.FC<AgentsGridProps> = ({
  loading,
  currentPageUsers,
  viewAgentDetails,
  toggleTeamMember,
  convertToAgent
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="h-48 bg-gray-100 rounded-lg animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
      {currentPageUsers.map((user) => {
        console.log(user.id, 'has audio?', user.audio_files && user.audio_files.length > 0);
        if (user.audio_files && user.audio_files.length > 0) {
          console.log('Audio URLs:', user.audio_files.map(f => f.audio_url));
        }
        const agent = convertToAgent(user);
        return (
          <AgentListCard 
            key={user.id}
            agent={agent}
            onViewDetails={() => viewAgentDetails(user.id)}
            onAddToTeam={() => toggleTeamMember(user.id)}
          />
        );
      })}
    </div>
  );
};

export default AgentsGrid;
