
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

    // Get request parameters
    let params = {};
    try {
      params = await req.json();
    } catch (e) {
      // If request body is not valid JSON, just use empty object
      params = {};
    }
    
    const businessOnly = params.businessOnly === true;
    const adminMode = params.adminMode === true;
    
    // Check if an authentication token was provided
    const authHeader = req.headers.get('Authorization');
    let currentUserRole = 'anonymous';
    let currentUserId = null;
    
    console.log("Request received with auth header:", authHeader ? "provided" : "not provided");
    
    // If auth header exists, validate the user
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.replace('Bearer ', '');
        const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
        
        if (!authError && user) {
          currentUserId = user.id;
          console.log("Authenticated user ID:", currentUserId);
          
          // Check user role
          const { data: roleData } = await supabaseAdmin
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id)
            .single();
          
          if (roleData && roleData.role) {
            currentUserRole = roleData.role;
          } else {
            // Check profiles table as fallback
            const { data: profileData } = await supabaseAdmin
              .from('profiles')
              .select('role')
              .eq('id', user.id)
              .single();
              
            currentUserRole = profileData?.role || 'agent';
          }
          
          console.log("User role determined as:", currentUserRole);
        } else {
          console.log("Auth error:", authError);
        }
      } catch (authError) {
        console.error('Auth verification error:', authError);
        // Continue as anonymous if auth fails
      }
    }
    
    // For security, only allow admin mode if user is admin
    const isAdmin = currentUserRole === 'admin';
    const isBusiness = currentUserRole === 'business';
    
    // If businessOnly requested but user isn't admin
    if (businessOnly && !isAdmin) {
      // Just return empty list instead of error for non-admins
      return new Response(JSON.stringify({ users: [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    // Fetch all users using the admin API
    const { data: usersData, error: usersError } = await supabaseAdmin.auth.admin.listUsers();

    if (usersError) {
      console.error('Error listing users:', usersError);
      return new Response(JSON.stringify({ error: usersError.message }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }
    
    console.log("Total users found:", usersData.users.length);
    
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
    
    // Also check profiles table for roles
    const { data: profileRoles, error: profileRolesError } = await supabaseAdmin
      .from('profiles')
      .select('id, role');
    
    if (!profileRolesError && profileRoles) {
      profileRoles.forEach(profile => {
        // Only set from profile if not already in role map
        if (!roleMap.has(profile.id) && profile.role) {
          roleMap.set(profile.id, profile.role);
        }
      });
    }
    
    console.log("User roles map built with", roleMap.size, "entries");
    
    // Filter users based on role and current user's permissions
    let filteredUsers = usersData.users;
    
    if (businessOnly) {
      // Keep only business users
      filteredUsers = filteredUsers.filter(user => {
        const role = roleMap.get(user.id);
        return role === 'business';
      });
      console.log(`Filtered to show only business profiles: ${filteredUsers.length} found`);
    } else if (!adminMode) {
      // Default behavior - remove business users
      const beforeLength = filteredUsers.length;
      filteredUsers = filteredUsers.filter(user => {
        const role = roleMap.get(user.id);
        return role !== 'business';
      });
      console.log(`Filtered out business profiles: ${beforeLength - filteredUsers.length} removed`);
      
      // If not admin or business, can only see their own profile
      if (currentUserRole !== 'business' && currentUserRole !== 'admin') {
        console.log("Non-business, non-admin user - restricting to only their own profile");
        filteredUsers = filteredUsers.filter(u => u.id === currentUserId);
        console.log(`After restricting to own profile: ${filteredUsers.length} profiles`);
      }
    }
    // If adminMode is true and user is admin, we don't filter and show all users
    
    console.log(`Final filtered users: ${filteredUsers.length}, User role: ${currentUserRole}`);
    
    // For each user, fetch their audio files directly from storage
    if (filteredUsers && filteredUsers.length > 0) {
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
