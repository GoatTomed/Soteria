function randHex(len: number): string {
  let s = '';
  const chars = '0123456789abcdef';
  for (let i = 0; i < len; i++) s += chars[Math.floor(Math.random() * 16)];
  return s;
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randName(): string {
  return `_${randHex(randInt(4, 8))}`;
}

const B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

function toBase64(str: string): string {
  const bytes: number[] = [];
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i);
    if (c < 128) {
      bytes.push(c);
    } else if (c < 2048) {
      bytes.push(0xc0 | (c >> 6));
      bytes.push(0x80 | (c & 0x3f));
    } else {
      bytes.push(0xe0 | (c >> 12));
      bytes.push(0x80 | ((c >> 6) & 0x3f));
      bytes.push(0x80 | (c & 0x3f));
    }
  }
  let result = '';
  for (let i = 0; i < bytes.length; i += 3) {
    const b1 = bytes[i] ?? 0;
    const b2 = bytes[i + 1] ?? 0;
    const b3 = bytes[i + 2] ?? 0;
    result += B64[b1 >> 2];
    result += B64[((b1 & 3) << 4) | (b2 >> 4)];
    result += i + 1 < bytes.length ? B64[((b2 & 15) << 2) | (b3 >> 6)] : '=';
    result += i + 2 < bytes.length ? B64[b3 & 63] : '=';
  }
  return result;
}

function fromBase64(b64: string): string {
  const clean = b64.replace(/[^A-Za-z0-9+/=]/g, '');
  const bytes: number[] = [];
  for (let i = 0; i < clean.length; i += 4) {
    const c1 = B64.indexOf(clean[i]);
    const c2 = B64.indexOf(clean[i + 1]);
    const c3 = B64.indexOf(clean[i + 2]);
    const c4 = B64.indexOf(clean[i + 3]);
    if (c1 < 0 || c2 < 0) break;
    bytes.push((c1 << 2) | (c2 >> 4));
    if (c3 >= 0 && clean[i + 2] !== '=') bytes.push(((c2 & 15) << 4) | (c3 >> 2));
    if (c4 >= 0 && clean[i + 3] !== '=') bytes.push(((c3 & 3) << 6) | c4);
  }
  let result = '';
  let i = 0;
  while (i < bytes.length) {
    const b1 = bytes[i++];
    if (b1 < 128) {
      result += String.fromCharCode(b1);
    } else if (b1 < 224) {
      const b2 = bytes[i++];
      result += String.fromCharCode(((b1 & 31) << 6) | (b2 & 63));
    } else {
      const b2 = bytes[i++];
      const b3 = bytes[i++];
      result += String.fromCharCode(((b1 & 15) << 12) | ((b2 & 63) << 6) | (b3 & 63));
    }
  }
  return result;
}

function shuffleArray<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Obfuscates Luau source by encoding the entire script as a base64 string
 * and wrapping it in a self-decoding loader. The output is valid Luau that
 * runs correctly in Roblox executors while hiding the original source.
 * Uses a shuffled base64 alphabet so the payload isn't easily decoded.
 */
export function obfuscateLua(source: string): string {
  if (!source.trim()) return '-- Empty script';

  const shuffled = shuffleArray(B64.split('')).join('');
  const encoded = toBase64Custom(source, shuffled);

  // Split into random-length chunks
  const chunks: string[] = [];
  let i = 0;
  while (i < encoded.length) {
    const len = randInt(20, 80);
    chunks.push(encoded.slice(i, i + len));
    i += len;
  }

  const vAlpha = randName();
  const vChunk = randName();
  const vPayload = randName();
  const vDecoded = randName();
  const vFn = randName();
  const vIdx = randName();
  const vByte = randName();
  const vTable = randName();
  const vLoad = randName();
  const vChar = randName();
  const vSub = randName();
  const vFind = randName();

  const junk: string[] = [];
  for (let j = 0; j < randInt(8, 16); j++) {
    junk.push(`local ${randName()} = ${randInt(0, 999999999)}`);
  }

  const chunkLines = chunks.map((c, idx) => `  ${vChunk}[${idx + 1}] = "${c}"`);

  return [
    `-- Obfuscated by Soteria`,
    `-- ${new Date().toISOString()}`,
    ...junk,
    `local ${vAlpha} = "${shuffled}"`,
    `local ${vChunk} = {}`,
    chunkLines.join('\n'),
    `local ${vPayload} = ""`,
    `for ${vIdx} = 1, #${vChunk} do`,
    `  ${vPayload} = ${vPayload} .. ${vChunk}[${vIdx}]`,
    `end`,
    `local ${vTable} = {}`,
    `local ${vFind} = function(h, n) return string.find(h, n, 1, true) end`,
    `for ${vByte} = 1, #${vPayload}, 4 do`,
    `  local ${vSub} = ${vPayload}:sub(${vByte}, ${vByte} + 3)`,
    `  local c1 = ${vFind}(${vAlpha}, ${vSub}:sub(1, 1)) - 1`,
    `  local c2 = ${vFind}(${vAlpha}, ${vSub}:sub(2, 2)) - 1`,
    `  local c3 = ${vFind}(${vAlpha}, ${vSub}:sub(3, 3))`,
    `  local c4 = ${vFind}(${vAlpha}, ${vSub}:sub(4, 4))`,
    `  ${vTable}[#${vTable} + 1] = (c1 * 4) + math.floor(c2 / 16)`,
    `  if c3 and c3 > 0 then ${vTable}[#${vTable} + 1] = ((c2 % 16) * 16) + math.floor((c3 - 1) / 4) end`,
    `  if c4 and c4 > 0 then ${vTable}[#${vTable} + 1] = ((c3 - 1) % 4) * 16 + (c4 - 1) end`,
    `end`,
    `local ${vDecoded} = ""`,
    `local ${vChar} = string.char`,
    `for ${vIdx} = 1, #${vTable} do`,
    `  ${vDecoded} = ${vDecoded} .. ${vChar}(${vTable}[${vIdx}])`,
    `end`,
    `local ${vLoad} = loadstring or load`,
    `local ${vFn} = ${vLoad}(${vDecoded})`,
    `if ${vFn} then ${vFn}() end`,
  ].join('\n');
}

function toBase64Custom(str: string, alphabet: string): string {
  const bytes: number[] = [];
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i);
    if (c < 128) {
      bytes.push(c);
    } else if (c < 2048) {
      bytes.push(0xc0 | (c >> 6));
      bytes.push(0x80 | (c & 0x3f));
    } else {
      bytes.push(0xe0 | (c >> 12));
      bytes.push(0x80 | ((c >> 6) & 0x3f));
      bytes.push(0x80 | (c & 0x3f));
    }
  }
  let result = '';
  for (let i = 0; i < bytes.length; i += 3) {
    const b1 = bytes[i] ?? 0;
    const b2 = bytes[i + 1] ?? 0;
    const b3 = bytes[i + 2] ?? 0;
    result += alphabet[b1 >> 2];
    result += alphabet[((b1 & 3) << 4) | (b2 >> 4)];
    result += i + 1 < bytes.length ? alphabet[((b2 & 15) << 2) | (b3 >> 6)] : '=';
    result += i + 2 < bytes.length ? alphabet[b3 & 63] : '=';
  }
  return result;
}

/**
 * Reverses the obfuscation produced by obfuscateLua.
 * Extracts the base64 chunks and the shuffled alphabet, then decodes.
 */
export function unobfuscateLua(obfuscated: string): string {
  if (!obfuscated || !obfuscated.trim()) return '';

  if (!obfuscated.includes('Obfuscated by Soteria')) return obfuscated;

  // Try the new shuffled-alphabet format first
  const alphaMatch = obfuscated.match(/local\s+(_[0-9a-f]+)\s*=\s*"([A-Za-z0-9+/]{64})"/);
  if (alphaMatch) {
    const alphabet = alphaMatch[2];
    const alphaVar = alphaMatch[1];

    // Pull every quoted string from chunk table lines
    const chunkPattern = new RegExp(`${alphaVar.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\[\\d+\\]\\s*=\\s*"([A-Za-z0-9+/=]+)"`, 'g');
    // Actually we need the chunk variable, not the alpha variable
    // Let's just grab all quoted strings that look like base64
    const hexMatches = obfuscated.match(/=\s*"([A-Za-z0-9+/=]+)"/g);
    if (!hexMatches || hexMatches.length === 0) return obfuscated;

    // Filter out the alphabet line and junk lines
    const payloadChunks: string[] = [];
    for (const m of hexMatches) {
      const inner = m.match(/"([A-Za-z0-9+/=]+)"/);
      if (inner && inner[1].length > 0 && inner[1] !== alphabet) {
        payloadChunks.push(inner[1]);
      }
    }

    const payload = payloadChunks.join('');
    if (payload.length === 0) return obfuscated;

    const decoded = fromBase64Custom(payload, alphabet);
    return decoded;
  }

  // Fall back to old hex format
  const hexMatches = obfuscated.match(/=\s*"([0-9a-fA-F]+)"/g);
  if (!hexMatches || hexMatches.length === 0) return obfuscated;

  let hex = '';
  for (const m of hexMatches) {
    const inner = m.match(/"([0-9a-fA-F]+)"/);
    if (inner) hex += inner[1];
  }

  if (hex.length === 0 || hex.length % 2 !== 0) return obfuscated;

  let decoded = '';
  for (let i = 0; i < hex.length; i += 2) {
    decoded += String.fromCharCode(parseInt(hex.slice(i, i + 2), 16));
  }
  return decoded;
}

function fromBase64Custom(b64: string, alphabet: string): string {
  const clean = b64.replace(/[^A-Za-z0-9+/=]/g, '');
  const bytes: number[] = [];
  for (let i = 0; i < clean.length; i += 4) {
    const c1 = alphabet.indexOf(clean[i]);
    const c2 = alphabet.indexOf(clean[i + 1]);
    const c3 = clean[i + 2] === '=' ? -1 : alphabet.indexOf(clean[i + 2]);
    const c4 = clean[i + 3] === '=' ? -1 : alphabet.indexOf(clean[i + 3]);
    if (c1 < 0 || c2 < 0) break;
    bytes.push((c1 << 2) | (c2 >> 4));
    if (c3 >= 0) bytes.push(((c2 & 15) << 4) | (c3 >> 2));
    if (c4 >= 0) bytes.push(((c3 & 3) << 6) | c4);
  }
  let result = '';
  let i = 0;
  while (i < bytes.length) {
    const b1 = bytes[i++];
    if (b1 < 128) {
      result += String.fromCharCode(b1);
    } else if (b1 < 224) {
      const b2 = bytes[i++];
      result += String.fromCharCode(((b1 & 31) << 6) | (b2 & 63));
    } else {
      const b2 = bytes[i++];
      const b3 = bytes[i++];
      result += String.fromCharCode(((b1 & 15) << 12) | ((b2 & 63) << 6) | (b3 & 63));
    }
  }
  return result;
}

export function generateSlug(): string {
  return String(randInt(100000, 999999));
}

// ─── Lua string literal decoder ────────────────────────────────────────────

/**
 * Decodes a Lua string literal (content between quotes) resolving all
 * Lua escape sequences: \DDD decimal, \xHH hex, \n \t \r \\ \" \' etc.
 */
function decodeLuaString(raw: string): string {
  let out = '';
  let i = 0;
  while (i < raw.length) {
    if (raw[i] !== '\\') { out += raw[i++]; continue; }
    i++; // skip backslash
    if (i >= raw.length) break;
    const ch = raw[i];
    // Decimal escape \DDD (1-3 digits, value 0-255)
    if (ch >= '0' && ch <= '9') {
      let numStr = '';
      while (i < raw.length && raw[i] >= '0' && raw[i] <= '9' && numStr.length < 3) {
        numStr += raw[i++];
      }
      out += String.fromCharCode(parseInt(numStr, 10));
      continue;
    }
    // Hex escape \xHH
    if (ch === 'x') {
      i++;
      const hex = raw.slice(i, i + 2);
      out += String.fromCharCode(parseInt(hex, 16));
      i += 2;
      continue;
    }
    // Named escapes
    const escMap: Record<string, string> = {
      n: '\n', t: '\t', r: '\r', '\\': '\\', '"': '"', "'": "'",
      a: '\x07', b: '\x08', f: '\x0C', v: '\x0B', '0': '\0',
    };
    if (escMap[ch] !== undefined) { out += escMap[ch]; i++; }
    else { out += ch; i++; }
  }
  return out;
}

/**
 * Extracts and decodes all Lua double-quoted string literals from source.
 * Returns the decoded strings in order.
 */
function extractLuaStrings(src: string): string[] {
  const results: string[] = [];
  let i = 0;
  while (i < src.length) {
    if (src[i] === '"') {
      i++;
      let content = '';
      while (i < src.length && src[i] !== '"') {
        if (src[i] === '\\') { content += '\\'; i++; }
        if (i < src.length) { content += src[i++]; }
      }
      i++; // closing quote
      results.push(decodeLuaString(content));
    } else {
      i++;
    }
  }
  return results;
}

// ─── WeAreDevs-specific decoder ─────────────────────────────────────────────

/**
 * Handles the WeAreDevs obfuscator format (v1.x):
 *   return(function(...)local r={"...\DDD\DDD...","...",...}
 *   function y(y) return r[y+(...)] end
 *   ... ipairs loop + string.char + table.concat reassembly ...
 *
 * The approach: extract every quoted string from the r-table, decode the
 * \DDD decimal escapes, then reassemble via the ipairs+string.char pattern.
 *
 * Because the arithmetic offsets are randomised per-obfuscation we cannot
 * recover the *exact* original source statically without running the Lua VM.
 * What we CAN do is decode every string literal and present the decoded
 * byte streams so the logic is readable.
 */
function decodeWeAreDevs(src: string): string {
  // Locate the r-table: local r={...}
  const rTableMatch = src.match(/local\s+\w+\s*=\s*\{([\s\S]*?)\}/);
  if (!rTableMatch) return src;

  const rTableContent = rTableMatch[1];

  // Extract all quoted strings from the r-table and decode their \DDD escapes
  const decoded = extractLuaStrings('"' + rTableContent.replace(/",\s*"/g, '" "') + '"');

  if (decoded.length === 0) return src;

  // The decoded strings are byte runs that reconstitute the original script
  // when concatenated in the order the ipairs loop visits them.
  // We join them and return the readable result.
  const joined = decoded.join('');

  // Clean up: the joined result is usually valid Lua source
  return joined.trim() || src;
}

// ─── Public entry point ──────────────────────────────────────────────────────

/**
 * Best-effort static deobfuscation of Lua/Luau scripts.
 *
 * Handles (in order):
 *  1. Soteria's own obfuscation format
 *  2. WeAreDevs v1 obfuscator (\DDD string tables + ipairs reassembly)
 *  3. Lua decimal escape sequences (\DDD) inside quoted strings
 *  4. Lua hex escape sequences (\xHH)
 *  5. string.char(...) calls with decimal or hex byte lists
 *  6. loadstring("base64") patterns
 *  7. getfenv/setfenv namespace wrappers
 *  8. Numeric byte-array tables {104,101,108,...}
 *
 * Note: Some obfuscators (Iron Brew, Luraph, Prometheus) use a custom
 * bytecode VM that cannot be decoded statically in a browser. For those,
 * the output will be partially cleaned but not fully recovered.
 */
export function unobfuscateExternal(source: string): string {
  if (!source || !source.trim()) return '';

  if (source.includes('Obfuscated by Soteria')) return unobfuscateLua(source);

  // ── Pass 1: WeAreDevs format ─────────────────────────────────────────────
  const isWeAreDevs = source.includes('wearedevs.net/obfuscator') ||
    /return\s*\(\s*function\s*\(\.\.\.\)\s*local\s+\w+\s*=\s*\{/.test(source);
  if (isWeAreDevs) {
    const wad = decodeWeAreDevs(source);
    if (wad !== source && wad.trim().length > 0) {
      // Run additional passes on the decoded result
      return unobfuscateExternal(wad);
    }
  }

  let result = source;

  // ── Pass 2: Decode \DDD decimal escapes inside ALL quoted strings ─────────
  // Matches double-quoted strings and decodes escape sequences inside them.
  result = result.replace(/"((?:[^"\\]|\\[\s\S])*?)"/g, (_match, inner) => {
    // Only process strings that actually contain \DDD or \xHH sequences
    if (!/\\[0-9]|\\x[0-9a-fA-F]/.test(inner)) return _match;
    const decoded = decodeLuaString(inner);
    // Escape any double-quotes that appeared in the decoded output
    return '"' + decoded.replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"';
  });

  // ── Pass 3: \xHH hex escape sequences outside strings ────────────────────
  result = result.replace(/\\x([0-9a-fA-F]{2})/g, (_, h) => String.fromCharCode(parseInt(h, 16)));

  // ── Pass 4: string.char(...) calls → string literals ─────────────────────
  // Handles both decimal (72) and hex (0x48) args; also arithmetic like 72+0
  result = result.replace(/string\.char\(([\s\S]*?)\)/g, (_m, args) => {
    const parts = args.split(',').map((s: string) => s.trim());
    let decoded = '';
    for (const p of parts) {
      // Simple arithmetic: try eval-safe integer parse
      const num = /^0x[0-9a-fA-F]+$/.test(p)
        ? parseInt(p, 16)
        : /^\d+$/.test(p)
          ? parseInt(p, 10)
          : /^(\d+)\s*[+\-]\s*(\d+)$/.test(p)
            ? (() => { const [, a, op, b] = p.match(/^(\d+)\s*([+\-])\s*(\d+)$/) as RegExpMatchArray; return op === '+' ? parseInt(a) + parseInt(b) : parseInt(a) - parseInt(b); })()
            : NaN;
      if (!isNaN(num) && num >= 0 && num <= 255) decoded += String.fromCharCode(num);
      else decoded = ''; // give up if any arg can't be resolved
    }
    if (decoded.length > 0) return '"' + decoded.replace(/"/g, '\\"') + '"';
    return _m;
  });

  // ── Pass 5: loadstring("base64payload")() ────────────────────────────────
  result = result.replace(/loadstring\s*\(\s*"([A-Za-z0-9+/=]{20,})"\s*\)\s*\(\s*\)/g, (_m, payload) => {
    try {
      const decoded = fromBase64(payload);
      if (/function|local|print|require/.test(decoded)) return decoded;
    } catch { /* not base64 */ }
    return _m;
  });

  // ── Pass 6: getfenv()/setfenv() namespace wrappers ───────────────────────
  result = result.replace(/getfenv\s*\(\s*\)\s*\[\s*"(\w+)"\s*\]\s*\[\s*"(\w+)"\s*\]/g, '$1.$2');
  result = result.replace(/getfenv\s*\(\s*\)\s*\.\s*(\w+)\s*\.\s*(\w+)/g, '$1.$2');

  // ── Pass 7: numeric byte-array tables → string literals ──────────────────
  result = result.replace(/\{(\s*\d+(?:\s*,\s*\d+){9,}\s*)\}/g, (_m, inner) => {
    const nums = inner.split(',').map((s: string) => parseInt(s.trim()));
    if (nums.every((n: number) => n >= 0 && n <= 255)) {
      const decoded = nums.map((n: number) => String.fromCharCode(n)).join('');
      return '"' + decoded.replace(/"/g, '\\"') + '"';
    }
    return _m;
  });

  // ── Pass 8: local function shorthand cleanup ──────────────────────────────
  result = result.replace(/\blocal\s+([A-Za-z_]\w*)\s*=\s*function\s*\(/g, 'local function $1(');

  // ── Pass 9: collapse repeated whitespace / blank lines ───────────────────
  result = result.replace(/\n{3,}/g, '\n\n').trim();

  return result;
}
