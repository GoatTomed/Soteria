import {
  Lock,
  Shuffle,
  Zap,
  ShieldCheck,
  Gauge,
  Fingerprint,
  Layers,
  Braces,
  Repeat,
  KeyRound,
  Ban,
  Server,
  Eye,
  FileCode2,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type Feature = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export const obfuscatorFeatures: Feature[] = [
  {
    icon: Lock,
    title: 'Encryption',
    description:
      'Encrypts literals, strings, numbers, booleans and instruction-level data to prevent inspection.',
  },
  {
    icon: Shuffle,
    title: 'Control Flow Flattening',
    description:
      'Corrupts logical flow with hidden redirects that force execution down unpredictable paths.',
  },
  {
    icon: Zap,
    title: 'Fast Obfuscation',
    description:
      'Pure Luau engine built for speed. Obfuscate in milliseconds, not seconds.',
  },
  {
    icon: ShieldCheck,
    title: 'Reliability',
    description:
      'Regular updates, robust error handling, and ongoing improvements to stay on top.',
  },
  {
    icon: Gauge,
    title: 'Blazing Performance',
    description:
      'Benchmarked against Luraph, Wynfuscator, Prometheus. Equal or faster on every test.',
  },
  {
    icon: Ban,
    title: 'Anti-Tamper',
    description:
      'Kills execution the moment anything is modified. Outperforms every competitor on the market.',
  },
  {
    icon: Layers,
    title: 'Opcode Fusion',
    description:
      'Fuses multiple VM opcodes into single instructions. Less overhead, harder to analyze.',
  },
  {
    icon: Braces,
    title: 'Built-in Macros',
    description: 'Use macros directly in your code. Automatically handled during obfuscation.',
  },
  {
    icon: Repeat,
    title: 'Instruction Shuffling',
    description:
      'Reorders bytecode while preserving behavior. Breaks every decompilation attempt.',
  },
];

export const oracleFeatures: Feature[] = [
  {
    icon: Ban,
    title: 'Anti-Tamper',
    description:
      'Kills execution the moment anything is modified. Runs throughout, not just at startup.',
  },
  {
    icon: Lock,
    title: 'Full Encryption',
    description: 'Everything encrypted end-to-end. Requests, responses, all system comms.',
  },
  {
    icon: Fingerprint,
    title: 'HWID Locking',
    description: 'Keys tied to a specific machine. Leaked keys are useless elsewhere.',
  },
  {
    icon: Server,
    title: 'Service Disabling',
    description: 'Kill a service and every script under it goes down instantly.',
  },
  {
    icon: KeyRound,
    title: 'Key Generation',
    description: 'Generate, revoke, and manage keys directly through Oracle.',
  },
  {
    icon: Eye,
    title: 'Bypass Prevention',
    description: 'Detects hooks, spoofs, and patches. Shuts down before they get anywhere.',
  },
];

export const genesisFeatures: Feature[] = [
  {
    icon: FileCode2,
    title: 'Readable Output',
    description:
      'Custom algorithms produce clean variable names and structured, maintainable source.',
  },
  {
    icon: Zap,
    title: 'Fast Decompilation',
    description: 'Bytecode in, source code out. Built for speed without sacrificing fidelity.',
  },
  {
    icon: Layers,
    title: 'Luau Native',
    description: 'Purpose-built for Luau bytecode. Handles modern language features correctly.',
  },
];
