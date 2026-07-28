import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { AuthShell } from '@/components/AuthShell';
import { supabase } from '@/lib/supabase';

export function LoginPage() {
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
    setLoading(true);

    const { data: profile, error: lookupErr } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', username.trim().toLowerCase())
      .maybeSingle();

    if (lookupErr || !profile) {
      setLoading(false);
      setError('Invalid username or password');
      return;
    }

    const email = `${username.trim().toLowerCase()}@soteria.users`;
    const { error: signInErr } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (signInErr) {
      setError('Invalid username or password');
      return;
    }
    navigate(redirect);
  };

  return (
    <AuthShell
      title="Welcome back"
      footer={
        <>
          No account?{' '}
          <Link to={`/signup?redirect=${encodeURIComponent(redirect)}`} className="font-semibold text-white/60 hover:text-white/80 transition-colors">
            Sign up
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
        </div>
        <div>
          <label className="mb-1.5 block text-[0.62rem] font-bold uppercase tracking-[0.08em] text-white/30">
            Password
          </label>
          <input
            type="password"
            required
            autoComplete="current-password"
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
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </AuthShell>
  );
}
