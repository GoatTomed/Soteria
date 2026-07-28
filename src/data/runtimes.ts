export type RuntimeRow = {
  name: string;
  version: string;
  soteria: 'Supported' | 'Degraded' | 'Unsupported';
  oracle: 'Supported' | 'Degraded' | 'Unsupported';
};

export const runtimes: RuntimeRow[] = [
  { name: 'Roblox', version: '0.730', soteria: 'Supported', oracle: 'Unsupported' },
  { name: 'Volt', version: '1.3.2.4', soteria: 'Supported', oracle: 'Supported' },
  { name: 'Potassium', version: '2.3.1', soteria: 'Supported', oracle: 'Supported' },
  { name: 'Wave', version: 'NEW-1.4.1', soteria: 'Supported', oracle: 'Supported' },
  { name: 'Synapse Z', version: '1.0.3.3', soteria: 'Supported', oracle: 'Supported' },
  { name: 'Madium', version: '1.6.8', soteria: 'Supported', oracle: 'Supported' },
  { name: 'Cosmic', version: '0.730', soteria: 'Supported', oracle: 'Supported' },
  { name: 'Real', version: '1.3.1', soteria: 'Supported', oracle: 'Supported' },
  { name: 'Velocity', version: '1.1.9', soteria: 'Supported', oracle: 'Supported' },
  { name: 'SirHurt', version: 'V5.450', soteria: 'Supported', oracle: 'Supported' },
  { name: 'Solara', version: '3.266', soteria: 'Supported', oracle: 'Supported' },
  { name: 'Xeno', version: '1.3.55', soteria: 'Supported', oracle: 'Supported' },
  { name: 'MacSploit', version: '727.143', soteria: 'Degraded', oracle: 'Degraded' },
  { name: 'Opiumware', version: 'v2.4.4', soteria: 'Degraded', oracle: 'Degraded' },
  { name: 'Delta', version: '2.724.735', soteria: 'Supported', oracle: 'Degraded' },
  { name: 'Codex', version: '2.726.1142', soteria: 'Supported', oracle: 'Supported' },
];
