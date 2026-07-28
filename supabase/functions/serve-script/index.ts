import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const HOMEPAGE = "https://yousoteria.vercel.app/";

Deno.serve(async (req: Request) => {
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
    `${SUPABASE_URL}/rest/v1/files?slug=eq.${encodeURIComponent(slug)}&select=content,obfuscated_content,obfuscated,unobfuscated_content&limit=1`,
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
  // Always serve obfuscated content if available — this is what executors should run
  const content = file.obfuscated ? (file.obfuscated_content || file.content) : file.content;

  return new Response(content || "-- Empty script", {
    headers: {
      ...corsHeaders,
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
});
