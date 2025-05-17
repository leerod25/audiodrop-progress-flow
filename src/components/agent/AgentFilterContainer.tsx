
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import AgentFilters, { FilterValues } from '@/components/agent/AgentFilters';
import { Agent } from '@/types/Agent';
import { supabase } from '@/integrations/supabase/client';

interface AgentFilterContainerProps {
  countries: string[];
  cities: string[];
  skillLevels: string[];
  /** Callback to update the parent with the user list */
  onApplyFilters: (agents: Agent[]) => void;
  /** Whether the current viewer is a business user */
  isBusinessAccount: boolean;
}

const AgentFilterContainer: React.FC<AgentFilterContainerProps> = ({
  countries,
  cities,
  skillLevels,
  onApplyFilters,
  isBusinessAccount,
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [allAgents, setAllAgents] = useState<Agent[]>([]);

  // fetch all users from Supabase profiles table
  useEffect(() => {
    async function loadUsers() {
      const { data, error } = await supabase
        .from('profiles')
        .select('*');
      if (error) {
        console.error('Error fetching users:', error);
      } else {
        // Add mock audio data for testing
        const agentsWithAudioInfo = (data || []).map(profile => ({
          id: profile.id,
          has_audio: true, // Set all profiles to have audio for testing
          audio_url: "path/to/your/audio-file.mp3",
          country: profile.country,
          city: profile.city,
          computer_skill_level: profile.computer_skill_level,
          is_favorite: false
        }));
        
        setAllAgents(agentsWithAudioInfo);
        onApplyFilters(agentsWithAudioInfo);
      }
    }
    loadUsers();
  }, [onApplyFilters]);

  // filter form
  const form = useForm<FilterValues>({
    defaultValues: {
      country: '',
      city: '',
      hasAudio: false,
      skillLevel: '',
      favoritesOnly: false,
    },
  });

  // apply filters when form changes
  useEffect(() => {
    const sub = form.watch((values: FilterValues) => {
      let result = allAgents;
      if (!showFilters) {
        onApplyFilters(allAgents);
        return;
      }
      if (values.country) result = result.filter(a => a.country === values.country);
      if (values.city) result = result.filter(a => a.city === values.city);
      if (values.hasAudio) result = result.filter(a => a.has_audio);
      if (values.skillLevel) result = result.filter(a => a.computer_skill_level === values.skillLevel);
      if (values.favoritesOnly && isBusinessAccount) result = result.filter(a => a.is_favorite);
      onApplyFilters(result);
    });
    return () => sub.unsubscribe();
  }, [form, allAgents, showFilters, isBusinessAccount, onApplyFilters]);

  const resetFilters = () => {
    form.reset({ country: '', city: '', hasAudio: false, skillLevel: '', favoritesOnly: false });
    onApplyFilters(allAgents);
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
