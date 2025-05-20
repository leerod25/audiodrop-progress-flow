
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
  /** Deletes a single recording by metadata.id AND storage path */
  remove: (fileId: string) => Promise<void>;
}

export function useAgentAudio(agentId: string | null): AudioHookResult {
  const [audioList, setAudioList] = useState<AgentAudio[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string|null>(null);

  // fetch audio files
  useEffect(() => {
    if (!agentId) {
      setAudioList([]);
      return;
    }
    
    setLoading(true);
    supabase
      .from('audio_metadata')
      .select('id, title, audio_url, created_at')
      .eq('user_id', agentId)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) throw error;
        setAudioList(
          data!.map((r) => ({
            id: r.id,
            title: r.title,
            url: r.audio_url!,
            updated_at: r.created_at!,
          }))
        );
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [agentId]);

  // remove helper
  const remove = async (fileId: string) => {
    if (!agentId) return;
    setLoading(true);
    try {
      // 1) fetch that row to get the URL
      const { data: rows, error: fetchErr } = await supabase
        .from('audio_metadata')
        .select('audio_url')
        .eq('id', fileId)
        .limit(1);
        
      if (fetchErr) throw fetchErr;
      if (!rows || rows.length === 0) throw new Error("Recording not found");
      
      const row = rows[0];

      // 2) derive storage path from the URL
      const publicUrl = row!.audio_url!;
      const urlObj = new URL(publicUrl);
      // assume your bucket is public and the path after /object/public/ is bucketName/filepath
      const path = urlObj.pathname.split('/object/public/')[1]!;

      // 3) delete from storage
      const { error: delErr } = await supabase.storage
        .from('audio-bucket')
        .remove([path]);
        
      if (delErr) throw delErr;

      // 4) delete metadata row
      const { error: mdErr } = await supabase
        .from('audio_metadata')
        .delete()
        .eq('id', fileId);
        
      if (mdErr) throw mdErr;

      // 5) update local UI
      setAudioList((prev) => prev.filter((a) => a.id !== fileId));
    } catch (err: any) {
      console.error('Error removing recording:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { audioList, loading, error, remove };
}
