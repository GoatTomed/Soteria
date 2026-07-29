export async function createUserAdmin(username: string, password: string) {
  const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-create-user`;
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
  return { ok: res.ok, status: res.status, body, bodyText: text };
}
