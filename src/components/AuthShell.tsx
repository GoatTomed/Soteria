import { Link } from 'react-router-dom';

export function AuthShell({
  title,
  children,
  footer,
}: {
  title: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden px-4 py-16">
      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663690201156/JENZdJJc5x8KiqieXexEyT/yousuck-logo-v3-UfpH3hrPHAYBWPNbmh6WvM.webp"
              alt="Soteria"
              className="h-10 w-10 rounded-[28%] object-cover"
            />
          </Link>
        </div>

        {/* Card — plain gray, no grid background */}
        <div className="rounded-[20px] border border-white/[0.08] bg-[#1a1a1a] p-7 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.8)] animate-fade-up">
          <h2 className="mb-[22px] text-[1.1rem] font-bold text-white">{title}</h2>
          {children}
        </div>

        <p className="mt-5 text-center text-[0.72rem] text-white/25 animate-fade-up" style={{ animationDelay: '80ms' }}>
          {footer}
        </p>
      </div>
    </section>
  );
}
