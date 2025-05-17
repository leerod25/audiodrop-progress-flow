import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

// Set up CORS headers for browser access
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

// Helper function to check if a URL is valid
function isValidUrl(urlString: string): boolean {
  try {
    if (!urlString) return false;
    
    // Check if it's a proper URL
    if (urlString.startsWith('http://') || urlString.startsWith('https://')) {
      return true;
    }
    
    // For relative paths, we'll consider them valid if they match certain patterns
    if (urlString.startsWith('path/') || urlString.startsWith('/') || /^[a-zA-Z0-9]/.test(urlString)) {
      return true;
    }
    
    return false;
  } catch (e) {
    console.error("Error validating URL:", e);
    return false;
  }
}

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }

  try {
    // Create a Supabase client with the service role key (admin privileges)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Get the user's token from the Authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Not authorized' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }

    // Verify the user is authenticated first
    const {
      data: { user },
    } = await supabaseAdmin.auth.getUser(authHeader.replace('Bearer ', ''));

    if (!user) {
      return new Response(JSON.stringify({ error: 'Not authorized' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }
    
    // Get request parameters
    let params = {};
    try {
      params = await req.json();
    } catch (e) {
      // If request body is not valid JSON, just use empty object
      params = {};
    }
    
    const businessOnly = params.businessOnly === true;

    // Fetch all users using the admin API
    const { data: usersData, error: usersError } = await supabaseAdmin.auth.admin.listUsers();

    if (usersError) {
      console.error('Error listing users:', usersError);
      return new Response(JSON.stringify({ error: usersError.message }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }
    
    // Get user roles to filter profiles
    const { data: userRoles, error: rolesError } = await supabaseAdmin
      .from('user_roles')
      .select('user_id, role');
      
    if (rolesError) {
      console.error('Error fetching user roles:', rolesError);
      return new Response(JSON.stringify({ error: 'Failed to fetch user roles' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }
    
    // Create a map of user_id to role
    const roleMap = new Map();
    userRoles?.forEach(userRole => {
      roleMap.set(userRole.user_id, userRole.role);
    });
    
    // Filter users based on role
    let filteredUsers = usersData.users;
    if (businessOnly) {
      // Keep only business users
      filteredUsers = filteredUsers.filter(user => {
        const role = roleMap.get(user.id);
        return role === 'business';
      });
      console.log(`Filtered to show only business profiles: ${filteredUsers.length} found`);
    } else {
      // Default behavior - remove business users
      filteredUsers = filteredUsers.filter(user => {
        const role = roleMap.get(user.id);
        return role !== 'business';
      });
    }
    
    // For each user, fetch their audio files directly from storage
    if (filteredUsers) {
      for (const user of filteredUsers) {
        try {
          // Get all audio files from storage for this user
          // Look for files in the audio-bucket/{user_id}/ path
          const { data: filesList, error: storageError } = await supabaseAdmin
            .storage
            .from('audio-bucket')
            .list(user.id, {
              sortBy: { column: 'created_at', order: 'desc' }
            });
          
          if (storageError) {
            console.error(`Error fetching storage files for user ${user.id}:`, storageError);
            user.audio_files = [];
            continue;
          }
          
          if (filesList && filesList.length > 0) {
            console.log(`Found ${filesList.length} files in storage for user ${user.id}`);
            
            // Create signed URLs for each file
            const audioFiles = await Promise.all(
              filesList
                .filter(file => {
                  // Only include audio files (typically .webm, .mp3, .wav)
                  const isAudio = file.name.endsWith('.webm') || 
                                  file.name.endsWith('.mp3') || 
                                  file.name.endsWith('.wav') ||
                                  file.name.endsWith('.m4a') ||
                                  file.name.endsWith('.ogg');
                  return isAudio;
                })
                .map(async (file) => {
                  try {
                    // Create a public URL for the file
                    const { data: publicURL } = supabaseAdmin
                      .storage
                      .from('audio-bucket')
                      .getPublicUrl(`${user.id}/${file.name}`);
                    
                    if (publicURL && publicURL.publicUrl) {
                      console.log(`Valid audio URL for file ${file.name}: ${publicURL.publicUrl}`);
                      
                      // Extract a title from the filename (remove extension)
                      const title = file.name.split('.').slice(0, -1).join('.') || file.name;
                      
                      return {
                        id: file.id || `file-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                        title: title || 'Untitled Recording',
                        audio_url: publicURL.publicUrl,
                        created_at: file.created_at || new Date().toISOString()
                      };
                    }
                    return null;
                  } catch (err) {
                    console.error(`Error processing file ${file.name}:`, err);
                    return null;
                  }
                })
            );
            
            // Filter out any null entries and assign to the user
            user.audio_files = audioFiles.filter(Boolean);
            console.log(`User ${user.id} has ${user.audio_files.length} valid audio files`);
          } else {
            user.audio_files = [];
            console.log(`User ${user.id} has no audio files in storage`);
          }
        } catch (err) {
          console.error(`Error processing audio files for user ${user.id}:`, err);
          user.audio_files = []; // Default to empty array on error
        }
      }
    }
    
    // Update the usersData object with the filtered users
    usersData.users = filteredUsers;

    // Return the users with their audio files
    return new Response(JSON.stringify(usersData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'Server error' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
