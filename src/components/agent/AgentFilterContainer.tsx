
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

        console.log('Total profiles before filtering:', profiles?.length);
        
        // Filter out business profiles
        const filteredProfiles = profiles?.filter(profile => {
          const role = roleMap.get(profile.id);
          const isNotBusiness = role !== 'business';
          if (!isNotBusiness) {
            console.log('Filtering out business profile:', profile.id);
          }
          return isNotBusiness;
        }) || [];
        
        console.log('Profiles after filtering out businesses:', filteredProfiles.length);
        
        // Transform the profile data to match the Agent type
        const agents: Agent[] = filteredProfiles.map(profile => ({
          id: profile.id,
          email: profile.email || '', // Required field in Agent type
          created_at: profile.created_at || new Date().toISOString(), // Required field in Agent type
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
