# Simple Server Starter
Write-Host "Starting Next.js Server..." -ForegroundColor Blue

# Stop existing Node processes
Write-Host "Stopping existing processes..." -ForegroundColor Yellow
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 3

# Set environment variables
$env:NODE_OPTIONS = "--max-old-space-size=4096"
$env:NEXT_TELEMETRY_DISABLED = 1

# Build project
Write-Host "Building project..." -ForegroundColor Yellow
npm run build

# Start server on port 3003
Write-Host "Starting server on port 3003..." -ForegroundColor Green
Write-Host "Open browser: http://localhost:3003" -ForegroundColor Cyan
Write-Host "Blog page: http://localhost:3003/blog" -ForegroundColor Cyan

npx next dev -p 3003