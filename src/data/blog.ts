export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  dateISO: string;
  excerpt: string;
  body: string[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: 'oracle-gateway-slugs',
    title: 'Claim your vanity gate link',
    date: 'July 27, 2026',
    dateISO: '2026-07-27',
    excerpt:
      'Services can now claim a custom vanity link instead of the default ID. First come, first served.',
    body: [
      'Oracle services can now claim a vanity link for their gate. Instead of sending users to something like `soteria.rip/gate/srv_8f4bxx4fd9xx84x051de8afexx0f6930`, you can claim a name and send them to `soteria.rip/gate/cool`.',
      'Open Oracle Services, create or edit a service, and set a **Gateway link**. It has to be 3-20 characters, lowercase letters, numbers, and hyphens only, and it has to be unique — once it is taken, it is taken. Your old `srv_` link keeps working either way, so nothing breaks if you skip this.',
      'Vanity links are first come, first served with no waitlist. Short names run out fast once people start claiming them, so if there is one you actually want, now is the time.',
      'Head to Oracle Services and grab yours before someone else does.',
    ],
  },
  {
    slug: 'obfuscator-6-3-update',
    title: 'Obfuscator 6.3 update',
    date: 'July 26, 2026',
    dateISO: '2026-07-26',
    excerpt:
      'Improved anti-tamper protections, improved structure generation, and faster output.',
    body: [
      'Version 6.3 of the Soteria obfuscator is out now on the main branch.',
      '## Improvements\n- Improved anti-tamper protections\n- Improved overall security\n- Improved structure generation\n- Optimized output generation for runtime performance\n  - Up to ~11.1% faster benchmark performance',
      '## Fixes\n- Fixed an issue underlying from v6.2.0',
      '## Changes to Oracle\n- Gate links can now be generated for an entire service, not just a single script. Open Oracle Services, click the **⋮** menu on a service, and select **Copy gate link**. Existing per-script gate links still work as before.\n- Updated Plus and Pro plan limits:\n  - **Plus**: services 2 → 1, scripts 200 → 100, total keys 10,000 → 5,000, permanent keys 5,000 → 1,000, keys per gate visitor 5 → 2\n  - **Pro**: services 5 → 3, scripts 500 → 250',
    ],
  },
  {
    slug: 'obfuscator-6-2-update',
    title: 'Obfuscator 6.2 update',
    date: 'July 24, 2026',
    dateISO: '2026-07-24',
    excerpt:
      'Improved anti-tamper protections, smaller and faster output, and a fix for Velocity.',
    body: [
      'Version 6.2 of the Soteria obfuscator is out now on the main branch.',
      '## Improvements\n- Improved anti-tamper protections\n- Improved overall security\n- Optimized output generation for both file size and runtime performance\n  - Up to ~40% smaller output size\n  - Up to ~15% faster benchmark performance',
      '## Fixes\n- Fixed an issue affecting Velocity caused by a recent Roblox update',
    ],
  },
  {
    slug: 'discord-bot-panel-resethwid',
    title: 'Discord bot: /panel and /resethwid',
    date: 'July 23, 2026',
    dateISO: '2026-07-23',
    excerpt:
      'A control panel embed for your scripts, plus self-service HWID resets right from Discord.',
    body: [
      'The Soteria Discord bot picked up two new commands aimed at cutting down on manual support work.',
      '## /panel\nPost a persistent control panel embed for a script in any channel. Customers get:\n- **Get Key**: a link straight to the gateway to redeem or view their key\n- **Get Script**: replies with a ready-to-run loadstring snippet\n- **Reset HWID**: opens a modal so they can reset their own HWID lock without pinging staff\n- **Get Stats**: script analytics for staff only, anyone else who clicks it is told they lack permission',
      'You can also pass a role to `/panel`, which adds a **Get Role** button. Customers who submit a valid, unexpired key for the service (and are not blacklisted) are given that role automatically.',
      'Unlike most of the bot\'s interactive messages, panel buttons keep working indefinitely. They are not tied to a short-lived collector, so a panel posted today will still work months from now.',
      '## /resethwid\nThe same self-service HWID reset from the panel is also available as a standalone command: `/resethwid <key>`. Paste your key and the bot resets its HWID lock, limited to 2 resets per key in a rolling 24 hour window.',
    ],
  },
  {
    slug: 'obfuscator-6-1-update',
    title: 'Obfuscator 6.1 update',
    date: 'July 22, 2026',
    dateISO: '2026-07-22',
    excerpt:
      'Stronger anti-tamper, LZMA compression, and a faster Luau upstream.',
    body: [
      'Version 6.1 of the Soteria obfuscator is out, focused on hardening and output quality.',
      '## Improvements\n- Strengthened anti-tamper protections\n- Improved overall security and resistance against both static and dynamic analysis\n- Higher quality output generation\n- Improved platform locking strategies for Roblox target scripts\n- Replaced the base compression algorithm for compressed scripts, moving from LZW to LZMA\n- Improved macro handling, fixing several edge cases\n- Optimized `for` loops that use `next` as their iterator\n- Upstreamed the internal Luau version from 0.728 to 0.730',
      '## Changes\n- Macros can no longer be used inside `SOTR_EXPOSE` (and its aliases), due to potential security and reliability risks',
      '## Fixes\n- Fixed a rare random error',
    ],
  },
  {
    slug: 'oracle-discord-bot',
    title: "Oracle's new Discord bot",
    date: 'July 20, 2026',
    dateISO: '2026-07-20',
    excerpt:
      'Manage keys, monitor services, and get alerts for your Oracle integration directly from Discord.',
    body: [
      'Oracle now ships with a dedicated Discord bot, so you can manage your integration without leaving your server.',
      '## What it can do\n- Generate and revoke keys straight from a Discord command\n- Get real-time alerts when a service goes down\n- Look up key status and usage without opening the dashboard\n- Link multiple servers to a single Oracle account',
      '## Getting started\nHead to the **Discord Bot** tab in your dashboard, link a server, and invite the bot. Full command reference is available under Discord Bot documentation.',
    ],
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}
