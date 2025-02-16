import React from 'react';
import { supabase } from '../lib/supabaseClient';

function GoogleLoginButton() {
  const handleGoogleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) {
      console.error('Error logging in with Google:', error.message);
    } else {
      // Supabase will redirect to Google’s sign-in page
      // Then back to your callback URL
    }
  };

  return <button onClick={handleGoogleLogin}>Sign in with Google</button>;
}

export default GoogleLoginButton;