import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";
import { useAuth } from "@clerk/nextjs";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function useClerkSupabaseClient() {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const [client, setClient] = useState<any>(null);

  useEffect(() => {
    async function setup() {
      // If Clerk is loaded and user is signed in, use token
      if (isLoaded && isSignedIn) {
        const token = await getToken({ template: "supabase" });
        const supabase = createClient<Database>(
          SUPABASE_URL!,
          SUPABASE_ANON_KEY!,
          {
            global: {
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
              },
            },
          }
        );
        setClient(supabase);
      } else {
        // Otherwise, create a public client (no auth header)
        const supabase = createClient<Database>(SUPABASE_URL!, SUPABASE_ANON_KEY!);
        setClient(supabase);
      }
    }
    setup();
  }, [getToken, isLoaded, isSignedIn]);

  return client;
} 