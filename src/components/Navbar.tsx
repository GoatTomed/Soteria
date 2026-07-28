import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { LogoWord } from '@/components/Logo';

const productsLinks = [
  { label: 'Features', to: '/#features' },
  { label: 'Oracle', to: '/#oracle' },
  { label: 'Genesis', to: '/#genesis' },
  { label: 'Unobfuscated', to: '/unobfuscated' },
];

const resourcesLinks = [
  { label: 'Runtimes', to: '/runtimes' },
  { label: 'Blog', to: '/blog' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setProductsOpen(false);
    setResourcesOpen(false);
  }, [location.pathname, location.hash]);

  const headerClass = `fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
    scrolled
      ? 'border-b border-white/[0.06] bg-ink-950/80 backdrop-blur-xl'
      : 'border-b border-transparent bg-transparent'
  }`;

  return (
    <header className={headerClass}>
      <nav className="container-page flex h-16 items-center justify-between">
        <Link to="/" className="shrink-0">
          <LogoWord />
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          <Dropdown label="Products" items={productsLinks} open={productsOpen} setOpen={setProductsOpen} />
          <Dropdown label="Resources" items={resourcesLinks} open={resourcesOpen} setOpen={setResourcesOpen} />
          <NavItem to="/#pricing">Pricing</NavItem>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link to="/login" className="btn-ghost">
            Login
          </Link>
          <Link to="/dashboard" className="btn-primary">
            Get Started
          </Link>
        </div>

        <button
          className="grid h-10 w-10 place-items-center rounded-lg text-ink-200 hover:bg-white/5 md:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="border-t border-white/[0.06] bg-ink-950/95 backdrop-blur-xl md:hidden">
          <div className="container-page flex flex-col gap-1 py-4">
            <MobileGroup label="Products" items={productsLinks} />
            <MobileGroup label="Resources" items={resourcesLinks} />
            <MobileLink to="/#pricing">Pricing</MobileLink>
            <div className="mt-3 flex flex-col gap-2">
              <Link to="/login" className="btn-outline w-full">
                Login
              </Link>
              <Link to="/dashboard" className="btn-primary w-full">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function NavItem({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:text-white ${
          isActive ? 'text-white' : 'text-ink-200'
        }`
      }
    >
      {children}
    </NavLink>
  );
}

function Dropdown({
  label,
  items,
  open,
  setOpen,
}: {
  label: string;
  items: { label: string; to: string }[];
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  return (
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-ink-200 transition-colors hover:text-white"
        onClick={() => setOpen(!open)}
      >
        {label}
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute left-0 top-full pt-1">
          <div className="card min-w-[180px] p-1.5">
            {items.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="block rounded-lg px-3 py-2 text-sm text-ink-200 hover:bg-white/5 hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MobileGroup({ label, items }: { label: string; items: { label: string; to: string }[] }) {
  return (
    <div className="py-1">
      <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wider text-ink-400">{label}</p>
      {items.map((item) => (
        <MobileLink key={item.label} to={item.to}>
          {item.label}
        </MobileLink>
      ))}
    </div>
  );
}

function MobileLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link to={to} className="block rounded-lg px-3 py-2.5 text-sm text-ink-200 hover:bg-white/5 hover:text-white">
      {children}
    </Link>
  );
}
