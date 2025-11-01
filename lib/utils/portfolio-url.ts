// Import the Profile type from database types
import type { Profile } from "@/supabase/types";

// Types for user object - compatible with Supabase User type
type User = {
  id?: string;
  user_metadata?: {
    full_name?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
};

// Utility function to generate portfolio URLs
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function generatePortfolioUrl(user: any, profile?: Profile | null): string {
  // Handle null user
  if (!user) {
    return '/unknown';
  }

  // If profile is provided and has a username, use that
  if (profile?.username) {
    return `/${profile.username}`;
  }

  // Otherwise, create a slug from the user's full name
  if (user?.user_metadata?.full_name) {
    return `/${user.user_metadata.full_name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim()}`; // Trim whitespace
  }

  // If profile is provided but no username, try to use profile's full_name as fallback
  if (profile?.full_name) {
    return `/${profile.full_name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim()}`; // Trim whitespace
  }

  // Fallback to user ID
  return `/${user?.id || 'unknown'}`;
}

// Function to get portfolio URL from username
export function getPortfolioUrlFromUsername(username: string): string {
  return `/${username}`;
}
