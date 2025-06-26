import { useMemo, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";
import { useAuth, useUser } from "@clerk/nextjs";
import { toast } from "sonner";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function useClerkSupabaseClient() {
  const { getToken, isSignedIn } = useAuth();

  const supabaseClient = useMemo(() => {
    if (isSignedIn) {
      return createClient<Database>(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
        global: {
          fetch: async (url: RequestInfo | URL, options?: RequestInit) => {
            try {
              const token = await getToken({ template: "supabase" });
              
              if (!token) {
                console.error('No token received from Clerk');
                throw new Error('Authentication token not available');
              }

              const headers = new Headers(options?.headers);
              headers.set("Authorization", `Bearer ${token}`);
              headers.set("Accept", "application/json");

              return fetch(url, {
                ...options,
                headers,
              });
            } catch (error) {
              console.error('Error getting token:', error);
              throw error;
            }
          },
        },
      });
    }
    // if not signed in, return a client without an auth header
    return createClient<Database>(SUPABASE_URL!, SUPABASE_ANON_KEY!);
  }, [isSignedIn, getToken]);

  return supabaseClient;
}

// Hook to automatically initialize user profile when they first sign up
export function useInitializeUserProfile() {
  const { user, isLoaded } = useUser();
  const { isSignedIn } = useAuth();
  const supabase = useClerkSupabaseClient();

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user || !supabase) return;

    let isInitializing = false; // Prevent multiple simultaneous initializations

    async function initializeUserProfile() {
      if (isInitializing || !user?.id) return;
      isInitializing = true;
      try {
        // Add a small delay to prevent immediate race conditions
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Check if profile already exists
        const { data: existingProfile, error: fetchError } = await supabase
          .from('user_profiles')
          .select('id')
          .eq('id', user.id)
          .maybeSingle(); // Use maybeSingle instead of single to avoid errors when no rows exist

        if (fetchError) {
          console.error('Error fetching user profile:', fetchError);
          return; // Exit early if we can't check for existing profile
        }

        if (!existingProfile) {
          
          // Profile doesn't exist, create it with Google account data as defaults
          const defaultProfile = {
            id: user.id,
            full_name: user.fullName || user.firstName + (user.lastName ? ` ${user.lastName}` : '') || '',
            headline: '',
            bio: '',
            location: '',
            website: '',
            github: '',
            linkedin: '',
            twitter: '',
            avatar_url: user.imageUrl || '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };

          // Use upsert to handle race conditions where profile might be created by another process
          const { data: upsertData, error: upsertError } = await supabase
            .from('user_profiles')
            .upsert([defaultProfile], {
              onConflict: 'id',
              ignoreDuplicates: false
            })
            .select();

          if (upsertError) {
            // Only show error if it's not a duplicate key constraint
            if (!upsertError.message.includes('duplicate key') && 
                !upsertError.message.includes('unique constraint')) {
              console.error('Error creating user profile:', upsertError);
              toast.error('Error creating profile: ' + upsertError.message);
            }
            // If it's a duplicate key error, the profile was already created elsewhere, which is fine
          }
          // No success toast needed - profile creation should be silent
        }
      } catch (error) {
        console.error('Error initializing user profile:', error);
        toast.error('Error loading profile');
      } finally {
        isInitializing = false;
      }
    }

    initializeUserProfile();
  }, [isLoaded, isSignedIn, user, supabase]);
} 