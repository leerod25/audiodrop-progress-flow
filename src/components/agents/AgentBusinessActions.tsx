
import React from 'react';
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { Agent } from '@/types/Agent';

interface AgentBusinessActionsProps {
  agent: Agent;
  toggleFavorite: (agentId: string, currentStatus: boolean) => void;
}

const AgentBusinessActions: React.FC<AgentBusinessActionsProps> = ({ 
  agent, 
  toggleFavorite 
}) => {
  return (
    <div className="border-t pt-4">
      <h3 className="text-lg font-medium mb-2">Your Selection</h3>
      <p>
        {agent.is_favorite ? (
          <span className="text-green-600">✓ This agent is in your team</span>
        ) : (
          <span className="text-gray-500">This agent is not in your team</span>
        )}
      </p>
      <Button
        className="mt-2"
        variant={agent.is_favorite ? "destructive" : "default"}
        onClick={() => toggleFavorite(agent.id, agent.is_favorite)}
      >
        <Star className={`mr-1 h-4 w-4 ${agent.is_favorite ? 'fill-white' : ''}`} />
        {agent.is_favorite ? "Remove from Team" : "Add to Team"}
      </Button>
    </div>
  );
};

export default AgentBusinessActions;
