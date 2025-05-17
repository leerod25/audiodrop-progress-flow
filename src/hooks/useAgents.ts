
import { useState } from 'react';
import { Agent } from '@/types/Agent';
import { useAgentProfiles } from './agents/useAgentProfiles';
import { useAgentFavorites } from './agents/useAgentFavorites';

export interface UseAgentsResult {
  agents: Agent[];
  loading: boolean;
  countries: string[];
  cities: string[];
  skillLevels: string[];
  toggleFavorite: (agentId: string, currentStatus: boolean) => Promise<void>;
}

export function useAgents(): UseAgentsResult {
  // Get agent profiles data
  const { 
    agents, 
    loading, 
    countries, 
    cities, 
    skillLevels 
  } = useAgentProfiles();
  
  // Get favorites functionality
  const { toggleFavorite } = useAgentFavorites(agents, setAgents);

  return { 
    agents, 
    loading, 
    countries, 
    cities, 
    skillLevels,
    toggleFavorite
  };
}

// Helper function used by useAgentFavorites
const setAgents = (updater: (prevAgents: Agent[]) => Agent[]) => {
  // This function is passed to useAgentFavorites to update the agents state
  useAgentProfiles.updateAgents(updater);
};
