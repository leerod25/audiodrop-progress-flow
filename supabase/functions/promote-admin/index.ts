
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

    // Parse request body for email to check
    let params;
    try {
      params = await req.json();
    } catch (e) {
      return new Response(JSON.stringify({ error: 'Invalid request body' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    const { email, targetUserId } = params;

    if (!email || !targetUserId) {
      return new Response(JSON.stringify({ error: 'Email and targetUserId are required' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // For security, only allow the specified email address to perform this action
    const allowedEmail = 'leerod25@hotmail.com';
    
    // Verify the user is authenticated first
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Not authorized', details: authError?.message }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }

    // Check if user email matches the allowed email
    if (user.email !== allowedEmail) {
      return new Response(JSON.stringify({ error: 'Only the admin can perform this action' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 403,
      });
    }

    // First, update user_metadata with admin role
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      targetUserId,
      {
        user_metadata: { role: 'admin' },
      }
    );

    if (updateError) {
      return new Response(JSON.stringify({ error: 'Failed to update user', details: updateError.message }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    // Then update or insert into user_roles table
    const { error: roleError } = await supabaseAdmin
      .from('user_roles')
      .upsert({ 
        user_id: targetUserId, 
        role: 'admin' 
      })
      .select();

    if (roleError) {
      return new Response(JSON.stringify({ error: 'Failed to update role', details: roleError.message }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    // Also update the profile role
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .update({ role: 'admin' })
      .eq('id', targetUserId);

    if (profileError) {
      return new Response(JSON.stringify({ error: 'Failed to update profile', details: profileError.message }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'User promoted to admin successfully',
      userId: targetUserId
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error:', error);
    
    return new Response(JSON.stringify({ error: 'Server error', details: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
