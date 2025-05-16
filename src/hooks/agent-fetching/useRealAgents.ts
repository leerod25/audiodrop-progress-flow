
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
        
        // First check if Supabase client is available
        if (!supabase) {
          console.error('Supabase client is not initialized');
          setLoading(false);
          return;
        }
        
        // First get all profiles
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

        console.log('Profiles fetched:', profiles);

        // Fetch audio metadata
        const { data: audioData, error: audioError } = await supabase
          .from('audio_metadata')
          .select('user_id, audio_url')
          .order('created_at', { ascending: false });
        
        if (audioError) {
          console.error('Error fetching audio data:', audioError);
          toast.error('Failed to load audio metadata');
        }
        
        console.log('Audio metadata fetched:', audioData);
        
        // Create a map of user IDs to audio URLs
        const audioMap = new Map<string, string>();
        
        if (audioData && audioData.length > 0) {
          // Process each audio metadata entry
          for (const audio of audioData) {
            if (!audioMap.has(audio.user_id) && audio.audio_url) {
              // Get public URL from storage if it's a path
              if (audio.audio_url.startsWith('audio/')) {
                const { data } = supabase
                  .storage
                  .from('audio-bucket')
                  .getPublicUrl(audio.audio_url);
                
                if (data.publicUrl) {
                  console.log(`Generated public URL for ${audio.user_id}: ${data.publicUrl}`);
                  audioMap.set(audio.user_id, data.publicUrl);
                }
              } else if (audio.audio_url.startsWith('http')) {
                // Already a full URL
                audioMap.set(audio.user_id, audio.audio_url);
              }
            }
          }
        } else {
          console.log('No audio data found in the database');
        }

        // Map profiles to agents with audio info
        const agentsWithAudioInfo = profiles.map(profile => {
          const hasAudio = audioMap.has(profile.id);
          const audioUrl = audioMap.get(profile.id) || null;
          
          console.log(`Agent ${profile.id} (${profile.full_name}): has_audio=${hasAudio}, audio_url=${audioUrl}`);
          
          return {
            id: profile.id,
            has_audio: hasAudio,
            audio_url: audioUrl,
            country: profile.country,
            city: profile.city,
            computer_skill_level: profile.computer_skill_level,
            is_favorite: false, // Will be updated later with favorite status
            avatar_url: '/lovable-uploads/photo-1581092795360-fd1ca04f0952.jpg',
            name: profile.full_name,
            profile_complete: Boolean(profile.country && profile.city && profile.computer_skill_level),
            is_real: true,
            description: profile.description
          };
        });
        
        console.log("Real profiles fetched:", agentsWithAudioInfo);
        
        setAgents(agentsWithAudioInfo);
        
        // Extract filter data
        const filterData = extractFilterData(agentsWithAudioInfo);
        setCountries(filterData.countries);
        setCities(filterData.cities);
        setSkillLevels(filterData.skillLevels);
      } catch (err) {
        console.error('Unexpected error in useRealAgents:', err);
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
