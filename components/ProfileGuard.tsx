'use client';

import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useUser } from '@/components/providers/SupabaseUserProvider';
import { useUserProfile } from '@/hooks/useProfile';

const PUBLIC_PATHS = new Set(['/login', '/signup', '/auth/callback', '/']);
const PROFILE_SETUP_PATHS = new Set(['/complete-profile', '/profile/edit']);
const EXEMPT_PATHS = new Set(['/community']);

export default function ProfileGuard({ children }: { readonly children: React.ReactNode }) {
  const { user, loading: authLoading } = useUser();
  const { data: profile, isLoading: profileLoading } = useUserProfile();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Wait for all loading to finish
    if (authLoading || profileLoading) return;

    // If not logged in, we don't need to check profile (AppLayout/Middleware handles auth protection)
    if (!user) return;

    // Check if current path is public or part of the setup flow
    const isPublicPath = PUBLIC_PATHS.has(pathname);
    const isSetupPath = PROFILE_SETUP_PATHS.has(pathname);
    const isExemptPath = EXEMPT_PATHS.has(pathname);

    if (isPublicPath || isSetupPath || isExemptPath) return;

    // If logged in but no profile or incomplete profile (no first name), redirect to complete-profile
    if (!profile?.first_name) {
      router.push('/complete-profile');
    }
  }, [user, profile, authLoading, profileLoading, pathname, router]);

  // We render children while checking to avoid flash of white content
  // The useEffect will handle the redirect if needed
  return <>{children}</>;
}
