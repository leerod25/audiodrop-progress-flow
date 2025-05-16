
import { useState, useEffect } from 'react';
import { Agent } from '@/types/agent';

export function useAgentFilter(agents: Agent[]) {
  const [filteredAgents, setFilteredAgents] = useState<Agent[]>(agents);
  
  // Update filtered agents whenever the source list changes
  useEffect(() => {
    setFilteredAgents(agents);
  }, [agents]);
  
  return {
    filteredAgents,
    setFilteredAgents
  };
}
