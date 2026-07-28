import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Settings, Copy, Check, FileCode2, Bell, Menu, LogOut, GitBranch, Clock } from 'lucide-react';
import { supabase, type File } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { LogoWord } from '@/components/Logo';

export function UnobfuscatedPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const load = useCallback(async () => {
    setLoading(true);
    // Fetch all files, we'll group by name to show version history
    const { data } = await supabase
      .from('files')
      .select('*')
      .eq('obfuscated', true)
      .order('updated_at', { ascending: false });
    const rows = (data as File[]) ?? [];
    setFiles(rows);
    if (rows.length > 0) setActiveId(rows[0].id);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const active = files.find(f => f.id === activeId) ?? null;
  const displayContent = active?.unobfuscated_content || active?.content || '';

  // Group files by name to show version history
  const fileGroups = files.reduce<Record<string, File[]>>((acc, f) => {
    if (!acc[f.name]) acc[f.name] = [];
    acc[f.name].push(f);
    return acc;
  }, {});
  const activeGroup = active ? (fileGroups[active.name] ?? [active]) : [];
  const activeVersion = active ? (active as File & { version?: number; parent_file_id?: string | null }) : null;

  const copy = () => {
    if (!displayContent) return;
    navigator.clipboard.writeText(displayContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const email = user?.email ?? '';
  const initial = email.charAt(0).toUpperCase();

  const sidebarContent = (
    <div className="flex h-full w-full flex-col" style={{ background: 'hsl(0,0%,4%)' }}>
      <div className="p-3 pb-1">
        <Link to="/" className="inline-flex items-center pl-1 focus:outline-none" onClick={() => setMobileOpen(false)}>
          <LogoWord />
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        <p className="px-2 py-1.5 text-xs font-medium text-white/40">Unobfuscated Scripts</p>
        {loading ? (
          <div className="space-y-1 px-1">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-9 rounded-md bg-white/[0.04] animate-pulse" />
            ))}
          </div>
        ) : files.length === 0 ? (
          <p className="px-2 py-2 text-xs text-white/30">No obfuscated scripts yet.</p>
        ) : (
          <ul className="space-y-0.5">
            {files.map(f => {
              const group = fileGroups[f.name] ?? [];
              const hasVersions = group.length > 1;
              return (
                <li key={f.id}>
                  <button
                    onClick={() => { setActiveId(f.id); setMobileOpen(false); }}
                    className={`flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm transition-colors text-left ${
                      activeId === f.id
                        ? 'bg-white/[0.06] text-white font-medium'
                        : 'text-white/50 hover:bg-white/[0.04] hover:text-white'
                    }`}
                  >
                    <FileCode2 className="h-4 w-4 shrink-0 opacity-60" />
                    <span className="truncate flex-1">"{f.name}"</span>
                    {hasVersions && (
                      <span className="text-[10px] text-white/30 shrink-0 flex items-center gap-0.5">
                        <GitBranch className="h-3 w-3" />
                        {group.length}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="p-2 border-t border-white/[0.06]">
        <Link
          to="/"
          onClick={() => setMobileOpen(false)}
          className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm text-white/50 hover:bg-white/[0.04] hover:text-white transition-colors"
        >
          <Settings className="h-4 w-4 shrink-0" />
          <span>Settings</span>
        </Link>
        <button
          onClick={() => { signOut(); navigate('/login'); }}
          className="w-full flex items-center gap-2 rounded-md px-2 py-2.5 hover:bg-white/[0.05] transition-colors mt-0.5"
        >
          <span className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-semibold text-white shrink-0">
            {initial}
          </span>
          <div className="flex-1 text-left min-w-0">
            <p className="text-sm font-medium text-white truncate">{email}</p>
            <p className="text-xs text-white/40">user</p>
          </div>
          <LogOut className="h-4 w-4 text-white/30 shrink-0" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen w-full bg-[hsl(0,0%,5%)]">
      <aside className="hidden md:flex w-[280px] shrink-0 flex-col border-r border-white/[0.07] h-screen sticky top-0 overflow-hidden">
        {sidebarContent}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <aside className="relative flex w-[280px] h-full flex-col border-r border-white/[0.07] overflow-hidden">
            {sidebarContent}
          </aside>
        </div>
      )}

      <main className="flex flex-1 flex-col min-h-screen min-w-0">
        <header className="flex h-12 shrink-0 items-center justify-between px-4 gap-2 border-b border-white/[0.07] bg-[hsl(0,0%,5%)]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileOpen(true)}
              className="inline-flex items-center justify-center h-7 w-7 rounded-md hover:bg-white/[0.06] md:hidden"
            >
              <Menu className="h-4 w-4 text-white" />
            </button>
            <div className="hidden md:block w-px h-4 bg-white/10" />
            <span className="text-sm text-white font-normal">
              {active ? active.name : 'Unobfuscated Scripts'}
            </span>
            {activeGroup.length > 1 && (
              <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] bg-white/[0.06] text-white/50 flex items-center gap-1">
                <GitBranch className="h-3 w-3" />
                {activeGroup.length} versions
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button className="relative flex items-center justify-center h-9 w-9 rounded-full hover:bg-white/[0.06] transition-colors">
              <Bell className="h-[17px] w-[17px] text-white/50" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-white" />
            </button>
          </div>
        </header>

        {/* Version selector bar */}
        {active && activeGroup.length > 1 && (
          <div className="flex items-center gap-2 px-4 py-2 border-b border-white/[0.07] bg-white/[0.01] overflow-x-auto">
            <span className="text-xs text-white/40 shrink-0 flex items-center gap-1">
              <Clock className="h-3 w-3" /> Versions:
            </span>
            {activeGroup.map((v, idx) => {
              const versionNum = (v as File & { version?: number }).version ?? (activeGroup.length - idx);
              const isActive = v.id === activeId;
              return (
                <button
                  key={v.id}
                  onClick={() => setActiveId(v.id)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-white/10 text-white'
                      : 'text-white/40 hover:text-white/60 hover:bg-white/[0.04]'
                  }`}
                >
                  v{versionNum}
                  {idx === 0 && <span className="ml-1 text-[10px] text-green-400/60">latest</span>}
                  {idx === activeGroup.length - 1 && idx !== 0 && <span className="ml-1 text-[10px] text-white/30">original</span>}
                </button>
              );
            })}
          </div>
        )}

        <div className="flex flex-1 flex-col relative min-h-0">
          {active ? (
            <>
              <div className="absolute top-3 right-4 z-10">
                <button
                  onClick={copy}
                  className="flex items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white/60 hover:text-white hover:bg-white/[0.07] transition-colors"
                >
                  {copied ? (
                    <><Check className="h-3.5 w-3.5 text-green-400" /> Copied</>
                  ) : (
                    <><Copy className="h-3.5 w-3.5" /> Copy</>
                  )}
                </button>
              </div>

              <pre className="flex-1 overflow-auto p-6 pt-12 font-mono text-[13px] leading-relaxed text-white/80 scrollbar-thin whitespace-pre-wrap break-words">
                <code>{displayContent || '-- No original source stored for this script.'}</code>
              </pre>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center">
              <div className="text-center">
                <FileCode2 className="mx-auto h-10 w-10 text-white/10 mb-3" />
                <p className="text-sm text-white/30">Select a script from the sidebar</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
