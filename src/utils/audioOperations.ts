
import { supabase } from '@/integrations/supabase/client';

/**
 * Remove an agent's recording from both storage and metadata.
 * 
 * Note: This function is deprecated and maintained for backward compatibility.
 * Please use the useAgentAudio hook's remove method instead.
 *
 * @param userId  the agent's user_id folder in storage
 * @param fileId  the metadata.id (UUID) OR the file name if you only know that
 */
export async function deleteRecording(
  userId: string,
  fileIdOrName: string
): Promise<void> {
  console.warn('deleteRecording is deprecated. Please use useAgentAudio hook instead');
  
  try {
    // 1) fetch that row to get the URL
    const { data: rows, error: fetchErr } = await supabase
      .from('audio_metadata')
      .select('audio_url')
      .eq('id', fileIdOrName)
      .limit(1);
      
    if (fetchErr) throw fetchErr;
    if (!rows || rows.length === 0) {
      // If not found by ID, might be a filename
      if (isUuid(fileIdOrName)) {
        throw new Error("Recording not found");
      }
      
      // Fall back to legacy path-based removal (direct filename)
      const storagePath = `${userId}/${fileIdOrName}`;
      await supabase.storage.from('audio-bucket').remove([storagePath]);
      
      // Delete any metadata that might match this path
      await supabase
        .from('audio_metadata')
        .delete()
        .eq('user_id', userId)
        .like('audio_url', `%/${fileIdOrName}`);
        
      return;
    }
    
    const row = rows[0];

    // 2) derive storage path from the URL
    const publicUrl = row!.audio_url!;
    const urlObj = new URL(publicUrl);
    // assume your bucket is public and the path after /object/public/ is bucketName/filepath
    const path = urlObj.pathname.split('/object/public/')[1]!;

    // 3) delete from storage
    await supabase.storage.from('audio-bucket').remove([path]);

    // 4) delete metadata row
    await supabase.from('audio_metadata').delete().eq('id', fileIdOrName);
  } catch (err) {
    console.error('Error in deleteRecording:', err);
    throw err;
  }
}

/** quick regex test */
function isUuid(str: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    .test(str);
}
