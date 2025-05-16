
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { FileObject } from '@supabase/storage-js';

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
        
        if (listErr) {
          console.error('[useAgentAudio] list error:', listErr);
          setAudio(null);
        } else if (files && files.length > 0) {
          const file = files[0] as FileObject;
          const path = `${agentId}/${file.name}`;
          const { data } = supabase.storage
            .from(bucket)
            .getPublicUrl(path);
            
          if (!data?.publicUrl) {
            throw new Error('Failed to get public URL');
          }
          
          setAudio({
            id: file.name,
            title: file.name,
            url: data.publicUrl,
            updated_at: file.updated_at || new Date().toISOString()
          });
        } else {
          setAudio(null);
        }
      } catch (err: any) {
        console.error('[useAgentAudio] error:', err);
        setError(err.message || 'Failed to fetch recording');
        setAudio(null);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestFile();
  }, [agentId]);

  return { audio, loading, error };
}
