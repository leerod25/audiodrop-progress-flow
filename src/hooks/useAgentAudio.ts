
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AgentAudio {
  id: string;
  title: string;
  url: string;
  updated_at: string;
}

interface AudioHookResult {
  audioList: AgentAudio[];
  loading: boolean;
  error: string | null;
}

export function useAgentAudio(agentId: string | null): AudioHookResult {
  const [audioList, setAudioList] = useState<AgentAudio[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!agentId) {
      setAudioList([]);
      return;
    }

    const fetchFiles = async () => {
      setLoading(true);
      setError(null);
      try {
        const bucket = 'audio-bucket';
        const { data: files, error: listErr } = await supabase.storage
          .from(bucket)
          .list(agentId, { limit: 100, sortBy: { column: 'updated_at', order: 'desc' } });
        if (listErr) throw listErr;

        const results: AgentAudio[] = [];
        for (const file of files || []) {
          const path = `${agentId}/${file.name}`;
          const { data: urlData } = supabase.storage
            .from(bucket)
            .getPublicUrl(path);
            
          if (!urlData?.publicUrl) continue;
          results.push({
            id: file.name,
            title: file.name,
            url: urlData.publicUrl,
            updated_at: file.updated_at || file.created_at || ''
          });
        }
        setAudioList(results);
      } catch (err: any) {
        console.error('[useAgentAudio] error:', err);
        setError('Failed to fetch recordings');
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [agentId]);

  return { audioList, loading, error };
}
