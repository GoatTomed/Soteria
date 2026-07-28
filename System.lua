-- ============================================================
--  YouSuck — Key System
-- ============================================================

local Players       = game:GetService("Players")
local HttpService   = game:GetService("HttpService")
local TweenService  = game:GetService("TweenService")

while not Players.LocalPlayer do task.wait(0.1) end
local LocalPlayer = Players.LocalPlayer

-- ── Constants ─────────────────────────────────────────────
local KEY_FILE       = "yousuck_key.txt"
local VALIDATE_URL   = "https://yoursuck.vercel.app/api/verify-key"
local GET_KEY_URL    = "https://yoursuck.vercel.app/"

-- ── File helpers ──────────────────────────────────────────
local function canRead()  return type(readfile)  == "function" or type(read_file)  == "function" end
local function canWrite() return type(writefile) == "function" or type(write_file) == "function" end

local function fileExists(path)
    if type(isfile) == "function" then return isfile(path) end
    if type(is_file) == "function" then return is_file(path) end
    return false
end

local function readFile(path)
    if type(readfile)  == "function" then return pcall(readfile,  path) end
    if type(read_file) == "function" then return pcall(read_file, path) end
    return false, nil
end

local function writeFile(path, content)
    if type(writefile)  == "function" then return pcall(writefile,  path, content) end
    if type(write_file) == "function" then return pcall(write_file, path, content) end
    return false
end

local function getSavedKey()
    if not canRead() then return nil end
    if fileExists(KEY_FILE) then
        local ok, content = readFile(KEY_FILE)
        if ok and type(content) == "string" then
            return content:gsub("^%s*(.-)%s*$", "%1")
        end
    end
    return nil
end

local function saveKey(key)
    if key == "test" or not canWrite() then return end
    writeFile(KEY_FILE, key)
end

-- ── HTTP helpers ──────────────────────────────────────────
local function hasHttp()
    return type(request) == "function"
        or (type(syn) == "table" and type(syn.request) == "function")
        or (type(http) == "table" and type(http.request) == "function")
        or type(http_request) == "function"
        or (type(fluxus) == "table" and type(fluxus.request) == "function")
        or (HttpService and type(HttpService.PostAsync) == "function")
end

local function safePost(url, bodyTable)
    local ok, encoded = pcall(function() return HttpService:JSONEncode(bodyTable or {}) end)
    local payload = ok and encoded or "{}"
    local headers = { ["Content-Type"] = "application/json" }

    local attempts = {
        function() return request and request({ Url = url, Method = "POST", Body = payload, Headers = headers }) end,
        function() return syn and syn.request and syn.request({ Url = url, Method = "POST", Body = payload, Headers = headers }) end,
        function() return http and http.request and http.request({ Url = url, Method = "POST", Body = payload, Headers = headers }) end,
        function() return http_request and http_request({ Url = url, Method = "POST", Body = payload, Headers = headers }) end,
        function() return fluxus and fluxus.request and fluxus.request({ Url = url, Method = "POST", Body = payload, Headers = headers }) end,
        function() return HttpService and HttpService.PostAsync and HttpService:PostAsync(url, payload, Enum.HttpContentType.ApplicationJson) end,
    }

    for _, fn in ipairs(attempts) do
        if fn then
            local s, res = pcall(fn)
            if s and res then
                local body = type(res) == "table" and res.Body or res
                if type(body) == "string" then return true, body end
            end
        end
    end
    return false, "no HTTP method available"
end

-- ── Key normalisation ──────────────────────────────────────
local function normalizeKey(str)
    local s = tostring(str or ""):gsub("^%s*(.-)%s*$", "%1"):gsub("[%c%s]+", ""):gsub("[^A-Za-z0-9]", ""):upper()
    if #s == 9 then s = s:gsub("(...)(...)(...)", "%1-%2-%3") end
    return s
end

-- ── GUI ───────────────────────────────────────────────────
local Theme = {
    BG      = Color3.fromRGB(24, 24, 28),
    Card    = Color3.fromRGB(30, 30, 35),
    Input   = Color3.fromRGB(42, 42, 50),
    Border  = Color3.fromRGB(55, 55, 65),
    Text    = Color3.fromRGB(235, 235, 235),
    TextMid = Color3.fromRGB(120, 120, 135),
    Cyan    = Color3.fromRGB(0,  185, 235),
    CyanHov = Color3.fromRGB(20, 205, 255),
    Btn     = Color3.fromRGB(52, 52, 62),
    BtnHov  = Color3.fromRGB(68, 68, 80),
    Red     = Color3.fromRGB(220, 50, 50),
    RedHov  = Color3.fromRGB(240, 70, 70),
}

local function tween(obj, goal, t)
    TweenService:Create(obj, TweenInfo.new(t or 0.14, Enum.EasingStyle.Quart, Enum.EasingDirection.Out), goal):Play()
end

local function make(class, props)
    local obj = Instance.new(class)
    for k, v in pairs(props or {}) do
        if k ~= "Parent" then obj[k] = v end
    end
    if props and props.Parent then obj.Parent = props.Parent end
    return obj
end

local function corner(parent, r)
    return make("UICorner", { CornerRadius = UDim.new(0, r or 8), Parent = parent })
end

local PlayerGui = LocalPlayer:WaitForChild("PlayerGui")

local ScreenGui = make("ScreenGui", {
    Name            = "KeySystem",
    ResetOnSpawn    = false,
    ZIndexBehavior  = Enum.ZIndexBehavior.Sibling,
    IgnoreGuiInset  = true,
    Parent          = PlayerGui,
})

make("Frame", {
    Size                  = UDim2.new(1, 0, 1, 0),
    BackgroundColor3      = Color3.fromRGB(0, 0, 0),
    BackgroundTransparency = 0.52,
    BorderSizePixel       = 0,
    ZIndex                = 1,
    Parent                = ScreenGui,
})

local Card = make("Frame", {
    Name             = "Card",
    Size             = UDim2.new(0, 370, 0, 192),
    Position         = UDim2.new(0.5, -185, 0.5, -96),
    BackgroundColor3 = Theme.Card,
    BorderSizePixel  = 0,
    ZIndex           = 2,
    Parent           = ScreenGui,
})
corner(Card, 12)
make("UIStroke", { Color = Theme.Border, Thickness = 1, ApplyStrokeMode = Enum.ApplyStrokeMode.Border, Parent = Card })

-- Close button
local CloseBtn = make("TextButton", {
    Size             = UDim2.new(0, 26, 0, 26),
    Position         = UDim2.new(1, -13, 0, -13),
    BackgroundColor3 = Theme.Red,
    AutoButtonColor  = false,
    Text             = "✕",
    TextColor3       = Color3.fromRGB(255, 255, 255),
    TextSize         = 12,
    Font             = Enum.Font.GothamBold,
    ZIndex           = 5,
    Parent           = Card,
})
corner(CloseBtn, 13)
make("UIStroke", { Color = Color3.fromRGB(170, 35, 35), Thickness = 1.5, ApplyStrokeMode = Enum.ApplyStrokeMode.Border, Parent = CloseBtn })

-- Title
make("TextLabel", {
    Size               = UDim2.new(1, -48, 0, 28),
    Position           = UDim2.new(0, 20, 0, 16),
    BackgroundTransparency = 1,
    Text               = "Enter access key",
    TextColor3         = Theme.Text,
    TextSize           = 18,
    Font               = Enum.Font.GothamBold,
    TextXAlignment     = Enum.TextXAlignment.Left,
    ZIndex             = 3,
    Parent             = Card,
})

-- Input box
local InputBox = make("TextBox", {
    Size               = UDim2.new(1, -40, 0, 38),
    Position           = UDim2.new(0, 20, 0, 56),
    BackgroundColor3   = Theme.Input,
    BorderSizePixel    = 0,
    Text               = "",
    PlaceholderText    = "Your Key Here!",
    PlaceholderColor3  = Theme.TextMid,
    TextColor3         = Theme.Text,
    TextSize           = 14,
    Font               = Enum.Font.Gotham,
    ClearTextOnFocus   = false,
    ZIndex             = 3,
    Parent             = Card,
})
corner(InputBox, 8)
make("UIStroke", { Color = Theme.Border, Thickness = 1, ApplyStrokeMode = Enum.ApplyStrokeMode.Border, Parent = InputBox })
make("UIPadding", { PaddingLeft = UDim.new(0, 12), PaddingRight = UDim.new(0, 12), Parent = InputBox })

-- Status label (feedback only — never shows saved key expired text)
local StatusLabel = make("TextLabel", {
    Name               = "Status",
    Size               = UDim2.new(1, -40, 0, 18),
    Position           = UDim2.new(0, 20, 0, 102),
    BackgroundTransparency = 1,
    Text               = "",
    TextColor3         = Theme.TextMid,
    TextSize           = 12,
    Font               = Enum.Font.Gotham,
    TextXAlignment     = Enum.TextXAlignment.Left,
    ZIndex             = 3,
    Parent             = Card,
})

-- Get Key button
local GetKeyBtn = make("TextButton", {
    Size             = UDim2.new(0, 118, 0, 38),
    Position         = UDim2.new(0, 20, 1, -58),
    BackgroundColor3 = Theme.Btn,
    AutoButtonColor  = false,
    Text             = "Get Key",
    TextColor3       = Theme.Text,
    TextSize         = 14,
    Font             = Enum.Font.GothamSemibold,
    ZIndex           = 3,
    Parent           = Card,
})
corner(GetKeyBtn, 20)

-- Verify button
local VerifyBtn = make("TextButton", {
    Size             = UDim2.new(0, 118, 0, 38),
    Position         = UDim2.new(1, -138, 1, -58),
    BackgroundColor3 = Theme.Cyan,
    AutoButtonColor  = false,
    Text             = "Verify",
    TextColor3       = Color3.fromRGB(255, 255, 255),
    TextSize         = 14,
    Font             = Enum.Font.GothamBold,
    ZIndex           = 3,
    Parent           = Card,
})
corner(VerifyBtn, 20)

-- ── Hover effects ─────────────────────────────────────────
CloseBtn.MouseEnter:Connect(function()  tween(CloseBtn,  { BackgroundColor3 = Theme.RedHov  }) end)
CloseBtn.MouseLeave:Connect(function()  tween(CloseBtn,  { BackgroundColor3 = Theme.Red     }) end)
GetKeyBtn.MouseEnter:Connect(function() tween(GetKeyBtn, { BackgroundColor3 = Theme.BtnHov  }) end)
GetKeyBtn.MouseLeave:Connect(function() tween(GetKeyBtn, { BackgroundColor3 = Theme.Btn     }) end)
VerifyBtn.MouseEnter:Connect(function() tween(VerifyBtn, { BackgroundColor3 = Theme.CyanHov }) end)
VerifyBtn.MouseLeave:Connect(function() tween(VerifyBtn, { BackgroundColor3 = Theme.Cyan    }) end)

-- ── Input focus glow ──────────────────────────────────────
local InputStroke = InputBox:FindFirstChildOfClass("UIStroke")
InputBox.Focused:Connect(function()
    if InputStroke then tween(InputStroke, { Color = Theme.Cyan }, 0.18) end
end)
InputBox.FocusLost:Connect(function()
    if InputStroke then tween(InputStroke, { Color = Theme.Border }, 0.18) end
end)

-- ── Helpers ───────────────────────────────────────────────
local function setStatus(text, color)
    StatusLabel.Text      = tostring(text or "")
    StatusLabel.TextColor3 = color or Theme.TextMid
end

local function closeGui()
    tween(Card, { Position = UDim2.new(0.5, -185, 0.6, -96), BackgroundTransparency = 0.4 }, 0.2)
    task.wait(0.2)
    ScreenGui:Destroy()
end

-- ── Validation ────────────────────────────────────────────
local validated = false

local function validateKey(key, onResult)
    if key == "test" then
        onResult(true, "Test key accepted.")
        return
    end

    local norm = normalizeKey(key)
    if not norm:match("^[A-Z0-9][A-Z0-9][A-Z0-9]%-[A-Z0-9][A-Z0-9][A-Z0-9]%-[A-Z0-9][A-Z0-9][A-Z0-9]$") then
        onResult(false, "Invalid key format.")
        return
    end

    if not hasHttp() then
        onResult(false, "HTTP not available in this executor.")
        return
    end

    setStatus("Validating…", Theme.TextMid)
    local ok, body = safePost(VALIDATE_URL, { key = norm })
    if not ok or type(body) ~= "string" then
        onResult(false, "Could not reach validation server.")
        return
    end

    local decOk, data = pcall(function() return HttpService:JSONDecode(body) end)
    if not decOk or type(data) ~= "table" then
        onResult(false, "Bad server response.")
        return
    end

    local isValid = data.valid == true or data.success == true or tostring(data.status or ""):lower() == "success"
    local message = tostring(data.message or data.error or (isValid and "Access granted." or "Invalid key."))
    onResult(isValid, message)
end

-- ── Button logic ──────────────────────────────────────────
CloseBtn.MouseButton1Click:Connect(function() closeGui() end)

GetKeyBtn.MouseButton1Click:Connect(function()
    pcall(function()
        if setclipboard then setclipboard(GET_KEY_URL) end
    end)
    setStatus("Key URL copied to clipboard.", Theme.TextMid)
end)

VerifyBtn.MouseButton1Click:Connect(function()
    if validated then return end
    local key = InputBox.Text:gsub("^%s*(.-)%s*$", "%1")
    if key == "" then setStatus("Enter a key first.", Theme.TextMid) return end

    VerifyBtn.Text = "Checking…"
    VerifyBtn.BackgroundColor3 = Color3.fromRGB(0, 140, 175)

    task.spawn(function()
        validateKey(key, function(success, message)
            if success then
                validated = true
                setStatus(message, Color3.fromRGB(34, 197, 94))
                saveKey(normalizeKey(key))
                VerifyBtn.Text       = "Verified ✓"
                VerifyBtn.BackgroundColor3 = Color3.fromRGB(34, 197, 94)
                task.wait(1.2)
                closeGui()
            else
                setStatus(message, Color3.fromRGB(239, 68, 68))
                VerifyBtn.Text       = "Verify"
                VerifyBtn.BackgroundColor3 = Theme.Cyan
            end
        end)
    end)
end)

-- ── Auto-validate saved key (silently, no expired message) ─
task.spawn(function()
    task.wait(0.3)
    local saved = getSavedKey()
    if not saved or saved == "" then return end

    InputBox.Text = saved
    validateKey(saved, function(success, message)
        if success then
            validated = true
            setStatus(message, Color3.fromRGB(34, 197, 94))
            saveKey(normalizeKey(saved))
            VerifyBtn.Text             = "Verified ✓"
            VerifyBtn.BackgroundColor3 = Color3.fromRGB(34, 197, 94)
            task.wait(1.2)
            closeGui()
        end
        -- on failure: do nothing, leave overlay open so user can re-enter
    end)
end)
