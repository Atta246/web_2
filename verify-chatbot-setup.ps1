# PowerShell script to verify the chatbot setup

Write-Host "Checking chatbot configuration..." -ForegroundColor Cyan

# Check if .env.local exists
if (-not (Test-Path .env.local)) {
    Write-Host "Error: .env.local file not found!" -ForegroundColor Red
    Write-Host "Please create a .env.local file with your OpenAI API key." -ForegroundColor Yellow
    exit 1
}

# Check if OpenAI API key is configured
$envContent = Get-Content .env.local -Raw
if ($envContent -notmatch "OPENAI_API_KEY=") {
    Write-Host "Error: OPENAI_API_KEY not found in .env.local!" -ForegroundColor Red
    Write-Host "Please add OPENAI_API_KEY=your_api_key to your .env.local file." -ForegroundColor Yellow
    exit 1
}

# Check if key is not empty
if ($envContent -match "OPENAI_API_KEY=$" -or $envContent -match "OPENAI_API_KEY=''") {
    Write-Host "Error: OPENAI_API_KEY is empty!" -ForegroundColor Red
    Write-Host "Please set a valid API key in your .env.local file." -ForegroundColor Yellow
    exit 1
}

# Check required files exist
$requiredFiles = @(
    "src/app/support/page.js",
    "src/app/components/ChatMessage.js",
    "src/app/api/chat/route.js",
    "src/app/lib/openai-config.js"
)

$allFilesExist = $true
foreach ($file in $requiredFiles) {
    if (-not (Test-Path $file)) {
        Write-Host "Error: Required file $file not found!" -ForegroundColor Red
        $allFilesExist = $false
    }
}

if (-not $allFilesExist) {
    Write-Host "Some required chatbot files are missing. Please check your implementation." -ForegroundColor Yellow
    exit 1
}

Write-Host "All required files are present." -ForegroundColor Green

# Test the OpenAI API key
Write-Host "Testing OpenAI API key (this may take a moment)..." -ForegroundColor Cyan
node test-openai-api-key.js

# If we got here without exiting, the setup looks good
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Chatbot setup verified successfully!" -ForegroundColor Green
    Write-Host "You can test the chatbot by running 'npm run dev' and navigating to http://localhost:3000/support" -ForegroundColor Cyan
}
