
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import AgentFilters, { FilterValues } from '@/components/agent/AgentFilters';
import { Agent } from '@/types/Agent';
import { useUserContext } from '@/contexts/UserContext';

interface AgentFilterContainerProps {
  /** All user profiles, including agents and business users */
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
  const { user } = useUserContext();
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

  // Only include agent profiles, exclude business users and self
  const agentProfiles = user
    ? agents.filter(a => a.id !== user.id)
    : agents;

  // Apply filters whenever form values change
  useEffect(() => {
    const subscription = form.watch((values: FilterValues) => {
      let result = agentProfiles;

      if (values.country) {
        result = result.filter(a => a.country === values.country);
      }
      if (values.city) {
        result = result.filter(a => a.city === values.city);
      }
      if (values.hasAudio) {
        result = result.filter(a => a.has_audio);
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

  // Reset all filters back to full agent list
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
      form={form}
      showFilters={showFilters}
      setShowFilters={setShowFilters}
      resetFilters={resetFilters}
      /** applyFilters handled by form.watch */
      applyFilters={() => {}}
      countries={countries}
      cities={cities}
      skillLevels={skillLevels}
      isBusinessAccount={isBusinessAccount}
    />
  );
};

export default AgentFilterContainer;
