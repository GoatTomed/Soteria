local Players = game:GetService("Players")
local LocalPlayer = Players.LocalPlayer
local PlayerGui = LocalPlayer:WaitForChild("PlayerGui")

-- ScreenGui
local ScreenGui = Instance.new("ScreenGui")
ScreenGui.Name = "KeySystem"
ScreenGui.ResetOnSpawn = false
ScreenGui.ZIndexBehavior = Enum.ZIndexBehavior.Sibling
ScreenGui.Parent = PlayerGui

-- Blur overlay (optional dim background)
local Overlay = Instance.new("Frame")
Overlay.Size = UDim2.new(1, 0, 1, 0)
Overlay.BackgroundColor3 = Color3.fromRGB(0, 0, 0)
Overlay.BackgroundTransparency = 0.5
Overlay.BorderSizePixel = 0
Overlay.ZIndex = 1
Overlay.Parent = ScreenGui

-- Main dialog frame
local Frame = Instance.new("Frame")
Frame.Size = UDim2.new(0, 360, 0, 185)
Frame.Position = UDim2.new(0.5, -180, 0.5, -92)
Frame.BackgroundColor3 = Color3.fromRGB(30, 30, 35)
Frame.BorderSizePixel = 0
Frame.ZIndex = 2
Frame.Parent = ScreenGui

local FrameCorner = Instance.new("UICorner")
FrameCorner.CornerRadius = UDim.new(0, 10)
FrameCorner.Parent = Frame

-- Close button (red circle, top right)
local CloseBtn = Instance.new("TextButton")
CloseBtn.Size = UDim2.new(0, 28, 0, 28)
CloseBtn.Position = UDim2.new(1, -14, 0, -14)
CloseBtn.BackgroundColor3 = Color3.fromRGB(220, 50, 50)
CloseBtn.BorderSizePixel = 0
CloseBtn.Text = "✕"
CloseBtn.TextColor3 = Color3.fromRGB(255, 255, 255)
CloseBtn.TextSize = 13
CloseBtn.Font = Enum.Font.GothamBold
CloseBtn.ZIndex = 3
CloseBtn.Parent = Frame

local CloseBtnCorner = Instance.new("UICorner")
CloseBtnCorner.CornerRadius = UDim.new(1, 0)
CloseBtnCorner.Parent = CloseBtn

-- Title label
local Title = Instance.new("TextLabel")
Title.Size = UDim2.new(1, -40, 0, 40)
Title.Position = UDim2.new(0, 18, 0, 10)
Title.BackgroundTransparency = 1
Title.Text = "Enter access key"
Title.TextColor3 = Color3.fromRGB(235, 235, 235)
Title.TextSize = 17
Title.Font = Enum.Font.GothamBold
Title.TextXAlignment = Enum.TextXAlignment.Left
Title.ZIndex = 3
Title.Parent = Frame

-- Key input box
local InputBox = Instance.new("TextBox")
InputBox.Size = UDim2.new(1, -36, 0, 40)
InputBox.Position = UDim2.new(0, 18, 0, 58)
InputBox.BackgroundColor3 = Color3.fromRGB(45, 45, 52)
InputBox.BorderSizePixel = 0
InputBox.PlaceholderText = "Your Key Here!"
InputBox.PlaceholderColor3 = Color3.fromRGB(120, 120, 130)
InputBox.Text = ""
InputBox.TextColor3 = Color3.fromRGB(220, 220, 220)
InputBox.TextSize = 14
InputBox.Font = Enum.Font.Gotham
InputBox.ClearTextOnFocus = false
InputBox.ZIndex = 3
InputBox.Parent = Frame

local InputCorner = Instance.new("UICorner")
InputCorner.CornerRadius = UDim.new(0, 7)
InputCorner.Parent = InputBox

local InputPadding = Instance.new("UIPadding")
InputPadding.PaddingLeft = UDim.new(0, 12)
InputPadding.PaddingRight = UDim.new(0, 12)
InputPadding.Parent = InputBox

-- Buttons row
local GetKeyBtn = Instance.new("TextButton")
GetKeyBtn.Size = UDim2.new(0, 110, 0, 38)
GetKeyBtn.Position = UDim2.new(0, 18, 1, -55)
GetKeyBtn.BackgroundColor3 = Color3.fromRGB(55, 55, 63)
GetKeyBtn.BorderSizePixel = 0
GetKeyBtn.Text = "Get Key"
GetKeyBtn.TextColor3 = Color3.fromRGB(210, 210, 210)
GetKeyBtn.TextSize = 14
GetKeyBtn.Font = Enum.Font.GothamSemibold
GetKeyBtn.ZIndex = 3
GetKeyBtn.Parent = Frame

local GetKeyCorner = Instance.new("UICorner")
GetKeyCorner.CornerRadius = UDim.new(0, 22)
GetKeyCorner.Parent = GetKeyBtn

local VerifyBtn = Instance.new("TextButton")
VerifyBtn.Size = UDim2.new(0, 110, 0, 38)
VerifyBtn.Position = UDim2.new(1, -128, 1, -55)
VerifyBtn.BackgroundColor3 = Color3.fromRGB(0, 180, 230)
VerifyBtn.BorderSizePixel = 0
VerifyBtn.Text = "Verify"
VerifyBtn.TextColor3 = Color3.fromRGB(255, 255, 255)
VerifyBtn.TextSize = 14
VerifyBtn.Font = Enum.Font.GothamBold
VerifyBtn.ZIndex = 3
VerifyBtn.Parent = Frame

local VerifyCorner = Instance.new("UICorner")
VerifyCorner.CornerRadius = UDim.new(0, 22)
VerifyCorner.Parent = VerifyBtn

-- Hover effects
GetKeyBtn.MouseEnter:Connect(function()
    GetKeyBtn.BackgroundColor3 = Color3.fromRGB(70, 70, 80)
end)
GetKeyBtn.MouseLeave:Connect(function()
    GetKeyBtn.BackgroundColor3 = Color3.fromRGB(55, 55, 63)
end)

VerifyBtn.MouseEnter:Connect(function()
    VerifyBtn.BackgroundColor3 = Color3.fromRGB(20, 200, 255)
end)
VerifyBtn.MouseLeave:Connect(function()
    VerifyBtn.BackgroundColor3 = Color3.fromRGB(0, 180, 230)
end)

CloseBtn.MouseEnter:Connect(function()
    CloseBtn.BackgroundColor3 = Color3.fromRGB(240, 70, 70)
end)
CloseBtn.MouseLeave:Connect(function()
    CloseBtn.BackgroundColor3 = Color3.fromRGB(220, 50, 50)
end)

-- Button logic
CloseBtn.MouseButton1Click:Connect(function()
    ScreenGui:Destroy()
end)

GetKeyBtn.MouseButton1Click:Connect(function()
    -- Replace with your key link
    setclipboard("https://yousoteria.vercel.app/")
end)

VerifyBtn.MouseButton1Click:Connect(function()
    local key = InputBox.Text
    if key == "" then return end

    -- Replace with your verification logic
    -- Example: check against a whitelist or endpoint
    print("Verifying key:", key)
end)
