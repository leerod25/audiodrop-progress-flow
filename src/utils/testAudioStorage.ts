
import { supabase } from '@/integrations/supabase/client';

/**
 * A utility function to test if we can list files from the Supabase storage bucket
 * and generate public URLs for them.
 * 
 * Run this with: 
 * import { testAudioStorage } from '@/utils/testAudioStorage';
 * testAudioStorage('YOUR_AGENT_ID');
 */
export async function testAudioStorage(agentId: string) {
  console.log(`🔍 Testing audio storage for agent: ${agentId}`);
  
  // First, check what bucket exists
  const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
  console.log('Available buckets:', buckets?.map(b => b.name));
  
  if (bucketsError) {
    console.error('❌ Error listing buckets:', bucketsError);
    return;
  }
  
  // Try with the "audio" bucket (standard bucket name in the project)
  const bucket = 'audio';
  console.log(`📁 Testing bucket: ${bucket}`);
  
  // List files in the bucket for this agent
  const { data: files, error: listErr } = await supabase.storage
    .from(bucket)
    .list(agentId);
    
  console.log('Files:', files, 'Error:', listErr);

  if (listErr) {
    console.error(`❌ Error listing files in ${bucket}/${agentId}:`, listErr);
    return;
  }
  
  if (!files || files.length === 0) {
    console.log(`ℹ️ No files found in ${bucket}/${agentId}`);
    return;
  }
  
  // Get URLs for each file
  console.log(`🔗 Getting URLs for ${files.length} files:`);
  for (const file of files) {
    const path = `${agentId}/${file.name}`;
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);
      
    console.log(`✅ ${file.name}:`, urlData?.publicUrl);
    
    // Test if URL is accessible
    try {
      const response = await fetch(urlData?.publicUrl || '', { method: 'HEAD' });
      console.log(`🌐 ${file.name} HTTP status:`, response.status, response.ok ? '✅ Accessible' : '❌ Not accessible');
    } catch (e) {
      console.error(`❌ Network error testing ${file.name}:`, e);
    }
  }
}
