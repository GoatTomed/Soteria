import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { AuthShell } from '@/components/AuthShell';
import { supabase } from '@/lib/supabase';

export function ResetPasswordPage() {
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setSent(true);
  };

  return (
    <AuthShell
      title="Reset password"
      footer={
        <Link to="/login" className="inline-flex items-center gap-1.5 text-brand-300 hover:text-brand-200">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to login
        </Link>
      }
    >
      {sent ? (
        <div className="py-4 text-center">
          <CheckCircle2 className="mx-auto h-10 w-10 text-success" />
          <p className="mt-4 text-sm text-ink-200">
            If an account exists for that email, a reset link is on its way.
          </p>
        </div>
      ) : (
        <form className="space-y-5" onSubmit={handleSubmit}>
          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3.5 py-2.5 text-sm text-red-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}
          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-ink-400">Email</label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input pl-10"
              />
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full text-base disabled:opacity-50">
            {loading ? 'Sending...' : 'Send reset link'}
          </button>
        </form>
      )}
    </AuthShell>
  );
}
