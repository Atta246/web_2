# Admin Authentication System Setup PowerShell Script

# Install required packages
Write-Host "Installing required packages..." -ForegroundColor Cyan
npm install bcryptjs jsonwebtoken

# Instructions for database setup
Write-Host "`nDatabase setup instructions:" -ForegroundColor Yellow
Write-Host "Run the following SQL script in your Supabase database:" -ForegroundColor Yellow
Write-Host "setup/setup_admins_table.sql" -ForegroundColor White

# Create a hashed password
Write-Host "`nGenerating a hashed password for admin..." -ForegroundColor Cyan
Write-Host "Run:" -ForegroundColor Yellow
Write-Host "node setup/hash-password.js" -ForegroundColor White

# Insert admin instructions
Write-Host "`nAfter generating a hash, insert an admin using the JavaScript code:" -ForegroundColor Yellow
Write-Host @"
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('YOUR_SUPABASE_URL', 'YOUR_SUPABASE_KEY');

async function createAdmin() {
  const { data, error } = await supabase
    .from('admins')
    .insert([
      { 
        id: 1, 
        password: 'YOUR_HASHED_PASSWORD',
        name: 'Admin User',
        email: 'admin@example.com'
      }
    ]);
  
  if (error) {
    console.error('Error creating admin:', error);
  } else {
    console.log('Admin created successfully!');
  }
}

createAdmin();
"@ -ForegroundColor White

# Test admin authentication
Write-Host "`nTest admin authentication with:" -ForegroundColor Cyan
Write-Host "node setup/test-admin-auth.js" -ForegroundColor White

Write-Host "`nSetup instructions complete!" -ForegroundColor Green
