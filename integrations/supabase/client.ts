import { createClient } from '@supabase/supabase-js'
import { Database } from './types'

const supabaseUrl = 'https://shkafuasvbqezptssyds.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoa2FmdWFzdmJxZXpwdHNzeWRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcyMjQ0OTcsImV4cCI6MjA3MjgwMDQ5N30.D2pbFge9K5NPGRu1N_kA_Irxeek1OXgsz1j5aABRh4s'

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})

// Export the client for use in components
export default supabase 