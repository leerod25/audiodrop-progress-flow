
import React, { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Agent } from '@/types/Agent';

interface AgentFilterContainerProps {
  /** Callback to supply all users to parent component */
  onApplyFilters: (agents: Agent[]) => void;
}

/**
 * Simplest loader: fetches all profiles from Supabase and passes them up.
 */
const AgentFilterContainer: React.FC<AgentFilterContainerProps> = ({ onApplyFilters }) => {
  useEffect(() => {
    supabase
      .from('profiles')
      .select('*')
      .then(({ data, error }) => {
        if (error) {
          console.error('Error fetching users:', error);
          onApplyFilters([]);
        } else {
          // Transform the profile data to match the Agent type
          const agents: Agent[] = (data || []).map(profile => ({
            id: profile.id,
            has_audio: true, // Setting a default value
            audio_url: null, // Default to null
            country: profile.country,
            city: profile.city,
            computer_skill_level: profile.computer_skill_level,
            is_favorite: false // Default value
          }));
          
          onApplyFilters(agents);
        }
      });
  }, [onApplyFilters]);

  return null; // No UI
};

export default AgentFilterContainer;
