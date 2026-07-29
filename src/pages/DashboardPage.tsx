import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { DashboardShell, TabButton, PageTitle, Card } from '@/components/DashboardShell';
import { supabase, type Service, type Script, type Key, type Integration, type File } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { generateSlug, unobfuscateExternal } from '@/lib/obfuscate';
import { generateKeySystemLua } from '@/lib/key-system';
import {
  Search, ChevronDown, Plus, Link2, FileCode2, Eye, Sparkles,
  ShieldCheck, Trash2, Copy, Check, X, RefreshCw, Power, PowerOff,
  Lock, Unlock, ExternalLink, XCircle, ClipboardPaste, Loader2, BookOpen,
} from 'lucide-react';

const VALID_TABS = ['obfuscate', 'utilities', 'oracle', 'genesis', 'settings'] as const;
const ORACLE_SUBS = ['services', 'scripts', 'keys', 'monetization', 'log', 'guide'] as const;

function pathToTab(pathname: string): { tab: string; oracleSub: string } {
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length === 0) return { tab: 'obfuscate', oracleSub: 'services' };
  const first = parts[0];
  if (first === 'oracle') {
    const sub = parts[1] && ORACLE_SUBS.includes(parts[1] as typeof ORACLE_SUBS[number]) ? parts[1] : 'services';
    return { tab: 'oracle', oracleSub: sub };
  }
  if ((VALID_TABS as readonly string[]).includes(first)) {
    return { tab: first, oracleSub: 'services' };
  }
  return { tab: 'obfuscate', oracleSub: 'services' };
}

function tabToPath(tab: string, oracleSub?: string): string {
  if (tab === 'oracle') return oracleSub && oracleSub !== 'services' ? `/oracle/${oracleSub}` : '/oracle';
  if (tab === 'obfuscate') return '/';
  return `/${tab}`;
}

export function DashboardPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const { tab: urlTab, oracleSub } = pathToTab(location.pathname);
  const [tab, setTab] = useState(urlTab);

  // Sync from URL when browser back/forward is used
  useEffect(() => {
    const { tab: t } = pathToTab(location.pathname);
    if (t !== tab) setTab(t);
  }, [location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleTabChange = (newTab: string) => {
    setTab(newTab);
    navigate(tabToPath(newTab));
  };

  return (
    <DashboardShell breadcrumb={breadcrumbFor(tab)} activeTab={tab} onTabChange={handleTabChange}>
      {tab === 'obfuscate' && <ObfuscateView />}
      {tab === 'utilities' && <UtilitiesView />}
      {tab === 'oracle' && <OracleView initialSub={oracleSub} onSubChange={(sub) => navigate(tabToPath('oracle', sub))} />}
      {tab === 'genesis' && <GenesisView />}
      {tab === 'settings' && <SettingsView />}
    </DashboardShell>
  );
}

function breadcrumbFor(tab: string): string {
  if (tab === 'oracle') return 'Soteria / Oracle';
  if (tab === 'genesis') return 'Soteria / Genesis';
  if (tab === 'utilities') return 'Soteria / Utilities';
  if (tab === 'settings') return 'Soteria / Settings';
  return 'Soteria';
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function generateKey(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let key = '';
  for (let i = 0; i < 32; i++) {
    key += chars[Math.floor(Math.random() * chars.length)];
    if (i === 7 || i === 15 || i === 23) key += '-';
  }
  return key;
}

function generateVerificationUrl(): string {
  const slug = generateSlug();
  return `https://yousoteria.vercel.app/verify/${slug}`;
}

/* ============ Obfuscate ============ */

function ObfuscateView() {
  const [sub, setSub] = useState('files');
  return (
    <div className="space-y-5 mb-2">
      <PageTitle>Obfuscate</PageTitle>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-1">
          <TabButton label="Files" active={sub === 'files'} onClick={() => setSub('files')} />
          <TabButton label="Analytics" active={sub === 'analytics'} onClick={() => setSub('analytics')} />
        </div>
      </div>
      {sub === 'files' ? <ObfuscateFiles /> : <ObfuscateAnalytics />}
    </div>
  );
}

function ObfuscateFiles() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState('');
  const [newContent, setNewContent] = useState('');
  const [selected, setSelected] = useState<File | null>(null);
  const [view, setView] = useState<'original' | 'obfuscated'>('original');
  const [copied, setCopied] = useState(false);
  const [obfuscating, setObfuscating] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('files').select('*').order('updated_at', { ascending: false });
    setFiles((data as File[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = files.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));

  const createFile = async () => {
    if (!newName.trim()) return;
    const content = newContent || `-- ${newName}\nprint("Hello from ${newName}")`;
    const size = new Blob([content]).size;
    const slug = generateSlug();
    const { data } = await supabase.from('files').insert({
      name: newName, size_bytes: size, status: 'active', obfuscated: false,
      content, obfuscated_content: '', slug,
    }).select('*');
    if (data) setFiles(prev => [data[0] as File, ...prev]);
    setShowNew(false); setNewName(''); setNewContent('');
  };

  const obfuscateFile = async (file: File) => {
    setObfuscating(file.id);
    const original = file.content || '';
    const owner = 'soteria';
    const keySystem = generateKeySystemLua(owner, file.id);
    const combined = keySystem + '\n' + original;

    let obfuscated: string;
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://bcedukdmqieckhpsrrcx.supabase.co';
      const res = await fetch(`${supabaseUrl}/functions/v1/wearedevs-obfuscate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ script: combined }),
      });
      const data = await res.json();
      if (!data.success || !data.obfuscated) throw new Error(data.error || 'Obfuscation failed');
      obfuscated = data.obfuscated;
    } catch {
      setObfuscating(null);
      return;
    }

    if (file.obfuscated) {
      // Already obfuscated — create a NEW version row with the same name,
      // preserving the original file untouched.
      const parent = (file as File & { parent_file_id?: string | null }).parent_file_id ?? file.id;
      const { data: existing } = await supabase
        .from('files')
        .select('id, version')
        .or(`parent_file_id.eq.${parent},id.eq.${parent}`)
        .order('version', { ascending: false })
        .limit(1)
        .maybeSingle();
      const nextVersion = ((existing as { version?: number } | null)?.version ?? 1) + 1;

      const { data: newFile } = await supabase.from('files').insert({
        name: file.name,
        size_bytes: file.size_bytes,
        status: 'obfuscated',
        obfuscated: true,
        content: original,
        obfuscated_content: obfuscated,
        unobfuscated_content: original,
        slug: generateSlug(),
        version: nextVersion,
        parent_file_id: parent,
      }).select('*');
      if (newFile) {
        setFiles(prev => [newFile[0] as File, ...prev]);
      }
    } else {
      // First obfuscation — update the existing row in place
      await supabase.from('files').update({
        obfuscated: true, status: 'obfuscated',
        obfuscated_content: obfuscated,
        unobfuscated_content: original,
        version: 1,
        updated_at: new Date().toISOString(),
      }).eq('id', file.id);
      setFiles(prev => prev.map(f => f.id === file.id ? { ...f, obfuscated: true, status: 'obfuscated', obfuscated_content: obfuscated, unobfuscated_content: original } : f));
    }
    setObfuscating(null);
  };

  const deleteFile = async (id: string) => {
    await supabase.from('files').delete().eq('id', id);
    setFiles(prev => prev.filter(f => f.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  const loadstringUrl = (slug: string) => `https://yousoteria.vercel.app/${slug}`;
  const loadstringCode = (slug: string) => `loadstring(game:HttpGet("${loadstringUrl(slug)}"))()`;

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full h-9 rounded-md border border-white/10 bg-white/[0.02] pl-8 pr-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/20"
            placeholder="Search files..."
          />
        </div>
        <button
          onClick={() => setShowNew(true)}
          className="h-9 px-4 rounded-full bg-white text-black text-sm font-medium hover:bg-white/90 transition-colors flex items-center gap-2 whitespace-nowrap"
        >
          <Plus className="h-4 w-4" /> New
        </button>
      </div>

      {showNew && (
        <Card className="p-5 space-y-3">
          <input
            value={newName}
            onChange={e => setNewName(e.target.value)}
            placeholder="File name (e.g. anti-cheat.luau)"
            className="w-full h-9 rounded-md border border-white/10 bg-white/[0.02] px-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/20"
          />
          <textarea
            value={newContent}
            onChange={e => setNewContent(e.target.value)}
            placeholder="-- Paste your Luau script here (optional)"
            rows={6}
            className="w-full rounded-md border border-white/10 bg-white/[0.02] px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/20 font-mono"
          />
          <div className="flex gap-2">
            <button onClick={createFile} className="h-9 px-4 rounded-full bg-white text-black text-sm font-medium hover:bg-white/90">Create</button>
            <button onClick={() => setShowNew(false)} className="h-9 px-4 rounded-full border border-white/10 text-sm text-white/60 hover:text-white">Cancel</button>
          </div>
        </Card>
      )}

      <Card>
        <div className="px-6 py-4 border-b border-white/[0.07] flex items-center justify-between">
          <h2 className="text-sm font-medium text-white">Your files</h2>
          <span className="text-sm text-white/40">{files.length} file{files.length !== 1 ? 's' : ''}</span>
        </div>
        {loading ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-12 rounded-lg bg-white/[0.03] animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-sm text-white/40">No files found. Click "New" to create one.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-white/[0.07] bg-white/[0.015] text-white/40">
                  <th className="text-left font-medium px-4 sm:px-6 py-2.5">Name</th>
                  <th className="text-left font-medium px-3 py-2.5 hidden md:table-cell">ID</th>
                  <th className="text-left font-medium px-3 py-2.5 hidden md:table-cell">Size</th>
                  <th className="text-left font-medium px-3 py-2.5 hidden md:table-cell">Status</th>
                  <th className="text-left font-medium px-3 py-2.5 hidden sm:table-cell">Updated</th>
                  <th className="text-right font-medium px-4 sm:px-6 py-2.5">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                {filtered.map(f => (
                  <tr key={f.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 sm:px-6 py-3">
                      <button
                        onClick={() => { setSelected(f); setView('original'); }}
                        className="flex items-center gap-3 text-left hover:text-brand-300 transition-colors"
                      >
                        <FileCode2 className="h-4 w-4 text-white/30 shrink-0" />
                        <span className="text-white">{f.name}</span>
                      </button>
                    </td>
                    <td className="px-3 py-3 hidden md:table-cell">
                      <code className="text-xs text-brand-300/70 font-mono">/{f.slug}</code>
                    </td>
                    <td className="px-3 py-3 hidden md:table-cell text-white/50">{formatBytes(f.size_bytes)}</td>
                    <td className="px-3 py-3 hidden md:table-cell">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${f.obfuscated ? 'bg-green-500/10 text-green-400' : 'bg-white/[0.06] text-white/50'}`}>
                        {f.obfuscated ? 'Obfuscated' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-3 py-3 hidden sm:table-cell text-white/50">{timeAgo(f.updated_at)}</td>
                    <td className="px-4 sm:px-6 py-3">
                      <div className="flex items-center justify-end gap-2">
                        {!f.obfuscated ? (
                          <button
                            onClick={() => obfuscateFile(f)}
                            disabled={obfuscating === f.id}
                            title="Obfuscate"
                            className="p-1.5 rounded hover:bg-white/10 text-white/50 hover:text-white transition-colors disabled:opacity-30"
                          >
                            <ShieldCheck className={`h-4 w-4 ${obfuscating === f.id ? 'animate-pulse' : ''}`} />
                          </button>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-xs bg-green-500/10 text-green-400">Obfuscated</span>
                        )}
                        <button onClick={() => { setSelected(f); setView('original'); }} title="View" className="p-1.5 rounded hover:bg-white/10 text-white/50 hover:text-white transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button onClick={() => deleteFile(f.id)} title="Delete" className="p-1.5 rounded hover:bg-red-500/10 text-white/50 hover:text-red-400 transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {selected && (
        <FileDetailModal
          file={selected}
          view={view}
          onViewChange={setView}
          onClose={() => setSelected(null)}
          onObfuscate={obfuscateFile}
          onCopy={copy}
          copied={copied}
          obfuscating={obfuscating === selected.id}
          loadstringCode={loadstringCode(selected.slug)}
          loadstringUrl={loadstringUrl(selected.slug)}
        />
      )}
    </div>
  );
}

function FileDetailModal({
  file, view, onViewChange, onClose, onObfuscate, onCopy, copied, obfuscating, loadstringCode, loadstringUrl,
}: {
  file: File;
  view: 'original' | 'obfuscated';
  onViewChange: (v: 'original' | 'obfuscated') => void;
  onClose: () => void;
  onObfuscate: (f: File) => void;
  onCopy: (t: string) => void;
  copied: boolean;
  obfuscating: boolean;
  loadstringCode: string;
  loadstringUrl: string;
}) {
  const content = view === 'obfuscated' ? (file.obfuscated_content || '-- Not obfuscated yet') : (file.content || '-- Empty');
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="w-full max-w-3xl max-h-[85vh] overflow-hidden rounded-2xl border border-white/10 bg-[hsl(0,0%,6%)] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.07]">
          <div className="flex items-center gap-3">
            <FileCode2 className="h-5 w-5 text-brand-400" />
            <h3 className="text-sm font-medium text-white">{file.name}</h3>
            <code className="text-xs text-brand-300/60 font-mono">/{file.slug}</code>
          </div>
          <button onClick={onClose} className="p-1.5 rounded hover:bg-white/10 text-white/50 hover:text-white transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-6 py-4 border-b border-white/[0.07] space-y-3">
          <div>
            <p className="text-xs text-white/40 mb-1.5">Loadstring URL</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 truncate rounded-md border border-white/10 bg-white/[0.02] px-3 py-2 text-xs text-brand-300 font-mono">{loadstringUrl}</code>
              <button onClick={() => onCopy(loadstringUrl)} className="p-2 rounded-md border border-white/10 text-white/50 hover:text-white hover:bg-white/5 transition-colors shrink-0">
                {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
              </button>
              <a href={loadstringUrl} target="_blank" rel="noopener noreferrer" className="p-2 rounded-md border border-white/10 text-white/50 hover:text-white hover:bg-white/5 transition-colors shrink-0">
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
          <div>
            <p className="text-xs text-white/40 mb-1.5">Executor code</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 truncate rounded-md border border-white/10 bg-white/[0.02] px-3 py-2 text-xs text-white font-mono">{loadstringCode}</code>
              <button onClick={() => onCopy(loadstringCode)} className="p-2 rounded-md border border-white/10 text-white/50 hover:text-white hover:bg-white/5 transition-colors shrink-0">
                {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>

        <div className="px-6 py-3 border-b border-white/[0.07] flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button
              onClick={() => onViewChange('original')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${view === 'original' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60'}`}
            >Original</button>
            <button
              onClick={() => onViewChange('obfuscated')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${view === 'obfuscated' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60'}`}
            >Obfuscated</button>
          </div>
          <div className="flex items-center gap-2">
            {file.obfuscated ? (
              <span className="px-2 py-1 rounded-full text-xs bg-green-500/10 text-green-400">Obfuscated</span>
            ) : (
              <button
                onClick={() => onObfuscate(file)}
                disabled={obfuscating}
                className="h-8 px-3 rounded-full bg-brand-500 text-white text-xs font-medium hover:bg-brand-400 transition-colors flex items-center gap-1.5 disabled:opacity-50"
              >
                <ShieldCheck className={`h-3.5 w-3.5 ${obfuscating ? 'animate-pulse' : ''}`} />
                {obfuscating ? 'Obfuscating...' : 'Obfuscate now'}
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6 bg-black/20">
          <pre className="text-xs text-white/80 font-mono whitespace-pre-wrap break-all leading-relaxed">{content}</pre>
        </div>
      </div>
    </div>
  );
}

function ObfuscateAnalytics() {
  const [files, setFiles] = useState<File[]>([]);
  const [executionsToday, setExecutionsToday] = useState(0);
  const [totalExecutions, setTotalExecutions] = useState(0);
  const [hourly, setHourly] = useState<number[]>(Array.from({ length: 24 }, () => 0));

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('files').select('*');
      setFiles((data as File[]) ?? []);

      const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const { count: todayCount } = await supabase
        .from('execution_logs')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', since);
      setExecutionsToday(todayCount ?? 0);

      const totalExec = (data as File[] ?? []).reduce((a, f) => a + (f.executions ?? 0), 0);
      setTotalExecutions(totalExec);

      // Build hourly bar chart from execution_logs in last 24h
      const { data: logs } = await supabase
        .from('execution_logs')
        .select('created_at')
        .gte('created_at', since)
        .order('created_at', { ascending: true });
      const buckets = Array.from({ length: 24 }, () => 0);
      const now = Date.now();
      for (const log of (logs ?? []) as { created_at: string }[]) {
        const hourAgo = Math.floor((now - new Date(log.created_at).getTime()) / (60 * 60 * 1000));
        if (hourAgo >= 0 && hourAgo < 24) buckets[23 - hourAgo]++;
      }
      setHourly(buckets);
    })();
  }, []);

  const total = files.length;
  const obfuscated = files.filter(f => f.obfuscated).length;
  const pending = total - obfuscated;
  const maxHour = Math.max(...hourly, 1);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total files', value: total },
          { label: 'Obfuscated', value: obfuscated },
          { label: 'Pending', value: pending },
          { label: 'Executions today', value: executionsToday },
        ].map(s => (
          <Card key={s.label} className="p-5">
            <p className="text-xs text-white/40">{s.label}</p>
            <p className="mt-2 text-2xl font-semibold text-white">{s.value}</p>
          </Card>
        ))}
      </div>
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-white">Executions (last 24 hours)</p>
          <span className="text-xs text-white/40">{totalExecutions} total all-time</span>
        </div>
        <div className="mt-6 flex items-end gap-1 h-40">
          {hourly.map((count, i) => (
            <div key={i} className="flex-1 rounded-t bg-white/[0.06] hover:bg-white/[0.12] transition-colors relative group" style={{ height: `${(count / maxHour) * 100}%`, minHeight: count > 0 ? '4px' : '0' }}>
              <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs text-white/0 group-hover:text-white/60 transition-colors whitespace-nowrap">{count}</span>
            </div>
          ))}
        </div>
        <div className="mt-2 flex justify-between text-xs text-white/30">
          <span>24h ago</span>
          <span>Now</span>
        </div>
      </Card>
    </div>
  );
}

/* ============ Utilities ============ */

function UtilitiesView() {
  const utils = [
    { name: 'String Encryptor', desc: 'Encrypt string literals for manual use', icon: FileCode2 },
    { name: 'Key Generator', desc: 'Generate random keys for Oracle', icon: ShieldCheck },
    { name: 'HWID Checker', desc: 'Look up hardware IDs for keys', icon: Eye },
    { name: 'Script Formatter', desc: 'Format and beautify Luau code', icon: FileCode2 },
  ];
  return (
    <div className="space-y-5 mb-2">
      <PageTitle>Utilities</PageTitle>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {utils.map(u => (
          <Card key={u.name} className="p-5 flex items-center gap-4 hover:border-white/15 transition-colors cursor-pointer">
            <div className="h-11 w-11 rounded-lg bg-white/[0.05] flex items-center justify-center shrink-0">
              <u.icon className="h-5 w-5 text-white/60" />
            </div>
            <div><p className="text-sm font-medium text-white">{u.name}</p><p className="text-xs text-white/40 mt-0.5">{u.desc}</p></div>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ============ Oracle ============ */

function OracleView({ initialSub, onSubChange }: { initialSub: string; onSubChange: (sub: string) => void }) {
  const [sub, setSub] = useState(initialSub);
  const subs = ['Services', 'Scripts', 'Keys', 'Monetization', 'Log', 'Guide'];

  useEffect(() => {
    setSub(initialSub);
  }, [initialSub]);

  const handleSubChange = (s: string) => {
    setSub(s);
    onSubChange(s);
  };

  return (
    <div className="space-y-5 mb-2">
      <PageTitle>Oracle</PageTitle>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-1 flex-wrap">
          {subs.map(s => (
            <TabButton key={s} label={s} active={sub === s.toLowerCase()} onClick={() => handleSubChange(s.toLowerCase())} />
          ))}
        </div>
      </div>
      {sub === 'services' && <OracleServices />}
      {sub === 'scripts' && <OracleScripts />}
      {sub === 'keys' && <OracleKeys />}
      {sub === 'monetization' && <OracleMonetization />}
      {sub === 'log' && <OracleLog />}
      {sub === 'guide' && <OracleGuide />}
    </div>
  );
}

function OracleServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [totalKeys, setTotalKeys] = useState(0);
  const [activeIntegrations, setActiveIntegrations] = useState(0);
  const [executionsToday, setExecutionsToday] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    const [svcRes, keysRes, intRes, execRes] = await Promise.all([
      supabase.from('services').select('*').order('updated_at', { ascending: false }),
      supabase.from('keys').select('id', { count: 'exact', head: true }),
      supabase.from('integrations').select('id', { count: 'exact', head: true }),
      supabase.from('execution_logs').select('id', { count: 'exact', head: true }).gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()),
    ]);
    setServices((svcRes.data as Service[]) ?? []);
    setTotalKeys(keysRes.count ?? 0);
    setActiveIntegrations(intRes.count ?? 0);
    setExecutionsToday(execRes.count ?? 0);
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  const filtered = services.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

  const createService = async () => {
    if (!newName.trim()) return;
    const { data } = await supabase.from('services').insert({ name: newName, description: newDesc }).select('*');
    if (data) setServices(prev => [data[0] as Service, ...prev]);
    setShowNew(false); setNewName(''); setNewDesc('');
  };

  const deleteService = async (id: string) => {
    await supabase.from('services').delete().eq('id', id);
    setServices(prev => prev.filter(s => s.id !== id));
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Total services', value: services.length, sub: 'Active integrations' },
          { label: 'Total keys', value: totalKeys, sub: 'Across all services' },
          { label: 'Executions today', value: executionsToday, sub: 'Last 24 hours real stats' },
        ].map(s => (
          <Card key={s.label} className="px-6 py-5">
            <p className="text-xs text-white/40">{s.label}</p>
            <p className="mt-2 text-xl font-semibold text-white">{s.value}</p>
            <p className="mt-1 text-xs text-white/30">{s.sub}</p>
          </Card>
        ))}
      </div>
      <Card>
        <div className="px-6 py-4 border-b border-white/[0.07] flex flex-col gap-4 md:flex-row md:items-center justify-between">
          <div>
            <h2 className="font-medium text-white">Your Services</h2>
            <p className="text-white/40 text-sm">{services.length} service{services.length !== 1 ? 's' : ''}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 w-4 h-4" />
              <input value={search} onChange={e => setSearch(e.target.value)} className="h-9 rounded-md border border-white/10 bg-white/[0.05] pl-9 pr-3 w-52 text-sm text-white placeholder:text-white/30 outline-none" placeholder="Search services..." />
            </div>
            <button onClick={() => setShowNew(true)} className="h-9 px-4 rounded-full bg-white text-black text-sm font-medium hover:bg-white/90 flex items-center gap-2 whitespace-nowrap">
              <Plus className="h-4 w-4" /> New
            </button>
          </div>
        </div>

        {showNew && (
          <div className="px-6 py-4 border-b border-white/[0.07] space-y-3">
            <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Service name" className="w-full h-9 rounded-md border border-white/10 bg-white/[0.02] px-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/20" />
            <input value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="Description (optional)" className="w-full h-9 rounded-md border border-white/10 bg-white/[0.02] px-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/20" />
            <div className="flex gap-2">
              <button onClick={createService} className="h-9 px-4 rounded-full bg-white text-black text-sm font-medium hover:bg-white/90">Create</button>
              <button onClick={() => setShowNew(false)} className="h-9 px-4 rounded-full border border-white/10 text-sm text-white/60 hover:text-white">Cancel</button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="divide-y divide-white/[0.07]">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between px-5 py-4 animate-pulse">
                <div className="flex items-center gap-3 md:gap-6">
                  <div className="size-12 rounded-lg bg-white/[0.06]" />
                  <div className="space-y-2"><div className="h-4 w-36 rounded bg-white/[0.06]" /><div className="h-3 w-56 rounded bg-white/[0.06]" /></div>
                </div>
                <div className="h-8 w-8 rounded bg-white/[0.06]" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-sm text-white/40">No services found. Click "New" to create one.</div>
        ) : (
          <div className="divide-y divide-white/[0.07]">
            {filtered.map(s => (
              <div key={s.id} className="flex items-center justify-between px-5 py-4 hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-3 md:gap-6">
                  <div className="size-12 rounded-lg bg-white/[0.05] flex items-center justify-center">
                    <Eye className="h-5 w-5 text-white/40" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{s.name}</p>
                    {s.description && <p className="text-white/40 text-sm">{s.description}</p>}
                    <p className="text-white/30 text-xs mt-0.5">{s.executions} executions · {timeAgo(s.updated_at)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${s.status === 'active' ? 'bg-green-500/10 text-green-400' : 'bg-white/[0.06] text-white/50'}`}>{s.status}</span>
                  <button onClick={() => deleteService(s.id)} className="p-1.5 rounded hover:bg-red-500/10 text-white/50 hover:text-red-400 transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </>
  );
}

function OracleScripts() {
  const [scripts, setScripts] = useState<Script[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newService, setNewService] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    const [sRes, svcRes] = await Promise.all([
      supabase.from('scripts').select('*').order('updated_at', { ascending: false }),
      supabase.from('services').select('*'),
    ]);
    setScripts((sRes.data as Script[]) ?? []);
    setServices((svcRes.data as Service[]) ?? []);
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  const filtered = scripts.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

  const createScript = async () => {
    if (!newName.trim()) return;
    const { data } = await supabase.from('scripts').insert({
      name: newName, content: newContent || '-- empty', service_id: newService || null,
    }).select('*');
    if (data) setScripts(prev => [data[0] as Script, ...prev]);
    setShowNew(false); setNewName(''); setNewContent(''); setNewService('');
  };

  const deleteScript = async (id: string) => {
    await supabase.from('scripts').delete().eq('id', id);
    setScripts(prev => prev.filter(s => s.id !== id));
  };

  const svcName = (id: string | null) => services.find(s => s.id === id)?.name ?? 'Unassigned';

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <input value={search} onChange={e => setSearch(e.target.value)} className="w-full h-9 rounded-md border border-white/10 bg-white/[0.02] pl-8 pr-3 text-sm text-white placeholder:text-white/30 outline-none" placeholder="Search scripts..." />
        </div>
        <button onClick={() => setShowNew(true)} className="h-9 px-4 rounded-full bg-white text-black text-sm font-medium hover:bg-white/90 flex items-center gap-2 whitespace-nowrap">
          <Plus className="h-4 w-4" /> New
        </button>
      </div>

      {showNew && (
        <Card className="p-5 space-y-3">
          <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Script name" className="w-full h-9 rounded-md border border-white/10 bg-white/[0.02] px-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/20" />
          <select value={newService} onChange={e => setNewService(e.target.value)} style={{ colorScheme: 'dark' }} className="w-full h-9 rounded-md border border-white/10 bg-[#1a1a1a] px-3 text-sm text-white outline-none">
            <option value="">No service</option>
            {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <textarea value={newContent} onChange={e => setNewContent(e.target.value)} placeholder="-- Script content" rows={5} className="w-full rounded-md border border-white/10 bg-white/[0.02] px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/20 font-mono" />
          <div className="flex gap-2">
            <button onClick={createScript} className="h-9 px-4 rounded-full bg-white text-black text-sm font-medium hover:bg-white/90">Create</button>
            <button onClick={() => setShowNew(false)} className="h-9 px-4 rounded-full border border-white/10 text-sm text-white/60 hover:text-white">Cancel</button>
          </div>
        </Card>
      )}

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-white/[0.07] bg-white/[0.015] text-white/40">
                <th className="text-left font-medium px-4 sm:px-6 py-2.5">Name</th>
                <th className="text-left font-medium px-3 py-2.5 hidden md:table-cell">Service</th>
                <th className="text-left font-medium px-3 py-2.5 hidden md:table-cell">Executions</th>
                <th className="text-left font-medium px-3 py-2.5 hidden sm:table-cell">Updated</th>
                <th className="text-right font-medium px-4 sm:px-6 py-2.5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {Array.from({ length: 5 }).map((_, j) => <td key={j} className="px-4 py-3"><div className="h-3.5 rounded bg-white/[0.06]" style={{ width: `${60 + (j % 3) * 20}%` }} /></td>)}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-sm text-white/40">No scripts found</td></tr>
              ) : (
                filtered.map(s => (
                  <tr key={s.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 sm:px-6 py-3"><div className="flex items-center gap-3"><FileCode2 className="h-4 w-4 text-white/30 shrink-0" /><span className="text-white">{s.name}</span></div></td>
                    <td className="px-3 py-3 hidden md:table-cell text-white/50">{svcName(s.service_id)}</td>
                    <td className="px-3 py-3 hidden md:table-cell text-white/50">{s.executions}</td>
                    <td className="px-3 py-3 hidden sm:table-cell text-white/50">{timeAgo(s.updated_at)}</td>
                    <td className="px-4 sm:px-6 py-3 text-right"><button onClick={() => deleteScript(s.id)} className="p-1.5 rounded hover:bg-red-500/10 text-white/50 hover:text-red-400 transition-colors"><Trash2 className="h-4 w-4" /></button></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function OracleKeys() {
  const [keys, setKeys] = useState<Key[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [sub, setSub] = useState<'keys' | 'analytics'>('keys');
  const [newService, setNewService] = useState('');
  const [newNote, setNewNote] = useState('');
  const [newHwid, setNewHwid] = useState('');
  const [bulkCount, setBulkCount] = useState('1');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const [kRes, svcRes] = await Promise.all([
      supabase.from('keys').select('*').order('updated_at', { ascending: false }),
      supabase.from('services').select('*'),
    ]);
    setKeys((kRes.data as Key[]) ?? []);
    setServices((svcRes.data as Service[]) ?? []);
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  const filtered = keys.filter(k =>
    k.key_value.toLowerCase().includes(search.toLowerCase()) ||
    k.note.toLowerCase().includes(search.toLowerCase())
  );

  const createKeys = async () => {
    const count = Math.min(Math.max(parseInt(bulkCount) || 1, 1), 100);
    const rows = Array.from({ length: count }).map(() => ({
      key_value: generateKey(), service_id: newService || null, note: newNote, hwid: newHwid,
    }));
    const { data } = await supabase.from('keys').insert(rows).select('*');
    if (data) setKeys(prev => [...(data as Key[]), ...prev]);
    setShowNew(false); setNewNote(''); setNewHwid(''); setBulkCount('1');
  };

  const toggleKeyStatus = async (key: Key) => {
    const newStatus = key.status === 'active' ? 'revoked' : 'active';
    await supabase.from('keys').update({ status: newStatus, updated_at: new Date().toISOString() }).eq('id', key.id);
    setKeys(prev => prev.map(k => k.id === key.id ? { ...k, status: newStatus } : k));
  };

  const deleteKey = async (id: string) => {
    await supabase.from('keys').delete().eq('id', id);
    setKeys(prev => prev.filter(k => k.id !== id));
  };

  const copyKey = (key: Key) => {
    navigator.clipboard.writeText(key.key_value);
    setCopiedId(key.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const svcName = (id: string | null) => services.find(s => s.id === id)?.name ?? 'Unassigned';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-1 w-fit">
        <TabButton label="Keys" active={sub === 'keys'} onClick={() => setSub('keys')} />
        <TabButton label="Analytics" active={sub === 'analytics'} onClick={() => setSub('analytics')} />
      </div>
      {sub === 'analytics' ? (
        <OracleKeysAnalytics keys={keys} services={services} />
      ) : (
      <>
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 h-3.5 w-3.5" />
          <input value={search} onChange={e => setSearch(e.target.value)} className="w-full h-9 rounded-md border border-white/10 bg-white/[0.02] pl-8 text-sm text-white placeholder:text-white/30 outline-none" placeholder="Search by name or key…" />
        </div>
        <button onClick={() => setShowNew(true)} className="h-9 px-4 rounded-full bg-white text-black text-sm font-medium hover:bg-white/90 flex items-center gap-2 whitespace-nowrap">
          <Plus className="h-4 w-4" /> Generate
        </button>
      </div>

      {showNew && (
        <Card className="p-5 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <select value={newService} onChange={e => setNewService(e.target.value)} style={{ colorScheme: 'dark' }} className="h-9 rounded-md border border-white/10 bg-[#1a1a1a] px-3 text-sm text-white outline-none">
              <option value="">No service</option>
              {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <input value={bulkCount} onChange={e => setBulkCount(e.target.value)} type="number" min="1" max="100" placeholder="How many keys?" className="h-9 rounded-md border border-white/10 bg-white/[0.02] px-3 text-sm text-white placeholder:text-white/30 outline-none" />
          </div>
          <input value={newNote} onChange={e => setNewNote(e.target.value)} placeholder="Note (optional)" className="w-full h-9 rounded-md border border-white/10 bg-white/[0.02] px-3 text-sm text-white placeholder:text-white/30 outline-none" />
          <input value={newHwid} onChange={e => setNewHwid(e.target.value)} placeholder="HWID lock (optional)" className="w-full h-9 rounded-md border border-white/10 bg-white/[0.02] px-3 text-sm text-white placeholder:text-white/30 outline-none" />
          <div className="flex gap-2">
            <button onClick={createKeys} className="h-9 px-4 rounded-full bg-white text-black text-sm font-medium hover:bg-white/90">Generate</button>
            <button onClick={() => setShowNew(false)} className="h-9 px-4 rounded-full border border-white/10 text-sm text-white/60 hover:text-white">Cancel</button>
          </div>
        </Card>
      )}

      <Card>
        <div className="divide-y divide-white/[0.05]">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="px-4 sm:px-6 py-4 animate-pulse space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3"><div className="w-3.5 h-3.5 rounded bg-white/[0.06]" /><div className="space-y-1.5"><div className="h-3.5 w-28 rounded bg-white/[0.06]" /><div className="h-3 w-20 rounded bg-white/[0.06]" /></div></div>
                  <div className="flex gap-2"><div className="h-7 w-12 rounded bg-white/[0.06]" /><div className="h-7 w-16 rounded bg-white/[0.06]" /></div>
                </div>
                <div className="h-9 rounded-lg bg-white/[0.03]" />
              </div>
            ))
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-sm text-white/40">No keys found. Click "Generate" to create some.</div>
          ) : (
            filtered.map(k => (
              <div key={k.id} className="px-4 sm:px-6 py-4 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className={`h-2 w-2 rounded-full shrink-0 ${k.status === 'active' ? 'bg-green-400' : 'bg-red-400'}`} />
                    <div>
                      <p className="text-sm font-medium text-white">{k.note || 'Untitled key'}</p>
                      <p className="text-xs text-white/40">{svcName(k.service_id)} · {k.uses} uses</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => toggleKeyStatus(k)} title={k.status === 'active' ? 'Revoke' : 'Activate'} className="h-7 px-3 rounded-full text-xs font-medium bg-white/[0.06] text-white/70 hover:bg-white/10 flex items-center gap-1">
                      {k.status === 'active' ? <PowerOff className="h-3 w-3" /> : <Power className="h-3 w-3" />}
                      {k.status === 'active' ? 'Revoke' : 'Activate'}
                    </button>
                    <button onClick={() => deleteKey(k.id)} title="Delete" className="p-1.5 rounded hover:bg-red-500/10 text-white/50 hover:text-red-400 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <code className="flex-1 h-9 rounded-lg bg-white/[0.03] px-3 flex items-center text-sm font-mono text-white/70 overflow-x-auto">
                    {k.key_value}
                  </code>
                  <button onClick={() => copyKey(k)} className="h-9 w-9 rounded-lg bg-white/[0.06] hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors shrink-0">
                    {copiedId === k.id ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
                {k.hwid && <p className="text-xs text-white/30">HWID: <code className="font-mono">{k.hwid}</code></p>}
              </div>
            ))
          )}
        </div>
      </Card>
      </>
      )}
    </div>
  );
}

function OracleKeysAnalytics({ keys, services }: { keys: Key[]; services: Service[] }) {
  const activeKeys = keys.filter(k => k.status === 'active').length;
  const revokedKeys = keys.filter(k => k.status !== 'active').length;
  const totalUses = keys.reduce((a, k) => a + (k.uses ?? 0), 0);
  const keysByService = services.map(s => ({ name: s.name, count: keys.filter(k => k.service_id === s.id).length }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total keys', value: keys.length },
          { label: 'Active', value: activeKeys },
          { label: 'Revoked', value: revokedKeys },
          { label: 'Total uses', value: totalUses },
        ].map(s => (
          <Card key={s.label} className="p-5">
            <p className="text-xs text-white/40">{s.label}</p>
            <p className="mt-2 text-2xl font-semibold text-white">{s.value}</p>
          </Card>
        ))}
      </div>
      <Card className="p-6">
        <p className="text-sm font-medium text-white">Keys by service</p>
        <div className="mt-4 space-y-3">
          {keysByService.length === 0 ? (
            <p className="text-sm text-white/40">No services yet.</p>
          ) : keysByService.map(s => (
            <div key={s.name}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-white/70">{s.name}</span>
                <span className="text-xs text-white/40">{s.count} keys</span>
              </div>
              <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
                <div className="h-full rounded-full bg-white/20" style={{ width: `${keys.length > 0 ? (s.count / keys.length) * 100 : 0}%` }} />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

type Provider = {
  name: 'Linkvertise' | 'Work.ink' | 'LootLabs' | 'Earnpaste';
  desc: string;
  docs: string;
  linkLabel: string;
  linkPlaceholder: string;
  linkType: 'url' | 'id';
  setupSteps: string[];
};

const MONETIZATION_PROVIDERS: Provider[] = [
  {
    name: 'Earnpaste',
    desc: 'Monetize your gate links with paste-based ads',
    docs: 'https://earnpaste.com/',
    linkLabel: 'Earnpaste URL',
    linkPlaceholder: 'https://earnpaste.com/your-paste',
    linkType: 'url',
    setupSteps: [
      'Log in to earnpaste.com and go to your dashboard.',
      'Copy your API key from Settings → API Keys.',
      'Paste it in the field above and choose your timer.',
    ],
  },
  {
    name: 'Linkvertise',
    desc: 'Monetize links with interstitial ad pages',
    docs: 'https://linkvertise.com/',
    linkLabel: 'Linkvertise URL',
    linkPlaceholder: 'https://linkvertise.com/your-link',
    linkType: 'url',
    setupSteps: [
      'Log in to linkvertise.com and create a new link.',
      'Copy the full Linkvertise URL from your dashboard.',
      'Paste it in the field above.',
    ],
  },
  {
    name: 'Work.ink',
    desc: 'Monetize links with shortener-based ads',
    docs: 'https://work.ink/',
    linkLabel: 'Work.ink URL',
    linkPlaceholder: 'https://work.ink/your-link',
    linkType: 'url',
    setupSteps: [
      'Log in to work.ink and create a new shortened link.',
      'Copy the full Work.ink URL from your dashboard.',
      'Paste it in the field above.',
    ],
  },
  {
    name: 'LootLabs',
    desc: 'Monetize links with rewarded ad checkpoints',
    docs: 'https://lootlabs.gg/',
    linkLabel: 'LootLabs URL',
    linkPlaceholder: 'https://lootlabs.gg/your-link',
    linkType: 'url',
    setupSteps: [
      'Log in to lootlabs.gg and create a new link.',
      'Copy the full LootLabs URL from your dashboard.',
      'Paste it in the field above.',
    ],
  },
];

type ProviderName = (typeof MONETIZATION_PROVIDERS)[number]['name'];

const PROVIDER_BADGE: Record<ProviderName, { gradient: string; label: string }> = {
  'Linkvertise': { gradient: 'linear-gradient(135deg, #2D7FF9, #1A5FB4)', label: 'LV' },
  'Work.ink':    { gradient: 'linear-gradient(135deg, #0EA5E9, #0284C7)', label: 'W' },
  'LootLabs':    { gradient: 'linear-gradient(135deg, #10B981, #059669)', label: 'LL' },
  'Earnpaste':   { gradient: 'linear-gradient(135deg, #F59E0B, #D97706)', label: 'EP' },
};

function ProviderLogo({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' }) {
  const dim = size === 'sm' ? 'h-9 w-9' : 'size-10';
  const localSrc =
    name === 'Linkvertise'
      ? '/logos/linkvertise.svg'
      : name === 'Work.ink'
        ? '/logos/workink.png'
        : name === 'LootLabs'
          ? '/logos/lootlabs.svg'
          : null;

  if (localSrc) {
    return (
      <div className={`${dim} rounded-lg overflow-hidden bg-white/[0.06] flex items-center justify-center shrink-0`}>
        <img src={localSrc} alt={name} className="h-full w-full object-contain p-1.5" />
      </div>
    );
  }

  const cfg = (PROVIDER_BADGE as Record<string, { gradient: string; label: string }>)[name];
  if (!cfg) return <div className={`${dim} rounded-lg bg-white/[0.06] flex items-center justify-center shrink-0`}><Link2 className="h-5 w-5 text-white/50" /></div>;
  return (
    <div className={`${dim} rounded-lg flex items-center justify-center shrink-0`} style={{ background: cfg.gradient }}>
      <span className="font-bold text-white text-sm tracking-tight">{cfg.label}</span>
    </div>
  );
}

function OracleMonetization() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const [intRes, svcRes] = await Promise.all([
      supabase.from('integrations').select('*').order('created_at', { ascending: false }),
      supabase.from('services').select('*'),
    ]);
    setIntegrations((intRes.data as Integration[]) ?? []);
    setServices((svcRes.data as Service[]) ?? []);
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  const svcName = (id: string | null) => services.find(s => s.id === id)?.name ?? 'No service';

  const removeIntegration = async (id: string) => {
    await supabase.from('integrations').delete().eq('id', id);
    setIntegrations(prev => prev.filter(i => i.id !== id));
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Monetization</h2>
          <p className="text-sm text-white/40 mt-0.5">Connect monetization providers to earn from your scripts</p>
        </div>
        <button
          onClick={() => setShowNew(true)}
          className="h-9 px-4 rounded-full bg-white text-black text-sm font-medium hover:bg-white/90 transition-colors flex items-center gap-2 whitespace-nowrap"
        >
          <Plus className="h-4 w-4" /> New Integration
        </button>
      </div>

      {integrations.length === 0 && !loading ? (
        <Card className="p-12 text-center">
          <div className="mx-auto h-14 w-14 rounded-2xl bg-white/[0.04] flex items-center justify-center mb-4">
            <Link2 className="h-7 w-7 text-white/30" />
          </div>
          <p className="text-sm font-medium text-white">No integrations yet</p>
          <p className="text-xs text-white/40 mt-1 mb-4">Connect a monetization provider to start earning from your scripts.</p>
          <button
            onClick={() => setShowNew(true)}
            className="h-9 px-4 rounded-full bg-white text-black text-sm font-medium hover:bg-white/90 transition-colors inline-flex items-center gap-2"
          >
            <Plus className="h-4 w-4" /> New Integration
          </button>
        </Card>
      ) : (
        <Card>
          <div className="px-6 py-4 border-b border-white/[0.07] flex items-center justify-between">
            <h3 className="text-sm font-medium text-white">Active integrations</h3>
            <span className="text-sm text-white/40">{integrations.length} connected</span>
          </div>
          <div className="p-6 flex flex-col gap-3">
            {loading ? (
              Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="rounded-xl bg-white/[0.02] animate-pulse flex items-center justify-between p-4 md:p-6">
                  <div className="flex items-center gap-4"><div className="size-10 rounded-lg bg-white/[0.06]" /><div className="space-y-1.5"><div className="h-3.5 w-28 rounded bg-white/[0.06]" /><div className="h-3 w-20 rounded bg-white/[0.06]" /></div></div>
                  <div className="flex gap-2"><div className="h-8 w-14 rounded-full bg-white/[0.06]" /><div className="h-8 w-16 rounded-full bg-white/[0.06]" /></div>
                </div>
              ))
            ) : (
              integrations.map(i => {
                const prov = MONETIZATION_PROVIDERS.find(p => p.name === i.provider);
                return (
                  <div key={i.id} className="rounded-xl bg-white/[0.02] flex items-center justify-between p-4 md:p-6">
                    <div className="flex items-center gap-4">
                      {prov ? <ProviderLogo name={prov.name} /> : <div className="size-10 rounded-lg bg-white/[0.04] flex items-center justify-center"><Link2 className="h-5 w-5 text-white/50" /></div>}
                      <div>
                        <p className="text-sm font-medium text-white">{i.display_name || i.provider}</p>
                        <p className="text-xs text-white/40">{i.provider} · {svcName(i.service_id)} · {i.timer}s timer · Connected {timeAgo(i.created_at)}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <span className="h-8 px-3 rounded-full bg-green-500/10 text-green-400 text-xs font-medium flex items-center">Active</span>
                      <button onClick={() => removeIntegration(i.id)} className="h-8 px-3 rounded-full bg-white/[0.06] text-white/60 text-xs hover:bg-red-500/10 hover:text-red-400 transition-colors">Remove</button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Card>
      )}

      {showNew && <NewIntegrationModal onClose={() => { setShowNew(false); load(); }} />}
    </div>
  );
}

function NewIntegrationModal({ onClose }: { onClose: () => void }) {
  const [provider, setProvider] = useState<ProviderName | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [serviceId, setServiceId] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [earnpasteUrl, setEarnpasteUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [timer, setTimer] = useState('15');
  const [keyExpiry, setKeyExpiry] = useState('Never');
  const [checkpoints, setCheckpoints] = useState('None');
  const [hwidLock, setHwidLock] = useState('Disabled');
  const [uidLock, setUidLock] = useState('Disabled');
  const [showSetup, setShowSetup] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [selectedScripts, setSelectedScripts] = useState<string[]>([]);
  const [scripts, setScripts] = useState<Script[]>([]);

  const selected = MONETIZATION_PROVIDERS.find(p => p.name === provider);

  useEffect(() => {
    (async () => {
      const [svcRes, scriptRes] = await Promise.all([
        supabase.from('services').select('*').order('name'),
        supabase.from('scripts').select('*').order('name'),
      ]);
      setServices((svcRes.data as Service[]) ?? []);
      setScripts((scriptRes.data as Script[]) ?? []);
    })();
  }, []);

  const save = async () => {
    if (!provider) return;
    setError('');
    if (!serviceId) { setError('You must select a service to connect this provider to'); return; }
    const isEarnpaste = provider === 'Earnpaste';
    if (isEarnpaste) {
      if (!earnpasteUrl.trim() && !apiKey.trim()) { setError('Provide either an Earnpaste URL or an API key'); return; }
    } else {
      if (!earnpasteUrl.trim()) { setError('A link URL is required for this provider'); return; }
    }
    if (scripts.length > 0 && selectedScripts.length === 0) {
      setError('Select at least one script to bind this provider to.');
      return;
    }

    setSaving(true);
    const { data: integrationData, error: insErr } = await supabase.from('integrations').insert({
      provider,
      link_url: earnpasteUrl.trim(),
      api_key: apiKey.trim(),
      timer: parseInt(timer) || 15,
      display_name: displayName || provider,
      key_expiry_days: keyExpiry === 'Never' ? 0 : parseInt(keyExpiry) || 0,
      checkpoints_config: checkpoints,
      hwid_lock: hwidLock !== 'Disabled',
      uid_lock: uidLock !== 'Disabled',
      service_id: serviceId,
      status: 'connected',
    }).select('*').maybeSingle();
    setSaving(false);
    if (insErr || !integrationData) { setError(insErr?.message || 'Could not create integration'); return; }

    if (selectedScripts.length > 0) {
      const rows = selectedScripts.map(scriptId => ({
        integration_id: integrationData.id,
        script_id: scriptId,
      }));
      const { error: linkErr } = await supabase.from('integration_script_links').insert(rows);
      if (linkErr) {
        setError(linkErr.message);
        return;
      }
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-3xl max-h-[95vh] overflow-y-auto rounded-2xl border border-white/10 bg-[hsl(0,0%,7%)] shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4 sticky top-0 bg-[hsl(0,0%,7%)] z-10">
          <div>
            <h3 className="text-sm font-semibold text-white">Create Provider</h3>
            <p className="text-xs text-white/40">Connect a monetization provider and bind it to script(s)</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Provider selection */}
          <div>
            <label className="block text-xs font-medium text-white/40 mb-2">Provider</label>
            <div className="space-y-2">
              {MONETIZATION_PROVIDERS.map(p => (
                <button
                  key={p.name}
                  onClick={() => setProvider(p.name)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-colors text-left ${
                    provider === p.name
                      ? 'border-white/25 bg-white/[0.06]'
                      : 'border-white/[0.07] bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04]'
                  }`}
                >
                  <ProviderLogo name={p.name} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">{p.name}</p>
                    <p className="text-xs text-white/40 truncate">{p.desc}</p>
                  </div>
                  <div className={`h-4 w-4 rounded-full border-2 shrink-0 ${provider === p.name ? 'border-white bg-white' : 'border-white/20'}`} />
                </button>
              ))}
            </div>
          </div>

          {selected && (
            <>
              {/* Service */}
              <div>
                <label className="block text-xs font-medium text-white/40 mb-1.5">Service <span className="text-red-400">*</span></label>
                <select
                  value={serviceId}
                  onChange={e => setServiceId(e.target.value)}
                  style={{ colorScheme: 'dark' }}
                  className="w-full h-9 rounded-md border border-white/10 bg-[#1a1a1a] px-3 text-sm text-white outline-none focus:border-white/20"
                >
                  <option value="">Select a service…</option>
                  {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>

              {/* Display name */}
              <div>
                <label className="block text-xs font-medium text-white/40 mb-1.5">Display name</label>
                <input
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  placeholder={selected.name}
                  className="w-full h-9 rounded-md border border-white/10 bg-white/[0.02] px-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/20"
                />
              </div>

              {/* Link URL */}
              <div>
                <label className="block text-xs font-medium text-white/40 mb-1.5">{selected.linkLabel} <span className="text-red-400">*</span></label>
                <input
                  value={earnpasteUrl}
                  onChange={e => setEarnpasteUrl(e.target.value)}
                  placeholder={selected.linkPlaceholder}
                  className="w-full h-9 rounded-md border border-white/10 bg-white/[0.02] px-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/20"
                />
                <p className="text-xs text-white/30 mt-1">Paste your full {selected.name} link URL here.</p>
              </div>

              {/* OR divider + API key — only for Earnpaste */}
              {provider === 'Earnpaste' && (<>
                <div className="flex items-center gap-3 py-1">
                  <div className="h-px flex-1 bg-white/10" />
                  <span className="text-xs font-medium text-white/30 uppercase tracking-wider">OR</span>
                  <div className="h-px flex-1 bg-white/10" />
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/40 mb-1.5">Your API Key</label>
                  <input
                    value={apiKey}
                    onChange={e => setApiKey(e.target.value)}
                    placeholder="ep_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                    className="w-full h-9 rounded-md border border-white/10 bg-white/[0.02] px-3 font-mono text-sm text-white placeholder:text-white/30 outline-none focus:border-white/20"
                  />
                  <p className="text-xs text-white/30 mt-1">
                    Find your API key in the Earnpaste dashboard under Settings → API Keys.
                  </p>
                </div>
              </>)}

              {/* Timer dropdown */}
              <div>
                <label className="block text-xs font-medium text-white/40 mb-1.5">Timer</label>
                <select
                  value={timer}
                  onChange={e => setTimer(e.target.value)}
                  style={{ colorScheme: 'dark' }}
                  className="w-full h-9 rounded-md border border-white/10 bg-[#1a1a1a] px-3 text-sm text-white outline-none focus:border-white/20"
                >
                  <option value="2">2 seconds</option>
                  <option value="5">5 seconds</option>
                  <option value="8">8 seconds</option>
                  <option value="15">15 seconds</option>
                </select>
                <p className="text-xs text-white/30 mt-1">How long users wait on the ad page before they can continue.</p>
              </div>

              {/* Checkpoints dropdown */}
              <div>
                <label className="block text-xs font-medium text-white/40 mb-1.5">Checkpoints</label>
                <select
                  value={checkpoints}
                  onChange={e => setCheckpoints(e.target.value)}
                  style={{ colorScheme: 'dark' }}
                  className="w-full h-9 rounded-md border border-white/10 bg-[#1a1a1a] px-3 text-sm text-white outline-none focus:border-white/20"
                >
                  <option value="None">None</option>
                  <option value="1">1 checkpoint</option>
                  <option value="2">2 checkpoints</option>
                  <option value="3">3 checkpoints</option>
                  <option value="5">5 checkpoints</option>
                </select>
                <p className="text-xs text-white/30 mt-1">How many gateway steps users must complete before their key activates.</p>
              </div>

              {/* Key expiry dropdown */}
              <div>
                <label className="block text-xs font-medium text-white/40 mb-1.5">Key expiry</label>
                <select
                  value={keyExpiry}
                  onChange={e => setKeyExpiry(e.target.value)}
                  style={{ colorScheme: 'dark' }}
                  className="w-full h-9 rounded-md border border-white/10 bg-[#1a1a1a] px-3 text-sm text-white outline-none focus:border-white/20"
                >
                  <option value="Never">Never</option>
                  <option value="1">1 day</option>
                  <option value="3">3 days</option>
                  <option value="7">7 days</option>
                  <option value="14">14 days</option>
                  <option value="30">30 days</option>
                  <option value="90">90 days</option>
                </select>
              </div>

              {/* Script selection */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm font-semibold text-white">Attach scripts</p>
                    <p className="text-xs text-white/40">Choose which script(s) this provider should apply to.</p>
                  </div>
                  <span className="text-xs text-white/40">{selectedScripts.length} selected</span>
                </div>
                <div className="grid gap-3">
                  {scripts.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.02] p-4 text-sm text-white/40">
                      No scripts available. Create at least one script first, then bind a provider to it here.
                    </div>
                  ) : (
                    scripts.map(script => (
                      <button
                        key={script.id}
                        type="button"
                        onClick={() => {
                          setSelectedScripts(prev =>
                            prev.includes(script.id)
                              ? prev.filter(id => id !== script.id)
                              : [...prev, script.id],
                          );
                        }}
                        className={`w-full rounded-xl border px-3 py-3 text-left transition-colors ${
                          selectedScripts.includes(script.id)
                            ? 'border-white/30 bg-white/[0.08]'
                            : 'border-white/[0.07] bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.05]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-sm font-medium text-white">{script.name}</p>
                            <p className="text-xs text-white/40 truncate">{script.id}</p>
                          </div>
                          <div className={`h-5 w-5 rounded-full border ${selectedScripts.includes(script.id) ? 'border-white bg-white' : 'border-white/20'}`} />
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* HWID & UID lock dropdowns */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-white/40 mb-1.5">HWID lock</label>
                  <select
                    value={hwidLock}
                    onChange={e => setHwidLock(e.target.value)}
                    style={{ colorScheme: 'dark' }}
                    className="w-full h-9 rounded-md border border-white/10 bg-[#1a1a1a] px-3 text-sm text-white outline-none focus:border-white/20"
                  >
                    <option value="Disabled">Disabled</option>
                    <option value="Enabled">Enabled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/40 mb-1.5">UID lock</label>
                  <select
                    value={uidLock}
                    onChange={e => setUidLock(e.target.value)}
                    style={{ colorScheme: 'dark' }}
                    className="w-full h-9 rounded-md border border-white/10 bg-[#1a1a1a] px-3 text-sm text-white outline-none focus:border-white/20"
                  >
                    <option value="Disabled">Disabled</option>
                    <option value="Enabled">Enabled</option>
                  </select>
                </div>
              </div>

              {/* Collapsible setup guide */}
              <div className="rounded-xl border border-white/[0.07] overflow-hidden">
                <button
                  onClick={() => setShowSetup(s => !s)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
                >
                  <span className="text-xs font-medium text-white/60 flex items-center gap-2">
                    <BookOpen className="h-3.5 w-3.5" /> Setup guide
                  </span>
                  <ChevronDown className={`h-4 w-4 text-white/40 transition-transform ${showSetup ? '' : '-rotate-90'}`} />
                </button>
                {showSetup && (
                  <div className="px-4 py-3 space-y-2">
                    {selected.setupSteps.map((step, i) => (
                      <div key={i} className="flex gap-3">
                        <span className="text-xs font-semibold text-white/30 shrink-0">{i + 1}.</span>
                        <p className="text-xs text-white/50">{step}</p>
                      </div>
                    ))}
                    <a href={selected.docs} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-brand-300 hover:text-brand-200 mt-2">
                      Open {selected.name} docs <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                  <XCircle className="h-4 w-4 text-red-400 shrink-0" />
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              <div className="flex gap-2 pt-1">
                <button
                  onClick={save}
                  disabled={saving}
                  className="h-9 px-4 rounded-full bg-white text-black text-sm font-medium hover:bg-white/90 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                  {saving ? 'Saving...' : 'Create Provider'}
                </button>
                <button onClick={onClose} className="h-9 px-4 rounded-full border border-white/10 text-sm text-white/60 hover:text-white">
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function OracleLog() {
  const [scripts, setScripts] = useState<Script[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('scripts').select('*').order('updated_at', { ascending: false });
    setScripts((data as Script[]) ?? []);
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  const copy = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-white">Script Log</h2>
        <p className="text-sm text-white/40 mt-0.5">All scripts with their original unobfuscated source</p>
      </div>

      {loading ? (
        <Card className="p-6 space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-xl bg-white/[0.02] animate-pulse p-4">
              <div className="flex items-center gap-3">
                <div className="h-4 w-4 rounded bg-white/[0.06]" />
                <div className="h-4 w-40 rounded bg-white/[0.06]" />
              </div>
            </div>
          ))}
        </Card>
      ) : scripts.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="mx-auto h-14 w-14 rounded-2xl bg-white/[0.04] flex items-center justify-center mb-4">
            <FileCode2 className="h-7 w-7 text-white/30" />
          </div>
          <p className="text-sm font-medium text-white">No scripts logged</p>
          <p className="text-xs text-white/40 mt-1">Scripts you upload will appear here with their original source.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {scripts.map(s => {
            const isOpen = expanded === s.id;
            return (
              <Card key={s.id} className="overflow-hidden">
                <button
                  onClick={() => setExpanded(isOpen ? null : s.id)}
                  className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-white/[0.02] transition-colors"
                >
                  <ChevronDown className={`h-4 w-4 text-white/40 transition-transform shrink-0 ${isOpen ? '' : '-rotate-90'}`} />
                  <FileCode2 className="h-4 w-4 text-white/40 shrink-0" />
                  <span className="text-sm font-medium text-white flex-1 truncate">{s.name}</span>
                  <span className="text-xs text-white/30 shrink-0">{s.executions} executions</span>
                  <span className={`text-xs shrink-0 ${s.status === 'active' ? 'text-green-400' : 'text-white/40'}`}>{s.status}</span>
                </button>
                {isOpen && (
                  <div className="border-t border-white/[0.07]">
                    <div className="flex items-center justify-between px-5 py-2.5 bg-white/[0.01]">
                      <span className="text-xs text-white/40">Original source · {s.content.length} chars</span>
                      <button
                        onClick={() => copy(s.id, s.content)}
                        className="text-xs text-white/50 hover:text-white flex items-center gap-1.5 transition-colors"
                      >
                        {copied === s.id ? <><Check className="h-3 w-3 text-green-400" /> Copied</> : <><Copy className="h-3 w-3" /> Copy</>}
                      </button>
                    </div>
                    <pre className="px-5 py-4 text-sm font-mono text-white/70 bg-white/[0.02] overflow-x-auto whitespace-pre-wrap max-h-96">{s.content}</pre>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

function OracleGuide() {
  const steps = [
    { n: 1, title: 'Create a service', desc: 'Set up an Oracle service to group your scripts and keys together.' },
    { n: 2, title: 'Add scripts', desc: 'Upload or link the Luau scripts you want to protect under your service.' },
    { n: 3, title: 'Generate keys', desc: 'Create keys manually, in bulk, or through a gateway with HWID locking.' },
    { n: 4, title: 'Distribute', desc: 'Share your gate link or keys with users. Monitor executions in real time.' },
  ];
  return (
    <div className="space-y-4">
      {steps.map(s => (
        <Card key={s.n} className="p-5 flex items-start gap-4">
          <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-sm font-semibold text-white shrink-0">{s.n}</div>
          <div><p className="text-sm font-medium text-white">{s.title}</p><p className="text-sm text-white/40 mt-1">{s.desc}</p></div>
        </Card>
      ))}
    </div>
  );
}

/* ============ Genesis ============ */

function GenesisView() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [processing, setProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [readingClipboard, setReadingClipboard] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'nochange' | 'error'>('idle');
  const [detectedFormat, setDetectedFormat] = useState('');

  // Auto-read clipboard on mount
  useEffect(() => {
    (async () => {
      setReadingClipboard(true);
      try {
        const text = await navigator.clipboard.readText();
        if (text && text.trim()) {
          setInput(text);
          detectFormat(text);
        }
      } catch {
        // Clipboard API may not be available without user gesture
      }
      setReadingClipboard(false);
    })();
  }, []);

  const detectFormat = (text: string) => {
    if (text.includes('Obfuscated by Yousoteria') || text.includes('Obfuscated by Soteria')) setDetectedFormat('Soteria');
    else if (text.includes('wearedevs.net/obfuscator') || /return\s*\(\s*function\s*\(\.\.\.\)\s*local\s+\w+\s*=\s*\{/.test(text)) setDetectedFormat('WeAreDevs');
    else if (/\\[0-9]{1,3}/.test(text) && text.includes('string.char')) setDetectedFormat('String-encoded');
    else if (/\\x[0-9a-fA-F]{2}/.test(text)) setDetectedFormat('Hex-escaped');
    else setDetectedFormat('Unknown');
  };

  const readClipboard = async () => {
    setReadingClipboard(true);
    try {
      const text = await navigator.clipboard.readText();
      if (text && text.trim()) {
        setInput(text);
        detectFormat(text);
        setStatus('idle');
      }
    } catch {
      // Clipboard read may fail if permissions are denied
    }
    setReadingClipboard(false);
  };

  const deobfuscate = () => {
    if (!input.trim()) return;
    setProcessing(true);
    setStatus('idle');
    setTimeout(() => {
      try {
        const result = unobfuscateExternal(input);
        if (result && result.trim() && result !== input) {
          setOutput(result);
          setStatus('success');
        } else if (result === input) {
          setOutput(result);
          setStatus('nochange');
        } else {
          setStatus('error');
        }
      } catch {
        setStatus('error');
      }
      setProcessing(false);
    }, 300);
  };

  const copyOutput = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5 mb-2">
      <PageTitle>Genesis</PageTitle>

      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="h-5 w-5 text-white/50" />
          <div>
            <p className="text-sm font-medium text-white">Unobfuscate any script</p>
            <p className="text-xs text-white/40 mt-0.5">Paste obfuscated Luau code or read from your clipboard. Supports WeAreDevs and other common obfuscators.</p>
          </div>
        </div>

        {detectedFormat && input && (
          <div className="mb-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06]">
            <span className="text-xs text-white/40">Detected format:</span>
            <span className="text-xs font-medium text-brand-300">{detectedFormat}</span>
          </div>
        )}

        <div className="flex gap-2 mb-3">
          <button
            onClick={readClipboard}
            disabled={readingClipboard}
            className="h-9 px-4 rounded-full bg-white/10 text-white text-sm font-medium hover:bg-white/20 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {readingClipboard ? <Loader2 className="h-4 w-4 animate-spin" /> : <ClipboardPaste className="h-4 w-4" />}
            {readingClipboard ? 'Reading...' : 'Read clipboard'}
          </button>
          <button
            onClick={deobfuscate}
            disabled={!input.trim() || processing}
            className="h-9 px-4 rounded-full bg-white text-black text-sm font-medium hover:bg-white/90 transition-colors flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Unlock className="h-4 w-4" />}
            {processing ? 'Unobfuscating...' : 'Unobfuscate'}
          </button>
        </div>

        <textarea
          value={input}
          onChange={e => { setInput(e.target.value); if (e.target.value) detectFormat(e.target.value); else setDetectedFormat(''); }}
          placeholder="-- Paste obfuscated Luau here or click 'Read clipboard'..."
          rows={8}
          className="w-full rounded-md border border-white/10 bg-white/[0.02] px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/20 font-mono"
        />
      </Card>

      {output && (
        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <p className="text-sm font-medium text-white">Unobfuscated output · {output.length} chars</p>
              {status === 'success' && <span className="px-2 py-0.5 rounded-full text-xs bg-green-500/10 text-green-400">Decoded</span>}
              {status === 'nochange' && <span className="px-2 py-0.5 rounded-full text-xs bg-yellow-500/10 text-yellow-400">No change</span>}
              {status === 'error' && <span className="px-2 py-0.5 rounded-full text-xs bg-red-500/10 text-red-400">Failed</span>}
            </div>
            <button
              onClick={copyOutput}
              className="text-xs text-white/50 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              {copied ? <><Check className="h-3 w-3 text-green-400" /> Copied</> : <><Copy className="h-3 w-3" /> Copy</>}
            </button>
          </div>
          <pre className="text-sm font-mono text-white/70 bg-white/[0.02] rounded-lg p-4 overflow-x-auto whitespace-pre-wrap max-h-96">{output}</pre>
        </Card>
      )}
    </div>
  );
}

/* ============ Settings ============ */

function SettingsView() {
  const { user } = useAuth();
  const [username, setUsername] = useState(user?.email?.split('@')[0] ?? 'username');
  const [email, setEmail] = useState(user?.email ?? 'user@example.com');
  const [saved, setSaved] = useState(false);

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-5 mb-2">
      <PageTitle>Settings</PageTitle>
      <Card className="p-6 space-y-5">
        <div>
          <label className="block text-xs font-medium text-white/40 mb-1.5">Username</label>
          <input value={username} onChange={e => setUsername(e.target.value)} className="w-full h-9 rounded-md border border-white/10 bg-white/[0.02] px-3 text-sm text-white outline-none focus:border-white/20" />
        </div>
        <div>
          <label className="block text-xs font-medium text-white/40 mb-1.5">Email</label>
          <input value={email} onChange={e => setEmail(e.target.value)} className="w-full h-9 rounded-md border border-white/10 bg-white/[0.02] px-3 text-sm text-white outline-none focus:border-white/20" />
        </div>
        <div>
          <label className="block text-xs font-medium text-white/40 mb-1.5">API Key</label>
          <div className="flex gap-2">
            <input readOnly className="flex-1 h-9 rounded-md border border-white/10 bg-white/[0.02] px-3 text-sm font-mono text-white/60 outline-none" defaultValue="sotr_••••••••••••••••" />
            <button className="h-9 px-4 rounded-md border border-white/10 bg-white/[0.02] text-sm text-white/60 hover:text-white flex items-center gap-1.5">
              <RefreshCw className="h-3.5 w-3.5" /> Regenerate
            </button>
          </div>
        </div>
        <button onClick={save} className="h-9 px-4 rounded-full bg-white text-black text-sm font-medium hover:bg-white/90 transition-colors flex items-center gap-2">
          {saved ? <><Check className="h-4 w-4" /> Saved!</> : 'Save changes'}
        </button>
      </Card>
    </div>
  );
}
