import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("users")
    .select("is_admin")
    .eq("id", user.id)
    .single();
  if (!profile?.is_admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const { tip_id, url, context, preview_title, preview_description, preview_image, preview_favicon } = body;

  if (!tip_id || !url) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const { data: existing } = await supabaseAdmin
    .from("tip_links")
    .select("sort_order")
    .eq("tip_id", tip_id)
    .order("sort_order", { ascending: false })
    .limit(1);

  const sort_order = (existing?.[0]?.sort_order ?? -1) + 1;

  const { data, error } = await supabaseAdmin
    .from("tip_links")
    .insert({ tip_id, url, context, preview_title, preview_description, preview_image, preview_favicon, sort_order })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
