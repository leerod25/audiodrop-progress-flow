
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
      console.groupCollapsed('[useAgentAudio] Debug fetch start:', agentId);
      
      // Debug auth context
      try {
        // Supabase JS v1
        const sessionV1 = supabase.auth.session?.();
        console.log('[useAgentAudio] Session v1:', sessionV1);
      } catch (e) {
        console.log('[useAgentAudio] Session v1 not available');
      }
      
      try {
        // Supabase JS v2
        const { data: sessionData } = await supabase.auth.getSession();
        console.log('[useAgentAudio] Session v2:', sessionData);
      } catch (authErr) {
        console.warn('[useAgentAudio] auth.getSession error:', authErr);
      }

      try {
        // First attempt with user_id
        console.log(`[useAgentAudio] fetching audio_metadata for user_id=${agentId}`);
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
          
          // Normalize and get public URLs if needed
          const normalized: AgentAudio[] = data.map(d => {
            let url = d.audio_url;
            if (url && !/^https?:\/\//.test(url)) {
              const { data: urlData, error: urlErr } = supabase.storage
                .from('audio')
                .getPublicUrl(url);
              console.log('[useAgentAudio] Public URL call:', { urlData, urlErr });
              url = urlData?.publicUrl || url;
            }
            return {
              id: d.id,
              title: d.title ?? 'Untitled',
              url: url,
              created_at: d.created_at
            };
          });
          
          console.log('[useAgentAudio] Normalized data:', normalized);
          setAudioList(normalized);
        }
      } catch (err: any) {
        console.error('[useAgentAudio] unexpected error:', err);
        setError(err.message || 'Unexpected error occurred');
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
