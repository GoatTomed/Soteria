import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  SlidersHorizontal,
  Eye,
  Sparkles,
  Settings,
  Menu,
  Bell,
  LogOut,
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { LogoWord } from '@/components/Logo';

const overviewItems = [
  { key: 'obfuscate', label: 'Obfuscate', icon: ShieldCheck },
  { key: 'utilities', label: 'Utilities', icon: SlidersHorizontal },
];

const subdivisionItems = [
  { key: 'oracle', label: 'Oracle', icon: Eye },
  { key: 'genesis', label: 'Genesis', icon: Sparkles },
];

type SidebarProps = {
  activeTab: string;
  onTabChange: (tab: string) => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
};

export function DashboardSidebar({ activeTab, onTabChange, mobileOpen, onMobileClose }: SidebarProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const email = user?.email ?? 'user';
  const initial = email.charAt(0).toUpperCase();
  const sidebarContent = (
    <div className="flex h-full w-full flex-col" style={{ background: 'hsl(0,0%,4%)' }}>
      <div className="p-3 pb-1">
        <Link to="/" className="inline-flex items-center pl-1 focus:outline-none" onClick={onMobileClose}>
          <LogoWord />
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-4">
        <div>
          <p className="px-2 py-1.5 text-xs font-medium text-white/40">Overview</p>
          <ul className="space-y-0.5">
            {overviewItems.map(({ key, label, icon: Icon }) => (
              <SidebarItem
                key={key}
                label={label}
                icon={Icon}
                active={activeTab === key}
                onClick={() => { onTabChange(key); onMobileClose(); }}
              />
            ))}
          </ul>
        </div>

        <div>
          <div className="px-2 py-1.5 flex items-center gap-2">
            <p className="text-xs font-medium text-white/40">Subdivisions</p>
          </div>
          <ul className="space-y-0.5">
            {subdivisionItems.map(({ key, label, icon: Icon }) => (
              <SidebarItem
                key={key}
                label={label}
                icon={Icon}
                active={activeTab === key}
                onClick={() => { onTabChange(key); onMobileClose(); }}
              />
            ))}
          </ul>
        </div>
      </div>

      <div className="p-2 border-t border-white/[0.06]">
        <SidebarItem
          label="Settings"
          icon={Settings}
          active={activeTab === 'settings'}
          onClick={() => { onTabChange('settings'); onMobileClose(); }}
        />
        <button
          onClick={() => { signOut(); navigate('/login'); }}
          className="w-full flex items-center gap-2 rounded-md px-2 py-2.5 hover:bg-white/[0.05] transition-colors mt-0.5"
        >
          <span className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-semibold text-white shrink-0">
            {initial}
          </span>
          <div className="flex-1 text-left min-w-0">
            <p className="text-sm font-medium text-white truncate">{email}</p>
            <p className="text-xs text-white/40 truncate">Click to sign out</p>
          </div>
          <LogOut className="h-4 w-4 text-white/30 shrink-0" />
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden md:flex w-[280px] shrink-0 flex-col border-r border-white/[0.07] h-screen sticky top-0 overflow-hidden">
        {sidebarContent}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={onMobileClose} />
          <aside className="relative flex w-[280px] h-full flex-col border-r border-white/[0.07] overflow-hidden">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}

function SidebarItem({
  label,
  icon: Icon,
  active,
  onClick,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <li>
      <button
        onClick={onClick}
        className={`flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm transition-colors ${
          active
            ? 'bg-white/[0.06] text-white font-medium'
            : 'text-white/50 hover:bg-white/[0.04] hover:text-white'
        }`}
      >
        <Icon className={`h-4 w-4 shrink-0 ${active ? 'text-white' : ''}`} />
        <span>{label}</span>
      </button>
    </li>
  );
}

export function DashboardHeader({
  breadcrumb,
  onMenuClick,
}: {
  breadcrumb: string;
  onMenuClick: () => void;
}) {
  return (
    <header className="flex h-12 shrink-0 items-center justify-between px-4 gap-2 border-b border-white/[0.07] bg-[hsl(0,0%,5%)]">
      <div className="flex items-center gap-2">
        <button
          onClick={onMenuClick}
          className="inline-flex items-center justify-center h-7 w-7 rounded-md hover:bg-white/[0.06] md:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-4 w-4 text-white" />
        </button>
        <div className="hidden md:block w-px h-4 bg-white/10" />
        <nav aria-label="breadcrumb">
          <span className="text-sm text-white font-normal">{breadcrumb}</span>
        </nav>
      </div>
      <div className="flex items-center gap-2">
        <button className="relative flex items-center justify-center h-9 w-9 rounded-full hover:bg-white/[0.06] transition-colors">
          <Bell className="h-[17px] w-[17px] text-white/50" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-white" />
        </button>
      </div>
    </header>
  );
}
