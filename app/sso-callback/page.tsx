"use client";
import { useEffect, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser, useClerk } from '@clerk/nextjs';
import { toast } from 'sonner';

function SsoCallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoaded } = useUser();
  const { openSignUp } = useClerk();
  const [hasProcessed, setHasProcessed] = useState(false);

  useEffect(() => {
    if (!isLoaded || hasProcessed) return;

    const handleSsoCallback = async () => {
      setHasProcessed(true);
      
      // Get URL parameters
      const error = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');
      const afterSignInUrl = searchParams.get('after_sign_in_url');
      const afterSignUpUrl = searchParams.get('after_sign_up_url');
      
      // Check for errors first
      if (error) {
        
        // Handle specific error cases
        if (error === 'access_denied' || 
            error === 'user_not_found' ||
            errorDescription?.includes('user_not_found') || 
            errorDescription?.includes('not found') ||
            errorDescription?.includes('no account found') ||
            errorDescription?.includes('does not exist')) {
          // User doesn't exist, redirect to sign up
          toast.info('New user detected! Creating your account...');
          setTimeout(() => {
            openSignUp({ 
              afterSignUpUrl: afterSignUpUrl || afterSignInUrl || '/dashboard',
              redirectUrl: '/sso-callback',
              fallbackRedirectUrl: '/dashboard'
            });
          }, 1500);
          return;
        } else {
          // Other errors
          toast.error('Authentication failed. Please try again.');
          setTimeout(() => {
            router.push('/');
          }, 2000);
          return;
        }
      }

      // If user is successfully authenticated
      if (user) {
        const redirectUrl = afterSignInUrl || afterSignUpUrl || '/dashboard';
        // No toast needed - user will see dashboard immediately
        router.replace(redirectUrl);
        return;
      }

      // If no user and no error, wait a bit and check again
      setTimeout(() => {
        if (user) {
          const redirectUrl = afterSignInUrl || afterSignUpUrl || '/dashboard';
          router.replace(redirectUrl);
        } else {
          // Still no user after waiting, something went wrong
          toast.error('Authentication failed. Please try again.');
          router.push('/');
        }
      }, 2000);
    };

    handleSsoCallback();
  }, [isLoaded, user, hasProcessed, router, searchParams, openSignUp]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-sm text-muted-foreground">Processing authentication...</p>
      </div>
    </div>
  );
}

export default function SsoCallback() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    }>
      <SsoCallbackInner />
    </Suspense>
  );
} 