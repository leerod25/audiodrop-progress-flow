
import React from 'react';
import { Agent } from '@/types/Agent';
import AgentCard from '@/components/agent/AgentCard';
import LoadingAgentCards from '@/components/agent/LoadingAgentCards';
import { Button } from '@/components/ui/button';

interface AgentListProps {
  agents: Agent[];
  loading: boolean;
  isBusinessAccount: boolean;
  currentAudio: string | null;
  isPlaying: boolean;
  toggleFavorite: (agentId: string, currentStatus: boolean) => void;
  showAgentDetails: (agent: Agent) => void;
  openAudioModal: (agent: Agent) => void;
  resetFilters: () => void;
}

const AgentList: React.FC<AgentListProps> = ({
  agents,
  loading,
  isBusinessAccount,
  currentAudio,
  isPlaying,
  toggleFavorite,
  showAgentDetails,
  openAudioModal,
  resetFilters
}) => {
  // Format the user ID to show only first 8 characters
  const formatUserId = (id: string) => `${id.substring(0, 8)}...`;

  if (loading) {
    return <LoadingAgentCards />;
  }
  
  if (agents.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">No agents found matching your filters.</p>
        <Button 
          variant="outline" 
          className="mt-4" 
          onClick={resetFilters}
        >
          Reset Filters
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {agents.map((agent) => (
        <AgentCard 
          key={agent.id}
          agent={agent}
          isBusinessAccount={isBusinessAccount}
          isPlaying={isPlaying}
          currentAudio={currentAudio}
          toggleFavorite={toggleFavorite}
          showAgentDetails={showAgentDetails}
          openAudioModal={openAudioModal}
          formatUserId={formatUserId}
        />
      ))}
    </div>
  );
};

export default AgentList;
