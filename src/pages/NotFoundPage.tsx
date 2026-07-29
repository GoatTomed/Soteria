import { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ArrowRight } from 'lucide-react';

function AnimatedBlob({ style }: { style: React.CSSProperties }) {
  return (
    <div
      className="pointer-events-none absolute rounded-full bg-white/5 shadow-[0_0_120px_rgba(56,189,248,0.18)]"
      style={style}
    />
  );
}

function InteractiveCard({ path }: { path: string }) {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/85 px-8 py-10 shadow-[0_40px_120px_rgba(15,23,42,0.45)] backdrop-blur-xl">
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-sky-500/10 to-transparent" />
      <div className="relative">
        <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-slate-500">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-cyan-400" />
          route analyzer
        </div>
        <p className="text-sm text-slate-400">
          No matching route was found for <span className="text-white">{path}</span>. Try returning to the dashboard or explore unobfuscated scripts.
        </p>

        <div className="mt-8 rounded-3xl border border-white/5 bg-slate-900/90 p-5 text-left text-sm text-slate-300 shadow-inner shadow-slate-950/40">
          <div className="mb-3 text-xs uppercase tracking-[0.3em] text-slate-500">trace log</div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-400">
              <span className="font-mono text-slate-400">$</span>
              <span>trace --route <span className="text-white">{path}</span></span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <span className="font-mono text-slate-400">></span>
              <span>Scanning route registry...</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <span className="font-mono text-rose-400">!</span>
              <span>No matching handler registered</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <span className="font-mono text-slate-400">></span>
              <span>found 0 routes · status 404</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function NotFoundPage() {
  const location = useLocation();
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  const handleMouseMove = (event: React.MouseEvent<HTMLElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    setPointer({ x, y });
  };

  const layers = useMemo(
    () => [
      { size: 260, opacity: 0.18, factor: 18, bg: 'bg-cyan-500/15' },
      { size: 180, opacity: 0.1, factor: 12, bg: 'bg-fuchsia-500/15' },
      { size: 120, opacity: 0.08, factor: 8, bg: 'bg-blue-400/15' },
    ],
    []
  );

  return (
    <section
      className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-slate-950 text-white"
      onMouseMove={handleMouseMove}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.2),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.18),_transparent_24%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.92),rgba(15,23,42,0.95))]" />
      <div className="pointer-events-none absolute inset-0 bg-grid-faint opacity-20" />

      {layers.map((layer, index) => (
        <AnimatedBlob
          key={index}
          style={{
            width: layer.size,
            height: layer.size,
            opacity: layer.opacity,
            borderRadius: '9999px',
            transform: `translate3d(${pointer.x * layer.factor}px, ${pointer.y * layer.factor}px, 0)`,
            top: `${20 + index * 18}%`,
            left: `${10 + index * 25}%`,
            background: index === 0 ? 'rgba(56,189,248,0.14)' : index === 1 ? 'rgba(168,85,247,0.12)' : 'rgba(56,189,248,0.08)',
          }}
        />
      ))}

      <div className="relative z-10 container-page mx-auto flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-20 sm:px-6 lg:px-8">
        <div className="relative max-w-5xl">
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/5 to-transparent" />

          <div className="mb-10 text-center">
            <p className="text-sm uppercase tracking-[0.35em] text-slate-500">404 - page not found</p>
            <h1 className="mt-6 text-[clamp(4rem,12vw,9rem)] font-black leading-none text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400">
              404
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-slate-300 sm:text-lg">
              The page <span className="font-semibold text-white">{location.pathname}</span> could not be found. The route ended in a dead zone.
            </p>
          </div>

          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
            <div className="space-y-6">
              <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-10 shadow-[0_30px_90px_rgba(15,23,42,0.4)] backdrop-blur-xl">
                <p className="text-sm uppercase tracking-[0.35em] text-cyan-300/80">Lost packet</p>
                <h2 className="mt-4 text-3xl font-semibold text-white">Try navigating back or scanning another path.</h2>
                <p className="mt-4 text-slate-400">
                  This page was not found by the router. Hover and move your cursor to keep an eye on the network trace.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link to="/" className="inline-flex items-center gap-2 rounded-full bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400">
                    <Home className="h-4 w-4" />
                    Back home
                  </Link>
                  <Link to="/unobfuscated" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-cyan-400 hover:text-cyan-300">
                    <ArrowRight className="h-4 w-4" />
                    View unobfuscated scripts
                  </Link>
                </div>
              </div>

              <InteractiveCard path={location.pathname} />
            </div>

            <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-slate-900/80 p-10 shadow-[0_40px_120px_rgba(15,23,42,0.5)]">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-400 opacity-70" />
              <div className="relative">
                <div className="mb-6 text-sm uppercase tracking-[0.35em] text-slate-500">Interactive diagnostics</div>
                <div className="grid gap-4">
                  <div className="rounded-3xl bg-slate-950/85 p-6 text-slate-300 shadow-inner shadow-slate-950/40">
                    <p className="text-sm uppercase tracking-[0.3em] text-slate-500">status</p>
                    <p className="mt-3 text-4xl font-black text-white">404</p>
                    <p className="mt-2 text-slate-400">Route not found</p>
                  </div>
                  <div className="rounded-3xl bg-slate-950/85 p-6 text-slate-300 shadow-inner shadow-slate-950/40">
                    <p className="text-sm uppercase tracking-[0.3em] text-slate-500">next step</p>
                    <p className="mt-3 text-lg font-semibold text-white">Return to the dashboard or explore scripts directly.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
