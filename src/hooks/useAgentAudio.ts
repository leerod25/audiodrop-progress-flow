
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AgentAudio {
  id: string;
  title: string;
  url: string;
  updated_at: string;
}

interface AudioHookResult {
  audio: AgentAudio | null;
  loading: boolean;
  error: string | null;
}

export function useAgentAudio(agentId: string | null): AudioHookResult {
  const [audio, setAudio] = useState<AgentAudio | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!agentId) {
      setAudio(null);
      return;
    }

    const fetchLatestFile = async () => {
      setLoading(true);
      setError(null);
      try {
        const bucket = 'audio-bucket';
        const { data: files, error: listErr } = await supabase.storage
          .from(bucket)
          .list(agentId, { limit: 1, sortBy: { column: 'updated_at', order: 'desc' } });
        if (listErr) throw listErr;

        if (files && files.length > 0) {
          const file = files[0];
          const path = `${agentId}/${file.name}`;
          const { data: urlData, error: urlErr } = supabase.storage
            .from(bucket)
            .getPublicUrl(path);
          if (urlErr || !urlData?.publicUrl) throw urlErr || new Error('Failed to get URL');

          setAudio({
            id: file.name,
            title: file.name,
            url: urlData.publicUrl,
            updated_at: file.updated_at || file.created_at || ''
          });
        } else {
          setAudio(null);
        }
      } catch (err: any) {
        console.error('[useAgentAudio] error:', err);
        setError('Failed to load recording');
        setAudio(null);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestFile();
  }, [agentId]);

  return { audio, loading, error };
}
