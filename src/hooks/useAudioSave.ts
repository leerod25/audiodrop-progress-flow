
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

export function useAudioSave() {
  const [isUploading, setIsUploading] = useState(false);

  const saveAudio = async (
    blob: Blob,
    title: string,
    user: User | null,
    onUploading?: (uploading: boolean) => void
  ): Promise<string> => {
    if (!user) {
      toast.error('You must be logged in to save audio.');
      throw new Error('Not authenticated');
    }

    setIsUploading(true);
    onUploading?.(true);

    try {
      // 1) Upload to storage
      const path = `${user.id}/${Date.now()}.webm`;
      const { data: uploadData, error: uploadErr } = await supabase
        .storage
        .from('audio-bucket')
        .upload(path, blob, { upsert: false });

      if (uploadErr || !uploadData?.path) {
        throw uploadErr || new Error('Storage upload failed');
      }

      // 2) Get public URL
      const { data: { publicUrl }, error: urlErr } = supabase
        .storage
        .from('audio-bucket')
        .getPublicUrl(uploadData.path);

      if (urlErr || !publicUrl) {
        throw urlErr || new Error('Failed to get public URL');
      }

      // 3) Insert metadata
      const { error: metaErr } = await supabase
        .from('audio_metadata')
        .insert([{
          user_id: user.id,
          title,
          audio_url: publicUrl,
        }]);

      if (metaErr) {
        throw metaErr;
      }

      toast.success('Audio saved successfully!');
      return publicUrl;

    } catch (err: any) {
      console.error('Audio save error:', err);
      toast.error(err.message || 'Failed to save audio');
      throw err;

    } finally {
      setIsUploading(false);
      onUploading?.(false);
    }
  };

  return { saveAudio, isUploading };
}
