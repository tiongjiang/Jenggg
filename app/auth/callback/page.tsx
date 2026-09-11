'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    // Process the OAuth redirect hash/code and navigate to profile
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace('/profile');
      } else {
        router.replace('/');
      }
    });
  }, [router]);

  return (
    <div className="flex-1 bg-bau-cream flex items-center justify-center font-baloo font-bold text-sm text-gray-500">
      Logging in...
    </div>
  );
}
