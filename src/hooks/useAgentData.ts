
import { useState, useEffect } from 'react';
import { useUserContext } from '@/contexts/UserContext';
import { useAgentFetch } from './useAgentFetch';
import { useAgentFilter } from './useAgentFilter';
import { useAgentFavorites } from './useAgentFavorites';
import { Agent } from '@/types/agent';

export function useAgentData(useFakeData: boolean) {
  const { user, userRole } = useUserContext();
  
  // Fetch raw (real or fake) list
  const { 
    agents: fetchedAgents, 
    loading, 
    countries, 
    cities, 
    skillLevels,
    isBusinessAccount 
  } = useAgentFetch(useFakeData, userRole);
  
  // Internal state
  const [agents, setAgents] = useState<Agent[]>([]);
  const [filteredAgents, setFilteredAgents] = useState<Agent[]>([]);
  
  // Whenever fetchedAgents OR fake-mode changes, reset both lists
  useEffect(() => {
    console.log("Resetting agents; fake=", useFakeData, "count=", fetchedAgents.length);
    setAgents(fetchedAgents);
    setFilteredAgents(fetchedAgents);
  }, [fetchedAgents, useFakeData]);
  
  // Apply your filter hook against the "live" filteredAgents state
  const { 
    filteredAgents: afterFilter, 
    setFilteredAgents: setAfterFilter 
  } = useAgentFilter(filteredAgents);
  
  // Favorites toggle
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
