
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
      // Use 'audio' bucket - the one that exists in the project
      const bucket = 'audio';
      try {
        console.log(`[useAgentAudio] Fetching audio files from ${bucket}/${agentId}`);
        
        const { data: files, error: listErr } = await supabase.storage
          .from(bucket)
          .list(agentId, { limit: 100 });
          
        if (listErr) {
          console.error('[useAgentAudio] List error:', listErr);
          throw listErr;
        }
        
        if (!files || files.length === 0) {
          console.log('[useAgentAudio] No files found');
          return [];
        }

        console.log('[useAgentAudio] Files found:', files);
        
        const audios: AgentAudio[] = [];
        for (const file of files) {
          const path = `${agentId}/${file.name}`;
          const { data: urlData } = supabase.storage
            .from(bucket)
            .getPublicUrl(path);
            
          if (!urlData?.publicUrl) {
            console.error('[useAgentAudio] getPublicUrl error for', path);
            continue;
          }
          
          console.log('[useAgentAudio] Got URL:', file.name, urlData.publicUrl);
          
          audios.push({
            id: file.name,
            title: file.name,
            url: urlData.publicUrl,
            created_at: file.updated_at || ''
          });
        }

        return audios;
      } catch (err: any) {
        console.error('[useAgentAudio] storage fetch error:', err);
        throw err;
      }
    };

    const fetchAudios = async () => {
      setLoading(true);
      setError(null);
      try {
        const storageList = await fetchFromStorage();
        console.log('[useAgentAudio] Setting audioList:', storageList);
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
