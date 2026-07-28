const LOGO_URL = 'https://yt3.ggpht.com/OV2tg0DmV-NvTvzSr6bxSXMXRG8TMBTOJOzgBfHTzV2x0KPSLDP5yufzsmKEmzfovbSDd3A1=s240-c-k-c0x00ffffff-no-rj';

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
