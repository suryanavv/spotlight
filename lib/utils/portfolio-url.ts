// Import the Profile type from database types
import type { Profile } from "@/types/database";

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
export function generatePortfolioUrl(user: any, profile?: Profile): string {
  // Handle null user
  if (!user) {
    return '/unknown';
  }

  // If user has a username set, use that
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

  // Fallback to user ID
  return `/${user?.id || 'unknown'}`;
}

// Function to get portfolio URL from username
export function getPortfolioUrlFromUsername(username: string): string {
  return `/${username}`;
}
