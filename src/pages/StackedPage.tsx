import { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { Copy, Check, Lock, ArrowLeft } from 'lucide-react';

const ALLOWED_USERNAMES = ['president', 'yoursuck', 'yourSuck'];

const VM_OPCODES: { code: string; meaning: string }[] = [
  { code: '/111/', meaning: 'local — declare local variable' },
  { code: '/112/', meaning: 'set — variable assignment' },
  { code: '/113/', meaning: 'get — variable read' },
  { code: '/114/', meaning: 'call — function invocation' },
  { code: '/115/', meaning: 'return — return from function' },
  { code: '/116/', meaning: 'jump — unconditional branch' },
  { code: '/117/', meaning: 'jumpif — conditional branch (truthy)' },
  { code: '/118/', meaning: 'jumpifnot — conditional branch (falsy)' },
  { code: '/119/', meaning: 'forprep — numeric for-loop setup' },
  { code: '/120/', meaning: 'forloop — numeric for-loop iteration' },
  { code: '/121/', meaning: 'foreach — generic for-loop' },
  { code: '/122/', meaning: 'tablecreate — create new table' },
  { code: '/123/', meaning: 'tableget — table index read' },
  { code: '/124/', meaning: 'tableset — table index write' },
  { code: '/125/', meaning: 'tablelen — # operator (length)' },
  { code: '/126/', meaning: 'concat — string concatenation (..)' },
  { code: '/127/', meaning: 'add — arithmetic addition (+)' },
  { code: '/128/', meaning: 'sub — arithmetic subtraction (-)' },
  { code: '/129/', meaning: 'mul — arithmetic multiplication (*)' },
  { code: '/130/', meaning: 'div — arithmetic division (/)' },
  { code: '/131/', meaning: 'mod — arithmetic modulo (%)' },
  { code: '/132/', meaning: 'pow — exponentiation (^)' },
  { code: '/133/', meaning: 'eq — equality comparison (==)' },
  { code: '/134/', meaning: 'neq — inequality comparison (~=)' },
  { code: '/135/', meaning: 'lt — less than (<)' },
  { code: '/136/', meaning: 'le — less than or equal (<=)' },
  { code: '/137/', meaning: 'gt — greater than (>)' },
  { code: '/138/', meaning: 'ge — greater than or equal (>=)' },
  { code: '/139/', meaning: 'and — logical and' },
  { code: '/140/', meaning: 'or — logical or' },
  { code: '/141/', meaning: 'not — logical not' },
  { code: '/142/', meaning: 'neg — unary minus' },
  { code: '/143/', meaning: 'len — length operator (#)' },
  { code: '/144/', meaning: 'loadnil — load nil constant' },
  { code: '/145/', meaning: 'loadbool — load boolean constant' },
  { code: '/146/', meaning: 'loadnum — load numeric constant' },
  { code: '/147/', meaning: 'loadstr — load string constant' },
  { code: '/148/', meaning: 'loadk — load from constants table' },
  { code: '/149/', meaning: 'getglobal — read global variable' },
  { code: '/150/', meaning: 'setglobal — write global variable' },
  { code: '/151/', meaning: 'getupval — read upvalue' },
  { code: '/152/', meaning: 'setupval — write upvalue' },
  { code: '/153/', meaning: 'closure — create function closure' },
  { code: '/154/', meaning: 'vararg — varargs (...) access' },
  { code: '/155/', meaning: 'self — method call (obj:method())' },
  { code: '/156/', meaning: 'break — break out of loop' },
  { code: '/157/', meaning: 'continue — continue to next iteration' },
  { code: '/158/', meaning: 'close — close upvalues (scope exit)' },
  { code: '/159/', meaning: 'tforloop — generic for-loop iteration' },
  { code: '/160/', meaning: 'setlist — set array portion of table' },
  { code: '/161/', meaning: 'unpack — unpack table into args' },
  { code: '/162/', meaning: 'type — type() check' },
  { code: '/163/', meaning: 'assert — assert() call' },
  { code: '/164/', meaning: 'error — error() call' },
  { code: '/165/', meaning: 'pcall — protected call' },
  { code: '/166/', meaning: 'pairs — pairs() iterator' },
  { code: '/167/', meaning: 'ipairs — ipairs() iterator' },
  { code: '/168/', meaning: 'next — next() iterator' },
  { code: '/169/', meaning: 'select — select() varargs' },
  { code: '/170/', meaning: 'tostring — tostring() conversion' },
  { code: '/171/', meaning: 'tonumber — tonumber() conversion' },
  { code: '/172/', meaning: 'rawget — raw table get' },
  { code: '/173/', meaning: 'rawset — raw table set' },
  { code: '/174/', meaning: 'rawequal — raw equality check' },
  { code: '/175/', meaning: 'rawlen — raw length' },
  { code: '/176/', meaning: 'setmetatable — setmetatable() call' },
  { code: '/177/', meaning: 'getmetatable — getmetatable() call' },
  { code: '/178/', meaning: 'newproxy — newproxy() call' },
  { code: '/179/', meaning: 'getfenv — get function environment' },
  { code: '/180/', meaning: 'setfenv — set function environment' },
  { code: '/181/', meaning: 'string_char — string.char() byte→string' },
  { code: '/182/', meaning: 'string_byte — string.byte() string→byte' },
  { code: '/183/', meaning: 'string_sub — string.sub() substring' },
  { code: '/184/', meaning: 'string_rep — string.rep() repeat' },
  { code: '/185/', meaning: 'string_find — string.find() search' },
  { code: '/186/', meaning: 'string_gsub — string.gsub() replace' },
  { code: '/187/', meaning: 'string_format — string.format() printf' },
  { code: '/188/', meaning: 'string_reverse — string.reverse()' },
  { code: '/189/', meaning: 'table_insert — table.insert()' },
  { code: '/190/', meaning: 'table_remove — table.remove()' },
  { code: '/191/', meaning: 'table_concat — table.concat()' },
  { code: '/192/', meaning: 'table_sort — table.sort()' },
  { code: '/193/', meaning: 'math_floor — math.floor()' },
  { code: '/194/', meaning: 'math_ceil — math.ceil()' },
  { code: '/195/', meaning: 'math_abs — math.abs()' },
  { code: '/196/', meaning: 'math_random — math.random()' },
  { code: '/197/', meaning: 'math_max — math.max()' },
  { code: '/198/', meaning: 'math_min — math.min()' },
  { code: '/199/', meaning: 'bit_band — bitwise AND' },
  { code: '/200/', meaning: 'bit_bor — bitwise OR' },
  { code: '/201/', meaning: 'bit_bxor — bitwise XOR' },
  { code: '/202/', meaning: 'bit_bnot — bitwise NOT' },
  { code: '/203/', meaning: 'bit_lshift — bitwise left shift' },
  { code: '/204/', meaning: 'bit_rshift — bitwise right shift' },
  { code: '/205/', meaning: 'loadstring — loadstring() compile' },
  { code: '/206/', meaning: 'load — load() compile' },
  { code: '/207/', meaning: 'dofile — dofile() external load' },
  { code: '/208/', meaning: 'require — require() module load' },
  { code: '/209/', meaning: 'print — print() output' },
  { code: '/210/', meaning: 'write — io.write() output' },
  { code: '/211/', meaning: 'read — io.read() input' },
  { code: '/222/', meaning: 'fly — fly hack opcode' },
  { code: '/223/', meaning: 'noclip — noclip opcode' },
  { code: '/224/', meaning: 'speed — speed modifier opcode' },
  { code: '/225/', meaning: 'jump — jump power opcode' },
  { code: '/226/', meaning: 'gravity — gravity modifier opcode' },
  { code: '/227/', meaning: 'teleport — teleport opcode' },
  { code: '/228/', meaning: 'esp — ESP/visual opcode' },
  { code: '/229/', meaning: 'aimbot — aimbot opcode' },
  { code: '/230/', meaning: 'godmode — god mode opcode' },
  { code: '/231/', meaning: 'infinite_jump — infinite jump opcode' },
  { code: '/232/', meaning: 'walk_on_walls — wall walk opcode' },
  { code: '/233/', meaning: 'invisible — invisibility opcode' },
  { code: '/234/', meaning: 'kill_aura — kill aura opcode' },
  { code: '/235/', meaning: 'auto_farm — auto farm opcode' },
  { code: '/236/', meaning: 'anti_afk — anti AFK opcode' },
  { code: '/237/', meaning: 'player_list — player list opcode' },
  { code: '/238/', meaning: 'server_hop — server hop opcode' },
  { code: '/239/', meaning: 'rejoin — rejoin server opcode' },
  { code: '/240/', meaning: 'inject — injection opcode' },
  { code: '/241/', meaning: 'execute — script execution opcode' },
  { code: '/242/', meaning: 'hook — function hook opcode' },
  { code: '/243/', meaning: 'unhook — function unhook opcode' },
  { code: '/244/', meaning: 'bypass — anti-cheat bypass opcode' },
  { code: '/245/', meaning: 'spoof — identity spoof opcode' },
  { code: '/246/', meaning: 'encrypt — runtime encrypt opcode' },
  { code: '/247/', meaning: 'decrypt — runtime decrypt opcode' },
  { code: '/248/', meaning: 'key_check — license key validation opcode' },
  { code: '/249/', meaning: 'hwid_lock — hardware ID lock opcode' },
  { code: '/250/', meaning: 'webhook — Discord webhook call opcode' },
  { code: '/251/', meaning: 'http_get — HTTP GET request opcode' },
  { code: '/252/', meaning: 'http_post — HTTP POST request opcode' },
  { code: '/253/', meaning: 'notify — notification opcode' },
  { code: '/254/', meaning: 'ui_create — UI creation opcode' },
  { code: '/255/', meaning: 'ui_toggle — UI visibility opcode' },
  { code: '/256/', meaning: 'ui_destroy — UI cleanup opcode' },
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
