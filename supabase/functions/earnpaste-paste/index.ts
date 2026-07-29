import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const EARNPASTE_ENDPOINT = "https://us-central1-earnpaste-3cd5a.cloudfunctions.net/apiCreatePaste";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { targetUrl, integrationId } = await req.json();
    if (!targetUrl) {
      return new Response(JSON.stringify({ error: "targetUrl is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Look up the specific integration, or fall back to any connected one with an API key
    const filter = integrationId
      ? `id=eq.${encodeURIComponent(integrationId)}&status=eq.connected`
      : `status=eq.connected`;
    const select = "provider,api_key,link_url,timer";

    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/integrations?${filter}&select=${select}&limit=1`,
      {
        headers: {
          apikey: SERVICE_ROLE_KEY,
          Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
        },
      },
    );

    const data = await res.json();
    if (!data || data.length === 0) {
      return new Response(JSON.stringify({ error: "No Earnpaste integration configured" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const integration = data[0];
    const apiKey = integration.api_key;
    const linkUrl = integration.link_url;
    const timer = integration.timer || 15;

    // If the integration has a direct link_url (no API key), return it directly
    if (!apiKey && linkUrl) {
      return new Response(JSON.stringify({ url: linkUrl }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Earnpaste API key not set" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Call Earnpaste API to create a paste
    const pasteRes = await fetch(EARNPASTE_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiKey,
      },
      body: JSON.stringify({
        targetUrl,
        timer,
        revenueModel: "view",
      }),
    });

    const pasteData = await pasteRes.json();

    return new Response(JSON.stringify({ url: pasteData?.url || null }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
