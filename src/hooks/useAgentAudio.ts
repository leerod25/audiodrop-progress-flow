
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
      console.groupCollapsed('[useAgentAudio] Fetching audio for user_id:', agentId);

      try {
        // Query by the actual foreign key column 'user_id'
        const { data, error: supaErr } = await supabase
          .from('audio_metadata')
          .select('id, title, audio_url, created_at')
          .eq('user_id', agentId)
          .order('created_at', { ascending: false });
        console.log('[useAgentAudio] user_id query result:', { data, supaErr });

        if (supaErr) throw supaErr;

        // Use Promise.all to handle async URL generation
        const normalized: AgentAudio[] = await Promise.all(
          (data || []).map(async d => {
            let url = d.audio_url;
            
            // If it's not an HTTP URL, attempt to generate public or signed URL
            if (!/^https?:\/\//.test(url)) {
              // Try public URL first
              const { data: urlData, error: urlErr } = supabase.storage
                .from('audio')
                .getPublicUrl(url);
              console.log('[useAgentAudio] getPublicUrl:', { urlData, urlErr });
              
              if (urlData?.publicUrl) {
                url = urlData.publicUrl;
              } else {
                // Fallback to signed URL for private buckets
                try {
                  const { data: signedData, error: signedErr } = await supabase.storage
                    .from('audio')
                    .createSignedUrl(url, 60); // 60s expiry
                  console.log('[useAgentAudio] createSignedUrl:', { signedData, signedErr });
                  if (signedData?.signedUrl) url = signedData.signedUrl;
                } catch (signErr) {
                  console.warn('[useAgentAudio] signed URL error:', signErr);
                }
              }
            }
            
            return {
              id: d.id,
              title: d.title ?? 'Untitled',
              url,
              created_at: d.created_at
            };
          })
        );

        console.log('[useAgentAudio] Final normalized list:', normalized);
        setAudioList(normalized);
      } catch (err: any) {
        console.error('[useAgentAudio] Error:', err.message || err);
        setError(err.message || 'Error fetching audio');
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
