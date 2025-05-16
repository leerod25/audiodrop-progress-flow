
import { useState, useEffect } from 'react';
import { Agent } from '@/types/agent';
import { useFakeAgents } from './agent-fetching/useFakeAgents';
import { useRealAgents } from './agent-fetching/useRealAgents';

export function useAgentFetch(useFakeData: boolean, userRole: string | null) {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [countries, setCountries] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [skillLevels, setSkillLevels] = useState<string[]>([]);
  
  // Check if user is business role
  const isBusinessAccount = userRole === 'business';

  // Get fake agents data
  const fakeFetch = useFakeAgents();
  
  // Get real agents data
  const realFetch = useRealAgents();

  useEffect(() => {
    // Set data based on whether we're using fake data or real data
    if (useFakeData) {
      setAgents(fakeFetch.agents);
      setLoading(fakeFetch.loading);
      setCountries(fakeFetch.countries);
      setCities(fakeFetch.cities);
      setSkillLevels(fakeFetch.skillLevels);
    } else {
      setAgents(realFetch.agents);
      setLoading(realFetch.loading);
      setCountries(realFetch.countries);
      setCities(realFetch.cities);
      setSkillLevels(realFetch.skillLevels);
    }
  }, [
    useFakeData, 
    fakeFetch.agents, fakeFetch.loading, fakeFetch.countries, fakeFetch.cities, fakeFetch.skillLevels,
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
