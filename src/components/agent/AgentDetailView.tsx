
import React from 'react';
import { Agent } from '@/types/Agent';
import { Button } from "@/components/ui/button";
import AgentDetailCard from '@/components/agent/AgentDetailCard';

interface AgentDetailViewProps {
  agent: Agent;
  isBusinessAccount: boolean;
  toggleFavorite: (agentId: string, currentStatus: boolean) => void;
  onClose: () => void;
}

const AgentDetailView: React.FC<AgentDetailViewProps> = ({
  agent,
  isBusinessAccount,
  toggleFavorite,
  onClose
}) => {
  // Format the user ID to show only first 8 characters
  const formatUserId = (id: string) => `${id.substring(0, 8)}...`;

  return (
    <div className="mb-6 border-2 border-blue-100 p-4 rounded-lg bg-blue-50">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Agent Details</h2>
        <Button 
          variant="outline" 
          size="sm"
          onClick={onClose}
        >
          Close Details
        </Button>
      </div>
      <AgentDetailCard 
        agent={agent}
        isBusinessAccount={isBusinessAccount}
        formatUserId={formatUserId}
        toggleFavorite={toggleFavorite}
      />
    </div>
  );
};

export default AgentDetailView;
