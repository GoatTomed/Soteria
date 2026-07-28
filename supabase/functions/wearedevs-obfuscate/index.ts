import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const WRD_WATERMARK = /\-\-\[\[[\s\S]*?wearedevs\.net\/obfuscator[\s\S]*?\]\]\n?/;
const SOTERIA_WATERMARK = "-- Obfuscated by Yousoteria.vercel.app";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const { script } = await req.json();
    if (!script || typeof script !== "string" || !script.trim()) {
      return new Response(JSON.stringify({ error: "No script provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const wrdRes = await fetch("https://wearedevs.net/api/obfuscate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ script }),
    });

    if (!wrdRes.ok) {
      return new Response(
        JSON.stringify({ error: `WeAreDevs API returned ${wrdRes.status}` }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const wrdData = await wrdRes.json();
    if (wrdData.error) {
      return new Response(
        JSON.stringify({ error: typeof wrdData.error === "string" ? wrdData.error : "Obfuscation failed" }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    let obfuscated: string = wrdData.obfuscated || "";
    obfuscated = obfuscated.replace(WRD_WATERMARK, "").trimStart();
    obfuscated = `${SOTERIA_WATERMARK}\n${obfuscated}`;

    return new Response(JSON.stringify({ success: true, obfuscated }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Failed to reach obfuscation service" }),
      { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
