
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AgentAudio {
  id: string;
  title: string;
  url: string;
  created_at: string;
}

export function useAgentAudio(agentId: string | null) {
  const [audioList, setAudioList] = useState<AgentAudio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!agentId) {
      setAudioList([]);
      setLoading(false);
      return;
    }

    const fetchAudios = async () => {
      try {
        setLoading(true);
        console.log('Fetching audio for agent:', agentId);
        
        const { data, error } = await supabase
          .from('audio_metadata')
          .select('id, title, audio_url, created_at')
          .eq('user_id', agentId)
          .order('created_at', { ascending: false });
          
        if (error) {
          console.error('Error loading agent audio:', error);
          setError(error.message);
        } else if (data) {
          console.log('Audio data received:', data.length, 'recordings');
          // normalize into our shape
          setAudioList(
            data.map(d => ({
              id: d.id,
              title: d.title || 'Untitled',
              url: d.audio_url,
              created_at: d.created_at,
            }))
          );
        }
      } catch (err) {
        console.error('Unexpected error in useAgentAudio:', err);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchAudios();
  }, [agentId]);

  return { audioList, loading, error };
}
