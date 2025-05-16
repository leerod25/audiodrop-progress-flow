
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

    const fetchFromMetadata = async (): Promise<AgentAudio[]> => {
      try {
        const { data, error: supaErr } = await supabase
          .from('audio_metadata')
          .select('id, title, audio_url as url, created_at')
          .eq('user_id', agentId)
          .order('created_at', { ascending: false });
        if (supaErr) throw supaErr;
        return (data || []).map(d => ({ ...d, id: d.id, title: d.title ?? 'Untitled' }));
      } catch {
        return [];
      }
    };

    const fetchFromStorage = async (): Promise<AgentAudio[]> => {
      try {
        const { data: files, error: listErr } = await supabase.storage
          .from('audio')
          .list(agentId, { limit: 100 });
        if (listErr) throw listErr;
        return Promise.all(
          files.map(async (file: any) => {
            const path = `${agentId}/${file.name}`;
            const { data: urlData, error: urlErr } = supabase.storage
              .from('audio')
              .getPublicUrl(path);
            if (urlErr) throw urlErr;
            return {
              id: file.name,
              title: file.name,
              url: urlData.publicUrl,
              created_at: file.updated_at ?? ''
            };
          })
        );
      } catch {
        return [];
      }
    };

    const fetchAudios = async () => {
      setLoading(true);
      setError(null);
      try {
        const meta = await fetchFromMetadata();
        if (meta.length) {
          setAudioList(meta);
        } else {
          const storage = await fetchFromStorage();
          setAudioList(storage);
        }
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
