# PowerShell script to set or update the OpenAI API key

param(
    [Parameter(Mandatory=$false)]
    [string]$apiKey
)

# Get the current directory
$rootDir = Get-Location

# Path to the .env.local file
$envFile = Join-Path -Path $rootDir -ChildPath ".env.local"

# If no API key provided, prompt for one
if ([string]::IsNullOrEmpty($apiKey)) {
    $apiKey = Read-Host -Prompt "Enter your OpenAI API key"
}

# Check if .env.local exists
if (Test-Path $envFile) {
    # Read the current contents
    $envContent = Get-Content $envFile -Raw
    
    # Check if the OPENAI_API_KEY already exists
    if ($envContent -match "OPENAI_API_KEY=") {
        # Update the key
        $envContent = $envContent -replace "OPENAI_API_KEY=.*", "OPENAI_API_KEY=$apiKey"
        Write-Host "Updated OpenAI API key in .env.local" -ForegroundColor Green
    } else {
        # Add the key
        $envContent = "$envContent`n`n# OpenAI API configuration`nOPENAI_API_KEY=$apiKey"
        Write-Host "Added OpenAI API key to .env.local" -ForegroundColor Green
    }
    
    # Write the updated content back
    Set-Content -Path $envFile -Value $envContent
} else {
    # Create a new .env.local file
    $content = "# Environment configuration`n`n# OpenAI API configuration`nOPENAI_API_KEY=$apiKey"
    Set-Content -Path $envFile -Value $content
    Write-Host "Created new .env.local file with OpenAI API key" -ForegroundColor Green
}

# Verify the API key works
Write-Host "Testing the API key..." -ForegroundColor Cyan
$testResult = node validate-openai-key.js

# Check if we want to start the development server
$startServer = Read-Host -Prompt "Would you like to start the development server now? (y/n)"
if ($startServer -eq "y" -or $startServer -eq "Y") {
    Write-Host "Starting development server..." -ForegroundColor Cyan
    npm run dev
} else {
    Write-Host "You can start the server later with 'npm run dev'" -ForegroundColor Yellow
}
