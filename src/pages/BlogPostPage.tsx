import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, ArrowRight, MessageCircle } from 'lucide-react';
import { getPost, blogPosts } from '@/data/blog';

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const post = getPost(slug ?? '');

  if (!post) {
    return (
      <section className="container-page py-32 text-center">
        <h1 className="text-2xl font-semibold text-white">Post not found</h1>
        <Link to="/blog" className="btn-outline mt-6">
          <ArrowLeft className="h-4 w-4" />
          Back to blog
        </Link>
      </section>
    );
  }

  const others = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <section className="container-page py-16 sm:py-24">
      <article className="mx-auto max-w-2xl">
        <Link to="/blog" className="inline-flex items-center gap-1.5 text-sm text-ink-400 hover:text-white">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to blog
        </Link>
        <div className="mt-6 flex items-center gap-3 text-xs text-ink-400">
          <Calendar className="h-3.5 w-3.5" />
          <time dateTime={post.dateISO}>{post.date}</time>
        </div>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">{post.title}</h1>
        <div className="mt-8 space-y-5">
          {post.body.map((para, i) => (
            <Block key={i} text={para} />
          ))}
        </div>
        <div className="mt-10 flex items-center gap-2 rounded-xl border border-white/[0.06] bg-ink-900/60 p-4 text-sm text-ink-300">
          <MessageCircle className="h-4 w-4 text-brand-300" />
          If you run into any issues or unexpected behavior, let us know on{' '}
          <Link to="/discord" className="text-brand-300 hover:text-brand-200 font-medium">Discord</Link>.
        </div>
      </article>

      {others.length > 0 && (
        <div className="mx-auto mt-16 max-w-2xl">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-400">More posts</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {others.map((o) => (
              <Link key={o.slug} to={`/blog/${o.slug}`} className="card group p-5 hover:border-white/15">
                <p className="text-xs text-ink-400">{o.date}</p>
                <h3 className="mt-2 text-sm font-semibold text-white group-hover:text-brand-200">{o.title}</h3>
                <span className="mt-3 inline-flex items-center gap-1 text-xs text-brand-300">
                  Read <ArrowRight className="h-3 w-3" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function Block({ text }: { text: string }) {
  const lines = text.split('\n');
  const headingIdx = lines.findIndex((l) => l.startsWith('## '));
  if (headingIdx === 0) {
    return (
      <>
        <h2 className="text-xl font-semibold text-white">{lines[0].replace('## ', '')}</h2>
        <ul className="mt-2 space-y-1.5">
          {lines.slice(1).map((l, i) => (
            <li key={i} className="flex gap-2 text-sm leading-relaxed text-ink-200">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brand-400" />
              <span dangerouslySetInnerHTML={{ __html: inline(l.replace(/^\s*-\s*/, '')) }} />
            </li>
          ))}
        </ul>
      </>
    );
  }
  return <p className="text-sm leading-relaxed text-ink-200" dangerouslySetInnerHTML={{ __html: inline(text) }} />;
}

function inline(s: string): string {
  return s
    .replace(/`([^`]+)`/g, '<code class="rounded bg-white/5 px-1.5 py-0.5 font-mono text-[0.85em] text-accent-400">$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');
}
