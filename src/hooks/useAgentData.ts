import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useUserContext } from '@/contexts/UserContext';
import { Agent } from '@/types/agent';
import { generateFakeProfiles } from '@/utils/fakeProfiles';

export function useAgentData(useFakeData: boolean) {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [filteredAgents, setFilteredAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [countries, setCountries] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [skillLevels, setSkillLevels] = useState<string[]>([]);
  const { user, userRole } = useUserContext();
  
  // Check if user is business role
  const isBusinessAccount = userRole === 'business';

  // Fixed version of the audio URL construction function
  const constructAudioUrl = (url: string | null): string | null => {
    if (!url) return null;
    
    // If already a full URL, return it
    if (url.startsWith('http')) return url;
    
    // If it's a storage path, construct the full URL
    if (url.startsWith('audio/')) {
      const baseUrl = 'https://icfdrrmmacnmdpnwimya.supabase.co/storage/v1/object/public/';
      return `${baseUrl}${url}`;
    }
    
    // For any other case, return as is
    return url;
  };

  // Fetch agents and populate filter options
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setLoading(true);
        
        // If using fake data, generate fake profiles
        if (useFakeData) {
          const fakeAgents = generateFakeProfiles();
          
          // Add male profile picture URL to first 5 agents (male profiles)
          const agentsWithPictures = fakeAgents.map((agent, index) => {
            if (index < 5) { // First 5 are males in the fake data
              return {
                ...agent,
                avatar_url: '/lovable-uploads/photo-1581092795360-fd1ca04f0952.jpg'
              };
            }
            return agent;
          });
          
          // Extract unique values for filter dropdowns from fake data
          const uniqueCountries = Array.from(
            new Set(
              fakeAgents
                .map(agent => agent.country)
                .filter(Boolean) as string[]
            )
          ).sort();
          
          const uniqueCities = Array.from(
            new Set(
              fakeAgents
                .map(agent => agent.city)
                .filter(Boolean) as string[]
            )
          ).sort();
          
          const uniqueSkillLevels = Array.from(
            new Set(
              fakeAgents
                .map(agent => agent.computer_skill_level)
                .filter(Boolean) as string[]
            )
          ).sort();
          
          setAgents(agentsWithPictures);
          setFilteredAgents(agentsWithPictures);
          setCountries(uniqueCountries);
          setCities(uniqueCities);
          setSkillLevels(uniqueSkillLevels);
          setLoading(false);
          return;
        }
        
        // Otherwise fetch real data from Supabase
        // First get all profiles
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, country, city, computer_skill_level, full_name');
        
        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
          toast.error('Failed to load agent profiles');
          return;
        }

        // Then check which ones have audio
        const { data: audioData, error: audioError } = await supabase
          .from('audio_metadata')
          .select('user_id, audio_url')
          .order('created_at', { ascending: false });
        
        if (audioError) {
          console.error('Error fetching audio data:', audioError);
        }
        
        // Create a map of user IDs to audio URLs with proper URL construction
        const audioMap = new Map<string, string>();
        audioData?.forEach(audio => {
          if (!audioMap.has(audio.user_id)) {
            const fullUrl = constructAudioUrl(audio.audio_url);
            if (fullUrl) {
              audioMap.set(audio.user_id, fullUrl);
            }
          }
        });

        // If business user, get favorites
        let favorites: string[] = [];
        if (isBusinessAccount && user) {
          // Use RPC function to get favorites
          const { data, error } = await supabase
            .rpc('get_business_favorites', { 
              business_user_id: user.id 
            });

          if (error) {
            console.error('Error fetching favorites:', error);
          } else if (data) {
            favorites = data as unknown as string[];
          }
        }
        
        // Map profiles to agents with audio info and favorite status
        const agentsWithAudioInfo = profiles?.map(profile => ({
          id: profile.id,
          has_audio: audioMap.has(profile.id),
          audio_url: audioMap.get(profile.id) || null,
          country: profile.country,
          city: profile.city,
          computer_skill_level: profile.computer_skill_level,
          is_favorite: favorites.includes(profile.id),
          avatar_url: '/lovable-uploads/photo-1581092795360-fd1ca04f0952.jpg', // Add male profile picture
          name: profile.full_name // Use full_name instead of name
        })) || [];
        
        setAgents(agentsWithAudioInfo);
        setFilteredAgents(agentsWithAudioInfo);

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
        console.error('Unexpected error in AgentPreview:', err);
        toast.error('An error occurred while loading agents');
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, [user, userRole, isBusinessAccount, useFakeData]);

  // Toggle favorites
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
      // If using fake data, just update the local state
      if (useFakeData) {
        // Update local state
        setAgents(prevAgents => 
          prevAgents.map(agent => 
            agent.id === agentId ? { ...agent, is_favorite: !currentStatus } : agent
          )
        );
        
        setFilteredAgents(prevAgents => 
          prevAgents.map(agent => 
            agent.id === agentId ? { ...agent, is_favorite: !currentStatus } : agent
          )
        );
        
        toast.success(currentStatus ? 'Agent removed from favorites' : 'Agent added to favorites');
        return;
      }

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
      
      setFilteredAgents(prevAgents => 
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
    filteredAgents, 
    setFilteredAgents,
    loading,
    countries,
    cities,
    skillLevels,
    isBusinessAccount,
    toggleFavorite
  };
}
