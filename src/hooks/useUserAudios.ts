
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { toast } from 'sonner';

export interface Audio {
  id: string;
  title: string;
  audio_url: string;
  created_at: string;
  is_playable?: boolean;
}

export function useUserAudios(user: User | null) {
  const [audios, setAudios] = useState<Audio[]>([]);
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
          toast.error('Error loading audio recordings');
        } else if (data) {
          // Validate each audio URL and ensure it's a complete URL
          const processedAudios = data.map(audio => {
            let audioUrl = audio.audio_url;
            
            // Check if the URL is a Supabase storage URL or needs to be constructed
            if (audioUrl && !audioUrl.startsWith('http')) {
              // If it's a storage path, construct the full URL
              if (audioUrl.startsWith('audio/')) {
                const baseUrl = 'https://icfdrrmmacnmdpnwimya.supabase.co/storage/v1/object/public/';
                audioUrl = `${baseUrl}${audioUrl}`;
              }
            }
            
            return {
              ...audio,
              audio_url: audioUrl,
              is_playable: Boolean(audioUrl)
            };
          });
          
          console.log('Processed audio URLs:', processedAudios.map(a => a.audio_url));
          setAudios(processedAudios);
        }
      } catch (err) {
        console.error('Unexpected error in useUserAudios:', err);
        toast.error('Error loading audio recordings');
      } finally {
        setLoading(false);
      }
    };

    fetchAudios();
  }, [user]);

  const deleteAudio = async (id: string): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const { error } = await supabase
        .from('audio_metadata')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) {
        toast.error('Failed to delete recording');
        console.error('Error deleting audio:', error);
        return false;
      }
      
      // Update local state on success
      setAudios(prevAudios => prevAudios.filter(audio => audio.id !== id));
      toast.success('Recording deleted successfully');
      return true;
    } catch (err) {
      console.error('Unexpected error in deleteAudio:', err);
      toast.error('An error occurred');
      return false;
    }
  };

  const renameAudio = async (id: string, newTitle: string): Promise<boolean> => {
    if (!user || !newTitle.trim()) return false;
    
    try {
      const { error } = await supabase
        .from('audio_metadata')
        .update({ title: newTitle.trim() })
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) {
        toast.error('Failed to rename recording');
        console.error('Error renaming audio:', error);
        return false;
      }
      
      // Update local state on success
      setAudios(prevAudios => 
        prevAudios.map(audio => 
          audio.id === id ? { ...audio, title: newTitle.trim() } : audio
        )
      );
      toast.success('Recording renamed successfully');
      return true;
    } catch (err) {
      console.error('Unexpected error in renameAudio:', err);
      toast.error('An error occurred');
      return false;
    }
  };

  // Add a function to test if an audio URL is playable
  const testAudioPlayback = (audioUrl: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const audio = new Audio(audioUrl);
      
      audio.oncanplaythrough = () => {
        resolve(true);
        audio.pause();
        audio.src = '';
      };
      
      audio.onerror = () => {
        console.error('Audio playback test failed for:', audioUrl);
        resolve(false);
      };
      
      audio.load();
    });
  };

  return { audios, loading, deleteAudio, renameAudio, testAudioPlayback };
}
