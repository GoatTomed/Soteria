import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? Deno.env.get("PROJECT_URL") ?? "";
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? Deno.env.get("SERVICE_ROLE_KEY") ?? "";

Deno.serve(async (req: Request) => {
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    return jsonResponse({ success: false, error: 'Missing Supabase secrets', hint: 'Set SUPABASE_SERVICE_ROLE_KEY and SUPABASE_URL in the function environment' }, 500);
  }

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ success: false, error: 'Method not allowed' }, 405);
  }

  let body: any;
  try {
    body = await req.json();
  } catch (e) {
    return jsonResponse({ success: false, error: 'Invalid JSON body' }, 400);
  }

  const username = (body.username ?? "").toString().trim().toLowerCase();
  const password = (body.password ?? "").toString();

  if (!/^[a-z0-9_]{3,20}$/.test(username) || password.length < 6) {
    return jsonResponse({ success: false, error: 'Invalid username or password' }, 400);
  }

  // Construct email for internal accounts (members by default)
  const email = `${username}@soteria.members`;

  // Create the auth user via the Admin API using the service role key
  const createRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
    },
    body: JSON.stringify({ email, password, email_confirm: true }),
  });

  const createJson = await createRes.json().catch(() => ({}));
  if (!createRes.ok) {
    return jsonResponse({ success: false, error: createJson ?? 'Failed to create user' }, createRes.status || 500);
  }

  const userId = createJson.id ?? createJson.user?.id ?? null;
  if (!userId) {
    return jsonResponse({ success: false, error: 'No user id returned from auth' }, 500);
  }

  // Insert profile row using service role
  const profileRes = await fetch(`${SUPABASE_URL}/rest/v1/profiles`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({ id: userId, username }),
  });

  if (![200,201,204].includes(profileRes.status)) {
    const errText = await profileRes.text().catch(() => '');
    // Roll back created user
    await fetch(`${SUPABASE_URL}/auth/v1/admin/users?id=${encodeURIComponent(userId)}`, {
      method: 'DELETE',
      headers: {
        apikey: SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      },
    }).catch(() => null);

    return jsonResponse({ success: false, error: 'Failed to create profile', detail: errText }, 500);
  }

  return jsonResponse({ success: true, userId }, 200);
});

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
