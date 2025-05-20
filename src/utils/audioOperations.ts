
import { supabase } from '@/integrations/supabase/client';

/**
 * Remove an agent's recording from both storage and metadata.
 *
 * @param userId  the agent's user_id folder in storage
 * @param fileId  the metadata.id (UUID) OR the file name if you only know that
 */
export async function deleteRecording(
  userId: string,
  fileIdOrName: string
): Promise<void> {
  // 1) figure out the storage path & confirm existence
  const fileName = fileIdOrName.includes('-')
    ? /* looks like a UUID → fetch the metadata row to get the actual file name */
      (() => {
        /* fetch metadata to discover which file.name it refers to */
      })()
    : fileIdOrName              // you passed a raw filename already

  // --- example: assume fileName is now 'session1.mp3' ---
  const storagePath = `${userId}/${fileName}`

  // 2) check & delete from storage
  const { data: listData, error: listErr } = await supabase
    .storage
    .from('audio-bucket')
    .list(userId, { search: fileName, limit: 1 })
  if (listErr) throw listErr
  if (listData.length === 0) {
    console.warn('file not found in storage, skipping remove', storagePath)
  } else {
    const { error: rmErr } = await supabase
      .storage
      .from('audio-bucket')
      .remove([storagePath])
    if (rmErr) throw rmErr
  }

  // 3) now delete the metadata row
  // If you passed a true UUID, use it. Otherwise find it by matching user_id + path.
  let metadataFilter = supabase
    .from('audio_metadata')
    .delete()

  if (isUuid(fileIdOrName)) {
    metadataFilter = metadataFilter.eq('id', fileIdOrName)
  } else {
    metadataFilter = metadataFilter
      .eq('user_id', userId)
      .like('audio_url', `%/${fileName}`)
  }

  const { error: dbErr } = await metadataFilter
  if (dbErr) throw dbErr
}

/** quick regex test */
function isUuid(str: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    .test(str)
}
