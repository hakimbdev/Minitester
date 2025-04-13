@echo off
echo Starting MemePad Development Environment...

:: Start the backend server
start cmd /k "cd backend && npm run dev"

:: Start the frontend 
start cmd /k "npm run dev"

echo Development servers started!
echo Backend: http://localhost:5000
echo Frontend: Check console for URL (typically http://localhost:3000) 