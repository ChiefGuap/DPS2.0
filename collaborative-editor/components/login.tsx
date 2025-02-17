import React from 'react';
import { supabase } from '../lib/supabaseClient';

function GoogleLoginButton() {
  const handleGoogleLogin = async () => {
    const redirectPath = localStorage.getItem('redirectPath');
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?redirectPath=${redirectPath || '/'}`
      }
    });
    if (error) {
      console.error('Error logging in with Google:', error.message);
    }
  };

  return <button onClick={handleGoogleLogin}>Sign in with Google</button>;
}

export default GoogleLoginButton;