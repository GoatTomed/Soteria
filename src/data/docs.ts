export type Macro = {
  name: string;
  type: string;
  description: string;
  aliases?: string[];
  warning?: string;
};

export const macros: Macro[] = [
  {
    name: 'SOTR_OBFUSCATED',
    type: 'boolean',
    description:
      'Returns true if the current script is obfuscated, and false otherwise. Useful for toggling debug behavior or hiding sensitive logic paths in plain builds.',
    aliases: ['LPH_OBFUSCATED', 'MV_OBFUSCATED', 'WYNF_OBFUSCATED'],
  },
  {
    name: 'SOTR_LINE',
    type: '() → number',
    description:
      'Expands to the current source line number at the point of use. Helpful for logging, error reporting, and runtime diagnostics without relying on debug.traceback.',
    aliases: ['LPH_LINE (variable)', 'MV_LINE (variable)', 'WYNF_LINE (function)'],
  },
  {
    name: 'SOTR_KILL',
    type: '() → never',
    description:
      'Immediately crashes the Lua VM. Use this as a hard tripwire — placing it behind anti-tamper checks, license validation, or integrity guards ensures the process cannot continue if the condition is violated.',
    aliases: ['LPH_CRASH', 'MV_CRASH', 'WYNF_CRASH'],
    warning:
      'This is irreversible. Once called, the VM is terminated and no further code executes. Do not use in hot paths or without a deliberate condition guard.',
  },
  {
    name: 'SOTR_GUID',
    type: 'string',
    description:
      'Expands to a random hex string generated once at obfuscation time. Every obfuscation run produces a different value, but all uses of SOTR_GUID within the same run expand to the same string. Useful for unique script instance identification or anti-leak fingerprinting.',
  },
  {
    name: 'SOTR_TIMESTAMP',
    type: 'number',
    description:
      'Expands to the Unix timestamp of when the script was obfuscated. Useful for expiry logic, build tracking, or logging when a particular build was generated.',
  },
  {
    name: 'SOTR_VERSION',
    type: 'string',
    description:
      'Expands to the current Soteria obfuscator version string at the time of obfuscation. Useful for debugging, watermarking, or asserting a minimum obfuscator version at runtime.',
  },
  {
    name: 'SOTR_ENC_STR',
    type: '(string) → string',
    description:
      'Encrypts a string constant at compile-time and inserts the decryption logic inline. The plaintext value is never present in the compiled output, only the encrypted form and its corresponding decryptor are embedded. Decryption happens transparently at runtime when the value is first accessed.',
    aliases: ['LPH_ENCSTR', 'MV_ENC_STR', 'WYNF_ENC_STRING'],
  },
  {
    name: 'SOTR_ENC_NUM',
    type: '(number) → number',
    description:
      'Encrypts a numeric constant at compile-time. Like SOTR_ENC_STR, the original value is replaced with an encrypted representation in the compiled output and decrypted transparently at runtime. Useful for obscuring license codes, version checks, or magic constants.',
    aliases: ['LPH_ENCNUM', 'WYNF_ENC_NUM'],
  },
  {
    name: 'SOTR_ENC_FUNC',
    type: '(function, …string) → function',
    description:
      'Encrypts a function at compile-time using one or more key strings. The encrypted function will only execute if the correct decryption key(s) are provided at call time; if the key is absent or incorrect, the function will not run. The function body is never present in plaintext in the compiled output.',
    aliases: ['LPH_ENCFUNC', 'MV_ENC_FUNC', 'WYNF_ENC_FUNC'],
    warning:
      'If the decryption key is incorrect or tampered with, the function will not execute. Ensure your key values are consistent between encryption and any runtime references. Avoid hardcoding sensitive keys in plaintext — consider pairing with SOTR_ENC_STR to protect the key itself.',
  },
  {
    name: 'SOTR_EXPOSE',
    type: '(function) → function',
    description:
      'Wraps a function to exclude it from virtualization. The wrapped function is compiled normally and executes at native speed, bypassing the Soteria VM layer entirely. Use this for hot paths where virtualization overhead is unacceptable.',
    aliases: ['LPH_NO_VIRTUALIZE', 'MV_OMIT_VM', 'WYNF_NO_VIRTUALIZE'],
    warning:
      'Exposed functions receive no virtualization protection. Sensitive logic inside an exposed function can be more easily reverse engineered. Reserve this macro for performance-critical code that contains no secrets.',
  },
  {
    name: 'SOTR_SECURE_CALL',
    type: '(function) → function',
    description:
      'Wraps an event callback with a secure function wrapper at compile-time. Use this to protect event handlers and callbacks from tampering or unauthorized invocation — the wrapped function is shielded by Soteria\'s security layer and will not execute if the call environment has been compromised.',
    aliases: ['WYNF_SECURE_CALL'],
  },
];
