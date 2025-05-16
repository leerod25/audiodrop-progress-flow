
import { useState, useEffect } from 'react';
import { useUserContext } from '@/contexts/UserContext';
import { useAgentFetch } from './useAgentFetch';
import { useAgentFilter } from './useAgentFilter';
import { useAgentFavorites } from './useAgentFavorites';
import { Agent } from '@/types/agent';

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
  const [agents, setAgents] = useState<Agent[]>(fetchedAgents);
  
  // Update internal agents state when fetched agents change
  useEffect(() => {
    if (fetchedAgents.length > 0) {
      console.log("Setting agents from fetched data:", fetchedAgents.length);
      setAgents(fetchedAgents);
    }
  }, [fetchedAgents]);
  
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
