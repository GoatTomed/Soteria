/**
 * Generates the Soteria Lua key system code for a given owner username and script id.
 * The key system validates a key against the Soteria verify-gate endpoint and
 * saves/restores the key locally so the script can run once the gate succeeds.
 */
function getSystemUrls(ownerUsername: string | null, scriptId: string) {
  const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || 'https://bcedukdmqieckhpsrrcx.supabase.co').replace(/\/$/, '');
  const verifyUrl = `${supabaseUrl}/functions/v1/verify-gate`;
  const siteBase = (import.meta.env.VITE_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173')).replace(/\/$/, '');
  const safeOwner = (ownerUsername || '').trim().toLowerCase();
  const gateUrl = safeOwner ? `${siteBase}/gate/${encodeURIComponent(safeOwner)}/${scriptId}` : `${siteBase}/gate/${scriptId}`;
  return { verifyUrl, gateUrl };
}

export function generateKeySystemLua(ownerUsername: string | null, scriptId: string): string {
  const { verifyUrl, gateUrl } = getSystemUrls(ownerUsername, scriptId);
  const keyFile = 'soteria_key.txt';

  return `-- Soteria Key System
local Players = game:GetService("Players")
local HttpService = game:GetService("HttpService")
local TweenService = game:GetService("TweenService")

while not Players.LocalPlayer do task.wait(0.1) end
local LocalPlayer = Players.LocalPlayer

local VALIDATE_URL = "${verifyUrl}"
local GET_KEY_URL = "${gateUrl}"
local KEY_FILE = "${keyFile}"

local function canRead()
  return type(readfile) == "function" or type(read_file) == "function"
end

local function canWrite()
  return type(writefile) == "function" or type(write_file) == "function"
end

local function fileExists(path)
  if type(isfile) == "function" then return isfile(path) end
  if type(is_file) == "function" then return is_file(path) end
  return false
end

local function readFile(path)
  if type(readfile) == "function" then return pcall(readfile, path) end
  if type(read_file) == "function" then return pcall(read_file, path) end
  return false, nil
end

local function writeFile(path, content)
  if type(writefile) == "function" then return pcall(writefile, path, content) end
  if type(write_file) == "function" then return pcall(write_file, path, content) end
  return false
end

local function getSavedKey()
  if not canRead() then return nil end
  if fileExists(KEY_FILE) then
    local ok, content = readFile(KEY_FILE)
    if ok and type(content) == "string" then return content:gsub("^%s*(.-)%s*$", "%1") end
  end
  return nil
end

local function saveKey(key)
  if not canWrite() then return end
  writeFile(KEY_FILE, key)
end

local function normalizeKey(str)
  local s = tostring(str or ""):gsub("^%s*(.-)%s*$", "%1"):gsub("[%c%s]+", ""):gsub("[^A-Za-z0-9]", ""):upper()
  if #s == 9 then s = s:gsub("(...)(...)(...)", "%1-%2-%3") end
  return s
end

local function safePost(url, bodyTable)
  local payload = HttpService:JSONEncode(bodyTable or {})
  local headers = { ["Content-Type"] = "application/json" }

  local attempts = {
    function() return request and request({ Url = url, Method = "POST", Body = payload, Headers = headers }) end,
    function() return syn and syn.request and syn.request({ Url = url, Method = "POST", Body = payload, Headers = headers }) end,
    function() return http and http.request and http.request({ Url = url, Method = "POST", Body = payload, Headers = headers }) end,
    function() return HttpService and HttpService.PostAsync and HttpService:PostAsync(url, payload, Enum.HttpContentType.ApplicationJson) end,
  }

  for _, fn in ipairs(attempts) do
    if fn then
      local ok, res = pcall(fn)
      if ok and res then
        local body = type(res) == "table" and res.Body or res
        if type(body) == "string" then return true, body end
      end
    end
  end

  return false, "no HTTP method available"
end

local function showGatePrompt()
  local ScreenGui = Instance.new("ScreenGui")
  ScreenGui.Name = "SoteriaGate"
  ScreenGui.Parent = LocalPlayer:WaitForChild("PlayerGui")

  local Frame = Instance.new("Frame")
  Frame.Size = UDim2.fromOffset(340, 180)
  Frame.Position = UDim2.fromOffset(30, 60)
  Frame.BackgroundColor3 = Color3.fromRGB(18, 18, 18)
  Frame.BorderSizePixel = 0
  Frame.Parent = ScreenGui

  local Corner = Instance.new("UICorner")
  Corner.CornerRadius = UDim.new(0, 12)
  Corner.Parent = Frame

  local Title = Instance.new("TextLabel")
  Title.Size = UDim2.new(1, -24, 0, 28)
  Title.Position = UDim2.new(0, 12, 0, 12)
  Title.BackgroundTransparency = 1
  Title.TextColor3 = Color3.fromRGB(240, 240, 240)
  Title.Text = "Soteria Gate"
  Title.Font = Enum.Font.GothamBold
  Title.TextSize = 18
  Title.Parent = Frame

  local Input = Instance.new("TextBox")
  Input.Size = UDim2.new(1, -24, 0, 36)
  Input.Position = UDim2.new(0, 12, 0, 54)
  Input.BackgroundColor3 = Color3.fromRGB(24, 24, 24)
  Input.TextColor3 = Color3.fromRGB(240, 240, 240)
  Input.PlaceholderText = "Enter your key"
  Input.ClearTextOnFocus = false
  Input.Parent = Frame

  local Button = Instance.new("TextButton")
  Button.Size = UDim2.new(1, -24, 0, 36)
  Button.Position = UDim2.new(0, 12, 0, 104)
  Button.BackgroundColor3 = Color3.fromRGB(247, 197, 46)
  Button.TextColor3 = Color3.fromRGB(18, 18, 18)
  Button.Text = "Verify"
  Button.Font = Enum.Font.GothamBold
  Button.TextSize = 16
  Button.Parent = Frame

  local Status = Instance.new("TextLabel")
  Status.Size = UDim2.new(1, -24, 0, 24)
  Status.Position = UDim2.new(0, 12, 0, 148)
  Status.BackgroundTransparency = 1
  Status.TextColor3 = Color3.fromRGB(150, 150, 150)
  Status.Text = "Checking access..."
  Status.Font = Enum.Font.Gotham
  Status.TextSize = 13
  Status.Parent = Frame

  Button.MouseButton1Click:Connect(function()
    local key = normalizeKey(Input.Text)
    if key == "" then
      Status.Text = "Enter a valid key"
      return
    end

    local ok, body = safePost(VALIDATE_URL, { key = key, script_id = "${scriptId}" })
    if ok and body and body:find("valid") then
      saveKey(key)
      Status.Text = "Access granted"
      ScreenGui:Destroy()
    else
      Status.Text = "Invalid key"
    end
  end)
end

local savedKey = getSavedKey()
if savedKey then
  local ok, body = safePost(VALIDATE_URL, { key = savedKey, script_id = "${scriptId}" })
  if not (ok and body and body:find("valid")) then
    showGatePrompt()
  end
else
  showGatePrompt()
end
`;
}

function escapeLuaContent(content: string): string {
  return content
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\r/g, '\\r')
    .replace(/\n/g, '\\n');
}

export function generateWrappedKeySystemLua(ownerUsername: string | null, scriptId: string, content: string): string {
  const wrapper = generateKeySystemLua(ownerUsername, scriptId);
  const escaped = escapeLuaContent(content);
  return `${wrapper}\nlocal __SOTERIA_ORIGINAL = "${escaped}"\nfunction __soteria_run_original()\n  local f, err = loadstring(__SOTERIA_ORIGINAL)\n  if not f then return end\n  pcall(f)\nend\n__soteria_run_original()`;
}
