
import { useState, useEffect } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { toast } from 'sonner';
import { Agent } from '@/types/agent';
import { extractFilterData } from './extractFilterData';

export function useRealAgents() {
  const supabase = useSupabaseClient();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [countries, setCountries] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [skillLevels, setSkillLevels] = useState<string[]>([]);

  useEffect(() => {
    const fetchRealAgents = async () => {
      try {
        setLoading(true);
        
        // Check if Supabase client is available
        if (!supabase) {
          console.error('Supabase client is not available');
          setLoading(false);
          return;
        }
        
        // Fetch profiles from the profiles table
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, country, city, computer_skill_level, full_name, description');
        
        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
          toast.error('Failed to load agent profiles');
          setLoading(false);
          return;
        }

        if (!profiles || profiles.length === 0) {
          console.log('No profiles found in database');
          setAgents([]);
          setLoading(false);
          return;
        }

        console.log('Profiles fetched:', profiles.length);

        // Fetch audio metadata
        const { data: audioData, error: audioError } = await supabase
          .from('audio_metadata')
          .select('user_id, audio_url');
        
        if (audioError) {
          console.error('Error fetching audio data:', audioError);
        }
        
        // Create a map of user IDs to audio URLs
        const audioMap = new Map<string, string>();
        
        if (audioData && audioData.length > 0) {
          audioData.forEach(audio => {
            if (audio.user_id && audio.audio_url) {
              audioMap.set(audio.user_id, audio.audio_url);
            }
          });
        }

        // Map profiles to agents with audio info
        const agentsData = profiles.map(profile => {
          const hasAudio = audioMap.has(profile.id);
          const audioUrl = audioMap.get(profile.id) || null;
          
          return {
            id: profile.id,
            has_audio: hasAudio,
            audio_url: audioUrl,
            country: profile.country,
            city: profile.city,
            computer_skill_level: profile.computer_skill_level,
            is_favorite: false, // Will be updated with favorite status later
            avatar_url: '/lovable-uploads/photo-1581092795360-fd1ca04f0952.jpg',
            name: profile.full_name,
            profile_complete: Boolean(profile.country && profile.city && profile.computer_skill_level),
            is_real: true,
            description: profile.description
          };
        });
        
        console.log('Real agents processed:', agentsData.length);
        
        setAgents(agentsData);
        
        // Extract filter data
        const filterData = extractFilterData(agentsData);
        setCountries(filterData.countries);
        setCities(filterData.cities);
        setSkillLevels(filterData.skillLevels);
      } catch (err) {
        console.error('Error in useRealAgents:', err);
        toast.error('An error occurred while loading agents');
      } finally {
        setLoading(false);
      }
    };

    fetchRealAgents();
  }, [supabase]);

  return {
    agents,
    loading,
    countries,
    cities,
    skillLevels
  };
}
