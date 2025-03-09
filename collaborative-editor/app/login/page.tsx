// app/login/page.tsx
'use client';

import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";
import GoogleLoginButton from "../../components/login";
import { toast } from "sonner";

export default function LoginPage() {
  const [session, setSession] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // Check for an existing session and redirect immediately to /dashboard if found.
    async function checkSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      if (session) {
        const email = session.user.email;
        if (!email?.endsWith("@ucdavis.edu")) {
          toast.error("Please use your UC Davis email to sign in");
          // Optionally, you might call supabase.auth.signOut() here.
          return;
        }
        router.push('/dashboard');
      }
    }
    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        if (session) {
          const email = session.user.email;
          if (!email?.endsWith("@ucdavis.edu")) {
            toast.error("Please use your UC Davis email to sign in");
            return;
          }
          router.push('/dashboard');
        }
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [router]);

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    // Use emailRedirectTo instead of redirectTo
    const { error } = await supabase.auth.signInWithOtp({
      email: (e.currentTarget as any).email.value,
      options: { emailRedirectTo: `${window.location.origin}/dashboard` },
    });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Check your email for the login link!");
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">Sign in</h1>
      <form onSubmit={handleSignIn} className="mb-4">
        <input
          name="email"
          type="email"
          placeholder="Your email"
          className="border p-2 mb-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2">
          Sign In
        </button>
      </form>
      <GoogleLoginButton />
    </div>
  );
}
