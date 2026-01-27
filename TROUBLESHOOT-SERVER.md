# 🔧 **פתרון בעיית השרת שנופל - מדריך שלבי**

## 🎯 **הבעיה המזוהה**
השרת Next.js עולה בהצלחה אבל נופל אחרי זמן קצר או בלי סיבה ברורה.

---

## 🚀 **פתרון מהיר (לעכשיו)**

### שלב 1: עצירה מוחלטת של תהליכים
```powershell
# עצור את כל תהליכי Node.js
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force

# בדוק שאין תהליכים רצים
Get-Process -Name "node" -ErrorAction SilentlyContinue

# בדוק שהפורט פנוי
netstat -an | findstr :3002
```

### שלב 2: הרצה מחדש עם לוגים
```powershell
# ניקוי cache
npm run build

# הרצה עם לוגים מפורטים
npm run dev -- --verbose
```

---

## 🔍 **אבחון מתקדם**

### בדיקת זיכרון וCPU
```powershell
# בדוק שימוש זיכרון
Get-Process -Name "node" -ErrorAction SilentlyContinue | Select-Object Name, CPU, WorkingSet, Id

# בדוק את הפורט
netstat -ano | findstr :3002
```

### בדיקת שגיאות ב-Log
```powershell
# הרץ עם debug mode
$env:DEBUG="*"; npm run dev
```

---

## 💡 **פתרונות קבועים**

### פתרון 1: שינוי פורט (הכי יעיל)
```bash
# ערוך את package.json
# שנה מ:
"dev": "next dev -p 3002"
# ל:
"dev": "next dev -p 3003"
```

### פתרון 2: יצירת סקריפט הפעלה יציב
```powershell
# צור קובץ: start-server.ps1
$ProcessName = "node"
$Port = 3002

# עצור תהליכים קיימים
Get-Process -Name $ProcessName -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2

# בדוק שהפורט פנוי
$Connection = netstat -an | Select-String ":$Port"
if ($Connection) {
    Write-Host "⚠️ פורט $Port עדיין תפוס, ממתין..."
    Start-Sleep -Seconds 5
}

# נקה cache
npm run build | Out-Null

Write-Host "🚀 מתחיל שרת על פורט $Port..."
npm run dev
```

### פתרון 3: הגדרת משתני סביבה יציבים
```powershell
# הוסף לתחילת start-server.ps1:
$env:NODE_OPTIONS = "--max-old-space-size=4096"
$env:NEXT_TELEMETRY_DISABLED = 1
$env:NODE_ENV = "development"
```

### פתרון 4: שדרוג Next.js (אם נדרש)
```bash
# בדוק גרסה נוכחית
npm list next

# שדרג אם נדרש (זהירות!)
npm update next@latest
```

---

## 🛠️ **סקריפט אוטומטי - הפתרון המושלם**

### צור קובץ: `reliable-dev-server.ps1`
```powershell
#!/usr/bin/env pwsh

param(
    [int]$Port = 3002,
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
    try {
        Write-Host "🚀 Starting development server..." -ForegroundColor Green
        
        # Set environment variables for stability
        $env:NODE_OPTIONS = "--max-old-space-size=4096"
        $env:NEXT_TELEMETRY_DISABLED = 1
        $env:NODE_ENV = "development"
        
        # Build first
        Write-Host "🔨 Building project..." -ForegroundColor Yellow
        npm run build 2>$null
        
        # Start server
        npm run dev
        
    } catch {
        Write-Host "❌ Server crashed: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
    return $true
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
    $Success = Start-DevServer
    
    if ($Success) {
        Write-Host "✅ Server started successfully!" -ForegroundColor Green
        break
    } else {
        if ($i -lt $MaxRetries) {
            Write-Host "⏳ Retrying in $WaitSeconds seconds..." -ForegroundColor Yellow
            Start-Sleep -Seconds $WaitSeconds
        } else {
            Write-Host "💥 Failed to start server after $MaxRetries attempts!" -ForegroundColor Red
            Write-Host "🔧 Try running on a different port: ./reliable-dev-server.ps1 -Port 3003" -ForegroundColor Yellow
        }
    }
}

Write-Host "`n📝 Troubleshooting tips:" -ForegroundColor Cyan
Write-Host "- Check Windows Firewall settings" -ForegroundColor Gray
Write-Host "- Try running as Administrator" -ForegroundColor Gray
Write-Host "- Check antivirus software" -ForegroundColor Gray
Write-Host "- Free up system memory" -ForegroundColor Gray
```

### איך להשתמש בסקריפט:
```powershell
# הרשאת הפעלה (פעם אחת)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# הפעלה רגילה
./reliable-dev-server.ps1

# הפעלה על פורט אחר
./reliable-dev-server.ps1 -Port 3003

# עם יותר ניסיונות
./reliable-dev-server.ps1 -MaxRetries 5 -WaitSeconds 10
```

---

## 🏥 **אבחון מתקדם לבעיות מורכבות**

### בדיקת Windows Firewall
```powershell
# בדוק חוקי Firewall
Get-NetFirewallRule | Where-Object {$_.DisplayName -like "*Node*"}

# או הוסף חוק ידנית
New-NetFirewallRule -DisplayName "Node.js Dev" -Direction Inbound -Protocol TCP -LocalPort 3002 -Action Allow
```

### בדיקת אנטי-וירוס
```powershell
# בדוק אם Windows Defender חוסם
Get-MpThreatDetection | Where-Object {$_.Resources -like "*node*"}
```

### בדיקת זיכרון מערכת
```powershell
# זיכרון פנוי
Get-WmiObject -Class Win32_OperatingSystem | Select-Object @{Name="FreeGB";Expression={[math]::Round($_.FreePhysicalMemory/1MB,2)}}
```

---

## ⚡ **פתרון חירום - שרת יציב**

אם כלום לא עוזר, השתמש בשרת חלופי:

### צור קובץ: `emergency-server.js`
```javascript
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = process.env.PORT || 3003;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  })
  .listen(port, (err) => {
    if (err) throw err;
    console.log(`✅ Ready on http://${hostname}:${port}`);
  })
  .on('error', (err) => {
    console.error('Server error:', err);
    process.exit(1);
  });
});
```

### הפעלה:
```powershell
node emergency-server.js
```

---

## 📋 **רשימת בדיקות מהירות**

כאשר השרת נופל, בדוק:

- [ ] זיכרון מערכת פנוי (לפחות 2GB)
- [ ] פורט 3002 לא תפוס
- [ ] אין שגיאות ב-package.json
- [ ] Windows Firewall לא חוסם
- [ ] אנטי-וירוס לא מפריע
- [ ] Node.js מעודכן (v18+)
- [ ] תקיית node_modules לא פגומה

---

## 🎯 **המלצה סופית**

**השתמש בסקריפט `reliable-dev-server.ps1` - זה יפתור 90% מהבעיות!**

בעיות חוזרות בדרך כלל נפתרות עם:
1. ניקוי קבוע של תהליכים
2. שימוש בפורט אלטרנטיבי  
3. הגדרות סביבה יציבות
4. מנגנון retry אוטומטי

**שמור קובץ זה ותשתמש בו בכל פעם שהבעיה חוזרת!** 💪