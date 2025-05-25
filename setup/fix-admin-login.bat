@echo off
echo ===============================
echo Admin Login Fix Utility
echo ===============================
echo.
echo This will fix the admin login by:
echo 1. Adding the username column if needed
echo 2. Ensuring admin with ID 121401 exists
echo 3. Setting the password to "Atta"
echo.
echo Press any key to continue...
pause > nul

cd %~dp0\..
node setup\fix-admin-login.js

echo.
echo Press any key to exit...
pause > nul
