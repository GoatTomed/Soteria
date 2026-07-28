const LOGO_URL = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663690201156/JENZdJJc5x8KiqieXexEyT/yousuck-logo-v3-UfpH3hrPHAYBWPNbmh6WvM.webp';

export function Logo({ className = 'h-8 w-8' }: { className?: string }) {
  return (
    <img
      src={LOGO_URL}
      alt="Logo"
      className={`rounded-[28%] object-cover ${className}`}
      loading="eager"
    />
  );
}

export function LogoWord({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Logo className="h-8 w-8" />
      <span className="text-lg font-semibold tracking-tight text-white">
        Soteria
      </span>
    </span>
  );
}
