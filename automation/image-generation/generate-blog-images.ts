import { BlogImageGenerator } from './gemini-generator';

async function generateBlogImages() {
  // Note: You'll need to get a Gemini API key from Google AI Studio
  // For now, we'll create detailed prompts and placeholders
  const apiKey = process.env.GEMINI_API_KEY || 'placeholder-key';
  
  const generator = new BlogImageGenerator(apiKey);
  
  try {
    console.log('🚀 מתחיל יצירת תמונות לבלוג...');
    
    const blogSlug = 'smart-security-ai-2026';
    
    // Generate images and prompts
    await generator.generateBlogImages(blogSlug);
    
    // Create instructions file
    await generator.generateInstructionsFile(blogSlug);
    
    console.log('✅ הושלמה יצירת prompts ו-placeholders!');
    console.log('📋 בדוק את התקייה: public/optimized-variants/blog/smart-security-ai-2026/');
    console.log('🔗 לקבלת Gemini API key: https://ai.google.dev/');
    
  } catch (error) {
    console.error('❌ שגיאה ביצירת תמונות:', error);
  }
}

// Run if called directly
if (require.main === module) {
  generateBlogImages();
}

export default generateBlogImages;