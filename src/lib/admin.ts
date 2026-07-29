export async function createUserAdmin(username: string, password: string) {
  const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-create-user`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  const json = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, body: json };
}
