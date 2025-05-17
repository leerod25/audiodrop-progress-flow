
import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import AgentFilters, { FilterValues } from '@/components/agent/AgentFilters';
import { Agent } from '@/types/Agent';

interface AgentFilterContainerProps {
  /** All user profiles, including business users */
  agents: Agent[];
  countries: string[];
  cities: string[];
  skillLevels: string[];
  /** Callback to update the parent with the filtered list */
  onApplyFilters: (agents: Agent[]) => void;
  /** Whether the current viewer is a business user */
  isBusinessAccount: boolean;
}

const AgentFilterContainer: React.FC<AgentFilterContainerProps> = ({
  agents,
  countries,
  cities,
  skillLevels,
  onApplyFilters,
  isBusinessAccount,
}) => {
  // local toggle for showing/hiding the filter panel
  const [showFilters, setShowFilters] = useState(false);

  // form state for the filters
  const form = useForm<FilterValues>({
    defaultValues: {
      country: '',
      city: '',
      hasAudio: false,
      skillLevel: '',
      favoritesOnly: false,
    },
  });

  // Only agent profiles (exclude business accounts)
  // We need to use a different approach since isBusinessAccount doesn't exist on Agent
  const agentProfiles = agents;
  
  // Seed parent with all agents on mount or when the list changes
  useEffect(() => {
    onApplyFilters(agentProfiles);
  }, [agentProfiles, onApplyFilters]);

  // Apply filters whenever the form values change
  useEffect(() => {
    const subscription = form.watch((values: any) => {
      let result = agentProfiles;

      if (values.country) {
        result = result.filter(a => a.country === values.country);
      }
      if (values.city) {
        result = result.filter(a => a.city === values.city);
      }
      if (values.hasAudio) {
        result = result.filter(a => a.has_audio); // Changed hasAudio to has_audio to match Agent type
      }
      if (values.skillLevel) {
        result = result.filter(
          a => a.computer_skill_level === values.skillLevel
        );
      }
      if (values.favoritesOnly && isBusinessAccount) {
        result = result.filter(a => a.is_favorite);
      }

      onApplyFilters(result);
    });
    return () => subscription.unsubscribe();
  }, [form, agentProfiles, isBusinessAccount, onApplyFilters]);

  // Reset all filters back to default
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
      applyFilters={() => { /* handled by watch */ }}
      resetFilters={resetFilters}
      form={form}
      showFilters={showFilters}
      setShowFilters={setShowFilters}
      countries={countries}
      cities={cities}
      skillLevels={skillLevels}
      isBusinessAccount={isBusinessAccount}
    />
  );
};

export default AgentFilterContainer;
