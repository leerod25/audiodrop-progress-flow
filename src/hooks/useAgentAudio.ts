
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
      console.groupCollapsed('[useAgentAudio] Fetching audio for user_id:', agentId);

      try {
        // Query by the actual foreign key column 'user_id'
        const { data, error: supaErr } = await supabase
          .from('audio_metadata')
          .select('id, title, audio_url, created_at')
          .eq('user_id', agentId)
          .order('created_at', { ascending: false });
        console.log('[useAgentAudio] user_id query result:', { data, supaErr });

        if (supaErr) throw supaErr;

        // Normalize and get public URLs
        const normalized: AgentAudio[] = (data || []).map(d => {
          let url = d.audio_url;
          if (!/^https?:\/\//.test(url)) {
            const { data: urlData } = supabase.storage.from('audio').getPublicUrl(url);
            url = urlData?.publicUrl || url;
          }
          return {
            id: d.id,
            title: d.title ?? 'Untitled',
            url,
            created_at: d.created_at,
          };
        });

        console.log('[useAgentAudio] Normalized list:', normalized);
        setAudioList(normalized);
      } catch (err: any) {
        console.error('[useAgentAudio] Error:', err.message || err);
        setError(err.message || 'Error fetching audio');
        setAudioList([]);
      } finally {
        console.groupEnd();
        setLoading(false);
      }
    };

    fetchAudios();
  }, [agentId]);

  return { audioList, loading, error };
}
