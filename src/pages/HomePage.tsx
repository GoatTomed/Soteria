import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Check,
  ChevronDown,
  Minus,
  Plus,
  ShieldCheck,
  Sparkles,
  Terminal,
  Zap,
} from 'lucide-react';
import { obfuscatorFeatures, oracleFeatures, genesisFeatures } from '@/data/features';
import { plans, comparisonRows, faqs } from '@/data/pricing';
import { useCountUp, formatCompact } from '@/lib/format';

export function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <Oracle />
      <Genesis />
      <Stats />
      <Pricing />
      <FAQ />
      <FinalCTA />
    </>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-grid-faint [background-size:44px_44px] opacity-40" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[600px] bg-radial-fade" />
      <div className="container-page relative py-24 sm:py-32 lg:py-40">
        <div className="mx-auto max-w-3xl text-center">
          <span className="chip mb-6 animate-fade-up">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-pulse-soft rounded-full bg-success" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
            </span>
            150K+ active users this month
          </span>
          <h1 className="animate-fade-up text-balance text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl" style={{ animationDelay: '60ms' }}>
            Obfuscate, Protect,
            <br />
            <span className="bg-gradient-to-r from-brand-300 via-brand-400 to-accent-400 bg-clip-text text-transparent">
              Earn while you
            </span>{' '}
            ship.
          </h1>
          <p className="mx-auto mt-7 max-w-xl text-balance text-lg leading-relaxed text-ink-300 animate-fade-up" style={{ animationDelay: '120ms' }}>
            Advanced obfuscation that makes reverse engineering nearly impossible — built for Luau, fast as light, and trusted by 150,000+ developers.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 animate-fade-up sm:flex-row" style={{ animationDelay: '180ms' }}>
            <Link to="/dashboard" className="btn-primary group text-base">
              Ship now
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
        <HeroCodePreview />
      </div>
    </section>
  );
}

function HeroCodePreview() {
  return (
    <div className="mx-auto mt-16 max-w-3xl animate-fade-up" style={{ animationDelay: '260ms' }}>
      <div className="card overflow-hidden">
        <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-danger/80" />
          <span className="h-3 w-3 rounded-full bg-warning/80" />
          <span className="h-3 w-3 rounded-full bg-success/80" />
          <span className="ml-3 font-mono text-xs text-ink-400">array.luau</span>
          <span className="ml-auto flex items-center gap-1.5 text-xs text-ink-400">
            <ShieldCheck className="h-3.5 w-3.5 text-success" /> obfuscated
          </span>
        </div>
        <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-relaxed scrollbar-thin">
          <code>
            <span className="text-ink-400">-- SOTR_ENC_STR decrypts at runtime</span>
            {'\n'}
            <span className="text-brand-300">local</span> <span className="text-accent-400">t0</span>: <span className="text-ink-200">{`{ number }`}</span> = <span className="text-ink-200">{`{ 1, 2, 3, 4, 5, }`}</span>
            {'\n'}
            <span className="text-brand-300">local</span> <span className="text-accent-400">n0</span>: <span className="text-ink-200">number</span> = <span className="text-warning">50</span>
            {'\n'}
            <span className="text-brand-300">for</span> <span className="text-ink-200">_, t0_v</span> <span className="text-brand-300">in</span> <span className="text-accent-400">ipairs</span>(<span className="text-accent-400">t0</span>) <span className="text-brand-300">do</span>
            {'\n  '}
            <span className="text-accent-400">n0</span> <span className="text-ink-200">+=</span> <span className="text-accent-400">t0_v</span>
            {'\n'}
            <span className="text-brand-300">end</span>
          </code>
        </pre>
      </div>
    </div>
  );
}

function Features() {
  return (
    <section id="features" className="container-page py-20 sm:py-28">
      <SectionHeading
        eyebrow="Obfuscator"
        title="Everything you need to protect your code"
        subtitle="Advanced obfuscation that makes reverse engineering nearly impossible."
      />
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {obfuscatorFeatures.map((f, i) => (
          <FeatureCard key={f.title} icon={f.icon} title={f.title} description={f.description} delay={i * 40} />
        ))}
      </div>
    </section>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
  delay = 0,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => e.isIntersecting && setVisible(true),
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={`card group p-6 transition-all duration-500 hover:border-white/15 hover:bg-ink-850/60 ${visible ? 'animate-fade-up' : 'opacity-0'}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="mb-4 inline-flex rounded-xl bg-brand-500/10 p-2.5 ring-1 ring-brand-500/20 transition-colors group-hover:bg-brand-500/15">
        <Icon className="h-5 w-5 text-brand-300" />
      </div>
      <h3 className="text-base font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-300">{description}</p>
    </div>
  );
}

function Oracle() {
  return (
    <section id="oracle" className="relative overflow-hidden py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 bg-radial-fade opacity-50" />
      <div className="container-page relative">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="section-eyebrow">Oracle</span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Whitelist service.{' '}
              <span className="text-brand-300">Zero bypasses.</span>
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-ink-300">
              Key systems, HWID locks, tamper detection. All handled, nothing to build yourself.
            </p>
            <div className="mt-7">
              <Link to="/dashboard" className="btn-primary group">
                Get Oracle access
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {oracleFeatures.map((f) => (
              <div key={f.title} className="card p-5">
                <div className="mb-3 inline-flex rounded-lg bg-accent-500/10 p-2 ring-1 ring-accent-500/20">
                  <f.icon className="h-4 w-4 text-accent-400" />
                </div>
                <h3 className="text-sm font-semibold text-white">{f.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-300">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Genesis() {
  const tabs = [
    { name: 'array.luau', code: 'local t0: { number } = { 1, 2, 3, 4, 5, }\nlocal n0: number = 50\nfor _, t0_v in ipairs(t0) do\n  n0 += t0_v\nend' },
    { name: 'game-load.luau', code: 'local function onLoad()\n  local player = game.Players.LocalPlayer\n  print("Welcome, " .. player.Name)\nend\ngame.Loaded:Connect(onLoad)' },
    { name: 'team-check.luau', code: 'local function isEnemy(target)\n  local me = game.Players.LocalPlayer\n  return target.Team ~= me.Team\nend' },
    { name: 'character.luau', code: 'local char = script.Parent\nlocal hum = char:WaitForChild("Humanoid")\nhum.WalkSpeed = 24' },
    { name: 'function.luau', code: 'local function fib(n: number): number\n  if n < 2 then return n end\n  return fib(n - 1) + fib(n - 2)\nend' },
  ];
  const [active, setActive] = useState(0);

  return (
    <section id="genesis" className="container-page py-20 sm:py-28">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div className="order-2 lg:order-1">
          <div className="card overflow-hidden">
            <div className="flex items-center gap-1 overflow-x-auto border-b border-white/[0.06] px-3 py-2 scrollbar-thin">
              {tabs.map((t, i) => (
                <button
                  key={t.name}
                  onClick={() => setActive(i)}
                  className={`flex items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-1.5 font-mono text-xs transition-colors ${
                    active === i ? 'bg-white/8 text-white' : 'text-ink-400 hover:text-ink-200'
                  }`}
                >
                  <Terminal className="h-3 w-3" />
                  {t.name}
                </button>
              ))}
            </div>
            <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-relaxed text-ink-200 scrollbar-thin">
              <code>{tabs[active].code}</code>
            </pre>
            <div className="border-t border-white/[0.06] px-4 py-2.5">
              <p className="text-xs text-ink-400">* Examples picked for readability</p>
            </div>
          </div>
        </div>
        <div className="order-1 lg:order-2">
          <span className="section-eyebrow">Genesis</span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Luau decompiler.{' '}
            <span className="text-accent-400">Readable output.</span>
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-ink-300">
            Bytecode in, source code out. Built fast with custom algorithms for clean variable names.
          </p>
          <div className="mt-6 space-y-3">
            {genesisFeatures.map((f) => (
              <div key={f.title} className="flex items-start gap-3">
                <div className="mt-0.5 inline-flex rounded-lg bg-accent-500/10 p-2 ring-1 ring-accent-500/20">
                  <f.icon className="h-4 w-4 text-accent-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">{f.title}</h3>
                  <p className="mt-0.5 text-sm leading-relaxed text-ink-300">{f.description}</p>
                </div>
              </div>
            ))}
          </div>
          <Link to="/dashboard" className="btn-outline mt-7 group">
            Try Genesis
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function Stats() {
  const stats = [
    { label: 'Files Protected', value: 4_200_000, suffix: '' },
    { label: 'Executions', value: 1_800_000_000, suffix: '+' },
    { label: 'Developers', value: 150_000, suffix: '+' },
    { label: 'Deobfuscations*', value: 0, suffix: '' },
  ];
  const extra = [
    { label: 'Revenue Generated*', value: 0, prefix: '$' },
    { label: 'Decompilations', value: 0, suffix: '' },
  ];
  const ref = useRef<HTMLDivElement>(null);
  const [start, setStart] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => e.isIntersecting && setStart(true), { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="container-page py-16">
      <div ref={ref} className="card grid grid-cols-2 gap-px overflow-hidden bg-white/[0.04] sm:grid-cols-4 lg:grid-cols-6">
        {[...stats, ...extra].map((s) => (
          <StatCell key={s.label} {...s} start={start} />
        ))}
      </div>
    </section>
  );
}

function StatCell({
  label,
  value,
  suffix = '',
  prefix = '',
  start,
}: {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  start: boolean;
}) {
  const n = useCountUp(value, { start });
  return (
    <div className="bg-ink-900/80 p-6 text-center">
      <p className="text-2xl font-bold text-white sm:text-3xl">
        {prefix}
        {formatCompact(n)}
        {suffix}
      </p>
      <p className="mt-1 text-xs font-medium uppercase tracking-wider text-ink-400">{label}</p>
    </div>
  );
}

function Pricing() {
  const [yearly, setYearly] = useState(false);
  return (
    <section id="pricing" className="container-page py-20 sm:py-28">
      <SectionHeading
        eyebrow="Pricing"
        title="Simple, transparent pricing"
        subtitle="Pay only for what you use or go with a membership and save big."
      />
      <div className="mt-7 flex items-center justify-center gap-4">
        <span className={`text-sm font-medium ${!yearly ? 'text-white' : 'text-ink-400'}`}>Monthly</span>
        <button
          onClick={() => setYearly((v) => !v)}
          className="relative h-6 w-12 rounded-full border border-white/10 bg-white/5 transition-colors"
          aria-label="Toggle billing period"
        >
          <span
            className={`absolute top-0.5 h-[18px] w-[18px] rounded-full bg-brand-400 shadow-glow transition-transform ${
              yearly ? 'translate-x-6' : 'translate-x-0.5'
            }`}
          />
        </button>
        <span className={`text-sm font-medium ${yearly ? 'text-white' : 'text-ink-400'}`}>
          Yearly <span className="text-success">Save up to 40%</span>
        </span>
      </div>

      <div className="mt-12 grid gap-4 lg:grid-cols-4">
        {plans.map((plan) => (
          <PlanCard key={plan.name} plan={plan} yearly={yearly} />
        ))}
      </div>

      <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-white/[0.06] bg-ink-900/60 p-6 sm:flex-row">
        <div>
          <h3 className="text-lg font-semibold text-white">Enterprise</h3>
          <p className="mt-1 text-sm text-ink-300">
            Custom plans with up to 1,000,000 obfuscations, 50 MB files, and 1M keys.
          </p>
        </div>
        <a href="mailto:support@soteria.rip" className="btn-outline shrink-0">
          Contact Us
        </a>
      </div>

      <ComparisonTable />
    </section>
  );
}

function PlanCard({ plan, yearly }: { plan: (typeof plans)[number]; yearly: boolean }) {
  const highlight = plan.popular || plan.bestValue;
  const priceNum = parseFloat(plan.price.replace('$', ''));
  const displayPrice = yearly && priceNum > 1 ? `$${(priceNum * 12 * 0.6).toFixed(2)}` : plan.price;
  const displayUnit = yearly && priceNum > 1 ? '/year' : plan.unit;

  return (
    <div
      className={`card relative flex flex-col p-6 ${
        highlight ? 'border-brand-500/30 ring-1 ring-brand-500/20' : ''
      }`}
    >
      {plan.popular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-500 px-3 py-1 text-xs font-semibold text-white shadow-glow">
          Most Popular
        </span>
      )}
      {plan.bestValue && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent-500 px-3 py-1 text-xs font-semibold text-ink-950 shadow-glow-accent">
          Best Value
        </span>
      )}
      <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
      <p className="mt-1.5 text-sm text-ink-300 min-h-[40px]">{plan.tagline}</p>
      <div className="mt-5">
        <span className="text-3xl font-bold text-white">{displayPrice}</span>
        <span className="text-sm text-ink-400">{displayUnit}</span>
      </div>
      <p className="mt-1.5 text-xs text-ink-400">{plan.perUnit}</p>
      {plan.popular && (
        <p className="mt-1.5 text-xs font-medium text-brand-300">7× more obfuscations than Plus</p>
      )}
      {plan.bestValue && (
        <p className="mt-1.5 text-xs font-medium text-accent-400">3× more obfuscations than Pro</p>
      )}
      <Link
        to="/dashboard"
        className={`mt-6 ${highlight ? 'btn-primary' : 'btn-outline'}`}
      >
        {plan.cta}
      </Link>
    </div>
  );
}

function ComparisonTable() {
  const [cols] = useState(['Starter', 'Plus', 'Pro', 'Max']);
  const groups: { category: string; rows: (typeof comparisonRows)[number][] }[] = [];
  for (const row of comparisonRows) {
    let g = groups.find((x) => x.category === row.category);
    if (!g) {
      g = { category: row.category, rows: [] };
      groups.push(g);
    }
    g.rows.push(row);
  }

  return (
    <div className="mt-12 overflow-hidden">
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-white/[0.06]">
              <th className="py-4 text-left text-xs font-semibold uppercase tracking-wider text-ink-400">
                Starter
              </th>
              <th className="py-4 text-left text-xs font-semibold uppercase tracking-wider text-ink-400">
                Plus
              </th>
              <th className="py-4 text-left text-xs font-semibold uppercase tracking-wider text-ink-400">
                Pro
              </th>
              <th className="py-4 text-left text-xs font-semibold uppercase tracking-wider text-ink-400">
                Max
              </th>
            </tr>
          </thead>
          {groups.map((group) => (
            <tbody key={group.category}>
              <tr className="border-b border-white/[0.04]">
                <td colSpan={4} className="py-3 text-xs font-semibold uppercase tracking-wider text-brand-300">
                  {group.category}
                </td>
              </tr>
              {group.rows.map((row) => (
                <tr key={row.label} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                  <td className="py-3 pr-4 text-ink-200">{row.label}</td>
                  {cols.map((c) => {
                    const val =
                      c === 'Starter' ? row.starter : c === 'Plus' ? row.plus : c === 'Pro' ? row.pro : row.max;
                    return (
                      <td key={c} className="py-3 pr-4">
                        {typeof val === 'boolean' ? (
                          val ? (
                            <Check className="h-4 w-4 text-success" />
                          ) : (
                            <Minus className="h-4 w-4 text-ink-600" />
                          )
                        ) : (
                          <span className="text-ink-200">{val}</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          ))}
        </table>
      </div>
      <div className="mt-6 flex flex-col items-center gap-2 text-center">
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-xs text-ink-400">
          <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-success" /> Secure checkout</span>
          <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-success" /> Instant activation</span>
          <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-success" /> 24/7 support</span>
        </div>
        <p className="text-xs text-ink-400">Payments are processed securely. All sales are final and non-refundable.</p>
      </div>
    </div>
  );
}

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="container-page py-20 sm:py-28">
      <SectionHeading
        eyebrow="FAQ"
        title="Frequently asked questions"
        subtitle="Everything you need to know before getting started."
      />
      <div className="mx-auto mt-10 max-w-3xl space-y-3">
        {faqs.map((faq, i) => (
          <div key={i} className="card overflow-hidden">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="flex w-full items-center justify-between gap-4 p-5 text-left"
            >
              <span className="text-sm font-medium text-white">{faq.q}</span>
              {open === i ? (
                <Minus className="h-4 w-4 shrink-0 text-ink-400" />
              ) : (
                <Plus className="h-4 w-4 shrink-0 text-ink-400" />
              )}
            </button>
            <div
              className={`grid transition-all duration-300 ${
                open === i ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-5 text-sm leading-relaxed text-ink-300">{faq.a}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="container-page py-20 sm:py-28">
      <div className="card relative overflow-hidden p-10 text-center sm:p-16">
        <div className="pointer-events-none absolute inset-0 bg-radial-fade" />
        <div className="relative">
          <Sparkles className="mx-auto h-8 w-8 text-brand-300" />
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Code protected.
            <br />
            <span className="bg-gradient-to-r from-brand-300 to-accent-400 bg-clip-text text-transparent">
              Available now.
            </span>
          </h2>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/dashboard" className="btn-primary group text-base">
              Get started
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <span className="section-eyebrow">{eyebrow}</span>
      <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">{title}</h2>
      <p className="mt-4 text-lg text-ink-300">{subtitle}</p>
    </div>
  );
}
