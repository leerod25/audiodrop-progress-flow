
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Agent } from '@/types/Agent';
import { toast } from 'sonner';
import { useUserContext } from '@/contexts/UserContext';

// Create a module-level variable to store agents state
let agentsState: Agent[] = [];
let setAgentsState: ((agents: Agent[]) => void) | null = null;

export function useAgentProfiles() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [countries, setCountries] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [skillLevels, setSkillLevels] = useState<string[]>([]);
  const { user, userRole } = useUserContext();

  // Store the setter in the module-level variable
  setAgentsState = setAgents;
  
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

        console.log('Total profiles fetched:', profiles?.length || 0);

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
        if (Array.isArray(userRoles)) {
          userRoles.forEach(userRole => {
            roleMap.set(userRole.user_id, userRole.role);
          });
        }

        console.log('Fetched profiles:', profiles?.length, profiles);
        console.log('User roles map created with entries:', roleMap.size);
        
        // Add mock audio data for testing
        const audioMap = new Map<string, string>();
        if (Array.isArray(profiles)) {
          profiles.forEach(profile => {
            // Add mock audio URL for all profiles for testing
            audioMap.set(profile.id, "path/to/your/audio-file.mp3");
          });
        }

        // Get favorites if user is business
        let favorites: string[] = [];
        if (userRole === 'business' && user) {
          const { data, error } = await supabase
            .rpc('get_business_favorites', { business_user_id: user.id });

          if (error) {
            console.error('Error fetching favorites:', error);
          } else if (data) {
            favorites = Array.isArray(data) ? data : [];
          }
        }
        
        // Filter out profiles where role is 'business'
        const filteredProfiles = Array.isArray(profiles) ? profiles.filter(profile => {
          const role = roleMap.get(profile.id);
          const keepProfile = role !== 'business';
          
          if (!keepProfile) {
            console.log(`Filtering out business profile: ${profile.id}, role: ${role}`);
          }
          
          return keepProfile;
        }) : [];
        
        console.log('Filtered out business profiles, remaining:', filteredProfiles.length);
        console.log('Filtered profiles:', filteredProfiles);
        
        // Map filtered profiles to agents
        const agentsWithAudioInfo = filteredProfiles.map(profile => ({
          id: profile.id,
          email: profile.email || '', // Provide default empty string for email
          has_audio: true, // Set all profiles to have audio for testing
          audio_url: audioMap.get(profile.id) || null,
          country: profile.country,
          city: profile.city,
          computer_skill_level: profile.computer_skill_level,
          is_favorite: Array.isArray(favorites) && favorites.includes(profile.id),
          created_at: profile.created_at || new Date().toISOString(), // Ensure created_at has a value
        })) as Agent[];
        
        console.log('Processed agents:', agentsWithAudioInfo.length, agentsWithAudioInfo);
        setAgents(agentsWithAudioInfo);
        agentsState = agentsWithAudioInfo;

        // Extract unique values for filter dropdowns ensuring we have valid arrays
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

  return { 
    agents, 
    loading, 
    countries, 
    cities, 
    skillLevels
  };
}

// Expose a function to update agents from outside
useAgentProfiles.updateAgents = (updater: (prevAgents: Agent[]) => Agent[]) => {
  if (setAgentsState) {
    const updatedAgents = updater(agentsState);
    setAgentsState(updatedAgents);
    agentsState = updatedAgents;
  }
};
