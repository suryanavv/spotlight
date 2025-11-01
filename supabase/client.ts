import { createClient } from '@supabase/supabase-js'
import { Database } from '@/supabase/types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

// Client-side Supabase client for all operations
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Export the client for use in components
export default supabase




