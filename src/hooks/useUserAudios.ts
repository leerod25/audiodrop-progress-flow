
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

interface AudioItem {
  id: string;
  title: string;
  audio_url: string;
  created_at: string;
}

export function useUserAudios(user: User | null) {
  const [audios, setAudios] = useState<AudioItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchAudios = async () => {
      try {
        const { data, error } = await supabase
          .from('audio_metadata')
          .select('id, title, audio_url, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
        if (error) {
          console.error('Error fetching audio list:', error);
        } else if (data) {
          setAudios(data);
        }
      } catch (err) {
        console.error('Unexpected error in useUserAudios:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAudios();
  }, [user]);

  return { audios, loading };
}
