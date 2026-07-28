import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, Terminal, ShieldAlert, Bug, Lock, Cpu } from 'lucide-react';

const GLITCH_CHARS = '!<>-_\\/[]{}—=+*^?#01';

function useGlitchText(text: string, active: boolean, intervalMs = 50): string {
  const [display, setDisplay] = useState(text);
  useEffect(() => {
    if (!active) {
      setDisplay(text);
      return;
    }
    let frame = 0;
    const totalFrames = text.length * 2;
    const id = setInterval(() => {
      if (frame >= totalFrames) {
        setDisplay(text);
        clearInterval(id);
        return;
      }
      const progress = frame / totalFrames;
      const revealCount = Math.floor(progress * text.length);
      let out = '';
      for (let i = 0; i < text.length; i++) {
        if (i < revealCount) {
          out += text[i];
        } else if (text[i] === ' ') {
          out += ' ';
        } else {
          out += GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
        }
      }
      setDisplay(out);
      frame++;
    }, intervalMs);
    return () => clearInterval(id);
  }, [text, active, intervalMs]);
  return display;
}

function Scanline() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-x-0 h-px bg-brand-400/60 animate-scanline" />
      <div className="absolute inset-0 bg-scanlines opacity-[0.04]" />
    </div>
  );
}

function TerminalLine({ prompt, children, delay }: { prompt: string; children: React.ReactNode; delay: number }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(id);
  }, [delay]);
  return (
    <div
      className={`flex items-start gap-2 font-mono text-[13px] leading-relaxed transition-opacity duration-300 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <span className="select-none text-success/70">{prompt}</span>
      <span className="text-ink-300">{children}</span>
    </div>
  );
}

export function NotFoundPage() {
  const [glitching, setGlitching] = useState(true);
  const glitched = useGlitchText('404', glitching, 60);

  useEffect(() => {
    const id = setTimeout(() => setGlitching(false), 2500);
    return () => clearTimeout(id);
  }, []);

  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden">
      {/* Background layers */}
      <div className="pointer-events-none absolute inset-0 bg-grid-faint [background-size:44px_44px] opacity-30" />
      <div className="pointer-events-none absolute inset-0 bg-radial-fade opacity-60" />
      <Scanline />

      {/* Floating warning icons */}
      <div className="pointer-events-none absolute inset-0 select-none">
        <ShieldAlert className="absolute left-[12%] top-[18%] h-10 w-10 text-danger/15 animate-float-slow" />
        <Bug className="absolute right-[14%] top-[22%] h-8 w-8 text-warning/15 animate-float-slower" />
        <Lock className="absolute left-[18%] bottom-[20%] h-9 w-9 text-brand-400/15 animate-float-slow" />
        <Cpu className="absolute right-[16%] bottom-[18%] h-10 w-10 text-accent-400/15 animate-float-slower" />
      </div>

      <div className="container-page relative z-10 py-20">
        <div className="mx-auto max-w-2xl text-center">
          {/* Glitch 404 */}
          <div className="relative inline-block">
            <h1
              className="select-none font-mono text-7xl font-bold tracking-tighter text-white sm:text-8xl lg:text-9xl"
              style={{ textShadow: glitching ? '2px 0 #ef4444, -2px 0 #22d3ee' : 'none' }}
            >
              {glitched}
            </h1>
            {glitching && (
              <h1 className="absolute inset-0 select-none font-mono text-7xl font-bold tracking-tighter text-brand-400/30 sm:text-8xl lg:text-9xl animate-glitch-offset">
                {glitched}
              </h1>
            )}
          </div>

          <div className="mt-2 flex items-center justify-center gap-2">
            <span className="h-2 w-2 animate-pulse-soft rounded-full bg-danger" />
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-danger/80">
              ERR_RESOURCE_NOT_FOUND
            </span>
          </div>

          <h2 className="mt-8 text-2xl font-semibold text-white sm:text-3xl">
            Page not found
          </h2>
          <p className="mx-auto mt-3 max-w-md text-ink-300">
            The page you're looking for doesn't exist or has moved.
          </p>

          {/* Terminal block */}
          <div className="mx-auto mt-10 max-w-lg">
            <div className="card overflow-hidden text-left">
              <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-2.5">
                <span className="h-3 w-3 rounded-full bg-danger/80" />
                <span className="h-3 w-3 rounded-full bg-warning/80" />
                <span className="h-3 w-3 rounded-full bg-success/80" />
                <span className="ml-2 font-mono text-xs text-ink-400">soteria@edge: ~/trace</span>
              </div>
              <div className="space-y-1.5 p-5">
                <TerminalLine prompt="$" delay={200}>
                  <span className="text-warning">trace</span>{' '}
                  <span className="text-ink-200">--route</span>{' '}
                  <span className="text-danger">{window.location.pathname}</span>
                </TerminalLine>
                <TerminalLine prompt=">" delay={500}>
                  Scanning route registry...
                </TerminalLine>
                <TerminalLine prompt=">" delay={800}>
                  <span className="text-danger">FAIL</span> — no matching handler registered
                </TerminalLine>
                <TerminalLine prompt=">" delay={1100}>
                  <span className="text-ink-400">0 routes matched · 1 dead end · status </span>
                  <span className="text-danger">404</span>
                </TerminalLine>
                <TerminalLine prompt="$" delay={1500}>
                  <span className="text-success">_</span>
                  <span className="ml-0.5 inline-block h-4 w-2 translate-y-0.5 animate-cursor-blink bg-brand-400" />
                </TerminalLine>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/" className="btn-primary group">
              <Home className="h-4 w-4" />
              Back home
            </Link>
            <Link to="/unobfuscated" className="btn-outline group">
              <Terminal className="h-4 w-4" />
              View unobfuscated scripts
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
