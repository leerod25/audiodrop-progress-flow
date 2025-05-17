
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Agent } from '@/types/Agent';
import { toast } from 'sonner';
import { useUserContext } from '@/contexts/UserContext';

export interface UseAgentsResult {
  agents: Agent[];
  loading: boolean;
  countries: string[];
  cities: string[];
  skillLevels: string[];
  toggleFavorite: (agentId: string, currentStatus: boolean) => Promise<void>;
}

export function useAgents(): UseAgentsResult {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [countries, setCountries] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [skillLevels, setSkillLevels] = useState<string[]>([]);
  const { user, userRole } = useUserContext();

  // Fetch all profiles without ANY filtering
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setLoading(true);
        console.log('Fetching all profiles without filtering');
        
        // Get ALL profiles - no filters at all
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('*');
        
        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
          toast.error('Failed to load profiles');
          return;
        }

        // Fetch user roles to filter out business profiles
        const { data: userRoles, error: rolesError } = await supabase
          .from('user_roles')
          .select('user_id, role');
          
        if (rolesError) {
          console.error('Error fetching user roles:', rolesError);
          toast.error('Failed to load user roles');
          return;
        }
        
        // Create a map of user_id to role for quick lookup
        const roleMap = new Map<string, string>();
        userRoles?.forEach(userRole => {
          roleMap.set(userRole.user_id, userRole.role);
        });

        console.log('Fetched profiles:', profiles?.length, profiles);
        
        // Add mock audio data for testing
        const audioMap = new Map<string, string>();
        profiles?.forEach(profile => {
          // Add mock audio URL for all profiles for testing
          audioMap.set(profile.id, "path/to/your/audio-file.mp3");
        });

        // Get favorites if user is business
        let favorites: string[] = [];
        if (userRole === 'business' && user) {
          const { data, error } = await supabase
            .rpc('get_business_favorites', { business_user_id: user.id });

          if (error) {
            console.error('Error fetching favorites:', error);
          } else if (data) {
            favorites = data as unknown as string[];
          }
        }
        
        // Filter out profiles where role is 'business'
        const filteredProfiles = profiles?.filter(profile => roleMap.get(profile.id) !== 'business') || [];
        console.log('Filtered out business profiles, remaining:', filteredProfiles.length);
        
        // Map filtered profiles to agents
        const agentsWithAudioInfo = filteredProfiles.map(profile => ({
          id: profile.id,
          has_audio: true, // Set all profiles to have audio for testing
          audio_url: audioMap.get(profile.id) || null,
          country: profile.country,
          city: profile.city,
          computer_skill_level: profile.computer_skill_level,
          is_favorite: favorites.includes(profile.id)
        })) || [];
        
        console.log('Processed agents:', agentsWithAudioInfo.length, agentsWithAudioInfo);
        setAgents(agentsWithAudioInfo);

        // Extract unique values for filter dropdowns
        const uniqueCountries = Array.from(
          new Set(
            agentsWithAudioInfo
              .map(agent => agent.country)
              .filter(Boolean) as string[]
          )
        ).sort();
        
        const uniqueCities = Array.from(
          new Set(
            agentsWithAudioInfo
              .map(agent => agent.city)
              .filter(Boolean) as string[]
          )
        ).sort();
        
        const uniqueSkillLevels = Array.from(
          new Set(
            agentsWithAudioInfo
              .map(agent => agent.computer_skill_level)
              .filter(Boolean) as string[]
          )
        ).sort();

        setCountries(uniqueCountries);
        setCities(uniqueCities);
        setSkillLevels(uniqueSkillLevels);
      } catch (err) {
        console.error('Unexpected error in useAgents:', err);
        toast.error('An error occurred while loading agents');
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, [user, userRole]);

  // Handle favorites
  const toggleFavorite = async (agentId: string, currentStatus: boolean) => {
    if (!user) {
      toast.error('You must be logged in to add favorites');
      return;
    }

    if (userRole !== 'business') {
      toast.error('Only business accounts can add agents to favorites');
      return;
    }

    try {
      if (currentStatus) {
        // Remove from favorites using RPC function with proper typing
        const { error } = await supabase.rpc('remove_business_favorite', { 
          business_user_id: user.id, 
          agent_user_id: agentId 
        } as any); // Use type assertion to bypass TypeScript error

        if (error) throw error;
        toast.success('Agent removed from favorites');
      } else {
        // Add to favorites using RPC function with proper typing
        const { error } = await supabase.rpc('add_business_favorite', { 
          business_user_id: user.id, 
          agent_user_id: agentId 
        } as any); // Use type assertion to bypass TypeScript error

        if (error) throw error;
        toast.success('Agent added to favorites');
      }

      // Update local state
      setAgents(prevAgents => 
        prevAgents.map(agent => 
          agent.id === agentId ? { ...agent, is_favorite: !currentStatus } : agent
        )
      );
    } catch (error) {
      console.error('Error updating favorites:', error);
      toast.error('Failed to update favorites');
    }
  };

  return { 
    agents, 
    loading, 
    countries, 
    cities, 
    skillLevels,
    toggleFavorite
  };
}
