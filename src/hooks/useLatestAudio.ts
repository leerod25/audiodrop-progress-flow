
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

export function useLatestAudio(user: User | null) {
  const [audio, setAudio] = useState<{ title: string; url: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    supabase
      .from('audio_metadata')
      .select('title,audio_url')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) console.error('Error fetching latest audio:', error);
        else if (data) setAudio({ title: data.title, url: data.audio_url });
      })
      .finally(() => setLoading(false));
  }, [user]);

  return { audio, loading };
}
