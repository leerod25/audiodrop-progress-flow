
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
    const fetchProfiles = async () => {
      try {
        // Get all profiles
        const { data: profiles, error } = await supabase
          .from('profiles')
          .select('*');
        
        if (error) {
          console.error('Error fetching users:', error);
          onApplyFilters([]);
          return;
        }

        // Get user roles to filter out business profiles
        const { data: userRoles, error: rolesError } = await supabase
          .from('user_roles')
          .select('user_id, role');
          
        if (rolesError) {
          console.error('Error fetching user roles:', rolesError);
          onApplyFilters([]);
          return;
        }

        // Create a map of user_id to role for quick lookup
        const roleMap = new Map<string, string>();
        userRoles?.forEach(userRole => {
          roleMap.set(userRole.user_id, userRole.role);
        });

        // Filter out business profiles
        const filteredProfiles = profiles?.filter(profile => roleMap.get(profile.id) !== 'business') || [];
        
        // Transform the profile data to match the Agent type
        const agents: Agent[] = filteredProfiles.map(profile => ({
          id: profile.id,
          has_audio: true, // Setting a default value
          audio_url: null, // Default to null
          country: profile.country,
          city: profile.city,
          computer_skill_level: profile.computer_skill_level,
          is_favorite: false // Default value
        }));
        
        onApplyFilters(agents);
      } catch (err) {
        console.error('Error in AgentFilterContainer:', err);
        onApplyFilters([]);
      }
    };

    fetchProfiles();
  }, [onApplyFilters]);

  return null; // No UI
};

export default AgentFilterContainer;
