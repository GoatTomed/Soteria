import { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { Copy, Check, Lock, ArrowLeft } from 'lucide-react';

const ALLOWED_USERNAMES = ['president', 'yoursuck', 'yourSuck'];

// Real opcode-to-function mappings extracted from the WeAreDevs obfuscated output.
// The obfuscator uses b(x) = z[x + 65360] to index a custom-base64-encoded string table.
// Each /number/ below is the actual b() argument found in the obfuscated bytecode,
// and the meaning is the decoded string (function/library name) it resolves to.
const VM_OPCODES: { code: string; meaning: string }[] = [
  { code: '/-65329/', meaning: 'pcall — protected call (error handling)' },
  { code: '/-65320/', meaning: 'typeof — runtime type check' },
  { code: '/-65297/', meaning: 'getCount — Counter.getCount() method' },
  { code: '/-65288/', meaning: 'lower — string.lower() lowercase' },
  { code: '/-65269/', meaning: 'set — Set.set() / variable assignment' },
  { code: '/-65267/', meaning: 'type — type() builtin' },
  { code: '/-65250/', meaning: 'method2 — custom method2() function' },
  { code: '/-65232/', meaning: 'select — select() varargs builtin' },
  { code: '/-65227/', meaning: 'flush — io flush / buffer flush' },
  { code: '/-65224/', meaning: 'debug — debug library' },
  { code: '/-65192/', meaning: 'next — next() table iterator' },
  { code: '/-65184/', meaning: 'enqueue — Queue.enqueue() method' },
  { code: '/-65161/', meaning: 'write — io.write() output' },
  { code: '/-65154/', meaning: 'utf8 — utf8 library' },
  { code: '/-65151/', meaning: 'rawlen — rawlen() raw length' },
  { code: '/-65109/', meaning: 'gsub — string.gsub() replace' },
  { code: '/-65099/', meaning: '__len — metatable __len metamethod' },
  { code: '/-65077/', meaning: 'roar — Lion.roar() method' },
  { code: '/-65032/', meaning: 'package — package library' },
  { code: '/-65003/', meaning: 'task — task library (Luau)' },
  { code: '/-64952/', meaning: 'push — Stack.push() method' },
  { code: '/-64945/', meaning: 'getfenv — getfenv() function environment' },
  { code: '/-64941/', meaning: 'has — Set.has() membership check' },
  { code: '/-64932/', meaning: 'dequeue — Queue.dequeue() method' },
  { code: '/-64820/', meaning: 'os — os library' },
  { code: '/-64816/', meaning: 'new — Set.new() / constructor' },
  { code: '/-64810/', meaning: 'Tamper Detected! — anti-tamper string' },
  { code: '/-64794/', meaning: 'size — Stack.size() / Queue.size()' },
  { code: '/-64776/', meaning: 'rawequal — rawequal() raw equality' },
  { code: '/-64752/', meaning: 'newproxy — newproxy() userdata' },
  { code: '/-64716/', meaning: 'assert — assert() assertion' },
  { code: '/-64694/', meaning: 'unpack — unpack() table to args' },
  { code: '/-64692/', meaning: 'reverse — string.reverse()' },
  { code: '/-64664/', meaning: 'table — table library' },
  { code: '/-64605/', meaning: 'rawset — rawset() raw table set' },
  { code: '/-64602/', meaning: 'pairs — pairs() iterator' },
  { code: '/-64593/', meaning: 'print — print() output' },
  { code: '/-64554/', meaning: 'concat — table.concat() join' },
  { code: '/-64389/', meaning: '__metatable — metatable protection' },
  { code: '/-64376/', meaning: 'char — string.char() byte to string' },
  { code: '/-64325/', meaning: 'floor — math.floor()' },
  { code: '/-64281/', meaning: 'peek — Stack.peek() top element' },
  { code: '/-64254/', meaning: 'string — string library' },
  { code: '/-64219/', meaning: 'close — coroutine.close() / file close' },
  { code: '/-64199/', meaning: 'random — math.random()' },
  { code: '/-64179/', meaning: 'pop — Stack.pop() remove top' },
  { code: '/-64177/', meaning: 'sub — string.sub() substring' },
  { code: '/-64150/', meaning: 'tostring — tostring() conversion' },
  { code: '/-64135/', meaning: '_VERSION — Lua version global' },
  { code: '/-64132/', meaning: '_G — global table' },
  { code: '/-64120/', meaning: 'game — Roblox game object' },
  { code: '/-64093/', meaning: 'purr — Cat.purr() method' },
  { code: '/-64065/', meaning: '__gc — garbage collector metamethod' },
  { code: '/-64062/', meaning: 'bit32 — bit32 library' },
  { code: '/-64027/', meaning: 'require — require() module load' },
  { code: '/-63977/', meaning: 'xpcall — xpcall() protected call' },
  { code: '/-63950/', meaning: 'fn_global — global function definition' },
  { code: '/-63919/', meaning: 'increment — Counter.increment() method' },
  { code: '/-63878/', meaning: 'rep — string.rep() repeat' },
  { code: '/-63859/', meaning: 'tonumber — tonumber() conversion' },
];

function generateTxt(): string {
  const lines: string[] = [
    '# ═══════════════════════════════════════════════════════',
    '#  Soteria VM Opcode Reference — /stacked',
    '#  WeAreDevs VM bytecode pattern mapping',
    '#  Each /number/ maps to a VM instruction or feature opcode',
    '# ═══════════════════════════════════════════════════════',
    '',
    '# ── Core VM Instructions ──',
    '',
  ];

  const core = VM_OPCODES.filter(o => parseInt(o.code.slice(1, -1)) <= 220);
  const hacks = VM_OPCODES.filter(o => parseInt(o.code.slice(1, -1)) > 220);

  for (const op of core) {
    lines.push(`${op.code} = ${op.meaning}`);
  }

  lines.push('', '# ── Feature / Hack Opcodes ──', '');

  for (const op of hacks) {
    lines.push(`${op.code} = ${op.meaning}`);
  }

  lines.push('', '# ── End of Reference ──');

  return lines.join('\n');
}

export function StackedPage() {
  const { user, loading } = useAuth();
  const [username, setUsername] = useState<string | null>(null);
  const [usernameLoading, setUsernameLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  if (loading) return <div className="min-h-screen bg-[hsl(0,0%,5%)]" />;

  if (!user) return <Navigate to="/login?redirect=/stacked" replace />;

  if (usernameLoading) {
    supabase
      .from('profiles')
      .select('username')
      .eq('id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        setUsername(data?.username ?? null);
        setUsernameLoading(false);
      });
    return <div className="min-h-screen bg-[hsl(0,0%,5%)]" />;
  }

  const isAllowed = username !== null && ALLOWED_USERNAMES.includes(username.toLowerCase());

  if (!isAllowed) {
    return (
      <div className="min-h-screen bg-[hsl(0,0%,5%)] flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-red-500/10 flex items-center justify-center mb-5">
            <Lock className="h-8 w-8 text-red-400" />
          </div>
          <h1 className="text-xl font-semibold text-white mb-2">Access Denied</h1>
          <p className="text-sm text-white/40 mb-6">
            This page is restricted. You do not have permission to view this content.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 h-10 px-5 rounded-full bg-white/10 text-sm text-white/70 hover:bg-white/15 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const txtContent = generateTxt();

  const copyAll = () => {
    navigator.clipboard.writeText(txtContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[hsl(0,0%,5%)]">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">VM Opcode Reference</h1>
            <p className="text-sm text-white/40 mt-1">
              WeAreDevs bytecode pattern mapping — <code className="text-white/60 font-mono">/number/ = meaning</code>
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={copyAll}
              className="h-9 px-4 rounded-full border border-white/10 text-sm text-white/60 hover:text-white hover:border-white/20 transition-colors flex items-center gap-2"
            >
              {copied ? <><Check className="h-4 w-4 text-green-400" /> Copied</> : <><Copy className="h-4 w-4" /> Copy</>}
            </button>
            <Link
              to="/"
              className="h-9 px-4 rounded-full border border-white/10 text-sm text-white/60 hover:text-white hover:border-white/20 transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" /> Dashboard
            </Link>
          </div>
        </div>

        <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] overflow-hidden">
          <div className="px-4 py-2.5 border-b border-white/[0.07] bg-white/[0.01] flex items-center justify-between">
            <span className="text-xs font-mono text-white/40">stacked_reference.txt</span>
            <span className="text-xs text-white/30">{VM_OPCODES.length} entries</span>
          </div>
          <pre className="px-5 py-4 text-sm font-mono text-white/70 overflow-x-auto whitespace-pre leading-relaxed max-h-[70vh] overflow-y-auto">
{txtContent}
          </pre>
        </div>
      </div>
    </div>
  );
}
