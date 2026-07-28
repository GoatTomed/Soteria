import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  let key: string | null = null;
  let hwid: string | null = null;

  if (req.method === "POST") {
    try {
      const body = await req.json();
      key = body.key ?? null;
      hwid = body.hwid ?? null;
    } catch {
      return jsonResponse({ valid: false, message: "Invalid JSON body" }, 400);
    }
  } else if (req.method === "GET") {
    const url = new URL(req.url);
    key = url.searchParams.get("key");
    hwid = url.searchParams.get("hwid");
  } else {
    return jsonResponse({ valid: false, message: "Method not allowed" }, 405);
  }

  if (!key || typeof key !== "string") {
    return jsonResponse({ valid: false, message: "Key is required" }, 400);
  }

  const normalized = key.trim().toUpperCase();

  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/keys?key_value=eq.${encodeURIComponent(normalized)}&select=id,status,hwid,uses,service_id&limit=1`,
    {
      headers: {
        apikey: SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      },
    },
  );

  const data = await res.json();
  if (!data || data.length === 0) {
    return jsonResponse({ valid: false, message: "Key Invalid" });
  }

  const record = data[0];

  if (record.status !== "active") {
    return jsonResponse({ valid: false, message: "Key Invalid" });
  }

  if (record.hwid && hwid && record.hwid !== hwid) {
    return jsonResponse({ valid: false, message: "Key Invalid" });
  }

  await fetch(`${SUPABASE_URL}/rest/v1/keys?id=eq.${record.id}`, {
    method: "PATCH",
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({ uses: (record.uses ?? 0) + 1, updated_at: new Date().toISOString() }),
  });

  return jsonResponse({ valid: true, message: "Access granted.", status: "success" });
});

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
