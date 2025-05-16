
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AgentAudio {
  id: string;
  title: string;
  url: string;
  created_at: string;
}

interface AudioHookResult {
  audio: AgentAudio | null;
  loading: boolean;
  error: string | null;
}

export function useAgentAudio(agentId: string | null): AudioHookResult {
  const [audio, setAudio] = useState<AgentAudio | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!agentId) {
      setAudio(null);
      setLoading(false);
      return;
    }

    const fetchAudio = async () => {
      setLoading(true);
      setError(null);
      try {
        // Get the most recent audio metadata for this agent
        const { data, error: supaErr } = await supabase
          .from('audio_metadata')
          .select('id, title, audio_url, created_at')
          .eq('user_id', agentId)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (supaErr) {
          if (supaErr.code === 'PGRST116') { // no rows
            setAudio(null);
          } else {
            throw supaErr;
          }
        } else if (data) {
          setAudio({
            id: data.id,
            title: data.title ?? 'Recording',
            url: data.audio_url,
            created_at: data.created_at
          });
        }
      } catch (err: any) {
        console.error('[useAgentAudio] error:', err);
        setError(err.message || 'Failed to fetch audio');
      } finally {
        setLoading(false);
      }
    };

    fetchAudio();
  }, [agentId]);

  return { audio, loading, error };
}
