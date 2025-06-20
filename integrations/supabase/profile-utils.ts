import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Utility function to safely check if a profile exists
export async function checkProfileExists(supabase: any, userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('id', userId)
      .maybeSingle();
    
    if (error) {
      console.error('Error checking profile existence:', error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error('Exception checking profile existence:', error);
    return false;
  }
}

// Utility function to safely create or update a profile
export async function upsertProfile(supabase: any, profileData: any): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('user_profiles')
      .upsert([profileData], {
        onConflict: 'id',
        ignoreDuplicates: false
      });

    if (error) {
      // Handle duplicate key constraints gracefully
      if (error.message.includes('duplicate key') || 
          error.message.includes('unique constraint')) {
        console.log('Profile already exists, which is expected');
        return { success: true };
      }
      
      console.error('Error upserting profile:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Exception upserting profile:', error);
    return { success: false, error: error.message || 'Unknown error' };
  }
}

// Debug function to get profile creation status
export async function debugProfileStatus(supabase: any, userId: string): Promise<void> {
  console.log(`=== Profile Debug for User: ${userId} ===`);
  
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId);
    
    if (error) {
      console.error('❌ Error fetching profile:', error);
    } else if (!data || data.length === 0) {
      console.log('⚠️ No profile found');
    } else if (data.length === 1) {
      console.log('✅ Profile found:', data[0]);
    } else {
      console.error('❌ Multiple profiles found (should not happen):', data);
    }
  } catch (error) {
    console.error('❌ Exception during profile debug:', error);
  }
  
  console.log('=== End Profile Debug ===');
} 