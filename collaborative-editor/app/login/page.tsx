"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";
import GoogleLoginButton from "../../components/login";
import { toast } from "sonner";

export default function LoginPage() {
  const [session, setSession] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      if (session) {
        const email = session.user.email;
        if (!email?.endsWith("@ucdavis.edu")) {
          toast.error("Please use your UC Davis email to sign in");
          // Instead of signing out, we clear the session state to allow re-login.
          setSession(null);
          return;
        }

        // Only redirect to stored path, don't fallback to homepage
        const redirectPath = localStorage.getItem("redirectPath");
        if (redirectPath) {
          localStorage.removeItem("redirectPath");
          router.push(redirectPath);
        }
      }
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        if (session) {
          const email = session.user.email;
          if (!email?.endsWith("@ucdavis.edu")) {
            toast.error("Please use your UC Davis email to sign in");
            setSession(null);
            return;
          }

          // Only redirect to stored path, don't fallback to homepage
          const redirectPath = localStorage.getItem("redirectPath");
          if (redirectPath) {
            localStorage.removeItem("redirectPath");
            router.push(redirectPath);
          }
        }
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">Sign in</h1>
      <GoogleLoginButton />
    </div>
  );
}