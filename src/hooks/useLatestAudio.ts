
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

    // Create a proper Promise by using async/await or then/catch
    const fetchAudio = async () => {
      try {
        const { data, error } = await supabase
          .from('audio_metadata')
          .select('title,audio_url')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();
          
        if (error) console.error('Error fetching latest audio:', error);
        else if (data) setAudio({ title: data.title, url: data.audio_url });
      } catch (err) {
        console.error('Unexpected error in useLatestAudio:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAudio();
  }, [user]);

  return { audio, loading };
}
