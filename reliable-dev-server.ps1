#!/usr/bin/env pwsh

param(
    [int]$Port = 3003,
    [int]$MaxRetries = 3,
    [int]$WaitSeconds = 5
)

Write-Host "🔄 Starting Reliable Next.js Dev Server..." -ForegroundColor Blue
Write-Host "Port: $Port | Max Retries: $MaxRetries" -ForegroundColor Gray

function Stop-ExistingProcesses {
    Write-Host "🛑 Stopping existing Node processes..." -ForegroundColor Yellow
    Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
    Start-Sleep -Seconds $WaitSeconds
}

function Check-Port {
    param([int]$PortToCheck)
    $Connection = netstat -an | Select-String ":$PortToCheck"
    return $null -ne $Connection
}

function Start-DevServer {
    param([int]$ServerPort)
    try {
        Write-Host "🚀 Starting development server..." -ForegroundColor Green
        
        # Set environment variables for stability
        $env:NODE_OPTIONS = "--max-old-space-size=4096"
        $env:NEXT_TELEMETRY_DISABLED = 1
        $env:NODE_ENV = "development"
        
        # Build first
        Write-Host "🔨 Building project..." -ForegroundColor Yellow
        npm run build 2>$null
        
        # Start server on specified port
        npx next dev -p $ServerPort
        
        return $true
    }
    catch {
        Write-Host "❌ Server crashed: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Main execution loop
for ($i = 1; $i -le $MaxRetries; $i++) {
    Write-Host "`n--- Attempt $i of $MaxRetries ---" -ForegroundColor Cyan
    
    # Stop existing processes
    Stop-ExistingProcesses
    
    # Check if port is free
    if (Check-Port -PortToCheck $Port) {
        Write-Host "⚠️ Port $Port still in use, waiting..." -ForegroundColor Yellow
        Start-Sleep -Seconds ($WaitSeconds * 2)
    }
    
    # Try to start server
    $Success = Start-DevServer -ServerPort $Port
    
    if ($Success) {
        Write-Host "✅ Server started successfully on http://localhost:$Port!" -ForegroundColor Green
        break
    } else {
        if ($i -lt $MaxRetries) {
            Write-Host "⏳ Retrying in $WaitSeconds seconds..." -ForegroundColor Yellow
            Start-Sleep -Seconds $WaitSeconds
        } else {
            Write-Host "💥 Failed to start server after $MaxRetries attempts!" -ForegroundColor Red
            Write-Host "🔧 Try different port: .\reliable-dev-server.ps1 -Port 3004" -ForegroundColor Yellow
        }
    }
}

Write-Host "`n📝 Next steps:" -ForegroundColor Cyan
Write-Host "- Open browser: http://localhost:$Port" -ForegroundColor Green
Write-Host "- Blog page: http://localhost:$Port/blog" -ForegroundColor Green
Write-Host "- New article: http://localhost:$Port/blog/smart-security-ai-2026" -ForegroundColor Green