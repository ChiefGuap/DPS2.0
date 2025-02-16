import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
  // Read data from the request
  const body = await request.json();
  const {
    name,
    email,
    major,
    year,
    statement_of_interest,
    why_product,
    resume_url,
    vertical_preference_1,
    vertical_preference_2,
    additional_info,
    time_commitments,
    available_during_fellowship,
  } = body;

  // Insert the data into Supabase
  const { data, error } = await supabase
    .from("applications")
    .insert([
      {
        name,
        email,
        major,
        year,
        statement_of_interest,
        why_product,
        resume_url,
        vertical_preference_1,
        vertical_preference_2,
        additional_info,
        time_commitments,
        available_during_fellowship,
      },
    ]);

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
