import { useState } from 'react';
import { DashboardSidebar, DashboardHeader } from '@/components/DashboardSidebar';

type DashboardShellProps = {
  breadcrumb: string;
  activeTab: string;
  onTabChange: (tab: string) => void;
  children: React.ReactNode;
};

export function DashboardShell({
  breadcrumb,
  activeTab,
  onTabChange,
  children,
}: DashboardShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-[hsl(0,0%,5%)]">
      <DashboardSidebar
        activeTab={activeTab}
        onTabChange={onTabChange}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <main className="relative flex w-full flex-1 flex-col">
        <DashboardHeader breadcrumb={breadcrumb} onMenuClick={() => setMobileOpen(true)} />
        <div className="flex flex-1 flex-col">
          <div className="flex flex-1 flex-col gap-2">
            <div className="w-full max-w-6xl mx-auto flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 md:px-8">
              {children}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export function TabButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
        active
          ? 'bg-white/10 text-white'
          : 'text-white/40 hover:text-white/60'
      }`}
    >
      {label}
    </button>
  );
}

export function PageTitle({ children }: { children: React.ReactNode }) {
  return <h1 className="text-2xl font-semibold text-white">{children}</h1>;
}

export function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-white/[0.07] overflow-hidden ${className}`}>
      {children}
    </div>
  );
}

export function SkeletonRow({ cols = 5 }: { cols?: number }) {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 sm:px-6 py-3">
          <div className="h-3.5 rounded bg-white/[0.06]" style={{ width: `${60 + (i % 3) * 20}%` }} />
        </td>
      ))}
    </tr>
  );
}
