import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const SUPABASE_URL = Deno.env.get("PROJECT_URL") ?? Deno.env.get("SUPABASE_URL") ?? "";
const SERVICE_ROLE_KEY = Deno.env.get("SERVICE_ROLE_KEY") ?? Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const HOMEPAGE = "https://yousoteria.vercel.app/";

Deno.serve(async (req: Request) => {
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    return new Response("Missing Supabase secrets", {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "text/plain" },
    });
  }

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  const url = new URL(req.url);
  const segments = url.pathname.split("/").filter(Boolean);
  const slug = segments[segments.length - 1];

  const userAgent = req.headers.get("User-Agent") || "";
  const isRoblox = /Roblox/i.test(userAgent);

  // Allow both Roblox executor requests and browser previews
  if (!isRoblox) {
    return new Response(null, {
      status: 302,
      headers: { ...corsHeaders, Location: HOMEPAGE },
    });
  }

  if (!slug) {
    return new Response("-- No script ID provided", {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "text/plain" },
    });
  }

  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/files?slug=eq.${encodeURIComponent(slug)}&select=id,content,obfuscated_content,obfuscated,unobfuscated_content,service_id&limit=1`,
    {
      headers: {
        apikey: SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      },
    },
  );

  const data = await res.json();
  if (!data || data.length === 0) {
    return new Response("-- Script not found", {
      status: 404,
      headers: { ...corsHeaders, "Content-Type": "text/plain" },
    });
  }

  const file = data[0];
  const content = file.obfuscated ? (file.obfuscated_content || file.content) : file.content;

  // Heartbeat: log this execution and increment the file's execution counter
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/execution_logs`, {
      method: "POST",
      headers: {
        apikey: SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        file_id: file.id,
        service_id: file.service_id || null,
      }),
    });

    await fetch(`${SUPABASE_URL}/rest/v1/files?id=eq.${file.id}`, {
      method: "PATCH",
      headers: {
        apikey: SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        executions: (file.executions ?? 0) + 1,
        updated_at: new Date().toISOString(),
      }),
    });
  } catch {
    // Logging is best-effort; don't fail the script serving
  }

  return new Response(content || "-- Empty script", {
    headers: {
      ...corsHeaders,
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
});
