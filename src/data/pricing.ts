export type Plan = {
  name: string;
  tagline: string;
  price: string;
  unit: string;
  perUnit: string;
  cta: string;
  popular?: boolean;
  bestValue?: boolean;
  accent?: boolean;
};

export const plans: Plan[] = [
  {
    name: 'Starter',
    tagline: 'Perfect for a single project or quick test.',
    price: '$1',
    unit: '/ 2 tokens',
    perUnit: '= $0.50 per token',
    cta: 'Buy Tokens',
  },
  {
    name: 'Plus',
    tagline: 'Great for solo developers shipping regularly.',
    price: '$4.99',
    unit: '/month',
    perUnit: '= $0.020 per obfuscation',
    cta: 'Get Started',
  },
  {
    name: 'Pro',
    tagline: 'For serious developers who ship a lot of protected scripts.',
    price: '$19.99',
    unit: '/month',
    perUnit: '= $0.011 per obfuscation',
    cta: 'Get Started',
    popular: true,
  },
  {
    name: 'Max',
    tagline: 'Built for teams and studios protecting large codebases.',
    price: '$39.99',
    unit: '/month',
    perUnit: '= $0.008 per obfuscation',
    cta: 'Get Started',
    bestValue: true,
  },
];

export type FeatureRow = {
  category: string;
  label?: string;
  starter: string | boolean;
  plus: string | boolean;
  pro: string | boolean;
  max: string | boolean;
};

export const comparisonRows: FeatureRow[] = [
  { category: 'Obfuscation', label: 'Per month', starter: '$0.50/token', plus: '250', pro: '1,750', max: '5,000' },
  { category: 'Obfuscation', label: 'File size limit', starter: '100 KB', plus: '512.0KB', pro: '1.0MB', max: '5.1MB' },
  { category: 'Obfuscation', label: 'All layers & settings', starter: true, plus: true, pro: true, max: true },
  { category: 'Obfuscation', label: 'API access', starter: true, plus: true, pro: true, max: true },
  { category: 'Obfuscation', label: 'Token bonus', starter: false, plus: '+10%', pro: '+25%', max: '+25%' },
  { category: 'Uploads', label: 'Upload limit', starter: '50', plus: '100', pro: '150', max: '250' },
  { category: 'Oracle', label: 'Whitelist access', starter: false, plus: true, pro: true, max: true },
  { category: 'Oracle', label: 'Soteria ad-free gateway', starter: false, plus: true, pro: true, max: true },
  { category: 'Oracle', label: 'Integrations', starter: false, plus: '2', pro: '4', max: '6' },
  { category: 'Oracle', label: 'Services', starter: false, plus: '1', pro: '3', max: '10' },
  { category: 'Oracle', label: 'Scripts', starter: false, plus: '100', pro: '250', max: '1,000' },
  { category: 'Oracle', label: 'Mass Key Generation', starter: false, plus: '100', pro: '500', max: '1,000' },
  { category: 'Oracle', label: 'Permanent keys', starter: false, plus: '1,000', pro: '25,000', max: '75,000' },
  { category: 'Oracle', label: 'Max keys', starter: false, plus: '5,000', pro: '50,000', max: '150,000' },
  { category: 'Oracle', label: 'Keys per gateway visitor', starter: false, plus: '2', pro: '5', max: '10' },
  { category: 'Genesis', label: 'Decompiler access', starter: false, plus: false, pro: true, max: true },
  { category: 'Genesis', label: 'Unlimited Bandwidth', starter: false, plus: false, pro: false, max: true },
  { category: 'Genesis', label: 'Priority processing', starter: false, plus: false, pro: false, max: true },
  { category: 'Support', label: 'Support tier', starter: 'Basic', plus: 'Priority', pro: 'Priority', max: 'Priority' },
];

export const faqs = [
  {
    q: 'Will my code still work after obfuscation?',
    a: 'Yes. Soteria preserves the exact runtime behavior of your script while transforming its structure and representation. The obfuscated output runs identically to the original — only the readable form is destroyed.',
  },
  {
    q: 'How does Soteria compare to Luraph, Prometheus, or Wynfuscator?',
    a: 'Soteria is benchmarked against all major competitors and matches or exceeds them on both output performance and protection strength. It uses a pure Luau engine, so obfuscation runs in milliseconds, and its anti-tamper system outperforms every competitor we have tested against.',
  },
  {
    q: 'Is my source code stored on your servers?',
    a: 'No. Scripts you upload for obfuscation are held in memory only for the duration of processing and are never written to persistent storage. Once processing completes and the result is returned, all copies are deleted. We do not retain or claim ownership of your uploaded files.',
  },
  {
    q: 'What file size limits apply?',
    a: 'Limits depend on your plan: Starter supports up to 100 KB, Plus up to 512 KB, Pro up to 1.0 MB, and Max up to 5.1 MB. Enterprise plans support files up to 50 MB.',
  },
  {
    q: 'Do tokens expire?',
    a: 'Token-based plans (Starter) do not expire — once you purchase tokens, they remain available until used. Membership plans (Plus, Pro, Max) include a monthly obfuscation quota that resets each billing cycle.',
  },
  {
    q: 'What is Genesis?',
    a: 'Genesis is our Luau decompiler. It takes bytecode as input and produces readable, structured source code with clean variable names. It is available on Pro and Max plans, with unlimited bandwidth and priority processing on Max.',
  },
  {
    q: 'What is Oracle and do I need it?',
    a: 'Oracle is our whitelist and key system. It handles key generation, HWID locking, tamper detection, and service management so you can license and gate access to your scripts without building that infrastructure yourself. It is included with Plus, Pro, and Max plans.',
  },
];
