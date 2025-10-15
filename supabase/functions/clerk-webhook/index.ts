import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ClerkWebhookEvent {
  type: string
  data: {
    id: string
    email_addresses: Array<{
      email_address: string
      verification: {
        status: string
      }
    }>
    first_name?: string
    last_name?: string
    created_at: number
    updated_at: number
    deleted_at?: number
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Verify webhook signature (basic implementation)
    const webhookSecret = Deno.env.get('CLERK_WEBHOOK_SECRET')
    if (!webhookSecret) {
      console.error('Missing CLERK_WEBHOOK_SECRET')
      return new Response('Missing webhook secret', { status: 500 })
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase credentials')
      return new Response('Missing Supabase credentials', { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Parse webhook payload
    const event: ClerkWebhookEvent = await req.json()
    console.log('Received webhook event:', event.type)

    // Handle different event types
    switch (event.type) {
      case 'user.created':
        await handleUserCreated(supabase, event.data)
        break
      
      case 'user.updated':
        await handleUserUpdated(supabase, event.data)
        break
      
      case 'user.deleted':
        await handleUserDeleted(supabase, event.data)
        break
      
      default:
        console.log('Unhandled event type:', event.type)
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Webhook processed successfully' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error processing webhook:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})

async function handleUserCreated(supabase: any, userData: ClerkWebhookEvent['data']) {
  console.log('Processing user.created for:', userData.id)
  
  // Find primary email
  const primaryEmail = userData.email_addresses.find(email => 
    email.verification.status === 'verified'
  ) || userData.email_addresses[0]

  if (!primaryEmail) {
    console.error('No email found for user:', userData.id)
    return
  }

  // Create user in Supabase
  const { data, error } = await supabase
    .from('users')
    .insert({
      id: crypto.randomUUID(), // Generate new UUID for Supabase
      clerk_user_id: userData.id,
      email: primaryEmail.email_address,
      full_name: `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || null,
      created_at: new Date(userData.created_at).toISOString(),
      updated_at: new Date(userData.updated_at).toISOString(),
    })
    .select()

  if (error) {
    console.error('Error creating user in Supabase:', error)
    throw error
  }

  console.log('User created successfully:', data[0])
  
  // Create default user settings
  await supabase
    .from('user_settings')
    .insert({
      user_id: data[0].id,
      theme: 'light',
      language: 'pl',
      notifications_enabled: true,
      email_notifications: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

  console.log('Default user settings created')
}

async function handleUserUpdated(supabase: any, userData: ClerkWebhookEvent['data']) {
  console.log('Processing user.updated for:', userData.id)
  
  // Find primary email
  const primaryEmail = userData.email_addresses.find(email => 
    email.verification.status === 'verified'
  ) || userData.email_addresses[0]

  if (!primaryEmail) {
    console.error('No email found for user:', userData.id)
    return
  }

  // Update user in Supabase
  const { data, error } = await supabase
    .from('users')
    .update({
      email: primaryEmail.email_address,
      full_name: `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || null,
      updated_at: new Date(userData.updated_at).toISOString(),
    })
    .eq('clerk_user_id', userData.id)
    .select()

  if (error) {
    console.error('Error updating user in Supabase:', error)
    throw error
  }

  if (data.length === 0) {
    console.log('User not found, creating new user')
    await handleUserCreated(supabase, userData)
    return
  }

  console.log('User updated successfully:', data[0])
}

async function handleUserDeleted(supabase: any, userData: ClerkWebhookEvent['data']) {
  console.log('Processing user.deleted for:', userData.id)
  
  // Soft delete user in Supabase (set deleted_at timestamp)
  const { data, error } = await supabase
    .from('users')
    .update({
      deleted_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('clerk_user_id', userData.id)
    .select()

  if (error) {
    console.error('Error deleting user in Supabase:', error)
    throw error
  }

  console.log('User soft deleted successfully:', data[0])
}

