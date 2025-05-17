
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
    
    // For each user, fetch their audio files from audio_metadata
    if (data && data.users) {
      for (const user of data.users) {
        try {
          const { data: audioData, error: audioError } = await supabaseAdmin
            .from('audio_metadata')
            .select('*')
            .eq('user_id', user.id);
            
          // Validate audio URLs before attaching them to the user object
          let validAudioFiles = [];
          if (!audioError && audioData && audioData.length > 0) {
            validAudioFiles = audioData.map(file => {
              // Ensure the audio_url is present and a string
              if (!file.audio_url || typeof file.audio_url !== 'string') {
                console.warn(`Invalid audio URL for file ${file.id}`);
                // Return file with a placeholder URL that's obviously wrong
                return {
                  ...file,
                  audio_url: '#invalid-url'
                };
              }
              return file;
            });
          }
          
          // Attach audio files to each user object
          user.audio_files = audioError ? [] : validAudioFiles || [];
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
