import { createClient } from '@supabase/supabase-js'
import { Database } from './types'

const supabaseUrl = 'https://iycblctxyhfdetorspct.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5Y2JsY3R4eWhmZGV0b3JzcGN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyMzU1NDYsImV4cCI6MjA2MjgxMTU0Nn0.Q1gyvxhOrsc6zYyZvNw1e9Bcon-j3be-zUNJR2WrwQc'

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})

// Export the client for use in components
export default supabase 