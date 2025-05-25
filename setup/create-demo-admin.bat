@echo off
echo Creating demo admin account matching login screen credentials...
cd %~dp0\..
node setup\create-demo-admin.js
pause
