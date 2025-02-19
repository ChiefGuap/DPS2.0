import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

export const supabase = createClient("https://vssawgkhmxsrkcowqckk.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzc2F3Z2tobXhzcmtjb3dxY2trIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk0OTY4NjgsImV4cCI6MjA1NTA3Mjg2OH0.aOnWAU-i3qn8RUOsmD_rLleRHFPtfXMc0wDjmihkAmg");