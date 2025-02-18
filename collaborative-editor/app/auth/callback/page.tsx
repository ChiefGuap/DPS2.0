"use client";

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '../../../lib/supabaseClient';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const redirectPath = searchParams.get('redirectPath');
        
        // Get session to confirm authentication
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // Check email domain
          const email = session.user.email;
          if (!email?.endsWith('@ucdavis.edu')) {
            await supabase.auth.signOut();
            router.push('/login');
            return;
          }
          
          // Redirect to the original path or home
          router.push(redirectPath || '/');
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        router.push('/login');
      }
    };

    handleCallback();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse">Loading...</div>
    </div>
  );
} 