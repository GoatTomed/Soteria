import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import {
  Loader2, ShieldCheck, ExternalLink, Check, Lock, KeyRound, Copy, AlertCircle, Sparkles,
} from 'lucide-react';
import { supabase, type Integration } from '@/lib/supabase';
import { Logo } from '@/components/Logo';

type GateState = 'loading' | 'ready' | 'not_found' | 'error';

function generateKey(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const segment = () => Array.from({ length: 3 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `${segment()}-${segment()}-${segment()}`;
}

export function GatePage() {
  const { owner } = useParams<{ owner: string }>();
  const [searchParams] = useSearchParams();
  const [state, setState] = useState<GateState>('loading');
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [visited, setVisited] = useState<Set<string>>(new Set());
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pasteUrls, setPasteUrls] = useState<Record<string, string>>({});
  const [pasteLoading, setPasteLoading] = useState<Set<string>>(new Set());
  const verifiedRef = useRef(false);

  const load = useCallback(async () => {
    if (!owner) { setState('not_found'); return; }
    setState('loading');

    const { data: intData, error } = await supabase
      .from('integrations')
      .select('*')
      .eq('status', 'connected')
      .order('created_at', { ascending: true });
    if (error) {
      setState('error');
      return;
    }

    const all = (intData as Integration[]) ?? [];
    setIntegrations(all);
    setState('ready');
  }, [owner]);

  useEffect(() => { load(); }, [load]);

  const allVisited = visited.size >= integrations.length;

  // Auto-verify when returning from Earnpaste with ?verify=1
  useEffect(() => {
    if (verifiedRef.current) return;
    if (state !== 'ready') return;
    const verify = searchParams.get('verify');
    if (verify === '1' && integrations.length > 0) {
      verifiedRef.current = true;
      setVisited(new Set(integrations.map(i => i.id)));
    }
  }, [state, searchParams, integrations]);

  const visitCheckpoint = async (integration: Integration) => {
    const intId = integration.id;
    setPasteLoading(prev => new Set(prev).add(intId));

    // Non-Earnpaste providers: open the stored link_url directly
    if (integration.provider !== 'Earnpaste' && integration.link_url) {
      setPasteUrls(prev => ({ ...prev, [intId]: integration.link_url }));
      window.open(integration.link_url, '_blank');
      setVisited(prev => new Set(prev).add(intId));
      setPasteLoading(prev => { const n = new Set(prev); n.delete(intId); return n; });
      return;
    }

    // Earnpaste: use the edge function to generate a paste link
    try {
      const gateUrl = `${window.location.origin}/gate/${owner}`;
      const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ||
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjZWR1a2RtcWllY2tocHNycmN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUyODE5OTAsImV4cCI6MjEwMDg1Nzk5MH0.k9HcY0d42rP3NoX2sySFCneQcYwCdc29mEG0YnErNRU';
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/earnpaste-paste`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${anonKey}`, apikey: anonKey },
        body: JSON.stringify({ targetUrl: gateUrl, integrationId: intId }),
      });
      const data = await res.json();
      if (data?.url) {
        setPasteUrls(prev => ({ ...prev, [intId]: data.url }));
        window.open(data.url, '_blank');
        setVisited(prev => new Set(prev).add(intId));
        return;
      }
    } catch {
      // fall through
    }
    setPasteLoading(prev => { const n = new Set(prev); n.delete(intId); return n; });
  };

  const claimKey = async () => {
    if (!allVisited || !file) return;
    setGenerating(true);
    const key = generateKey();
    const { error } = await supabase.from('keys').insert({
      key_value: key,
      status: 'active',
      hwid: '',
      note: `Gate key for "${file.name}"`,
      uses: 0,
    });
    setGenerating(false);
    if (error) { setState('error'); return; }
    setGeneratedKey(key);
  };

  const copyKey = () => {
    if (!generatedKey) return;
    navigator.clipboard.writeText(generatedKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  /* ---------- Loading ---------- */
  if (state === 'loading') {
    return <GateFrame>
      <GateCard>
        <h1 className="text-2xl font-medium text-white">Loading...</h1>
        <p className="text-sm text-white/40">Preparing your gateway.</p>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-5 w-5 animate-spin text-white/40" />
        </div>
      </GateCard>
    </GateFrame>;
  }

  /* ---------- Not found ---------- */
  if (state === 'not_found') {
    return <GateFrame>
      <GateCard>
        <div className="mx-auto h-14 w-14 rounded-2xl bg-red-500/10 flex items-center justify-center mb-4">
          <AlertCircle className="h-7 w-7 text-red-400" />
        </div>
        <h1 className="text-2xl font-medium text-white">Script not found</h1>
        <p className="text-sm text-white/40 mt-1">This gateway link is invalid or has been removed.</p>
        <Link to="/" className="mt-6 inline-flex h-10 items-center justify-center gap-2 rounded-full bg-white text-black text-sm font-medium px-6 hover:bg-white/90 transition-colors">
          Back to site
        </Link>
      </GateCard>
    </GateFrame>;
  }

  /* ---------- Error ---------- */
  if (state === 'error') {
    return <GateFrame>
      <GateCard>
        <div className="mx-auto h-14 w-14 rounded-2xl bg-red-500/10 flex items-center justify-center mb-4">
          <AlertCircle className="h-7 w-7 text-red-400" />
        </div>
        <h1 className="text-2xl font-medium text-white">Something went wrong</h1>
        <p className="text-sm text-white/40 mt-1">We couldn't issue your key. Please try again.</p>
        <button onClick={() => { setState('ready'); setGeneratedKey(null); }} className="mt-6 inline-flex h-10 items-center justify-center gap-2 rounded-full bg-white text-black text-sm font-medium px-6 hover:bg-white/90 transition-colors">
          Try again
        </button>
      </GateCard>
    </GateFrame>;
  }

  /* ---------- Key revealed ---------- */
  if (generatedKey) {
    const firstInt = integrations[0];
    return <GateFrame>
      <GateCard>
        <div className="mx-auto h-14 w-14 rounded-2xl bg-green-500/10 flex items-center justify-center mb-4">
          <ShieldCheck className="h-7 w-7 text-green-400" />
        </div>
        <h1 className="text-2xl font-medium text-white">Access granted</h1>
        <p className="text-sm text-white/40 mt-1">Your key has been generated. Copy it before leaving this page.</p>
        <div className="mt-6 rounded-xl border border-white/10 bg-black/40 p-4">
          <div className="flex items-center gap-2 mb-2">
            <KeyRound className="h-4 w-4 text-brand-300" />
            <span className="text-xs font-medium uppercase tracking-wider text-white/40">Your key</span>
          </div>
          <div className="flex items-center gap-3">
            <code className="flex-1 font-mono text-lg text-white break-all tracking-wider">{generatedKey}</code>
            <button onClick={copyKey} className="shrink-0 h-9 px-3 rounded-lg border border-white/10 bg-white/[0.04] text-white/70 hover:text-white hover:bg-white/[0.08] transition-colors flex items-center gap-1.5 text-xs">
              {copied ? <><Check className="h-3.5 w-3.5 text-green-400" /> Copied</> : <><Copy className="h-3.5 w-3.5" /> Copy</>}
            </button>
          </div>
        </div>
        <p className="mt-4 text-xs text-white/30">
          {firstInt?.key_expiry_days ? `Expires in ${firstInt.key_expiry_days} day${firstInt.key_expiry_days !== 1 ? 's' : ''}.` : 'This key does not expire.'}
        </p>
      </GateCard>
    </GateFrame>;
  }

  /* ---------- Ready: checkpoints ---------- */
  return (
    <GateFrame>
      <GateCard>
        <div className="space-y-2 text-center mb-6">
          <h1 className="text-2xl font-medium text-white">{owner ? `${owner}'s Gate` : 'Gateway'}</h1>
          <p className="text-sm text-white/40">
            {integrations.length > 0
              ? `Complete all ${integrations.length} checkpoint${integrations.length !== 1 ? 's' : ''} below to get your key.`
              : 'This gate is configured to issue keys directly.'}
          </p>
        </div>

        {/* Progress bar */}
        {integrations.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-white/40">Progress</span>
              <span className="text-xs text-white/60">{visited.size} / {integrations.length}</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
              <div
                className="h-full bg-brand-400 transition-all duration-500"
                style={{ width: `${integrations.length > 0 ? (visited.size / integrations.length) * 100 : 0}%` }}
              />
            </div>
          </div>
        )}

        {/* Checkpoint list — one per integration */}
        {integrations.length === 0 ? (
          <div className="py-6 text-center">
            <Sparkles className="mx-auto h-8 w-8 text-brand-300/60 mb-3" />
            <p className="text-sm text-white/50">No checkpoints configured. You can claim your key directly.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {integrations.map((int, idx) => {
              const done = visited.has(int.id);
              const isLoading = pasteLoading.has(int.id);
              const linkUrl = pasteUrls[int.id] || '';
              return (
                <div
                  key={int.id}
                  className={`flex items-center gap-3 rounded-xl border p-4 transition-colors ${
                    done ? 'border-green-500/20 bg-green-500/[0.04]' : 'border-white/[0.07] bg-white/[0.02]'
                  }`}
                >
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                    done ? 'bg-green-500/15 text-green-400' : 'bg-white/[0.06] text-white/40'
                  }`}>
                    {done ? <Check className="h-4 w-4" /> : <span className="text-xs font-semibold">{idx + 1}</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{int.display_name || int.provider} #{idx + 1}</p>
                    <p className="text-xs text-white/40 truncate">
                      {done ? 'Checkpoint complete' : `Click to visit ${int.provider}`}
                    </p>
                  </div>
                  {!done ? (
                    <button
                      onClick={() => visitCheckpoint(int)}
                      disabled={isLoading}
                      className="shrink-0 h-9 px-3 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors bg-white text-black hover:bg-white/90 disabled:opacity-50"
                    >
                      {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ExternalLink className="h-3.5 w-3.5" />}
                      {isLoading ? 'Creating...' : 'Visit'}
                    </button>
                  ) : linkUrl ? (
                    <a
                      href={linkUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="shrink-0 h-9 px-3 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors bg-green-500/10 text-green-400"
                    >
                      <Check className="h-3.5 w-3.5" /> Done
                    </a>
                  ) : (
                    <span className="shrink-0 h-9 px-3 rounded-lg text-xs font-medium flex items-center gap-1.5 bg-green-500/10 text-green-400">
                      <Check className="h-3.5 w-3.5" /> Done
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Claim button */}
        <button
          onClick={claimKey}
          disabled={!allVisited || generating}
          className="mt-6 w-full h-11 rounded-full bg-white text-black text-sm font-medium hover:bg-white/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {generating ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Generating key...</>
          ) : allVisited ? (
            <><KeyRound className="h-4 w-4" /> Get my key</>
          ) : (
            <><Lock className="h-4 w-4" /> Complete all checkpoints</>
          )}
        </button>

        {integrations.length > 0 && (
          <p className="mt-4 text-center text-xs text-white/30">
            Powered by {integrations.map(i => i.display_name || i.provider).join(', ')}
          </p>
        )}
      </GateCard>
    </GateFrame>
  );
}

/* ---------- Layout helpers ---------- */

function GateFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 overflow-hidden relative bg-[hsl(0,0%,5%)]">
      {/* Dot grid background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 20%, transparent 70%)',
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[hsl(0,0%,5%)] via-transparent to-[hsl(0,0%,5%)]" />
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[hsl(0,0%,5%)] to-transparent" />

      <Link to="/" className="relative z-10 focus:outline-none">
        <Logo className="h-12 w-12 text-white" />
      </Link>

      <div className="relative z-10 w-full px-4 flex justify-center">
        {children}
      </div>

    </div>
  );
}

function GateCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full max-w-sm p-8 rounded-2xl border border-white/10 bg-[#050507] shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
      {children}
    </div>
  );
}
