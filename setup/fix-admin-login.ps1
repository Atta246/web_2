# Admin Login Fix Script
Write-Host "==============================="
Write-Host "Admin Login Fix Utility" -ForegroundColor Cyan
Write-Host "==============================="
Write-Host ""
Write-Host "This will fix the admin login by:" -ForegroundColor Yellow
Write-Host "1. Adding the username column if needed"
Write-Host "2. Ensuring admin with ID 121401 exists"
Write-Host "3. Setting the password to 'Atta'"
Write-Host ""
Write-Host "Press any key to continue..." -ForegroundColor Green
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Change to the project root directory
$scriptPath = $MyInvocation.MyCommand.Path
$scriptDir = Split-Path -Parent $scriptPath
$projectRoot = Split-Path -Parent $scriptDir

# Navigate to project root
Set-Location -Path $projectRoot

# Run the fix script
node setup\fix-admin-login.js

Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Green
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
