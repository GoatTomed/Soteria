import { Link } from 'react-router-dom';
import { Logo } from '@/components/Logo';

const cols = [
  {
    title: 'Products',
    links: [
      { label: 'Features', to: '/#features' },
      { label: 'Pricing', to: '/#pricing' },
      { label: 'Oracle', to: '/#oracle' },
      { label: 'Genesis', to: '/#genesis' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Runtimes', to: '/runtimes' },
      { label: 'Blog', to: '/blog' },
      { label: 'Blog', to: '/blog' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Terms of Service', to: '/legal/terms' },
      { label: 'Privacy Policy', to: '/legal/privacy' },
      { label: 'Cookie Policy', to: '/legal/cookies' },
      { label: 'Acceptable Use', to: '/legal/acceptable-use' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative mt-24 border-t border-white/[0.06] bg-ink-950/60">
      <div className="container-page py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link to="/" className="inline-flex items-center gap-2.5">
              <Logo className="h-8 w-8" />
              <span className="text-lg font-semibold tracking-tight text-white">Soteria</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-300">
              Secure your Luau scripts and accelerate your developer experience.
            </p>
          </div>
          {cols.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-white">{col.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="link-quiet text-sm">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-6 sm:flex-row">
          <p className="text-xs text-ink-400">© 2026 Soteria. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link to="/#features" className="link-quiet text-xs">Features</Link>
            <Link to="/#demo" className="link-quiet text-xs">Demo</Link>
            <Link to="/blog" className="link-quiet text-xs">Blog</Link>
            <Link to="/#pricing" className="link-quiet text-xs">Pricing</Link>
            <Link to="/login" className="link-quiet text-xs">Login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
