"use client";
import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function SsoCallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Try to get the redirect URL from the query, fallback to /dashboard
    const redirectUrl = searchParams.get("sign_up_force_redirect_url") || "/dashboard";
    router.replace(redirectUrl);
  }, [router, searchParams]);

  return null;
}

export default function SsoCallback() {
  return (
    <Suspense>
      <SsoCallbackInner />
    </Suspense>
  );
} 