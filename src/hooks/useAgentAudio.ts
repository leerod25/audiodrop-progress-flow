
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
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!agentId) {
      console.warn('[useAgentAudio] No agentId provided.');
      setAudioList([]);
      return;
    }

    const fetchAudios = async () => {
      setLoading(true);
      setError(null);
      console.log(`[useAgentAudio] fetching audio_metadata for user_id=${agentId}`);

      try {
        // First attempt with user_id
        const { data, error: supaErr } = await supabase
          .from('audio_metadata')
          .select('id, title, audio_url, created_at')
          .eq('user_id', agentId)
          .order('created_at', { ascending: false });

        if (supaErr) {
          console.error('[useAgentAudio] Supabase error:', supaErr);
          setError(supaErr.message);
          setAudioList([]);
        } else if (data) {
          console.log('[useAgentAudio] Data received:', data.length, 'entries');
          console.log('[useAgentAudio] Raw data:', data);
          
          const normalized: AgentAudio[] = data.map(d => ({
            id: d.id,
            title: d.title ?? 'Untitled',
            url: d.audio_url,
            created_at: d.created_at
          }));
          
          console.log('[useAgentAudio] Normalized data:', normalized);
          setAudioList(normalized);
        }
      } catch (err: any) {
        console.error('[useAgentAudio] unexpected error:', err);
        setError(err.message || 'Unexpected error occurred');
        setAudioList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAudios();
  }, [agentId]);

  return { audioList, loading, error };
}
