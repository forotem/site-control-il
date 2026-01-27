require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs').promises;

async function testInfographic() {
  const apiKey = process.env.GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const prompt = `Create a professional Hebrew infographic about Israel's Privacy Protection Law 2026 (Amendment 13) for security cameras.

CRITICAL: All text must be in HEBREW (עברית) language!

Visual Structure:
- Clean, modern business infographic design
- Vertical flow with 3 main sections
- Professional color scheme: Blue, White, Orange accents
- White background
- Clear visual hierarchy

Hebrew Text Content:
Main Title: "חוק הגנת הפרטיות 2026 - תיקון 13"

3 Key Points (in Hebrew):
1. דרישות התקנה - Installation Requirements
2. זכויות הדיירים - Tenant Rights  
3. התאמה לחוק - Legal Compliance

Include:
- Security camera icons
- Shield/protection symbols
- Clean Hebrew typography (readable)
- Modern Israeli business style

Technical: 1200×800 pixels, professional quality`;

  try {
    console.log('🎨 Creating infographic with Nano Banana...');
    
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash-image' 
    });
    
    const result = await model.generateContent(prompt);
    const response = result.response;
    
    console.log('📦 Response received');
    console.log('Candidates:', response.candidates?.length);
    
    if (response.candidates && response.candidates[0]) {
      const parts = response.candidates[0].content.parts;
      console.log('Parts:', parts.length);
      
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        console.log(`Part ${i}:`, Object.keys(part));
        
        if (part.inlineData) {
          console.log('  - Mime type:', part.inlineData.mimeType);
          const imageData = Buffer.from(part.inlineData.data, 'base64');
          const outputPath = 'C:/Users/timel/Projects/site-control-il-new/public/blog-images/privacy-law-amendment-13-cameras-2026/infographic.png';
          await fs.writeFile(outputPath, imageData);
          console.log('✅ Infographic saved:', outputPath);
        } else if (part.text) {
          console.log('  - Text:', part.text.substring(0, 100));
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testInfographic();
