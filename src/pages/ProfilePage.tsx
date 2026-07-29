import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, ShieldCheck, Settings, Info } from 'lucide-react';
import { useAuth } from '@/lib/auth';

const tabs = [
  { key: 'info', label: 'Info', icon: Info },
];

export function ProfilePage() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const email = user?.email ?? 'unknown@user.dev';
  const initial = email.charAt(0).toUpperCase();
  const owner = email.split('@')[0].toLowerCase();
  const gateUrl = `${window.location.origin}/gate/${owner}`;

  const tab = 'info';
  const TabIcon = tabs.find((item) => item.key === tab)?.icon ?? Info;

  const profileRows = useMemo(
    () => [
      { label: 'Email', value: email },
      { label: 'Username', value: owner },
      { label: 'Domain', value: email.split('@')[1] ?? 'n/a' },
    ],
    [email, owner]
  );

  return (
    <div className="flex min-h-screen bg-[hsl(0,0%,5%)] text-white">
      <aside className="hidden w-[280px] shrink-0 flex-col border-r border-white/[0.08] bg-[hsl(0,0%,7%)] p-4 lg:flex">
        <div className="mb-8 flex items-center gap-3 rounded-3xl border border-white/[0.06] bg-white/5 p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-lg font-semibold text-white">
            {initial}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">{email}</p>
            <p className="truncate text-xs text-white/50">Profile</p>
          </div>
        </div>

        <div className="space-y-2">
          {tabs.map((item) => (
            <button
              key={item.key}
              type="button"
              className="flex w-full items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/5 px-4 py-3 text-left text-sm text-white transition hover:border-cyan-400/40 hover:bg-white/10"
            >
              <item.icon className="h-4 w-4 text-white/70" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        <div className="mt-auto pt-6">
          <button
            type="button"
            onClick={async () => {
              await signOut();
              navigate('/login');
            }}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/[0.06] bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-200 transition hover:bg-rose-500/15"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </div>
      </aside>

      <main className="flex flex-1 flex-col">
        <div className="border-b border-white/[0.06] px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-white/5 p-3 text-sky-300">
              <User className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-white/80">Profile</p>
              <h1 className="text-2xl font-semibold text-white">Account details</h1>
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-white/[0.06] bg-white/5 p-6">
            <div className="flex items-center gap-3">
              <TabIcon className="h-5 w-5 text-cyan-300" />
              <div>
                <p className="text-sm font-medium text-white">Info</p>
                <p className="text-sm text-white/50">Your account details and profile information.</p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-white/[0.06] bg-[rgba(255,255,255,0.04)] p-6 text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-white/10 text-3xl font-semibold text-white">
                  {initial}
                </div>
                <p className="mt-4 text-sm font-medium text-white">Profile icon</p>
                <p className="mt-2 text-xs text-white/50">Your user avatar and identity marker.</p>
              </div>

              <div className="rounded-3xl border border-white/[0.06] bg-[rgba(255,255,255,0.04)] p-4">
                <p className="text-xs uppercase tracking-[0.25em] text-white/40">Gate URL</p>
                <p className="mt-3 break-words text-sm text-cyan-200">{gateUrl}</p>
                <p className="mt-2 text-xs text-white/50">Share this URL with your guests.</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/[0.06] bg-white/5 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-white">Session</p>
                <p className="text-sm text-white/50">Manage your login and logout state.</p>
              </div>
              <button
                type="button"
                onClick={async () => {
                  await signOut();
                  navigate('/login');
                }}
                className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15"
              >
                <LogOut className="h-4 w-4" />
                Log out
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
