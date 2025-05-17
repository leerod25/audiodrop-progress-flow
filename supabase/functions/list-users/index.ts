
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

// Set up CORS headers for browser access
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

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

    // Fetch all users using the admin API
    const { data, error } = await supabaseAdmin.auth.admin.listUsers();

    if (error) {
      console.error('Error listing users:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }
    
    // For each user, fetch their latest audio file from audio_metadata
    if (data && data.users) {
      for (const user of data.users) {
        try {
          // Get the most recent valid audio file for this user
          const { data: audioData } = await supabaseAdmin
            .from('audio_metadata')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });
            
          // Attach audio files to each user object, ensuring all URLs are valid
          if (audioData && audioData.length > 0) {
            // Filter to only include records with valid URLs
            const validAudioFiles = audioData.filter(file => {
              // Basic URL validation
              try {
                if (file.audio_url && typeof file.audio_url === 'string') {
                  new URL(file.audio_url); // This will throw if URL is invalid
                  return true;
                }
                return false;
              } catch (e) {
                console.warn(`Invalid audio URL for file ${file.id}: ${file.audio_url}`);
                return false;
              }
            });
            
            user.audio_files = validAudioFiles;
            console.log(`User ${user.id} has ${validAudioFiles.length} valid audio files`);
          } else {
            user.audio_files = [];
          }
        } catch (err) {
          console.error(`Error fetching audio files for user ${user.id}:`, err);
          user.audio_files = []; // Default to empty array on error
        }
      }
    }

    // Return the users with their audio files
    return new Response(JSON.stringify(data), {
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
