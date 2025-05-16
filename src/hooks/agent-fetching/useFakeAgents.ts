
import { useState, useEffect } from 'react';
import { Agent } from '@/types/agent';
import { generateFakeProfiles } from '@/utils/fakeProfiles';

export function useFakeAgents() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [countries, setCountries] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [skillLevels, setSkillLevels] = useState<string[]>([]);

  useEffect(() => {
    // Generate fake profiles
    const fakeAgents = generateFakeProfiles();
    
    // Add male profile picture URL to first 5 agents (male profiles)
    const agentsWithPictures = fakeAgents.map((agent, index) => {
      if (index < 5) { // First 5 are males in the fake data
        return {
          ...agent,
          avatar_url: '/lovable-uploads/photo-1581092795360-fd1ca04f0952.jpg',
          is_real: false,
          profile_complete: true
        };
      }
      return {
        ...agent,
        is_real: false,
        profile_complete: true
      };
    });
    
    // Extract unique values for filter dropdowns from fake data
    const uniqueCountries = Array.from(
      new Set(
        fakeAgents
          .map(agent => agent.country)
          .filter(Boolean) as string[]
      )
    ).sort();
    
    const uniqueCities = Array.from(
      new Set(
        fakeAgents
          .map(agent => agent.city)
          .filter(Boolean) as string[]
      )
    ).sort();
    
    const uniqueSkillLevels = Array.from(
      new Set(
        fakeAgents
          .map(agent => agent.computer_skill_level)
          .filter(Boolean) as string[]
      )
    ).sort();
    
    setAgents(agentsWithPictures);
    setCountries(uniqueCountries);
    setCities(uniqueCities);
    setSkillLevels(uniqueSkillLevels);
    setLoading(false);
  }, []);

  return {
    agents,
    loading,
    countries,
    cities,
    skillLevels
  };
}
