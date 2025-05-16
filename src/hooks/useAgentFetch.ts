
import { useState, useEffect } from 'react';
import { Agent } from '@/types/agent';
import { useRealAgents } from './agent-fetching/useRealAgents';

export function useAgentFetch(userRole: string | null) {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [countries, setCountries] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [skillLevels, setSkillLevels] = useState<string[]>([]);
  
  // Check if user is business role
  const isBusinessAccount = userRole === 'business';

  // Get real agents data
  const realFetch = useRealAgents();

  useEffect(() => {
    // Set data from real agents
    setAgents(realFetch.agents);
    setLoading(realFetch.loading);
    setCountries(realFetch.countries);
    setCities(realFetch.cities);
    setSkillLevels(realFetch.skillLevels);
  }, [
    realFetch.agents, realFetch.loading, realFetch.countries, realFetch.cities, realFetch.skillLevels
  ]);

  return {
    agents,
    loading,
    countries,
    cities,
    skillLevels,
    isBusinessAccount
  };
}
