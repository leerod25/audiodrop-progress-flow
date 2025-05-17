import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import AgentFilters, { FilterValues } from '@/components/agent/AgentFilters';
import { Agent } from '@/types/Agent';

interface AgentFilterContainerProps {
  agents: Agent[];              // full list of all user profiles
  countries: string[];
  cities: string[];
  skillLevels: string[];
  onApplyFilters: (agents: Agent[]) => void;
  isBusinessAccount: boolean;   // current viewer role
}

const AgentFilterContainer: React.FC<AgentFilterContainerProps> = ({
  agents,
  countries,
  cities,
  skillLevels,
  onApplyFilters,
  isBusinessAccount
}) => {
  const [showFilters, setShowFilters] = useState(false);
  
  // Only keep true "agent" profiles (exclude business accounts/self)
  const agentProfiles = agents.filter(agent => !agent.isBusinessAccount);
  
  // Seed parent with filtered agent list on mount or when raw agents change
  useEffect(() => {
    onApplyFilters(agentProfiles);
  }, [agentProfiles, onApplyFilters]);

  const form = useForm<FilterValues>({
    defaultValues: {
      country: '',
      city: '',
      hasAudio: false,
      skillLevel: '',
      favoritesOnly: false,
    }
  });

  const applyFilters = (values: FilterValues) => {
    let result = agentProfiles;
    
    if (values.country) {
      result = result.filter(a => a.country === values.country);
    }
    
    if (values.city) {
      result = result.filter(a => a.city === values.city);
    }
    
    if (values.hasAudio) {
      result = result.filter(a => a.hasAudio);
    }
    
    if (values.skillLevel) {
      result = result.filter(a => a.computer_skill_level === values.skillLevel);
    }
    
    if (values.favoritesOnly && isBusinessAccount) {
      result = result.filter(a => a.is_favorite);
    }
    
    onApplyFilters(result);
  };

  // Watch form changes and update filters
  useEffect(() => {
    const subscription = form.watch((value) => {
      applyFilters(value as FilterValues);
    });
    
    return () => subscription.unsubscribe();
  }, [form, agentProfiles]);

  const resetFilters = () => {
    form.reset({
      country: '',
      city: '',
      hasAudio: false,
      skillLevel: '',
      favoritesOnly: false,
    });
    onApplyFilters(agentProfiles);
    setShowFilters(false);
  };

  return (
    <AgentFilters
      countries={countries}
      cities={cities}
      skillLevels={skillLevels}
      showFilters={showFilters}
      setShowFilters={setShowFilters}
      applyFilters={applyFilters}
      resetFilters={resetFilters}
      form={form}
      isBusinessAccount={isBusinessAccount}
    />
  );
};

export default AgentFilterContainer;
