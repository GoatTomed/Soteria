import { Check, AlertTriangle, X, Cpu } from 'lucide-react';
import { runtimes } from '@/data/runtimes';
import type { RuntimeRow } from '@/data/runtimes';

export function RuntimesPage() {
  return (
    <section className="container-page py-16 sm:py-24">
      <div className="mx-auto max-w-3xl">
        <div className="inline-flex items-center gap-2 text-brand-300">
          <Cpu className="h-5 w-5" />
          <span className="section-eyebrow">Runtimes</span>
        </div>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Supported Runtimes
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-ink-300">
          Execution environments and their support status across Soteria and Oracle.
        </p>
      </div>

      <div className="mx-auto mt-12 max-w-4xl">
        <div className="card overflow-hidden">
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-ink-400">Runtime</th>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-ink-400">Last Checked Version</th>
                  <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wider text-ink-400">Soteria</th>
                  <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wider text-ink-400">Oracle</th>
                </tr>
              </thead>
              <tbody>
                {runtimes.map((r) => (
                  <Row key={r.name} row={r} />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-ink-400">
          <span className="flex items-center gap-1.5"><Badge status="Supported" /> Supported</span>
          <span className="flex items-center gap-1.5"><Badge status="Degraded" /> Degraded</span>
          <span className="flex items-center gap-1.5"><Badge status="Unsupported" /> Unsupported</span>
        </div>
      </div>
    </section>
  );
}

function Row({ row }: { row: RuntimeRow }) {
  return (
    <tr className="border-b border-white/[0.03] hover:bg-white/[0.02]">
      <td className="px-5 py-3.5 font-medium text-white">{row.name}</td>
      <td className="px-5 py-3.5 font-mono text-xs text-ink-300">{row.version}</td>
      <td className="px-5 py-3.5 text-center"><Badge status={row.soteria} /></td>
      <td className="px-5 py-3.5 text-center"><Badge status={row.oracle} /></td>
    </tr>
  );
}

function Badge({ status }: { status: RuntimeRow['soteria'] }) {
  if (status === 'Supported')
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-xs font-medium text-success ring-1 ring-success/20">
        <Check className="h-3 w-3" /> Supported
      </span>
    );
  if (status === 'Degraded')
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-warning/10 px-2.5 py-1 text-xs font-medium text-warning ring-1 ring-warning/20">
        <AlertTriangle className="h-3 w-3" /> Degraded
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-danger/10 px-2.5 py-1 text-xs font-medium text-danger ring-1 ring-danger/20">
      <X className="h-3 w-3" /> Unsupported
    </span>
  );
}
