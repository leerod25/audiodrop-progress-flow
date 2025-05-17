
import React, { useState } from 'react';
import { Agent } from '@/types/Agent';
import AgentFilterContainer from '@/components/agent/AgentFilterContainer';

const AgentPreview: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([]);

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Agent Preview</h1>
      
      {/* Get the agents data from the filter container */}
      <AgentFilterContainer onApplyFilters={setAgents} />
      
      {/* Simple display of the agents */}
      <div className="mt-6 space-y-4">
        {agents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Loading users...</p>
          </div>
        ) : (
          agents.map((agent) => (
            <div key={agent.id} className="border p-4 rounded-lg shadow-sm">
              <p className="font-medium">User ID: {agent.id.substring(0, 8)}...</p>
              <p>Country: {agent.country || 'Not specified'}</p>
              <p>City: {agent.city || 'Not specified'}</p>
              <p>Computer Skill: {agent.computer_skill_level || 'Not specified'}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AgentPreview;
