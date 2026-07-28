import { Link } from 'react-router-dom';
import { ArrowRight, Calendar } from 'lucide-react';
import { blogPosts } from '@/data/blog';

export function BlogPage() {
  return (
    <section className="container-page py-16 sm:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <span className="section-eyebrow">Blog</span>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Updates from the team
        </h1>
        <p className="mt-4 text-lg text-ink-300">
          Updates, tips, and announcements from the Soteria team.
        </p>
      </div>

      <div className="mx-auto mt-14 max-w-3xl space-y-4">
        {blogPosts.map((post, i) => (
          <Link
            key={post.slug}
            to={`/blog/${post.slug}`}
            className="card group block p-6 transition-all hover:border-white/15 hover:bg-ink-850/60"
          >
            <div className="flex items-center gap-3 text-xs text-ink-400">
              <Calendar className="h-3.5 w-3.5" />
              <time dateTime={post.dateISO}>{post.date}</time>
            </div>
            <h2 className="mt-3 text-xl font-semibold text-white transition-colors group-hover:text-brand-200">
              {post.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-300">{post.excerpt}</p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand-300">
              Read more
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
