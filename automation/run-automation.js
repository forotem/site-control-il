#!/usr/bin/env node

const { exec } = require('child_process');
const path = require('path');

console.log('🚀 מתחיל אוטומציה ליצירת תוכן SEO מותאם...\n');

// הרצת האוטומציה
exec('node -r ts-node/register automation/content-automation.ts', { 
  cwd: process.cwd(),
  stdio: 'inherit'
}, (error, stdout, stderr) => {
  if (error) {
    console.error('❌ שגיאה בהרצת האוטומציה:', error);
    return;
  }
  
  if (stderr) {
    console.log('⚠️ אזהרות:', stderr);
  }
  
  if (stdout) {
    console.log(stdout);
  }
  
  console.log('\n✅ האוטומציה הושלמה!');
  console.log('📋 בדוק את app/blog/ עבור התוכן החדש');
  console.log('🖼️ בדוק את automation/ עבור הוראות תמונות');
});