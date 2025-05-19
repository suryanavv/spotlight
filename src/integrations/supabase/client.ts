import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";
import { useAuth } from "@clerk/clerk-react";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export function useClerkSupabaseClient() {
  const { getToken } = useAuth();
  const [client, setClient] = useState(null);

  useEffect(() => {
    async function setup() {
      const token = await getToken({ template: "supabase" });
      const supabase = createClient<Database>(
        SUPABASE_URL,
        SUPABASE_ANON_KEY,
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
    }
    setup();
  }, [getToken]);

  return client;
} 