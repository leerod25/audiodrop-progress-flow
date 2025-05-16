
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
      setAudioList([]);
      return;
    }

    const fetchFromStorage = async (): Promise<AgentAudio[]> => {
      const bucket = 'audio';
      try {
        const { data: files, error: listErr } = await supabase.storage
          .from(bucket)
          .list(agentId, { limit: 100 });
        if (listErr) throw listErr;

        const audios = (files || []).map((file: any) => {
          const path = `${agentId}/${file.name}`;
          const { data: urlData } = supabase.storage
            .from(bucket)
            .getPublicUrl(path);
          if (!urlData?.publicUrl) {
            throw new Error('Failed to get public URL');
          }
          return {
            id: file.name,
            title: file.name,
            url: urlData.publicUrl,
            created_at: file.updated_at || ''
          };
        });

        return audios;
      } catch (err: any) {
        console.error('[useAgentAudio] storage fetch error:', err);
        setError(err.message || 'Failed to fetch recordings');
        return [];
      }
    };

    const fetchAudios = async () => {
      setLoading(true);
      setError(null);
      try {
        const storageList = await fetchFromStorage();
        setAudioList(storageList);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch audio');
      } finally {
        setLoading(false);
      }
    };

    fetchAudios();
  }, [agentId]);

  return { audioList, loading, error };
}
