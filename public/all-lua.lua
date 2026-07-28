-- ═══════════════════════════════════════════════════════
--  ALL-LUA.LUA — Comprehensive Lua Feature Coverage Script
--  Every keyword, operator, built-in function, and pattern
--  Designed to exercise all WeAreDevs VM opcodes
-- ═══════════════════════════════════════════════════════

-- ── Local variable declarations ──
local a = 1
local b = 2
local c = 3
local d = "hello"
local e = true
local f = false
local g = nil
local h = {...}
local i, j, k = 1, 2, 3

-- ── Global variable declarations ──
globalA = 10
globalB = "world"
globalC = true
globalD = nil

-- ── All arithmetic operators ──
local add = a + b
local sub = a - b
local mul = a * b
local div = a / b
local mod = a % b
local pow = a ^ b
local neg = -a
local floor_div = a // b

-- ── All comparison operators ──
local eq = (a == b)
local neq = (a ~= b)
local lt = (a < b)
local le = (a <= b)
local gt = (a > b)
local ge = (a >= b)

-- ── All logical operators ──
local and_op = true and false
local or_op = true or false
local not_op = not true

-- ── String concatenation ──
local concat = d .. " " .. globalB
local concat_num = "num: " .. tostring(a)

-- ── Length operator ──
local str_len = #d
local tbl_len = #{1, 2, 3, 4, 5}

-- ── Multiple assignment ──
local x, y, z = 1, 2, 3
x, y = y, x

-- ── If / elseif / else ──
if a == 1 then
  c = 10
elseif a == 2 then
  c = 20
else
  c = 0
end

-- ── Numeric for loop ──
for i = 1, 10 do
  local loop_val = i
end

-- ── Numeric for loop with step ──
for i = 10, 1, -1 do
  local reverse_val = i
end

-- ── Generic for loop (pairs) ──
local sample_table = {one = 1, two = 2, three = 3}
for key, value in pairs(sample_table) do
  local kv = key .. "=" .. tostring(value)
end

-- ── Generic for loop (ipairs) ──
local array_table = {10, 20, 30, 40, 50}
for index, value in ipairs(array_table) do
  local iv = index * value
end

-- ── Generic for loop with next ──
for k in next, sample_table do
  local nk = k
end

-- ── While loop ──
local w_count = 0
while w_count < 5 do
  w_count = w_count + 1
end

-- ── Repeat / until loop ──
local r_count = 0
repeat
  r_count = r_count + 1
until r_count >= 5

-- ── Break ──
for i = 1, 100 do
  if i > 10 then break end
end

-- ── Continue (if supported) ──
for i = 1, 10 do
  if i % 2 == 0 then
    -- continue not standard Lua but some environments support it
    local even = i
  end
end

-- ── Function declarations ──
local function local_func(x, y)
  return x + y
end

function global_func(x, y)
  return x * y
end

local arrow = function(x)
  return x * 2
end

-- ── Function with varargs ──
local function vararg_func(...)
  local args = {...}
  local n = select("#", ...)
  local first = select(1, ...)
  return args, n, first
end

-- ── Function with multiple returns ──
local function multi_return()
  return 1, 2, 3, 4, 5
end

local r1, r2, r3 = multi_return()

-- ── Method call (self) ──
local obj = {}
function obj:method(val)
  return self, val
end
local obj_result = obj:method(42)

-- ── Closures / upvalues ──
local function make_counter()
  local count = 0
  return function()
    count = count + 1
    return count
  end
end
local counter = make_counter()
local count1 = counter()
local count2 = counter()

-- ── Nested functions ──
local function outer(x)
  local function inner(y)
    return x + y
  end
  return inner
end
local nested = outer(5)
local nested_result = nested(10)

-- ── Recursive function ──
local function factorial(n)
  if n <= 1 then return 1 end
  return n * factorial(n - 1)
end
local fact_5 = factorial(5)

-- ── Table creation ──
local empty_table = {}
local array_t = {1, 2, 3, 4, 5}
local dict_t = {key1 = "val1", key2 = "val2", key3 = "val3"}
local mixed_t = {1, 2, 3, name = "test", [10] = "ten"}
local nested_t = {
  inner = {
    deeper = {
      value = 42
    }
  }
}

-- ── Table indexing ──
local t_get = dict_t.key1
local t_get_bracket = dict_t["key2"]
local t_get_num = array_t[1]
local t_get_nested = nested_t.inner.deeper.value

-- ── Table assignment ──
local new_table = {}
new_table.foo = "bar"
new_table["baz"] = "qux"
new_table[1] = "first"
new_table[2] = "second"

-- ── Table operations ──
table.insert(array_t, 60)
local removed = table.remove(array_t, 1)
local joined = table.concat(array_t, ", ")
table.sort(array_t)

-- ── String functions ──
local s_char = string.char(72, 73)
local s_byte = string.byte("A")
local s_sub = string.sub("hello world", 1, 5)
local s_rep = string.rep("ab", 3)
local s_find = string.find("hello world", "world")
local s_gsub = string.gsub("hello", "l", "L")
local s_format = string.format("%d + %d = %d", 1, 2, 3)
local s_reverse = string.reverse("hello")
local s_len = string.len("hello")
local s_upper = string.upper("hello")
local s_lower = string.lower("HELLO")
local s_match = string.match("hello123", "%d+")
local s_gmatch = string.gmatch("a1 b2 c3", "%w%d")
for m in s_gmatch do
  local gm = m
end

-- ── String method syntax ──
local s_method = ("hello"):upper()
local s_method2 = ("hello"):len()
local s_method3 = ("hello"):sub(1, 3)

-- ── Math functions ──
local m_floor = math.floor(3.7)
local m_ceil = math.ceil(3.2)
local m_abs = math.abs(-5)
local m_sqrt = math.sqrt(16)
local m_sin = math.sin(0)
local m_cos = math.cos(0)
local m_tan = math.tan(0)
local m_atan = math.atan(1)
local m_atan2 = math.atan2(1, 1)
local m_asin = math.asin(1)
local m_acos = math.acos(1)
local m_exp = math.exp(1)
local m_log = math.log(2.718)
local m_log10 = math.log10(100)
local m_max = math.max(1, 5, 3, 2)
local m_min = math.min(1, 5, 3, 2)
local m_pow = math.pow(2, 10)
local m_random = math.random(1, 100)
local m_randomseed = math.randomseed(os.time())
local m_fmod = math.fmod(10, 3)
local m_modf = math.modf(3.14)
local m_huge = math.huge
local m_pi = math.pi

-- ── Math as table ──
local math_funcs = {
  floor = math.floor,
  ceil = math.ceil,
  abs = math.abs,
  sqrt = math.sqrt,
}
local m_call = math_funcs.floor(4.7)

-- ── OS functions ──
local os_time = os.time()
local os_clock = os.clock()
local os_date = os.date("%Y-%m-%d")
local os_difftime = os.difftime(os_time, os_time - 3600)
local os_getenv = os.getenv("PATH")
local tmp_name = os.tmpname()

-- ── IO functions ──
local io_write = io.write("test")
local io_read = io.read()
local io_open = io.open("test.txt", "r")
if io_open then
  io_open:close()
end

-- ── Type checking ──
local t_nil = type(nil)
local t_bool = type(true)
local t_num = type(42)
local t_str = type("hello")
local t_tbl = type({})
local t_func = type(print)
local t_thread = type(coroutine.create(function() end))

-- ── Assert / error / pcall ──
local ok, err = pcall(function()
  assert(1 == 1, "assertion passed")
  error("test error")
end)

-- ── xpcall ──
local xok, xerr = xpcall(function()
  error("xpcall test")
end, function(e)
  return "handled: " .. tostring(e)
end)

-- ── Metatables ──
local mt_table = setmetatable({}, {
  __index = function(t, k) return "default" end,
  __newindex = function(t, k, v) rawset(t, k, v) end,
  __add = function(a, b) return 0 end,
  __sub = function(a, b) return 0 end,
  __mul = function(a, b) return 0 end,
  __div = function(a, b) return 0 end,
  __mod = function(a, b) return 0 end,
  __pow = function(a, b) return 0 end,
  __concat = function(a, b) return "" end,
  __eq = function(a, b) return true end,
  __lt = function(a, b) return false end,
  __le = function(a, b) return true end,
  __len = function(t) return 0 end,
  __call = function(t, ...) return ... end,
  __tostring = function(t) return "custom" end,
  __unm = function(a) return a end,
  __metatable = "locked",
})
local mt_get = getmetatable(mt_table)
local mt_rawget = rawget(mt_table, "key")
local mt_rawset = rawset(mt_table, "key", "value")
local mt_rawequal = rawequal({}, {})
local mt_rawlen = rawlen({1, 2, 3})

-- ── Metamethod operators ──
local op_t1 = setmetatable({}, {__add = function(a, b) return 100 end})
local op_t2 = setmetatable({}, {__add = function(a, b) return 200 end})
local add_result = op_t1 + op_t2
local sub_result = op_t1 - op_t2
local mul_result = op_t1 * op_t2
local div_result = op_t1 / op_t2
local mod_result = op_t1 % op_t2
local pow_result = op_t1 ^ op_t2
local concat_result = op_t1 .. op_t2
local unm_result = -op_t1
local len_result = #op_t1
local call_result = op_t1(1, 2, 3)

-- ── Coroutine ──
local co = coroutine.create(function(a, b)
  local x = coroutine.yield(a + b)
  local y = coroutine.yield(x * 2)
  return y
end)
local co_resume1 = coroutine.resume(co, 1, 2)
local co_resume2 = coroutine.resume(co, 10)
local co_resume3 = coroutine.resume(co, 20)
local co_status = coroutine.status(co)
local co_wrap = coroutine.wrap(function(x)
  return x * 3
end)
local co_wrap_result = co_wrap(5)
local co_yield = coroutine.isyieldable()

-- ── pcall with arguments ──
local pcall_func = function(x, y)
  return x / y
end
local p_ok, p_result = pcall(pcall_func, 10, 2)

-- ── unpack / table.unpack ──
local unpacked = unpack({1, 2, 3, 4, 5})
local unpacked_range = unpack({1, 2, 3, 4, 5}, 2, 4)
local t_unpack = table.unpack({10, 20, 30})

-- ── select ──
local sel_count = select("#", 1, 2, 3, 4)
local sel_first = select(1, "a", "b", "c")
local sel_second = select(2, "a", "b", "c")

-- ── tostring / tonumber ──
local ts_num = tostring(42)
local ts_bool = tostring(true)
local ts_nil = tostring(nil)
local tn_str = tonumber("42")
local tn_hex = tonumber("FF", 16)
local tn_float = tonumber("3.14")
local tn_invalid = tonumber("not a number")

-- ── print / type ──
print("hello", "world", 42, true, nil)
local print_result = print
local type_result = type
local typeof_result = typeof and typeof({}) or type({})

-- -- ── next ──
local next_key, next_val = next({a = 1, b = 2})
local next_none = next({})

-- ── getfenv / setfenv (Lua 5.1) ──
if getfenv then
  local env = getfenv(1)
  local env_var = env and env.print or print
end
if setfenv then
  local new_env = setmetatable({}, {__index = _G})
  local setfenv_func = function()
    if setfenv then setfenv(1, new_env) end
  end
end

-- ── loadstring / load (if available) ──
if loadstring then
  local loaded = loadstring("return 42")
  if loaded then
    local loaded_result = loaded()
  end
end
if load then
  local loaded2 = load("return 21 * 2")
  if loaded2 then
    local loaded2_result = loaded2()
  end
end

-- ── dofile / require ──
-- (commented to avoid runtime errors, but syntax is present)
-- local df = dofile("test.lua")
-- local req = require("module")

-- ── newproxy ──
if newproxy then
  local proxy = newproxy(true)
  local proxy_meta = getmetatable(proxy)
  local proxy2 = newproxy(false)
end

-- ── Bit operations (if available) ──
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
end

-- ── Bit32 (Lua 5.2) ──
if bit32 then
  local b32_band = bit32.band(0xFF, 0x0F)
  local b32_bor = bit32.bor(0xF0, 0x0F)
  local b32_bxor = bit32.bxor(0xAA, 0x55)
  local b32_bnot = bit32.bnot(0x00)
  local b32_lshift = bit32.lshift(1, 8)
  local b32_rshift = bit32.rshift(256, 4)
end

-- ── G table access ──
local g_print = _G.print
local g_string = _G.string
local g_table = _G.table
local g_math = _G.math
_G.custom_global = "custom value"

-- ── Table as namespace ──
local namespace = {}
namespace.sub = {}
namespace.sub.func = function(x) return x end
local ns_result = namespace.sub.func(42)

-- ── Chained method calls ──
local chained = setmetatable({}, {
  __index = function(t, k)
    t[k] = function() return t end
    return t[k]
  end
})
local chain_result = chained:foo():bar():baz()

-- ── Ternary-like pattern ──
local ternary = (a > b) and "a is bigger" or "b is bigger"

-- ── String indexing ──
local char_at = string.sub("hello", 2, 2)
local byte_at = string.byte("hello", 1)

-- ── Number formats ──
local hex_num = 0xFF
local oct_num = 0o17
local bin_num = 0b1010
local float_num = 3.14
local sci_num = 1.5e10
local exp_num = 2.5e-3

-- ── Multi-line string ──
local multiline = [[
line 1
line 2
line 3
]]

-- ── Nested multiline ──
local nested_ml = [==[
  contains ]] inside
]==]

-- ── And/or short-circuit ──
local sc1 = nil and "should not see"
local sc2 = "first" or "should not see"
local sc3 = nil or "default"
local sc4 = false or nil or "last resort"

-- ── Table with function values ──
local func_table = {
  add = function(a, b) return a + b end,
  sub = function(a, b) return a - b end,
  mul = function(a, b) return a * b end,
}
local ft_add = func_table.add(5, 3)
local ft_sub = func_table.sub(5, 3)
local ft_mul = func_table.mul(5, 3)

-- ── Goto / label (if supported) ──
local goto_val = 0
::start_label::
goto_val = goto_val + 1
if goto_val < 3 then
  goto start_label
end

-- ── In operator (if supported by environment) ──
-- local in_result = ("test" in {"test", "hello"})

-- ── Environment-specific (Luau / Roblox) ──
if typeof then
  local typeof_result = typeof({})
  local typeof_str = typeof("hello")
  local typeof_num = typeof(42)
  local typeof_func = typeof(print)
end

-- ── Continue via goto (Lua 5.2+) ──
for i = 1, 5 do
  if i == 3 then
    goto continue_loop
  end
  local processed = i * 2
  ::continue_loop::
end

-- ── Nested tables with metatables ──
local proto = {x = 0, y = 0}
proto.__index = proto
local instance = setmetatable({}, proto)
local inst_x = instance.x
local inst_y = instance.y

-- ── OOP pattern ──
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
function Animal:setName(name)
  self.name = name
end
function Animal:getName()
  return self.name
end

local dog = Animal.new("Dog", "Woof")
local dog_speak = dog:speak()
dog:setName("Rex")
local dog_name = dog:getName()

-- ── Inheritance pattern ──
local Cat = {}
Cat.__index = Cat
setmetatable(Cat, {__index = Animal})
function Cat.new(name)
  local self = Animal.new(name, "Meow")
  setmetatable(self, Cat)
  return self
end
function Cat:purr()
  return self.name .. " purrs"
end
local kitty = Cat.new("Whiskers")
local kitty_speak = kitty:speak()
local kitty_purr = kitty:purr()

-- ── Error handling patterns ──
local function safe_call(fn, ...)
  local ok, result = pcall(fn, ...)
  if not ok then
    return nil, result
  end
  return result
end
local safe_result = safe_call(function() return 42 end)
local safe_err = safe_call(function() error("fail") end)

-- ── Iterator protocol ──
local function range_iterator(max)
  local i = 0
  return function()
    i = i + 1
    if i <= max then return i end
  end
end
for v in range_iterator(5) do
  local range_val = v
end

-- ── State machine pattern ──
local state = "idle"
local function transition(event)
  if state == "idle" and event == "start" then
    state = "running"
  elseif state == "running" and event == "stop" then
    state = "idle"
  end
end
transition("start")
transition("stop")

-- ── Data structure: stack ──
local Stack = {}
Stack.__index = Stack
function Stack.new()
  return setmetatable({items = {}, size = 0}, Stack)
end
function Stack:push(item)
  self.size = self.size + 1
  self.items[self.size] = item
end
function Stack:pop()
  if self.size == 0 then return nil end
  local item = self.items[self.size]
  self.items[self.size] = nil
  self.size = self.size - 1
  return item
end
function Stack:peek()
  return self.items[self.size]
end
local stack = Stack.new()
stack:push(1)
stack:push(2)
stack:push(3)
local stack_pop1 = stack:pop()
local stack_peek = stack:peek()

-- ── Data structure: queue ──
local Queue = {}
Queue.__index = Queue
function Queue.new()
  return setmetatable({items = {}, head = 1, tail = 0}, Queue)
end
function Queue:enqueue(item)
  self.tail = self.tail + 1
  self.items[self.tail] = item
end
function Queue:dequeue()
  if self.head > self.tail then return nil end
  local item = self.items[self.head]
  self.items[self.head] = nil
  self.head = self.head + 1
  return item
end
local queue = Queue.new()
queue:enqueue("a")
queue:enqueue("b")
local queue_deq = queue:dequeue()

-- ── String pattern matching ──
local email_match = string.match("user@example.com", "[%w%.]+@[%w%.]+")
local phone_gsub = string.gsub("555-1234", "(%d+)-(%d+)", "%2/%1")
local split_pattern = {}
for word in string.gmatch("the quick brown fox", "%w+") do
  table.insert(split_pattern, word)
end

-- ── Number to string conversions ──
local n2s_auto = "value: " .. 42
local s2n = tonumber("42") + 8
local n_format = string.format("%.2f", 3.14159)
local n_hex = string.format("%x", 255)
local n_oct = string.format("%o", 64)
local n_pad = string.format("%05d", 42)

-- ── Boolean expressions ──
local complex_bool = (a > 0 and b > 0) or (c == 0 and not (d == "skip"))
local chained_cmp = a < b and b < c
local double_neg = not not a

-- ── Self-referencing table ──
local self_ref = {}
self_ref.self = self_ref
local self_ref_get = self_ref.self.self.self

-- ── Weak tables (if supported) ──
if setmetatable then
  local weak_k = setmetatable({}, {__mode = "k"})
  local weak_v = setmetatable({}, {__mode = "v"})
  local weak_kv = setmetatable({}, {__mode = "kv"})
end

-- ── Final comprehensive test ──
local function comprehensive(a, b, c, ...)
  local args = {...}
  local result = 0

  for i = 1, #args do
    if type(args[i]) == "number" then
      result = result + args[i]
    elseif type(args[i]) == "string" then
      result = result + #args[i]
    elseif type(args[i]) == "table" then
      result = result + #args[i]
    elseif type(args[i]) == "function" then
      result = result + 1
    end
  end

  if a and b and c then
    return result + a + b + c
  elseif a or b then
    return result + (a or 0) + (b or 0)
  else
    return result
  end
end

local final_result = comprehensive(1, 2, 3, 4, "five", {1, 2, 3}, function() end)

-- ── Collectgarbage (if available) ──
if collectgarbage then
  local gc_count = collectgarbage("count")
  local gc_collect = collectgarbage("collect")
end

-- ── Debug library (if available) ──
if debug then
  local debug_trace = debug.traceback("test", 1)
  if debug.getinfo then
    local info = debug.getinfo(1, "Slu")
  end
  if debug.getlocal then
    local ln, lv = debug.getlocal(1, 1)
  end
  if debug.setlocal then
    -- debug.setlocal(1, 1, "value")
  end
  if debug.getupvalue then
    -- local upn, upv = debug.getupvalue(print, 1)
  end
end

-- ── Package table (if available) ──
if package then
  local pkg_path = package.path
  local pkg_cpath = package.cpath
  local pkg_loaded = package.loaded
  local pkg_preload = package.preload
end

-- ── UTF8 (if available) ──
if utf8 then
  local u_len = utf8.len("hello")
  local u_char = utf8.char(0x41)
  local u_code = utf8.codepoint("A")
  local u_offset = utf8.offset("hello", 1)
  local u_codes = utf8.codes("hello")
end

-- ── Coroutine resume with error handling ──
local co_err = coroutine.create(function()
  error("coroutine error")
end)
local co_err_ok, co_err_msg = coroutine.resume(co_err)

-- ── Final print ──
print("All Lua features exercised successfully")
print("Result:", final_result)
print("Counter:", count2)
print("Factorial 5:", fact_5)
print("Dog:", dog_speak)
print("Cat:", kitty_speak)
