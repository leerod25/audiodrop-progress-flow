
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import AgentFilters, { FilterValues } from '@/components/agent/AgentFilters';
import { Agent } from '@/types/Agent';

interface AgentFilterContainerProps {
  /** All user profiles, without exclusions */
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
  const [showFilters, setShowFilters] = useState(false);

  // Initialize the form state for filters
  const form = useForm<FilterValues>({
    defaultValues: {
      country: '',
      city: '',
      hasAudio: false,
      skillLevel: '',
      favoritesOnly: false,
    },
  });

  // Show all profiles by default
  useEffect(() => {
    onApplyFilters(agents);
  }, [agents, onApplyFilters]);

  // Apply filters when any filter value changes
  useEffect(() => {
    const subscription = form.watch((values: FilterValues) => {
      if (!showFilters) {
        onApplyFilters(agents);
        return;
      }
      let result = agents;
      if (values.country) result = result.filter(a => a.country === values.country);
      if (values.city) result = result.filter(a => a.city === values.city);
      if (values.hasAudio) result = result.filter(a => a.has_audio);
      if (values.skillLevel) result = result.filter(a => a.computer_skill_level === values.skillLevel);
      if (values.favoritesOnly && isBusinessAccount) result = result.filter(a => a.is_favorite);
      onApplyFilters(result);
    });
    return () => subscription.unsubscribe();
  }, [form, agents, showFilters, isBusinessAccount, onApplyFilters]);

  // Reset filters to defaults
  const resetFilters = () => {
    form.reset({ country: '', city: '', hasAudio: false, skillLevel: '', favoritesOnly: false });
    onApplyFilters(agents);
    setShowFilters(false);
  };

  return (
    <AgentFilters
      form={form}
      showFilters={showFilters}
      setShowFilters={setShowFilters}
      resetFilters={resetFilters}
      applyFilters={() => {}}
      countries={countries}
      cities={cities}
      skillLevels={skillLevels}
      isBusinessAccount={isBusinessAccount}
    />
  );
};

export default AgentFilterContainer;
