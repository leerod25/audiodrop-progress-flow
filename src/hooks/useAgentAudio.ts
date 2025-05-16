
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string|null>(null);

  useEffect(() => {
    if (!agentId) {
      console.warn('[useAgentAudio] called with null agentId, skipping fetch');
      setAudioList([]);
      setLoading(false);
      return;
    }

    const fetchAudios = async () => {
      setLoading(true);
      setError(null);

      console.log(`[useAgentAudio] fetching audio_metadata for user_id = ${agentId}`);
      try {
        const { data, error: supaErr } = await supabase
          .from('audio_metadata')
          .select('id, title, audio_url, created_at')
          .eq('user_id', agentId)
          .order('created_at', { ascending: false });

        if (supaErr) {
          console.error('[useAgentAudio] Supabase error:', supaErr);
          setError(supaErr.message);
          setAudioList([]);
          return;
        }

        console.log('[useAgentAudio] raw data:', data);
        const normalized: AgentAudio[] = (data ?? []).map(d => ({
          id: d.id,
          title: d.title || 'Untitled',
          url: d.audio_url,
          created_at: d.created_at,
        }));
        console.log('[useAgentAudio] normalized:', normalized);

        setAudioList(normalized);
      } catch (err: any) {
        console.error('[useAgentAudio] unexpected error:', err);
        setError(err.message || 'Unknown error');
        setAudioList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAudios();
  }, [agentId]);

  return { audioList, loading, error };
}
