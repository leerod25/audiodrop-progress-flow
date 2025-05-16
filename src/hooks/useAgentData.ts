
import { useState, useEffect } from 'react';
import { useUserContext } from '@/contexts/UserContext';
import { useAgentFetch } from './useAgentFetch';
import { useAgentFilter } from './useAgentFilter';
import { useAgentFavorites } from './useAgentFavorites';
import { Agent } from '@/types/agent';

export function useAgentData() {
  const { user, userRole } = useUserContext();
  
  // Fetch real agents list
  const { 
    agents: fetchedAgents, 
    loading, 
    countries, 
    cities, 
    skillLevels,
    isBusinessAccount 
  } = useAgentFetch(userRole);
  
  // Internal state
  const [agents, setAgents] = useState<Agent[]>([]);
  const [filteredAgents, setFilteredAgents] = useState<Agent[]>([]);
  
  // Whenever fetchedAgents changes, reset both lists
  useEffect(() => {
    console.log("Resetting agents; count=", fetchedAgents.length);
    setAgents(fetchedAgents);
    setFilteredAgents(fetchedAgents);
  }, [fetchedAgents]);
  
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
    userRole
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
