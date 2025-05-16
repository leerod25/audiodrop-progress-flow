
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
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!agentId) {
      setAudio(null);
      return;
    }

    const fetchAudio = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch the latest metadata record for this agent
        const { data, error: supaErr } = await supabase
          .from('audio_metadata')
          .select('id, title, audio_url, created_at')
          .eq('user_id', agentId)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (supaErr) {
          // No record found or error
          setAudio(null);
        } else if (data) {
          // Generate a fully qualified public URL
          const { data: urlData, error: urlErr } = supabase.storage
            .from('audio-bucket')
            .getPublicUrl(data.audio_url);
          if (urlErr || !urlData.publicUrl) {
            throw urlErr || new Error('Failed to generate public URL');
          }

          setAudio({
            id: data.id,
            title: data.title ?? 'Recording',
            url: urlData.publicUrl,
            created_at: data.created_at
          });
        }
      } catch (err: any) {
        console.error('[useAgentAudio] error:', err);
        setError(err.message || 'Failed to fetch audio');
        setAudio(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAudio();
  }, [agentId]);

  return { audio, loading, error };
}
