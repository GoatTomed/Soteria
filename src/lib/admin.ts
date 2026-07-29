export async function createUserAdmin(username: string, password: string) {
  const url = `${supabaseUrl}/functions/v1/admin-create-user`;
  // Debug: log request target to help diagnose 405s in-browser
  try { console.debug('[createUserAdmin] POST', url); } catch {}

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  let json: any = null;
  let text = '';
  try {
    json = await res.clone().json();
  } catch {
    json = null;
  }
  try {
    text = await res.text();
  } catch {
    text = '';
  }
  const body = json ?? (text ? { text } : {});

  // Debug: expose response details in browser console
  try { console.debug('[createUserAdmin] response', { status: res.status, body, bodyText: text }); } catch {}

  return { ok: res.ok, status: res.status, body, bodyText: text };
}
