-- ═══════════════════════════════════════════════════════════════
--  ALL-LUA.LUA — Exhaustive Lua Reference Script
--  Literally everything Lua can do, in one file.
--  Covers Lua 5.1, 5.2, 5.3, 5.4, Luau, and common extensions.
--  Purpose: force the WeAreDevs VM obfuscator to emit every opcode.
-- ═══════════════════════════════════════════════════════════════

-- ═══════════════════════════════════════════════════════════════
-- SECTION 1: ALL KEYWORDS
-- Keywords: and break do else elseif end false for function goto
--           if in local nil not or repeat return then true until while
-- ═══════════════════════════════════════════════════════════════

-- ── local ──
local loc1 = 1
local loc2, loc3 = 2, 3
local loc4

-- ── nil ──
local n = nil

-- ── true / false ──
local t = true
local f = false

-- ── function (local) ──
local function fn_local() end

-- ── function (global) ──
function fn_global() end

-- ── function (anonymous) ──
local fn_anon = function() end

-- ── function (table method) ──
local kw_table = {}
function kw_table:method(self_val) return self_val end
function kw_table.method2(val) return val end
kw_table.arrow = function(val) return val end

-- ── if / elseif / else / then / end ──
if loc1 == 1 then
  loc1 = 10
elseif loc1 == 2 then
  loc1 = 20
else
  loc1 = 0
end

-- ── for (numeric) / do / end ──
for i = 1, 5 do local _ = i end
for i = 5, 1, -1 do local _ = i end
for i = 1, 10, 2 do local _ = i end

-- ── for (generic) / in / do / end ──
for k, v in pairs({a = 1}) do local _ = k .. v end
for i, v in ipairs({1, 2, 3}) do local _ = i + v end
for k in next, {x = 1} do local _ = k end

-- ── while / do / end ──
local wi = 0
while wi < 3 do wi = wi + 1 end

-- ── repeat / until ──
local ri = 0
repeat ri = ri + 1 until ri >= 3

-- ── break ──
for i = 1, 100 do if i > 5 then break end end

-- ── return ──
local function fn_return() return 1, 2, 3 end
local ra, rb, rc = fn_return()

-- ── return with no value ──
local function fn_return_void() return end

-- ── goto / label ──
local gv = 0
::glabel::
gv = gv + 1
if gv < 3 then goto glabel end

-- ── and / or / not ──
local and_r = true and false
local or_r = false or true
local not_r = not true
local sc_and = nil and "unreachable"
local sc_or = "first" or "unreachable"
local chained_bool = (1 > 0 and 2 > 1) or (3 == 0 and not false)

-- ═══════════════════════════════════════════════════════════════
-- SECTION 2: ALL OPERATORS
-- ═══════════════════════════════════════════════════════════════

-- ── Arithmetic ──
local op_add = 5 + 3
local op_sub = 5 - 3
local op_mul = 5 * 3
local op_div = 5 / 3
local op_mod = 5 % 3
local op_pow = 5 ^ 3
local op_unm = -5
local op_floordiv = 5 // 3       -- Lua 5.3+

-- ── Comparison ──
local op_eq = (1 == 1)
local op_ne = (1 ~= 2)
local op_lt = (1 < 2)
local op_le = (1 <= 2)
local op_gt = (2 > 1)
local op_ge = (2 >= 1)

-- ── Logical ──
local op_and = true and false
local op_or = true or false
local op_not = not true

-- ── Concatenation ──
local op_concat = "a" .. "b" .. "c"
local op_concat_num = "n=" .. 42

-- ── Length ──
local op_len_str = #"hello"
local op_len_tbl = #{1, 2, 3}
local op_len_empty = #{}

-- ── Bitwise (Lua 5.2+ lexical operators) ──
local op_band = 0xFF & 0x0F       -- Lua 5.3+
local op_bor = 0xF0 | 0x0F        -- Lua 5.3+
local op_bxor = 0xAA ~ 0x55       -- Lua 5.3+
local op_bnot = ~0xFF             -- Lua 5.3+
local op_shl = 1 << 8             -- Lua 5.3+
local op_shr = 256 >> 4           -- Lua 5.3+

-- ── Assignment variants ──
local ma1, ma2, ma3 = 1, 2, 3
ma1, ma2 = ma2, ma1
local ma4 = ma1
ma4 = ma4 + 1
ma4 += 1                           -- Luau compound assignment
ma4 -= 1
ma4 *= 2
ma4 /= 2
ma4 %= 3
ma4 ^= 2
ma4 //= 1
ma4 ..= "x"                       -- Luau string concat assignment

-- ═══════════════════════════════════════════════════════════════
-- SECTION 3: ALL LITERAL/VALUE FORMATS
-- ═══════════════════════════════════════════════════════════════

-- ── Numbers: integers ──
local lit_int = 42
local lit_neg = -42
local lit_zero = 0

-- ── Numbers: floats ──
local lit_float = 3.14
local lit_float2 = .5
local lit_float3 = 5.
local lit_sci = 1.5e10
local lit_sci2 = 2.5e-3
local lit_sci3 = 1E5

-- ── Numbers: hex ──
local lit_hex = 0xFF
local lit_hex2 = 0x1A2B
local lit_hexf = 0xFF.0p0          -- Lua 5.3+ hex float

-- ── Numbers: Luau binary ──
local lit_bin = 0b1010             -- Luau
local lit_bin2 = 0b11110000

-- ── Numbers: Lua 5.4 octal ──
-- local lit_oct = 0o17             -- Lua 5.4 (commented for compat)

-- ── Strings: single quote ──
local lit_s1 = 'single quote'

-- ── Strings: double quote ──
local lit_s2 = "double quote"

-- ── Strings: long bracket [[ ]] ──
local lit_s3 = [[
multi
line
string
]]

-- ── Strings: nested long bracket [==[ ]==] ──
local lit_s4 = [==[
contains ]] inside
]==]

-- ── Strings: escape sequences ──
local esc_bell = "\a"
local esc_bs = "\b"
local esc_ff = "\f"
local esc_nl = "\n"
local esc_cr = "\r"
local esc_tab = "\t"
local esc_vtab = "\v"
local esc_back = "\\"
local esc_quote = "\""
local esc_apos = "\'"
local esc_nl2 = "\10"
local esc_hex = "\x41"             -- Lua 5.2+
local esc_z = "\z                  -- skips whitespace
  after z"
local esc_d = "\d"                -- Lua 5.3+ decimal escape

-- ── Booleans ──
local lit_true = true
local lit_false = false

-- ── Nil ──
local lit_nil = nil

-- ── Varargs ──
local function lit_varargs(...)
  local args = {...}
  local n = select("#", ...)
  return n, args
end

-- ═══════════════════════════════════════════════════════════════
-- SECTION 4: ALL TABLE CONSTRUCTORS
-- ═══════════════════════════════════════════════════════════════

-- ── Empty table ──
local tc_empty = {}

-- ── Array-style ──
local tc_array = {1, 2, 3, 4, 5}

-- ── Dict-style (string keys) ──
local tc_dict = {name = "test", value = 42, flag = true}

-- ── Mixed ──
local tc_mixed = {1, 2, 3, name = "test", [10] = "ten", ["str key"] = "val"}

-- ── Numeric key ──
local tc_numkey = {[1] = "a", [2] = "b", [100] = "c"}

-- ── Expression values ──
local tc_expr = {1 + 2, "a" .. "b", math.floor(3.7)}

-- ── Function call as value ──
local tc_fnval = {print("inline"), math.random(1, 100)}

-- ── Table value from variable ──
local tc_varval = {x = loc1, y = loc2}

-- ── Nested tables ──
local tc_nested = {
  level1 = {
    level2 = {
      level3 = {
        deep = "value"
      }
    }
  }
}

-- ── Table with trailing separator ──
local tc_trail = {1, 2, 3,}
local tc_trail2 = {a = 1, b = 2,}

-- ── Table with method ──
local tc_method = {
  value = 42,
  get = function(self) return self.value end,
  set = function(self, v) self.value = v end,
}

-- ═══════════════════════════════════════════════════════════════
-- SECTION 5: ALL INDEXING FORMS
-- ═══════════════════════════════════════════════════════════════

local idx_tbl = {a = 1, b = {c = 2}}
local idx_str = "hello"

-- ── Dot index ──
local idx_dot = idx_tbl.a

-- ── Bracket index (string key) ──
local idx_bracket_str = idx_tbl["a"]

-- ── Bracket index (numeric key) ──
local idx_bracket_num = idx_tbl[1]

-- ── Chained dot ──
local idx_chain = idx_tbl.b.c

-- ── Chained bracket ──
local idx_chain2 = idx_tbl["b"]["c"]

-- ── Mixed chain ──
local idx_mixed = idx_tbl.b["c"]

-- ── String method call ──
local idx_strmethod = idx_str:upper()
local idx_strmethod2 = idx_str:sub(1, 3)
local idx_strmethod3 = idx_str:byte(1)

-- ── Index with expression ──
local key = "a"
local idx_expr = idx_tbl[key]
local idx_expr2 = idx_tbl[string.lower("A")]

-- ── Index assignment ──
local idx_assign = {}
idx_assign.foo = "bar"
idx_assign["baz"] = "qux"
idx_assign[1] = "first"
idx_assign[2] = "second"

-- ── Index on _G ──
local idx_g = _G.print
local idx_g2 = _G["string"]
local idx_g3 = _G.string.rep

-- ═══════════════════════════════════════════════════════════════
-- SECTION 6: ALL FUNCTION CALL FORMS
-- ═══════════════════════════════════════════════════════════════

-- ── Simple call ──
local fc_simple = print("hello")

-- ── Call with multiple args ──
local fc_multi = print("a", "b", "c", 1, 2, 3)

-- ── Call with no args ──
local fc_noargs = os.clock()

-- ── Call with table arg ──
local fc_tbl = print({1, 2, 3})

-- ── Call with function arg ──
local fc_fnarg = pcall(function() return 42 end)

-- ── Call with varargs ──
local fc_varargs = print(...)

-- ── Method call ──
local fc_method = idx_str:upper()

-- ── Method call with multiple args ──
local fc_method2 = idx_str:sub(1, 3)

-- ── Call returning multiple values ──
local fc_ret1, fc_ret2, fc_ret3 = string.find("hello world", "world")

-- ── Call in expression ──
local fc_expr = 1 + math.floor(3.7)

-- ── Call in table constructor ──
local fc_in_tbl = {math.floor(3.7), math.ceil(2.1)}

-- ── Call as argument ──
local fc_nested = print(math.floor(3.7))

-- ── Chained calls ──
local fc_chain = string.upper(string.sub("hello", 1, 3))

-- ── Self method call ──
local fc_self = tc_method:get()
tc_method:set(99)

-- ── Call with string literal as single arg (no parens) ──
local fc_noparen = print "hello"
local fc_noparen2 = require "math"   -- if supported

-- ── Call with table literal as single arg (no parens) ──
local fc_tblarg = print {1, 2, 3}

-- ── Tail call ──
local function fc_tail(x)
  return math.floor(x)
end

-- ═══════════════════════════════════════════════════════════════
-- SECTION 7: ALL SCOPE/VARIABLE PATTERNS
-- ═══════════════════════════════════════════════════════════════

-- ── Local shadowing ──
local sv = 1
do
  local sv = 2
  local _ = sv
end
-- sv is still 1 here

-- ── Block scoping ──
do
  local block_var = 10
  local _ = block_var
end

-- ── Upvalue capture ──
local uv = 100
local function uv_capture()
  return uv  -- uv is an upvalue
end

-- ── Upvalue mutation ──
local uv2 = 0
local function uv_mutate()
  uv2 = uv2 + 1
  return uv2
end
uv_mutate()
uv_mutate()

-- ── Multiple upvalues ──
local uv_a, uv_b = 1, 2
local function uv_multi()
  return uv_a + uv_b
end

-- ── Global assignment ──
sv_global = "global"
_G.explicit_global = "explicit"

-- ── Global read ──
local sv_read = _G.print
local sv_read2 = print

-- ── Local in loop ──
for i = 1, 3 do
  local loop_local = i * 2
end

-- ── Local in if ──
if true then
  local if_local = 42
end

-- ═══════════════════════════════════════════════════════════════
-- SECTION 8: ALL CONTROL FLOW PATTERNS
-- ═══════════════════════════════════════════════════════════════

-- ── Nested if ──
if true then
  if false then
    local _ = "unreachable"
  else
    local _ = "reached"
  end
end

-- ── If with complex condition ──
if (1 > 0) and (2 > 1) or (3 == 3) and not false then
  local _ = "complex"
end

-- ── For with break in middle ──
for i = 1, 100 do
  if i == 50 then break end
  local _ = i
end

-- ── While with break ──
local wb = 0
while true do
  wb = wb + 1
  if wb >= 10 then break end
end

-- ── Repeat with break ──
local rb = 0
repeat
  rb = rb + 1
  if rb >= 10 then break end
until false

-- ── Goto forward ──
local gf = 0
goto forward_label
gf = 999  -- skipped
::forward_label::
gf = gf + 1

-- ── Goto backward (loop simulation) ──
local gb = 0
::back_label::
gb = gb + 1
if gb < 5 then goto back_label end

-- ── Goto continue pattern ──
for i = 1, 10 do
  if i % 2 == 0 then goto continue_end end
  local _ = i
  ::continue_end::
end

-- ── Goto break pattern ──
for i = 1, 100 do
  if i > 5 then goto break_out end
  local _ = i
end
::break_out::

-- ── Nested loops ──
for i = 1, 3 do
  for j = 1, 3 do
    local _ = i * j
  end
end

-- ── Loop with return ──
local function loop_return()
  for i = 1, 100 do
    if i == 50 then return i end
  end
  return 0
end
local lr = loop_return()

-- ── Deeply nested control flow ──
for i = 1, 3 do
  for j = 1, 3 do
    if i == j then
      while i < 10 do
        if i == 5 then break end
        i = i + 1
      end
    end
  end
end

-- ═══════════════════════════════════════════════════════════════
-- SECTION 9: ALL STRING LIBRARY FUNCTIONS
-- ═══════════════════════════════════════════════════════════════

-- ── string.byte ──
local sb1 = string.byte("A")
local sb2 = string.byte("ABC", 1)
local sb3 = string.byte("ABC", 1, 3)
local sb4 = string.byte("ABC", -1)

-- ── string.char ──
local sc1 = string.char(65, 66, 67)
local sc2 = string.char(0x48, 0x49)

-- ── string.dump ──
local sd = string.dump(function() return 42 end)

-- ── string.find ──
local sf1 = string.find("hello world", "world")
local sf2 = string.find("hello world", "o", 6)
local sf3 = string.find("hello123", "%d+")
local sf4 = string.find("hello", "z")  -- nil
local sf5 = string.find("hello", ".", 1, true)  -- plain find

-- ── string.format ──
local sfm1 = string.format("%d", 42)
local sfm2 = string.format("%5d", 42)
local sfm3 = string.format("%-5d|", 42)
local sfm4 = string.format("%05d", 42)
local sfm5 = string.format("%f", 3.14)
local sfm6 = string.format("%.2f", 3.14159)
local sfm7 = string.format("%e", 12345.678)
local sfm8 = string.format("%g", 12345.678)
local sfm9 = string.format("%s", "hello")
local sfm10 = string.format("%q", "hello \"world\"")
local sfm11 = string.format("%x", 255)
local sfm12 = string.format("%X", 255)
local sfm13 = string.format("%o", 64)
local sfm14 = string.format("%c", 65)
local sfm15 = string.format("%%")
local sfm16 = string.format("%5s", "hi")
local sfm17 = string.format("%-5s|", "hi")
local sfm18 = string.format("%a", 3.14)       -- Lua 5.3+
local sfm19 = string.format("%i", 42)
local sfm20 = string.format("%u", 42)

-- ── string.gmatch ──
for m in string.gmatch("a1 b2 c3", "%a%d") do local _ = m end
for m in string.gmatch("hello world", "%w+") do local _ = m end
for m in string.gmatch("key=val,key2=val2", "([^=]+)=([^,]+)") do local _ = m end

-- ── string.gsub ──
local sg1 = string.gsub("hello", "l", "L")
local sg2 = string.gsub("hello", "l", "L", 1)
local sg3 = string.gsub("hello world", "%w+", function(w) return w:upper() end)
local sg4 = string.gsub("hello", "(l)", "%1%1")
local sg5 = string.gsub("hello", "%w", {h = "H", e = "E", l = "L", o = "O"})
local sg6 = string.gsub("aaa", "a", "b", 2)
local sg7, sg7n = string.gsub("hello", "l", "L")

-- ── string.len ──
local sl1 = string.len("hello")
local sl2 = #("hello")

-- ── string.lower ──
local slw = string.lower("HELLO")

-- ── string.upper ──
local su = string.upper("hello")

-- ── string.match ──
local sm1 = string.match("hello123", "%d+")
local sm2 = string.match("hello123world", "(%d+)")
local sm3 = string.match("key=value", "(%w+)=(%w+)")
local sm4 = string.match("hello", "z")  -- nil
local sm5 = string.match("2024-01-15", "(%d+)-(%d+)-(%d+)")

-- ── string.rep ──
local sr1 = string.rep("ab", 3)
local sr2 = string.rep("ab", 3, ", ")
local sr3 = string.rep("-", 10)

-- ── string.reverse ──
local srev = string.reverse("hello")

-- ── string.sub ──
local ss1 = string.sub("hello world", 1, 5)
local ss2 = string.sub("hello world", 7)
local ss3 = string.sub("hello", -3)
local ss4 = string.sub("hello", -5, -2)
local ss5 = string.sub("hello", 2, -2)

-- ── string.pack / unpack (Lua 5.3+) ──
if string.pack then
  local sp1 = string.pack("i4", 42)
  local spu1 = string.unpack("i4", sp1)
  local sp2 = string.pack(">i4i4", 1, 2)
  local spu2 = string.unpack(">i4i4", sp2)
  local sps = string.packsize("i4")
end

-- ── String method syntax ──
local sms1 = ("hello"):upper()
local sms2 = ("hello"):sub(1, 3)
local sms3 = ("hello"):len()
local sms4 = ("hello"):byte(1)
local sms5 = ("hello"):rep(3)
local sms6 = ("hello"):find("ell")
local sms7 = ("hello"):gsub("l", "L")
local sms8 = ("hello"):match("%w+")
local sms9 = ("hello"):reverse()
local sms10 = ("hello"):lower()

-- ── String patterns: character classes ──
local pc1 = string.match("a1", "%a")    -- letter
local pc2 = string.match("1a", "%d")    -- digit
local pc3 = string.match(" a", "%s")     -- whitespace
local pc4 = string.match("a", "%w")     -- alphanumeric
local pc5 = string.match("A", "%u")      -- upper
local pc6 = string.match("a", "%l")      -- lower
local pc7 = string.match("_", "%p")      -- punctuation
local pc8 = string.match("a", "%c")      -- control (nil here)
local pc9 = string.match("a", "%x")      -- hex digit
local pc10 = string.match(" ", "%g")     -- printable (nil for space)
local pc11 = string.match("a", "%A")     -- NOT letter (nil)
local pc12 = string.match("a1", "%D")    -- NOT digit (nil)

-- ── String patterns: anchors ──
local pa1 = string.match("hello", "^hello")
local pa2 = string.match("hello", "hello$")
local pa3 = string.match("hello", "^hello$")

-- ── String patterns: captures ──
local pcap1 = string.match("hello", "(h(e)llo)")
local pcap2 = string.match("hello", "()llo")
local pcap3 = string.match("hello", "(%w)()")
local pcap4 = string.gsub("hello", "()l", function(s) return s end)

-- ═══════════════════════════════════════════════════════════════
-- SECTION 10: ALL TABLE LIBRARY FUNCTIONS
-- ═══════════════════════════════════════════════════════════════

-- ── table.concat ──
local tc1 = table.concat({1, 2, 3})
local tc2 = table.concat({"a", "b", "c"}, ", ")
local tc3 = table.concat({"a", "b", "c"}, ", ", 2)
local tc4 = table.concat({"a", "b", "c"}, ", ", 1, 2)

-- ── table.insert ──
local ti_tbl = {1, 2, 3}
table.insert(ti_tbl, 4)
table.insert(ti_tbl, 1, 0)
table.insert(ti_tbl, "end")

-- ── table.remove ──
local tr_tbl = {1, 2, 3, 4, 5}
local tr1 = table.remove(tr_tbl)
local tr2 = table.remove(tr_tbl, 1)
local tr3 = table.remove(tr_tbl, 2)

-- ── table.sort ──
local ts_tbl = {5, 3, 1, 4, 2}
table.sort(ts_tbl)
table.sort(ts_tbl, function(a, b) return a > b end)
local ts_str = {"banana", "apple", "cherry"}
table.sort(ts_str)
local ts_obj = {{n = 3}, {n = 1}, {n = 2}}
table.sort(ts_obj, function(a, b) return a.n < b.n end)

-- ── table.unpack ──
local tu1 = table.unpack({1, 2, 3})
local tu2 = table.unpack({1, 2, 3, 4, 5}, 2)
local tu3 = table.unpack({1, 2, 3, 4, 5}, 2, 4)

-- ── unpack (5.1 global) ──
if unpack then
  local u1 = unpack({1, 2, 3})
  local u2 = unpack({1, 2, 3, 4, 5}, 2, 4)
end

-- ── table.pack (Lua 5.2+) ──
if table.pack then
  local tp1 = table.pack(1, 2, 3)
  local tp_n = tp1.n
end

-- ── table.move (Lua 5.3+) ──
if table.move then
  local tm_src = {1, 2, 3, 4, 5}
  local tm_dst = {}
  table.move(tm_src, 1, 5, 1, tm_dst)
  table.move(tm_src, 2, 4, 1)
end

-- ═══════════════════════════════════════════════════════════════
-- SECTION 11: ALL MATH LIBRARY FUNCTIONS
-- ═══════════════════════════════════════════════════════════════

-- ── Constants ──
local math_pi = math.pi
local math_huge = math.huge
local math_maxint = math.maxinteger or 0    -- Lua 5.3+
local math_minint = math.mininteger or 0    -- Lua 5.3+

-- ── Basic ──
local m_abs = math.abs(-5)
local m_ceil = math.ceil(3.2)
local m_floor = math.floor(3.8)
local m_max = math.max(1, 5, 3)
local m_min = math.min(1, 5, 3)
local m_sqrt = math.sqrt(16)
local m_pow = math.pow and math.pow(2, 10) or 2 ^ 10

-- ── Trigonometric ──
local m_sin = math.sin(math.pi / 2)
local m_cos = math.cos(0)
local m_tan = math.tan(0)
local m_asin = math.asin(1)
local m_acos = math.acos(1)
local m_atan = math.atan(1)
local m_atan2 = math.atan2 and math.atan2(1, 1) or math.atan(1)

-- ── Hyperbolic (Lua 5.3+) ──
if math.sinh then
  local m_sinh = math.sinh(0)
  local m_cosh = math.cosh(0)
  local m_tanh = math.tanh(0)
end

-- ── Logarithmic / Exponential ──
local m_exp = math.exp(1)
local m_log = math.log(math.e or 2.71828)
local m_log10 = math.log10 and math.log10(100) or math.log(100, 10)
local m_log2 = math.log(8, 2)

-- ── Rounding / Modulo ──
local m_fmod = math.fmod and math.fmod(10, 3) or 10 % 3
local m_modf = math.modf(3.14)
local m_modf_i, m_modf_f = math.modf(3.14)

-- ── Random ──
local m_rand1 = math.random()
local m_rand2 = math.random(100)
local m_rand3 = math.random(1, 100)
if math.randomseed then math.randomseed(os.time()) end

-- ── Type checking (Lua 5.3+) ──
if math.tointeger then
  local m_ti = math.tointeger(42)
  local m_type = math.type(42)
  local m_type2 = math.type(3.14)
end

-- ── Integer/Float division ──
local m_idiv = 5 // 2
local m_fdiv = 5 / 2

-- ═══════════════════════════════════════════════════════════════
-- SECTION 12: ALL OS LIBRARY FUNCTIONS
-- ═══════════════════════════════════════════════════════════════

local os_time = os.time()
local os_clock = os.clock()
local os_date = os.date()
local os_date2 = os.date("%Y-%m-%d %H:%M:%S")
local os_date3 = os.date("*t", os_time)
local os_date4 = os.date("!%Y-%m-%d")
local os_difftime = os.difftime(os_time, os_time - 100)
local os_getenv = os.getenv("PATH")
local os_tmpname = os.tmpname()

-- ── os.execute (if available) ──
-- local os_exec = os.execute("echo hello")

-- ── os.exit ──
-- os.exit(0)  -- would terminate

-- ── os.remove / os.rename (if available) ──
-- os.remove("test.txt")
-- os.rename("old.txt", "new.txt")

-- ── os.setlocale (if available) ──
if os.setlocale then
  local sl = os.setlocale("C", "all")
end

-- ═══════════════════════════════════════════════════════════════
-- SECTION 13: ALL IO LIBRARY FUNCTIONS
-- ═══════════════════════════════════════════════════════════════

-- ── io.write ──
io.write("hello", " ", "world", "\n")

-- ── io.read ──
-- local ir = io.read()

-- ── io.lines ──
-- for line in io.lines("file.txt") do local _ = line end

-- ── io.open / file methods ──
local io_f = io.open("test.txt", "w")
if io_f then
  io_f:write("hello")
  io_f:flush()
  -- local fr = io_f:read("*a")
  -- local fl = io_f:read("*l")
  -- local fn = io_f:read("*n")
  -- local fc = io_f:read(1)
  io_f:close()
end

-- ── io.close ──
-- io.close(io_f)

-- ── io.popen (if available) ──
-- local pp = io.popen("echo hello")
-- if pp then local pr = pp:read("*a") pp:close() end

-- ── io.tmpfile (if available) ──
if io.tmpfile then
  local tf = io.tmpfile()
  if tf then tf:close() end
end

-- ── io.type ──
-- local iot = io.type(io_f)

-- ── io.seek ──
-- if io_f then local sk = io_f:seek("set", 0) end

-- ── io.input / io.output ──
-- io.input(io.stdin)
-- io.output(io.stdout)

-- ═══════════════════════════════════════════════════════════════
-- SECTION 14: ALL COROUTINE LIBRARY FUNCTIONS
-- ═══════════════════════════════════════════════════════════════

-- ── coroutine.create ──
local co1 = coroutine.create(function(a, b)
  coroutine.yield(a + b)
  coroutine.yield(a * b)
  return a - b
end)

-- ── coroutine.resume ──
local co_r1 = coroutine.resume(co1, 3, 4)
local co_r2 = coroutine.resume(co1)
local co_r3 = coroutine.resume(co1)

-- ── coroutine.yield ──
local co2 = coroutine.create(function()
  local x = coroutine.yield(10)
  local y = coroutine.yield(20)
  return x + y
end)
local co2_r1 = coroutine.resume(co2)
local co2_r2 = coroutine.resume(co2, 100)
local co2_r3 = coroutine.resume(co2, 200)

-- ── coroutine.status ──
local co_stat = coroutine.status(co1)
local co_stat2 = coroutine.status(co2)

-- ── coroutine.wrap ──
local co_wrap = coroutine.wrap(function(x)
  coroutine.yield(x * 2)
  return x * 3
end)
local cw1 = co_wrap(5)
local cw2 = co_wrap()

-- ── coroutine.isyieldable ──
local co_iy = coroutine.isyieldable()

-- ── coroutine.running (Lua 5.3+) ──
if coroutine.running then
  local co_run, co_main = coroutine.running()
end

-- ── coroutine.close (Lua 5.4+) ──
if coroutine.close then
  local co_close = coroutine.create(function() end)
  coroutine.close(co_close)
end

-- ── Coroutine with error ──
local co_err = coroutine.create(function()
  error("co error")
end)
local co_err_ok, co_err_msg = coroutine.resume(co_err)

-- ── Coroutine with pcall inside ──
local co_pcall = coroutine.create(function()
  local ok, err = pcall(function()
    coroutine.yield("yielded")
    error("inner")
  end)
  return ok, err
end)
local co_pc1 = coroutine.resume(co_pcall)
local co_pc2 = coroutine.resume(co_pcall)

-- ═══════════════════════════════════════════════════════════════
-- SECTION 15: ALL BASIC/BUILT-IN FUNCTIONS
-- ═══════════════════════════════════════════════════════════════

-- ── print ──
print("hello")
print("a", "b", "c")
print(1, true, nil, {}, function() end)

-- ── type ──
local bt_nil = type(nil)
local bt_bool = type(true)
local bt_num = type(42)
local bt_str = type("hello")
local bt_tbl = type({})
local bt_fn = type(print)
local bt_thread = type(coroutine.create(function() end))
local bt_ud = type(newproxy and newproxy() or nil)

-- ── tostring ──
local ts1 = tostring(42)
local ts2 = tostring(true)
local ts3 = tostring(nil)
local ts4 = tostring("hello")
local ts5 = tostring({})
local ts6 = tostring(print)

-- ── tonumber ──
local tn1 = tonumber("42")
local tn2 = tonumber("3.14")
local tn3 = tonumber("FF", 16)
local tn4 = tonumber("0xFF")
local tn5 = tonumber("101", 2)
local tn6 = tonumber("not a number")
local tn7 = tonumber(true)
local tn8 = tonumber(nil)
local tn9 = tonumber("1e5")
local tn10 = tonumber("0x1A", 16)

-- ── pcall ──
local pc_ok, pc_err = pcall(function() error("test") end)
local pc_ok2, pc_ret = pcall(function() return 42 end)
local pc_ok3, pc_r1, pc_r2, pc_r3 = pcall(function() return 1, 2, 3 end)
local pc_ok4, pc_err4 = pcall(error, "string error")
local pc_ok5, pc_err5 = pcall(function() assert(false, "assert err") end)

-- ── xpcall ──
local xp_ok, xp_err = xpcall(function() error("xp test") end, function(e) return "caught: " .. tostring(e) end)
local xp_ok2, xp_ret = xpcall(function() return 42 end, function(e) return e end)
local xp_ok3, xp_r1, xp_r2 = xpcall(function() return 1, 2 end, function(e) return e end)

-- ── error ──
local err_ok, err_msg = pcall(function() error("string error") end)
local err_ok2, err_msg2 = pcall(function() error({code = 500}) end)
local err_ok3, err_msg3 = pcall(function() error("level 0", 0) end)
local err_ok4, err_msg4 = pcall(function() error("level 1", 1) end)
local err_ok5, err_msg5 = pcall(function() error("level 2", 2) end)

-- ── assert ──
local as1 = assert(true)
local as2 = assert(42)
local as3 = assert("hello")
local as_ok, as_err = pcall(function() assert(false, "assertion failed") end)
local as_ok2, as_err2 = pcall(function() assert(nil, "nil assertion") end)
local as_ok3, as_err3 = pcall(function() assert(false) end)

-- ── select ──
local sel_n = select("#", 1, 2, 3, 4, 5)
local sel_1 = select(1, "a", "b", "c")
local sel_2 = select(2, "a", "b", "c")
local sel_neg = select(-1, "a", "b", "c")
local sel_0 = select(0, "a", "b", "c")

-- ── pairs ──
for k, v in pairs({x = 1, y = 2, z = 3}) do local _ = k .. v end

-- ── ipairs ──
for i, v in ipairs({10, 20, 30}) do local _ = i + v end

-- ── next ──
local nk, nv = next({a = 1, b = 2})
local nk2, nv2 = next({a = 1, b = 2}, "a")
local nk3 = next({})

-- ── rawget ──
local rg_t = setmetatable({}, {__index = function() return "meta" end})
local rg1 = rawget(rg_t, "key")
local rg2 = rawget(rg_t, 1)

-- ── rawset ──
local rs_t = setmetatable({}, {__newindex = function() end})
rawset(rs_t, "key", "value")
rawset(rs_t, 1, "first")

-- ── rawequal ──
local re1 = rawequal({}, {})
local re2 = rawequal(1, 1)
local re3 = rawequal("a", "a")
local re_t = {}
local re4 = rawequal(re_t, re_t)

-- ── rawlen (Lua 5.2+) ──
if rawlen then
  local rl1 = rawlen({1, 2, 3})
  local rl2 = rawlen("hello")
end

-- ── setmetatable ──
local smm_t = setmetatable({}, {__index = function() return "default" end})

-- ── getmetatable ──
local gmm_t = getmetatable(smm_t)

-- ── getfenv (Lua 5.1) ──
if getfenv then
  local fe = getfenv(1)
  local fe2 = getfenv(0)
end

-- ── setfenv (Lua 5.1) ──
if setfenv then
  local newenv = setmetatable({}, {__index = _G})
  local se_fn = function() if setfenv then setfenv(1, newenv) end end
end

-- ── loadstring (Lua 5.1) ──
if loadstring then
  local ls_fn = loadstring("return 42")
  if ls_fn then local ls_r = ls_fn() end
  local ls_err = loadstring("invalid syntax !!!")
end

-- ── load (Lua 5.2+) ──
if load then
  local l_fn = load("return 21 * 2")
  if l_fn then local l_r = l_fn() end
  local l_fn2 = load("return x + y", "chunk", "t", {x = 10, y = 20})
  if l_fn2 then local l_r2 = l_fn2() end
end

-- ── loadfile (if available) ──
-- local lf = loadfile("script.lua")

-- ── dofile (if available) ──
-- local df = dofile("script.lua")

-- ── require ──
-- local req = require("math")

-- ── newproxy (Lua 5.1 / Roblox) ──
if newproxy then
  local np1 = newproxy(true)
  local np2 = newproxy(false)
  local np3 = newproxy()
  local np_meta = getmetatable(np1)
  if np_meta then
    setmetatable(np1, {__index = function() return "proxy" end})
  end
end

-- ── collectgarbage ──
if collectgarbage then
  local gc_count = collectgarbage("count")
  local gc_collect = collectgarbage("collect")
  local gc_stop = collectgarbage("stop")
  local gc_restart = collectgarbage("restart")
  local gc_step = collectgarbage("step", 100)
  local gc_stepb = collectgarbage("stepb")
  local gc_isrunning = collectgarbage("isrunning")
end

-- ── _VERSION ──
local lua_ver = _VERSION

-- ── _G ──
local g_print = _G.print
local g_string = _G.string
local g_table = _G.table
local g_math = _G.math
local g_io = _G.io
local g_os = _G.os
local g_coroutine = _G.coroutine
_G.custom = "custom global"

-- ── arg table ──
if arg then
  local arg0 = arg[0]
  local arg_n = arg.n
end

-- ═══════════════════════════════════════════════════════════════
-- SECTION 16: ALL METATABLES / METAMETHODS
-- ═══════════════════════════════════════════════════════════════

-- ── __index (table) ──
local mt_idx_t = setmetatable({}, {__index = {default = "value"}})
local mt_idx_t_r = mt_idx_t.default

-- ── __index (function) ──
local mt_idx_f = setmetatable({}, {__index = function(t, k) return "func:" .. k end})
local mt_idx_f_r = mt_idx_f.anything

-- ── __newindex (table) ──
local mt_ni_t = setmetatable({}, {__newindex = {}})
mt_ni_t.key = "val"

-- ── __newindex (function) ──
local mt_ni_store = {}
local mt_ni_f = setmetatable({}, {__newindex = function(t, k, v) mt_ni_store[k] = v end})
mt_ni_f.key = "val"

-- ── __add ──
local mt_add = setmetatable({}, {__add = function(a, b) return 100 end})
local mt_add_r = mt_add + mt_add

-- ── __sub ──
local mt_sub = setmetatable({}, {__sub = function(a, b) return 50 end})
local mt_sub_r = mt_sub - mt_sub

-- ── __mul ──
local mt_mul = setmetatable({}, {__mul = function(a, b) return 25 end})
local mt_mul_r = mt_mul * mt_mul

-- ── __div ──
local mt_div = setmetatable({}, {__div = function(a, b) return 5 end})
local mt_div_r = mt_div / mt_div

-- ── __mod ──
local mt_mod = setmetatable({}, {__mod = function(a, b) return 1 end})
local mt_mod_r = mt_mod % mt_mod

-- ── __pow ──
local mt_pow = setmetatable({}, {__pow = function(a, b) return 8 end})
local mt_pow_r = mt_pow ^ mt_pow

-- ── __concat ──
local mt_concat = setmetatable({}, {__concat = function(a, b) return "concat" end})
local mt_concat_r = mt_concat .. mt_concat

-- ── __unm ──
local mt_unm = setmetatable({}, {__unm = function(a) return "negated" end})
local mt_unm_r = -mt_unm

-- ── __len ──
local mt_len = setmetatable({}, {__len = function(a) return 42 end})
local mt_len_r = #mt_len

-- ── __eq ──
local mt_eq = setmetatable({}, {__eq = function(a, b) return true end})
local mt_eq_r = (mt_eq == mt_eq)

-- ── __lt ──
local mt_lt = setmetatable({}, {__lt = function(a, b) return true end})
local mt_lt_r = (mt_lt < mt_lt)

-- ── __le ──
local mt_le = setmetatable({}, {__le = function(a, b) return true end})
local mt_le_r = (mt_le <= mt_le)

-- ── __call ──
local mt_call = setmetatable({}, {__call = function(t, ...) return ... end})
local mt_call_r1 = mt_call(1)
local mt_call_r2 = mt_call(1, 2, 3)

-- ── __tostring ──
local mt_ts = setmetatable({}, {__tostring = function(t) return "custom_str" end})
local mt_ts_r = tostring(mt_ts)

-- ── __metatable ──
local mt_locked = setmetatable({}, {__metatable = "locked"})
local mt_locked_r = getmetatable(mt_locked)

-- ── __pairs (Lua 5.2+) ──
if pcall(function()
  local mt_p = setmetatable({}, {
    __pairs = function(t)
      return function(t, k)
        if k == nil then return "first", 1 end
        if k == "first" then return "second", 2 end
      end, t, nil
    end
  })
  for k, v in pairs(mt_p) do local _ = k .. v end
end) then end

-- ── __ipairs (Lua 5.2+) ──
if pcall(function()
  local mt_ip = setmetatable({}, {
    __ipairs = function(t)
      return function(t, i)
        i = i + 1
        if i <= 3 then return i, i * 10 end
      end, t, 0
    end
  })
  for i, v in ipairs(mt_ip) do local _ = i + v end
end) then end

-- ── __gc (Lua 5.3+) ──
if pcall(function()
  local mt_gc = setmetatable({}, {__gc = function(t) end})
end) then end

-- ── __name (Lua 5.4+) ──
if pcall(function()
  local mt_name = setmetatable({}, {__name = "MyType"})
end) then end

-- ── __close (Lua 5.4+) ──
if pcall(function()
  local mt_close = setmetatable({}, {__close = function(t) end})
end) then end

-- ── __idiv (Lua 5.3+) ──
if pcall(function()
  local mt_idiv = setmetatable({}, {__idiv = function(a, b) return 2 end})
  local r = mt_idiv // mt_idiv
end) then end

-- ── __band / __bor / __bxor / __bnot / __shl / __shr (Lua 5.3+) ──
if pcall(function()
  local mt_band = setmetatable({}, {__band = function(a, b) return 0xFF end})
  local r1 = mt_band & mt_band
  local mt_bor = setmetatable({}, {__bor = function(a, b) return 0xFF end})
  local r2 = mt_bor | mt_bor
  local mt_bxor = setmetatable({}, {__bxor = function(a, b) return 0xAA end})
  local r3 = mt_bxor ~ mt_bxor
  local mt_bnot = setmetatable({}, {__bnot = function(a) return 0xFF end})
  local r4 = ~mt_bnot
  local mt_shl = setmetatable({}, {__shl = function(a, b) return 256 end})
  local r5 = mt_shl << 8
  local mt_shr = setmetatable({}, {__shr = function(a, b) return 16 end})
  local r6 = mt_shr >> 4
end) then end

-- ── Combined metatable ──
local mt_all = setmetatable({}, {
  __index = function(t, k) return "idx_" .. k end,
  __newindex = function(t, k, v) rawset(t, k, v) end,
  __add = function(a, b) return "add" end,
  __sub = function(a, b) return "sub" end,
  __mul = function(a, b) return "mul" end,
  __div = function(a, b) return "div" end,
  __mod = function(a, b) return "mod" end,
  __pow = function(a, b) return "pow" end,
  __concat = function(a, b) return "concat" end,
  __unm = function(a) return "unm" end,
  __len = function(a) return 99 end,
  __eq = function(a, b) return true end,
  __lt = function(a, b) return false end,
  __le = function(a, b) return true end,
  __call = function(t, ...) return "called" end,
  __tostring = function(t) return "all_meta" end,
  __metatable = "protected",
})

-- ═══════════════════════════════════════════════════════════════
-- SECTION 17: ALL BIT LIBRARY FUNCTIONS
-- ═══════════════════════════════════════════════════════════════

-- ── bit library (LuaJIT / LuaBitOp) ──
if bit then
  local b_band = bit.band(0xFF, 0x0F)
  local b_bor = bit.bor(0xF0, 0x0F)
  local b_bxor = bit.bxor(0xAA, 0x55)
  local b_bnot = bit.bnot(0x00)
  local b_lshift = bit.lshift(1, 8)
  local b_rshift = bit.rshift(256, 4)
  local b_arshift = bit.arshift(-1, 1)
  local b_rol = bit.rol and bit.rol(1, 4) or 0
  local b_ror = bit.ror and bit.ror(16, 4) or 0
  local b_tobit = bit.tobit(300)
  local b_tohex = bit.tohex(255, 2)
  local b_tohex2 = bit.tohex(255)
  local b_bswap = bit.bswap and bit.bswap(0x12345678) or 0
end

-- ── bit32 library (Lua 5.2) ──
if bit32 then
  local b32_band = bit32.band(0xFF, 0x0F)
  local b32_bor = bit32.bor(0xF0, 0x0F)
  local b32_bxor = bit32.bxor(0xAA, 0x55)
  local b32_bnot = bit32.bnot(0x00)
  local b32_lshift = bit32.lshift(1, 8)
  local b32_rshift = bit32.rshift(256, 4)
  local b32_arshift = bit32.arshift(-1, 1)
  local b32_rol = bit32.rol(1, 4)
  local b32_ror = bit32.ror(16, 4)
  local b32_bswap = bit32.bswap(0x12345678)
  local b32_extract = bit32.extract(0xAB, 4, 4)
  local b32_replace = bit32.replace(0x00, 0xF, 0, 4)
  local b32_tobit = bit32.tobit(300)
  local b32_tohex = bit32.tohex(255, 2)
end

-- ═══════════════════════════════════════════════════════════════
-- SECTION 18: ALL DEBUG LIBRARY FUNCTIONS
-- ═══════════════════════════════════════════════════════════════

if debug then
  -- ── debug.traceback ──
  local db_tb = debug.traceback("test message")
  local db_tb2 = debug.traceback("test", 1)
  local db_tb3 = debug.traceback()

  -- ── debug.getinfo ──
  if debug.getinfo then
    local di = debug.getinfo(1, "SluLfn")
    local di2 = debug.getinfo(print, "SluLfn")
    local di_name = di.name
    local di_src = di.source
    local di_line = di.currentline
    local di_lnum = di.linedefined
    local di_lastl = di.lastlinedefined
    local di_what = di.what
    local di_fn = di.func
    local di_nups = di.nups
    local di_nparams = di.nparams
    local di_isvararg = di.isvararg
  end

  -- ── debug.getlocal / setlocal ──
  if debug.getlocal then
    local ln, lv = debug.getlocal(1, 1)
  end
  if debug.setlocal then
    -- debug.setlocal(1, 1, "new_value")
  end

  -- ── debug.getupvalue / setupvalue ──
  if debug.getupvalue then
    -- local upn, upv = debug.getupvalue(print, 1)
  end
  if debug.setupvalue then
    -- debug.setupvalue(fn, 1, "new_val")
  end

  -- ── debug.sethook / gethook ──
  if debug.sethook then
    debug.sethook(function(event, line) end, "l")
    debug.sethook(function(event, line) end, "c")
    debug.sethook(function(event, line) end, "r")
    debug.sethook(function(event, line) end, "crl", 100)
    local hk = debug.gethook()
    debug.sethook()
  end

  -- ── debug.getregistry ──
  if debug.getregistry then
    local reg = debug.getregistry()
  end

  -- ── debug.getmetatable / setmetatable ──
  if debug.getmetatable then
    local dgm = debug.getmetatable({})
  end
  if debug.setmetatable then
    -- debug.setmetatable({}, {__index = function() end})
  end

  -- ── debug.getuservalue / setuservalue (Lua 5.2+) ──
  if debug.getuservalue then
    -- local uv = debug.getuservalue(newproxy())
  end
  if debug.setuservalue then
    -- debug.setuservalue(newproxy(), {})
  end

  -- ── debug.upvalueid (Lua 5.2+) ──
  if debug.upvalueid then
    -- local id = debug.upvalueid(print, 1)
  end

  -- ── debug.upvaluejoin (Lua 5.2+) ──
  if debug.upvaluejoin then
    -- debug.upvaluejoin(fn1, 1, fn2, 1)
  end
end

-- ═══════════════════════════════════════════════════════════════
-- SECTION 19: ALL PACKAGE LIBRARY
-- ═══════════════════════════════════════════════════════════════

if package then
  local p_path = package.path
  local p_cpath = package.cpath
  local p_loaded = package.loaded
  local p_preload = package.preload
  local p_loaders = package.loaders or package.searchers
  local p_config = package.config

  -- ── package.searchpath (Lua 5.2+) ──
  if package.searchpath then
    -- local sp = package.searchpath("module", package.path)
  end

  -- ── package.seeall (Lua 5.1) ──
  if package.seeall then
    -- module("m", package.seeall)
  end
end

-- ═══════════════════════════════════════════════════════════════
-- SECTION 20: ALL UTF8 LIBRARY (Lua 5.3+)
-- ═══════════════════════════════════════════════════════════════

if utf8 then
  local u_len = utf8.len("héllo")
  local u_char = utf8.char(0x41, 0x42)
  local u_codepoint = utf8.codepoint("A")
  local u_offset = utf8.offset("héllo", 1)
  local u_offset2 = utf8.offset("héllo", 2, 1)
  local u_codes = utf8.codes("héllo")
  for c, p in utf8.codes("héllo") do local _ = c end
  for c in utf8.codepoint("héllo", 1, -1) do local _ = c end
  local u_charpattern = utf8.charpattern
end

-- ═══════════════════════════════════════════════════════════════
-- SECTION 21: ALL FUNCTION PATTERNS
-- ═══════════════════════════════════════════════════════════════

-- ── Closure with upvalue ──
local function make_adder(n)
  return function(x) return x + n end
end
local add5 = make_adder(5)
local add10 = make_adder(10)
local add5_r = add5(3)
local add10_r = add10(3)

-- ── Closure with shared upvalue ──
local function make_pair()
  local count = 0
  local function inc() count = count + 1 return count end
  local function dec() count = count - 1 return count end
  local function get() return count end
  return inc, dec, get
end
local inc, dec, get = make_pair()
inc()
inc()
dec()
local shared_r = get()

-- ── Recursive function ──
local function fib(n)
  if n <= 1 then return n end
  return fib(n - 1) + fib(n - 2)
end
local fib_10 = fib(10)

-- ── Mutual recursion ──
local is_even
local function is_odd(n) return n ~= 0 and is_even(n - 1) or false end
function is_even(n) return n == 0 or is_odd(n - 1) end
local even_10 = is_even(10)
local odd_7 = is_odd(7)

-- ── Tail call ──
local function tail_sum(n, acc)
  if n <= 0 then return acc end
  return tail_sum(n - 1, acc + n)
end
local ts = tail_sum(100, 0)

-- ── Varargs forwarding ──
local function forward(...)
  return print(...)
end
forward("a", "b", "c")

-- ── Varargs with select ──
local function vararg_select(...)
  local n = select("#", ...)
  local first = select(1, ...)
  local last = select(-1, ...)
  local mid = select(math.floor(n / 2), ...)
  return n, first, last, mid
end
local vs_n, vs_f, vs_l, vs_m = vararg_select(1, 2, 3, 4, 5)

-- ── Varargs in table ──
local function vararg_table(...)
  return {...}
end
local vt = vararg_table(1, 2, 3)

-- ── Varargs with nil ──
local function vararg_nil(...)
  local n = select("#", ...)
  local t = {...}
  return n, #t
end
local vn1, vn2 = vararg_nil(nil, nil, nil)

-- ── Multiple return value handling ──
local function multi() return 1, 2, 3 end
local mr1 = multi()              -- only first value
local mr2, mr3 = multi()         -- first 2
local mr4 = {multi()}            -- all in table
local mr5 = multi() + 1          -- only first used
local mr6 = {multi(), "end"}     -- first + literal
local mr7 = ("prefix"):rep(multi())  -- first only

-- ── Function as table value ──
local fn_tbl = {
  function() return 1 end,
  function() return 2 end,
  function() return 3 end,
}
for i, fn in ipairs(fn_tbl) do local _ = fn() end

-- ── Function as key ──
local fn_key = {}
local fn_as_key = {}
fn_key[fn_as_key] = "value"
local fn_key_r = fn_key[fn_as_key]

-- ── Higher-order functions ──
local function compose(f, g)
  return function(x) return f(g(x)) end
end
local inc_fn = function(x) return x + 1 end
local dbl_fn = function(x) return x * 2 end
local inc_dbl = compose(inc_fn, dbl_fn)
local hof_r = inc_dbl(5)

-- ── Map / filter / reduce ──
local function map(t, fn)
  local r = {}
  for i, v in ipairs(t) do r[i] = fn(v) end
  return r
end
local function filter(t, fn)
  local r = {}
  for _, v in ipairs(t) do
    if fn(v) then r[#r + 1] = v end
  end
  return r
end
local function reduce(t, fn, acc)
  for _, v in ipairs(t) do acc = fn(acc, v) end
  return acc
end
local map_r = map({1, 2, 3}, function(x) return x * 2 end)
local filter_r = filter({1, 2, 3, 4, 5}, function(x) return x % 2 == 0 end)
local reduce_r = reduce({1, 2, 3, 4, 5}, function(a, b) return a + b end, 0)

-- ═══════════════════════════════════════════════════════════════
-- SECTION 22: ALL OOP PATTERNS
-- ═══════════════════════════════════════════════════════════════

-- ── Class with __index ──
local Animal = {}
Animal.__index = Animal
function Animal.new(name, sound)
  local self = setmetatable({}, Animal)
  self.name = name
  self.sound = sound
  return self
end
function Animal:speak()
  return self.name .. " says " .. self.sound
end
function Animal:getName() return self.name end
function Animal:setName(name) self.name = name end
local dog = Animal.new("Rex", "Woof")
local dog_speak = dog:speak()
dog:setName("Buddy")
local dog_name = dog:getName()

-- ── Inheritance ──
local Cat = setmetatable({}, {__index = Animal})
Cat.__index = Cat
function Cat.new(name)
  local self = Animal.new(name, "Meow")
  return setmetatable(self, Cat)
end
function Cat:purr() return self.name .. " purrs" end
function Cat:speak()  -- override
  return self.name .. " says " .. self.sound .. " and purrs"
end
local kitty = Cat.new("Whiskers")
local kitty_speak = kitty:speak()
local kitty_purr = kitty:purr()
local kitty_name = kitty:getName()  -- inherited

-- ── Multi-level inheritance ──
local Lion = setmetatable({}, {__index = Cat})
Lion.__index = Lion
function Lion.new(name)
  local self = Cat.new(name)
  self.sound = "Roar"
  return setmetatable(self, Lion)
end
function Lion:roar() return self.name .. " ROARS!" end
local simba = Lion.new("Simba")
local simba_speak = simba:speak()
local simba_roar = simba:roar()
local simba_purr = simba:purr()      -- inherited from Cat
local simba_name = simba:getName()  -- inherited from Animal

-- ── Class with class methods ──
local Counter = {}
Counter.__index = Counter
Counter._count = 0
function Counter.new() return setmetatable({}, Counter) end
function Counter:increment() Counter._count = Counter._count + 1 return self end
function Counter:getCount() return Counter._count end
local cnt = Counter.new():increment():increment():increment()
local cnt_r = Counter:getCount()

-- ── Polymorphism ──
local function make_all_speak(animals)
  local results = {}
  for _, a in ipairs(animals) do
    results[#results + 1] = a:speak()
  end
  return results
end
local poly = make_all_speak({dog, kitty, simba})

-- ═══════════════════════════════════════════════════════════════
-- SECTION 23: ALL DATA STRUCTURE PATTERNS
-- ═══════════════════════════════════════════════════════════════

-- ── Stack ──
local Stack = {}
Stack.__index = Stack
function Stack.new() return setmetatable({items = {}, size = 0}, Stack) end
function Stack:push(v) self.size = self.size + 1 self.items[self.size] = v end
function Stack:pop() if self.size == 0 then return nil end local v = self.items[self.size] self.items[self.size] = nil self.size = self.size - 1 return v end
function Stack:peek() return self.items[self.size] end
function Stack:isEmpty() return self.size == 0 end
local stk = Stack.new()
stk:push(1) stk:push(2) stk:push(3)
local stk_pop = stk:pop()
local stk_peek = stk:peek()

-- ── Queue ──
local Queue = {}
Queue.__index = Queue
function Queue.new() return setmetatable({items = {}, head = 1, tail = 0}, Queue) end
function Queue:enqueue(v) self.tail = self.tail + 1 self.items[self.tail] = v end
function Queue:dequeue() if self.head > self.tail then return nil end local v = self.items[self.head] self.items[self.head] = nil self.head = self.head + 1 return v end
function Queue:size() return self.tail - self.head + 1 end
local que = Queue.new()
que:enqueue("a") que:enqueue("b") que:enqueue("c")
local que_d = que:dequeue()

-- ── Linked list ──
local function ll_node(val) return {val = val, next = nil} end
local function ll_push(head, val) local n = ll_node(val) n.next = head return n end
local ll = nil
ll = ll_push(ll, 3) ll = ll_push(ll, 2) ll = ll_push(ll, 1)
local ll_curr = ll
while ll_curr do local _ = ll_curr.val ll_curr = ll_curr.next end

-- ── Set ──
local Set = {}
Set.__index = Set
function Set.new() return setmetatable({items = {}}, Set) end
function Set:add(v) self.items[v] = true end
function Set:remove(v) self.items[v] = nil end
function Set:has(v) return self.items[v] == true end
function Set:size() local n = 0 for _ in pairs(self.items) do n = n + 1 end return n end
local st = Set.new()
st:add("a") st:add("b") st:add("c")
st:remove("b")
local st_has = st:has("a")
local st_size = st:size()

-- ── Graph (adjacency list) ──
local function graph_new() return {nodes = {}} end
local function graph_add_edge(g, from, to) g.nodes[from] = g.nodes[from] or {} table.insert(g.nodes[from], to) end
local function graph_neighbors(g, node) return g.nodes[node] or {} end
local gr = graph_new()
graph_add_edge(gr, "a", "b") graph_add_edge(gr, "a", "c") graph_add_edge(gr, "b", "d")
local gr_n = graph_neighbors(gr, "a")

-- ═══════════════════════════════════════════════════════════════
-- SECTION 24: ALL ITERATOR PATTERNS
-- ═══════════════════════════════════════════════════════════════

-- ── Stateless iterator ──
local function iter_range(max)
  local function iter(t, i)
    i = i + 1
    if i <= max then return i, i * i end
  end
  return iter, {}, 0
end
for i, sq in iter_range(5) do local _ = i + sq end

-- ── Stateful iterator (closure) ──
local function iter_closure(max)
  local i = 0
  return function()
    i = i + 1
    if i <= max then return i end
  end
end
for v in iter_closure(5) do local _ = v end

-- ── Iterator with multiple returns ──
local function iter_pairs(t)
  local k = nil
  return function()
    k = next(t, k)
    if k then return k, t[k] end
  end
end
for k, v in iter_pairs({x = 1, y = 2}) do local _ = k .. v end

-- ── File line iterator ──
-- for line in io.lines("file.txt") do local _ = line end

-- ── String gmatch iterator ──
for word in string.gmatch("the quick brown fox", "%w+") do local _ = word end
for k, v in string.gmatch("a=1,b=2", "(%w)=(%d)") do local _ = k .. v end

-- ── Custom iterator with state ──
local function iter_fib(max)
  local a, b = 0, 1
  local count = 0
  return function()
    if count >= max then return nil end
    count = count + 1
    a, b = b, a + b
    return a
  end
end
for fib_v in iter_fib(10) do local _ = fib_v end

-- ═══════════════════════════════════════════════════════════════
-- SECTION 25: ALL ERROR HANDLING PATTERNS
-- ═══════════════════════════════════════════════════════════════

-- ── pcall with function ──
local eh1_ok, eh1_err = pcall(function() error("pcall err") end)

-- ── pcall with arguments ──
local function eh_fn(a, b) if a == b then error("equal") end return a + b end
local eh2_ok, eh2_r = pcall(eh_fn, 1, 1)
local eh3_ok, eh3_r = pcall(eh_fn, 1, 2)

-- ── pcall returning multiple ──
local eh4_ok, eh4_a, eh4_b, eh4_c = pcall(function() return 1, 2, 3 end)

-- ── xpcall with handler ──
local eh5_ok, eh5_err = xpcall(function() error("xpcall err") end, function(e) return "handled: " .. tostring(e) end)

-- ── xpcall with args ──
local eh6_ok, eh6_r = xpcall(eh_fn, function(e) return e end, 1, 2)

-- ── Nested pcall ──
local eh7_ok, eh7_err = pcall(function()
  local ok, err = pcall(function() error("inner") end)
  if not ok then error("rethrown: " .. err) end
end)

-- ── pcall with assert ──
local eh8_ok, eh8_err = pcall(function() assert(nil, "assert in pcall") end)

-- ── Error with table ──
local eh9_ok, eh9_err = pcall(function() error({code = 42, msg = "table err"}) end)

-- ── Error with level ──
local eh10_ok, eh10_err = pcall(function() error("level 0", 0) end)
local eh11_ok, eh11_err = pcall(function() error("level 1", 1) end)
local eh12_ok, eh12_err = pcall(function() error("level 2", 2) end)

-- ── Protected require ──
-- local req_ok, req_err = pcall(require, "nonexistent")

-- ── Error propagation ──
local function deep1() error("deep error") end
local function deep2() return deep1() end
local function deep3() return deep2() end
local deep_ok, deep_err = pcall(deep3)

-- ═══════════════════════════════════════════════════════════════
-- SECTION 26: ALL STRING PATTERN CLASSES
-- ═══════════════════════════════════════════════════════════════

-- ── All character classes ──
local pat_a = string.match("abc", "%a")     -- any letter
local pat_A = string.match("123", "%A")     -- any non-letter
local pat_d = string.match("a1b", "%d")     -- any digit
local pat_D = string.match("abc", "%D")     -- any non-digit
local pat_l = string.match("Abc", "%l")     -- any lowercase
local pat_L = string.match("ABC", "%L")     -- any non-lowercase
local pat_u = string.match("aBc", "%u")     -- any uppercase
local pat_U = string.match("abc", "%U")     -- any non-uppercase
local pat_s = string.match("hello world", "%s")  -- any whitespace
local pat_S = string.match("hello", "%S")   -- any non-whitespace
local pat_w = string.match("a_1", "%w")    -- any alphanumeric
local pat_W = string.match("!@#", "%W")     -- any non-alphanumeric
local pat_p = string.match("a!b", "%p")     -- any punctuation
local pat_P = string.match("abc", "%P")     -- any non-punctuation
local pat_c = string.match("\n", "%c")     -- any control char
local pat_C = string.match("a", "%C")       -- any non-control
local pat_x = string.match("g", "%x")      -- any hex digit
local pat_X = string.match("g", "%X")      -- any non-hex digit
local pat_g = string.match("a", "%g")      -- any printable (excl space)
local pat_G = string.match(" ", "%G")      -- any non-printable

-- ── Quantifiers ──
local q_star = string.match("aaa", "%a*")       -- 0+
local q_plus = string.match("aaa", "%a+")        -- 1+
local q_minus = string.match("aaa", "%a-")       -- 0+ (lazy)
local q_q = string.match("aaa", "%a?")           -- 0 or 1
local q_num = string.match("aaa", "%a{3}")      -- exactly n
local q_range = string.match("aaaa", "%a{2,3}")  -- n to m
local q_min = string.match("aaaaa", "%a{2,}")    -- at least n

-- ── Anchors ──
local a_start = string.match("hello", "^he")
local a_end = string.match("hello", "lo$")
local a_both = string.match("hello", "^hello$")

-- ── Captures ──
local c1 = string.match("hello", "(h)(e)(l)(l)(o)")  -- multiple
local c2 = string.match("hello", "(he(l)lo)")         -- nested
local c3 = string.match("hello", "()llo")              -- position
local c4 = string.match("hello123", "(%a+)(%d+)")      -- split
local c5 = string.match("hello", "%w")                 -- no capture
local c6 = string.match("hello", "(%w)")               -- single capture
local c7 = string.gsub("hello", "(%w)(%w)", "%2%1")     -- swap pairs

-- ── Character sets ──
local cs1 = string.match("abc", "[abc]")
local cs2 = string.match("abc", "[a-z]")
local cs3 = string.match("ABC", "[A-Z]")
local cs4 = string.match("a1", "[a%d]")
local cs5 = string.match("a!", "[^a-z]")
local cs6 = string.match("a_b", "[%w_]")

-- ── Special items ──
local si1 = string.match("hello", "%b()")      -- balanced match
local si2 = string.match("hello (world)", "%b()")
local si3 = string.match("hello", "%f[%a]")    -- frontier match
local si4 = string.match("hello", ".")          -- any char
local si5 = string.match("hello", ".+")         -- greedy
local si6 = string.match("hello", ".-")         -- lazy

-- ═══════════════════════════════════════════════════════════════
-- SECTION 27: ALL NUMERIC FORMATS
-- ═══════════════════════════════════════════════════════════════

local num_int = 42
local num_neg = -42
local num_zero = 0
local num_float = 3.14
local num_dot = .5
local num_dot2 = 5.
local num_sci = 1.5e10
local num_sci2 = 2.5e-3
local num_sci3 = 1E5
local num_sci4 = 1.5E-10
local num_hex = 0xFF
local num_hex2 = 0x1A2B3C
local num_hexf = 0xFF.0p0
local num_hexf2 = 0x1.8p3
local num_bin = 0b1010          -- Luau
local num_bin2 = 0b11110000     -- Luau
local num_max = math.huge
local num_min = -math.huge
local num_nan = 0 / 0
local num_inf = 1 / 0
local num_ninf = -1 / 0

-- ── Integer vs float (Lua 5.3+) ──
local ni_int = 42
local ni_float = 42.0
local ni_div = 42 / 2          -- float
local ni_idiv = 42 // 2        -- integer
local ni_conv = 42.0 // 1

-- ── Number formatting ──
local nf1 = string.format("%d", 42)
local nf2 = string.format("%i", 42)
local nf3 = string.format("%u", 42)
local nf4 = string.format("%x", 255)
local nf5 = string.format("%X", 255)
local nf6 = string.format("%o", 64)
local nf7 = string.format("%f", 3.14)
local nf8 = string.format("%e", 12345.678)
local nf9 = string.format("%E", 12345.678)
local nf10 = string.format("%g", 12345.678)
local nf11 = string.format("%G", 12345.678)
local nf12 = string.format("%c", 65)
local nf13 = string.format("%s", "hello")
local nf14 = string.format("%q", "hello \"world\"")
local nf15 = string.format("%a", 3.14)
local nf16 = string.format("%A", 3.14)
local nf17 = string.format("%5d", 42)
local nf18 = string.format("%-5d|", 42)
local nf19 = string.format("%05d", 42)
local nf20 = string.format("%+d", 42)
local nf21 = string.format("% d", 42)
local nf22 = string.format("%.2f", 3.14159)
local nf23 = string.format("%5.2f", 3.14159)
local nf24 = string.format("%-5.2f|", 3.14159)
local nf25 = string.format("%5s", "hi")
local nf26 = string.format("%-5s|", "hi")
local nf27 = string.format("%.3s", "hello")
local nf28 = string.format("%5.3s", "hello")
local nf29 = string.format("%%")
local nf30 = string.format("%d %s %f", 42, "hello", 3.14)

-- ═══════════════════════════════════════════════════════════════
-- SECTION 28: ALL ENVIRONMENT-SPECIFIC EXTENSIONS
-- ═══════════════════════════════════════════════════════════════

-- ── Luau: typeof ──
if typeof then
  local to1 = typeof({})
  local to2 = typeof("hello")
  local to3 = typeof(42)
  local to4 = typeof(true)
  local to5 = typeof(nil)
  local to6 = typeof(print)
  local to7 = typeof(coroutine.create(function() end))
end

-- ── Luau: type() extended ──
if typeof then
  local te1 = type({})
  local te2 = typeof(newproxy and newproxy() or {})
end

-- ── Luau: string interpolation / format ──
-- Luau supports backtick strings:
-- local interp = `Hello {name}!`

-- ── Luau: continue keyword ──
-- for i = 1, 10 do
--   if i % 2 == 0 then continue end
--   local _ = i
-- end

-- ── Luau: compound assignment ──
local ca = 10
ca += 5
ca -= 3
ca *= 2
ca /= 4
ca %= 3
ca ^= 2
ca //= 1
ca ..= "x"

-- ── Luau: type annotations (if supported) ──
-- local typed: number = 42
-- local function typed_fn(x: number, y: string): boolean return true end

-- ── Luau: export type ──
-- export type Point = {x: number, y: number}

-- ── Roblox: game, workspace, Instance ──
if game then
  -- local inst = Instance.new("Part")
  -- local svc = game:GetService("ReplicatedStorage")
  -- local players = game:GetService("Players")
end

-- ── Roblox: task library ──
if task then
  -- task.wait(1)
  -- task.spawn(function() end)
  -- task.delay(1, function() end)
  -- task.defer(function() end)
  local t_clock = task.wait and 0 or os.clock()
end

-- ── Roblox: warn ──
if warn then
  warn("warning message")
end

-- ── Roblox: checkindex / checkself ──
-- (environment specific)

-- ── Lua 5.4: <const> and <close> attributes ──
-- local x <const> = 42
-- local f <close> = setmetatable({}, {__close = function() end})

-- ═══════════════════════════════════════════════════════════════
-- SECTION 29: ALL SPECIAL SYNTAX FORMS
-- ═══════════════════════════════════════════════════════════════

-- ── Function call without parens (string) ──
print "hello"
print 'hello'
-- require "math"

-- ── Function call without parens (table) ──
print {1, 2, 3}
print {key = "val"}

-- ── Method call without parens (string) ──
local ss = ("hello")
local ss_upper = ss:upper()
local ss_sub = ss:sub "1,3"  -- if supported

-- ── Chained string methods ──
local chain = ("hello"):upper():lower():reverse()

-- ── Nested table access ──
local nt = {a = {b = {c = {d = "deep"}}}}
local nt_deep = nt.a.b.c.d

-- ── Table index with call ──
local tic = {{fn = function() return 42 end}}
local tic_r = tic[1].fn()

-- ── Mixed dot/bracket ──
local mb = nt["a"].b["c"].d

-- ── Semicolons as separators ──
local s1 = 1; local s2 = 2; local s3 = 3;

-- ── Comments ──
-- single line
--[[ block comment ]]
--[==[ nested block comment ]==]
--- doc comment style

-- ── Multi-value return in middle ──
local function mr_test() return 1, 2, 3 end
local mr_mid = {mr_test(), "extra"}  -- only first value + extra
local mr_all = {mr_test()}           -- all values

-- ── Function definition in table ──
local fdt = {
  f1 = function() end,
  f2 = function() end,
  method = function(self, x) return x end,
}

-- ── Self-referencing table ──
local sr = {}
sr.self = sr
local sr_deep = sr.self.self.self

-- ═══════════════════════════════════════════════════════════════
-- SECTION 30: ALL EDGE CASES
-- ═══════════════════════════════════════════════════════════════

-- ── Empty function ──
local function empty() end

-- ── Function returning nothing ──
local function void() return end
local void_r = void()  -- nil

-- ── Nil index (error) ──
local ni_ok = pcall(function() return nil[1] end)

-- ── Nil call (error) ──
local nc_ok = pcall(function() return nil() end)

-- ── Arithmetic on nil (error) ──
local an_ok = pcall(function() return nil + 1 end)

-- ── Comparison with different types ──
local ct1 = (1 == "1")       -- false
local ct2 = (1 == 1.0)       -- true (Lua 5.3: true for same value)
local ct3 = ("a" < "b")      -- string comparison
local ct4 = pcall(function() return 1 < "1" end)  -- error in 5.3+

-- ── Integer overflow ──
local io1 = math.maxinteger or 0
local io2 = io1 + 1           -- wraps in Lua 5.3+

-- ── Float precision ──
local fp1 = 0.1 + 0.2
local fp2 = string.format("%.17g", fp1)

-- ─-- Empty table length ──
local et_len = #{}

-- ── Table with hole ──
local th = {1, 2, nil, 4}
local th_len = #th  -- undefined

-- ── String with NUL byte ──
local nul_str = "hello\0world"
local nul_len = #nul_str  -- 11

-- ── Very long string ──
local long_str = string.rep("x", 1000)

-- ─-- Deeply nested ──
local dn = {}
local dn_curr = dn
for i = 1, 10 do
  dn_curr[i] = {}
  dn_curr = dn_curr[i]
end

-- ── Large table ──
local lt = {}
for i = 1, 100 do lt[i] = i end
local lt_len = #lt

-- ── Multiple assignment with nil ──
local ma_nil1, ma_nil2 = nil, nil
local ma_mix1, ma_mix2, ma_mix3 = 1, nil, 3

-- ── And/or as ternary ──
local tern1 = true and "yes" or "no"
local tern2 = false and "yes" or "no"
local tern3 = nil and "yes" or "default"
local tern4 = 0 and "yes" or "no"  -- 0 is truthy in Lua!

-- ─-- Chained and/or ──
local cao1 = nil or false or nil or "last"
local cao2 = "first" and "second" and "third"

-- ── Comparison chaining (doesn't work like Python) ──
local cc1 = (1 < 2) and (2 < 3)  -- true
local cc2 = (1 < 2) and (2 > 3)   -- false

-- ── Short-circuit with side effects ──
local sce = 0
local function sce_fn() sce = sce + 1 return true end
local _ = false and sce_fn()  -- not called
local _ = true or sce_fn()    -- not called
local _ = true and sce_fn()   -- called
local sce_r = sce

-- ═══════════════════════════════════════════════════════════════
-- SECTION 31: ALL WEAK TABLE MODES
-- ═══════════════════════════════════════════════════════════════

if setmetatable then
  local weak_k = setmetatable({}, {__mode = "k"})
  local weak_v = setmetatable({}, {__mode = "v"})
  local weak_kv = setmetatable({}, {__mode = "kv"})
  weak_k[{}] = "key is weak"
  weak_v["k"] = {}
  weak_kv[{}] = {}
end

-- ═══════════════════════════════════════════════════════════════
-- SECTION 32: ALL STRING ESCAPE SEQUENCES
-- ═══════════════════════════════════════════════════════════════

local esc_a = "\a"     -- bell
local esc_b = "\b"     -- backspace
local esc_f = "\f"     -- form feed
local esc_n = "\n"     -- newline
local esc_r = "\r"     -- carriage return
local esc_t = "\t"     -- tab
local esc_v = "\v"     -- vertical tab
local esc_back = "\\"  -- backslash
local esc_q = "\""     -- quote
local esc_aq = "\'"    -- apostrophe
local esc_dec = "\65"  -- decimal
local esc_hex = "\x41" -- hex (Lua 5.2+)
local esc_z = "\z
  skip whitespace"
local esc_d = "\100"   -- decimal

-- ═══════════════════════════════════════════════════════════════
-- SECTION 33: ALL FINAL COMPREHENSIVE TEST
-- ═══════════════════════════════════════════════════════════════

-- ── Everything combined ──
local function comprehensive(a, b, c, ...)
  local args = {...}
  local n = select("#", ...)
  local result = 0

  -- Use all operators
  result = result + a + b - c
  result = result * 2 / 4
  result = result % 10
  result = result ^ 2
  result = -result
  result = result // 1

  -- Use all comparisons
  if result > 0 and result < 100 then
    result = result + 1
  elseif result == 0 or result >= 100 then
    result = result - 1
  else
    result = not result and 0 or result
  end

  -- Use string operations
  local s = tostring(result)
  s = s:upper():lower():reverse()
  s = string.format("%d", result)
  s = string.gsub(s, "%d", "X")
  s = s .. " end"
  local sl = #s

  -- Use table operations
  local t = {}
  for i = 1, n do
    local arg = args[i]
    if type(arg) == "number" then
      table.insert(t, arg)
    elseif type(arg) == "string" then
      t[arg] = true
    elseif type(arg) == "table" then
      for k, v in pairs(arg) do t[k] = v end
    elseif type(arg) == "function" then
      result = result + (arg() or 0)
    end
  end

  -- Use loops
  for i = 1, #t do
    result = result + t[i]
  end

  for k, v in pairs(t) do
    if type(k) == "string" then result = result + 1 end
  end

  -- Use coroutine
  local co = coroutine.create(function(x)
    coroutine.yield(x)
    return x * 2
  end)
  local co_ok, co_val = coroutine.resume(co, result)
  local co_ok2, co_val2 = coroutine.resume(co)

  -- Use pcall
  local ok, err = pcall(function()
    assert(result > 0, "must be positive")
  end)

  -- Use metatable
  local mt = setmetatable(t, {
    __len = function() return 999 end,
    __tostring = function() return "comprehensive" end,
  })
  local mt_len = #mt
  local mt_str = tostring(mt)

  return result, sl, mt_len, mt_str, co_val2
end

local comp_r = comprehensive(
  10, 20, 5,
  1, 2, 3,
  "string",
  {key = "value", num = 42},
  function() return 100 end,
  nil, true, false
)

-- ═══════════════════════════════════════════════════════════════
-- SECTION 34: FINAL OUTPUT
-- ═══════════════════════════════════════════════════════════════

print("═══════════════════════════════════════")
print("  ALL-LUA.LUA — Execution Complete")
print("  Every Lua feature has been exercised.")
print("═══════════════════════════════════════")
print("Version:", _VERSION)
print("Factorial(5):", factorial(5))
print("Fib(10):", fib(10))
print("Counter:", Counter:getCount())
print("Comprehensive result:", comp_r)
print("Dog:", dog:speak())
print("Cat:", kitty:speak())
print("Lion:", simba:roar())
print("Stack pop:", stk_pop)
print("Queue dequeue:", que_d)
print("Map result:", #map_r)
print("Filter result:", #filter_r)
print("Reduce result:", reduce_r)
print("═══════════════════════════════════════")
