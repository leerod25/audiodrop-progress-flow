
import { useState } from 'react';
import { useUserContext } from '@/contexts/UserContext';
import { useAgentFetch } from './useAgentFetch';
import { useAgentFilter } from './useAgentFilter';
import { useAgentFavorites } from './useAgentFavorites';

export function useAgentData(useFakeData: boolean) {
  const { user, userRole } = useUserContext();
  
  // Use the specialized hooks
  const { 
    agents: fetchedAgents, 
    loading, 
    countries, 
    cities, 
    skillLevels,
    isBusinessAccount 
  } = useAgentFetch(useFakeData, userRole);
  
  // Create a state to manage agents internally
  const [agents, setAgents] = useState(fetchedAgents);
  
  // Update internal agents state when fetched agents change
  if (JSON.stringify(fetchedAgents) !== JSON.stringify(agents)) {
    setAgents(fetchedAgents);
  }
  
  // Get filtered agents
  const { filteredAgents, setFilteredAgents } = useAgentFilter(agents);
  
  // Get favorite management functionality
  const { toggleFavorite } = useAgentFavorites(
    agents, 
    setAgents, 
    filteredAgents, 
    setFilteredAgents, 
    user?.id, 
    userRole,
    useFakeData
  );

  return {
    agents,
    filteredAgents, 
    setFilteredAgents,
    loading,
    countries,
    cities,
    skillLevels,
    isBusinessAccount,
    toggleFavorite
  };
}
