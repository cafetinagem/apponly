
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const { email, userId, timestamp, userAgent, ip } = await req.json()

    // Log admin access for security audit
    const { error } = await supabaseClient
      .from('audit_logs')
      .insert({
        action: 'admin_login',
        entity_type: 'authentication',
        actor_id: userId,
        actor_email: email,
        details: {
          timestamp,
          userAgent,
          ip,
          event_type: 'admin_access',
          security_level: 'high'
        }
      })

    if (error) {
      console.error('Error logging admin access:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to log admin access' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Optional: Send security notification for admin access
    // This could be extended to send email/SMS notifications
    console.log(`🔐 ADMIN ACCESS LOGGED: ${email} at ${timestamp}`)

    return new Response(
      JSON.stringify({ success: true, message: 'Admin access logged successfully' }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Error in log-admin-access function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
