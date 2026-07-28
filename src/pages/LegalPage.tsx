import { Link, useParams, Navigate } from 'react-router-dom';
import { FileText, Scale, Cookie, ShieldAlert } from 'lucide-react';
import { legalDocs, getLegalDoc } from '@/data/legal';

const icons: Record<string, React.ComponentType<{ className?: string }>> = {
  terms: FileText,
  privacy: Scale,
  cookies: Cookie,
  'acceptable-use': ShieldAlert,
};

export function LegalPage() {
  const { slug } = useParams<{ slug: string }>();
  const doc = getLegalDoc(slug ?? '');
  if (!doc) return <Navigate to="/404" replace />;

  return (
    <section className="container-page py-16 sm:py-24">
      <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <h2 className="text-sm font-semibold text-white">Legal</h2>
          <p className="mt-1 text-xs text-ink-400">Policies and legal documents.</p>
          <nav className="mt-5 space-y-1">
            {legalDocs.map((d) => {
              const Icon = icons[d.slug] ?? FileText;
              return (
                <Link
                  key={d.slug}
                  to={`/legal/${d.slug}`}
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
                    d.slug === doc.slug
                      ? 'bg-brand-500/10 text-brand-200 ring-1 ring-brand-500/20'
                      : 'text-ink-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {d.title}
                </Link>
              );
            })}
          </nav>
        </aside>

        <div className="max-w-2xl">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{doc.title}</h1>
          <p className="mt-3 text-sm text-ink-400">Last updated: {doc.updated}</p>
          <p className="mt-6 text-sm leading-relaxed text-ink-200">{doc.intro}</p>

          <div className="prose-legal mt-10">
            {doc.sections.map((s) => (
              <section key={s.heading}>
                <h3>{s.heading}</h3>
                {s.body.map((p, i) => (
                  <p key={i} dangerouslySetInnerHTML={{ __html: renderInline(p) }} />
                ))}
              </section>
            ))}
          </div>

          <div className="mt-10 border-t border-white/[0.06] pt-6 text-sm text-ink-400">
            Questions? Contact us at{' '}
            <a href="mailto:legal@soteria.rip" className="text-brand-300 hover:text-brand-200 underline underline-offset-2">
              legal@soteria.rip
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function renderInline(s: string): string {
  return s
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/legal@soteria\.rip/g, '<a href="mailto:legal@soteria.rip">legal@soteria.rip</a>');
}
