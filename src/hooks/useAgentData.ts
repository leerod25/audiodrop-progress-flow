
import { useState, useEffect } from 'react';
import { useUserContext } from '@/contexts/UserContext';
import { useAgentFetch } from './useAgentFetch';
import { useAgentFilter } from './useAgentFilter';
import { useAgentFavorites } from './useAgentFavorites';
import { Agent } from '@/types/agent';

export function useAgentData(useFakeData: boolean) {
  const { user, userRole } = useUserContext();
  
  // Use the specialized hooks to fetch raw (real or fake) list
  const { 
    agents: fetchedAgents, 
    loading, 
    countries, 
    cities, 
    skillLevels,
    isBusinessAccount 
  } = useAgentFetch(useFakeData, userRole);
  
  // Create internal states to manage agents
  const [agents, setAgents] = useState<Agent[]>([]);
  const [filteredAgents, setFilteredAgents] = useState<Agent[]>([]);
  
  // Whenever the fetched data or the mode (fake/real) changes, reset both lists
  useEffect(() => {
    console.log("Setting agents from fetched data:", fetchedAgents.length, "useFakeData:", useFakeData);
    setAgents(fetchedAgents);
    setFilteredAgents(fetchedAgents);
  }, [fetchedAgents, useFakeData]);
  
  // Apply filtering on the freshly reset list
  const { 
    filteredAgents: afterFilter, 
    setFilteredAgents: setAfterFilter 
  } = useAgentFilter(filteredAgents);
  
  // Wire up favorites toggles
  const { toggleFavorite } = useAgentFavorites(
    agents, 
    setAgents, 
    afterFilter, 
    setAfterFilter, 
    user?.id, 
    userRole,
    useFakeData
  );

  return {
    agents,
    filteredAgents: afterFilter, 
    setFilteredAgents: setAfterFilter,
    loading,
    countries,
    cities,
    skillLevels,
    isBusinessAccount,
    toggleFavorite
  };
}
