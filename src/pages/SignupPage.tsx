import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { AuthShell } from '@/components/AuthShell';
import { supabase } from '@/lib/supabase';
import { createUserAdmin } from '@/lib/admin';

export function SignupPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirect = params.get('redirect') || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const clean = username.trim().toLowerCase();
    if (!/^[a-z0-9_]{3,20}$/.test(clean)) {
      setError('Username must be 3-20 characters: letters, numbers, underscores only.');
      return;
    }

    setLoading(true);

    const { data: existing } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', clean)
      .maybeSingle();

    if (existing) {
      setLoading(false);
      setError('That username is already taken.');
      return;
    }

    // Use server-side admin endpoint to create user and profile using the service role key
    const res = await createUserAdmin(clean, password);
    setLoading(false);
    if (!res.ok || !res.body?.success) {
      const err = res.body?.error ?? res.body ?? 'Something went wrong.';
      setError(typeof err === 'string' ? err : JSON.stringify(err));
      return;
    }

    navigate(redirect);
  };

  return (
    <AuthShell
      title="Create an account"
      footer={
        <>
          Already have one?{' '}
          <Link to={`/login?redirect=${encodeURIComponent(redirect)}`} className="font-semibold text-white/60 hover:text-white/80 transition-colors">
            Sign in
          </Link>
        </>
      }
    >
      <form className="flex flex-col gap-[13px]" onSubmit={handleSubmit}>
        {error && (
          <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3.5 py-2.5 text-sm text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}
        <div>
          <label className="mb-1.5 block text-[0.62rem] font-bold uppercase tracking-[0.08em] text-white/30">
            Username
          </label>
          <input
            type="text"
            required
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="yourname"
            className="w-full h-[42px] px-3.5 rounded-[10px] bg-white/[0.05] border border-white/[0.09] text-white text-[0.84rem] outline-none focus:border-white/20 transition-colors"
          />
          <p className="mt-1.5 text-[11px] text-white/25">Letters, numbers, underscores · 3-20 chars</p>
        </div>
        <div>
          <label className="mb-1.5 block text-[0.62rem] font-bold uppercase tracking-[0.08em] text-white/30">
            Password
          </label>
          <input
            type="password"
            required
            autoComplete="new-password"
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full h-[42px] px-3.5 rounded-[10px] bg-white/[0.05] border border-white/[0.09] text-white text-[0.84rem] outline-none focus:border-white/20 transition-colors"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="h-[42px] rounded-[10px] bg-white text-black text-[0.82rem] font-bold flex items-center justify-center gap-1.5 hover:bg-white/90 transition-colors disabled:opacity-50"
        >
          {loading ? 'Creating account...' : 'Create account'}
        </button>
      </form>
    </AuthShell>
  );
}
