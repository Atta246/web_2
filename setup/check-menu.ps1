# Script to check menu tables and fix any issues
# This ensures the menu management system works correctly with the Supabase database

Write-Host "🔍 Running Menu Table Check..." -ForegroundColor Cyan

# Run the check-menu-tables.js script using Node.js
node setup/check-menu-tables.js

if ($LASTEXITCODE -eq 0) {
  Write-Host "`n✅ Menu table check completed successfully!" -ForegroundColor Green
} else {
  Write-Host "`n❌ Menu table check encountered some issues. Please check the output above for details." -ForegroundColor Red
  Write-Host "You may need to check your Supabase database configuration or permissions." -ForegroundColor Yellow
}

Write-Host "`nYou should now be able to use the menu management system properly." -ForegroundColor Cyan
