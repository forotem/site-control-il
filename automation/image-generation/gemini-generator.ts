import { GoogleGenerativeAI } from '@google/generative-ai';
import { promises as fs } from 'fs';
import path from 'path';

interface ImageGenerationRequest {
  prompt: string;
  outputPath: string;
  filename: string;
  width?: number;
  height?: number;
}

class GeminiImageGenerator {
  private genAI: GoogleGenerativeAI;
  
  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
  }
  
  async generateImage(request: ImageGenerationRequest): Promise<string> {
    console.log(`🎨 יוצר תמונה עם Gemini: ${request.filename}...`);
    
    try {
      // Note: As of now, Gemini doesn't have direct image generation
      // This is a placeholder for when the feature becomes available
      // For now, we'll create detailed prompts for external image generation tools
      
      const enhancedPrompt = this.enhancePrompt(request.prompt);
      
      // Create a detailed prompt file for external generation
      const promptData = {
        originalPrompt: request.prompt,
        enhancedPrompt: enhancedPrompt,
        specifications: {
          width: request.width || 1200,
          height: request.height || 675,
          style: 'photorealistic, professional, high-quality',
          elements: this.extractElements(request.prompt),
          colors: 'blue and white (Israeli tech colors)',
          lighting: 'professional, clean lighting',
          composition: 'centered, balanced composition'
        },
        additionalInstructions: this.generateAdditionalInstructions(request.prompt)
      };
      
      // Save prompt data for external generation
      const promptPath = path.join(request.outputPath, `${request.filename}-prompt.json`);
      await fs.mkdir(request.outputPath, { recursive: true });
      await fs.writeFile(promptPath, JSON.stringify(promptData, null, 2));
      
      // Create a placeholder image with text
      await this.createPlaceholder(request);
      
      console.log(`✅ נוצר prompt file ו-placeholder עבור: ${request.filename}`);
      return promptPath;
      
    } catch (error) {
      console.error('❌ שגיאה ביצירת תמונה:', error);
      throw error;
    }
  }
  
  private enhancePrompt(originalPrompt: string): string {
    const baseEnhancements = [
      'ultra-realistic, professional photography',
      '8K resolution, sharp details',
      'modern Israeli home or office setting',
      'clean, minimalist design aesthetic',
      'Hebrew text elements where appropriate',
      'blue and white color scheme representing Israeli technology',
      'professional lighting with soft shadows',
      'cinematic composition with depth of field'
    ];
    
    // Add context-specific enhancements based on prompt content
    let contextEnhancements: string[] = [];
    
    if (originalPrompt.toLowerCase().includes('security') || originalPrompt.toLowerCase().includes('camera')) {
      contextEnhancements = [
        'high-tech security cameras with LED indicators',
        'smart control panels with digital displays',
        'wireless technology elements',
        'modern architectural background',
        'subtle AI/technology visual elements'
      ];
    }
    
    if (originalPrompt.toLowerCase().includes('infographic') || originalPrompt.toLowerCase().includes('timeline')) {
      contextEnhancements = [
        'clean data visualization design',
        'progressive timeline elements',
        'modern chart and graph aesthetics',
        'professional business infographic style',
        'clear hierarchy and flow'
      ];
    }
    
    return `${originalPrompt}, ${[...baseEnhancements, ...contextEnhancements].join(', ')}`;
  }
  
  private extractElements(prompt: string): string[] {
    const elements = [];
    
    // Extract key elements from prompt
    if (prompt.includes('security')) elements.push('security cameras', 'control panels');
    if (prompt.includes('AI') || prompt.includes('smart')) elements.push('AI indicators', 'smart devices');
    if (prompt.includes('home') || prompt.includes('house')) elements.push('modern home interior');
    if (prompt.includes('Israeli')) elements.push('Israeli flag colors', 'Hebrew text');
    if (prompt.includes('infographic')) elements.push('charts', 'graphs', 'timeline');
    
    return elements;
  }
  
  private generateAdditionalInstructions(prompt: string): string[] {
    return [
      'Ensure all text in the image is in Hebrew when appropriate',
      'Use professional, business-grade aesthetic',
      'Include subtle Israeli tech industry references',
      'Maintain consistency with site branding (blue/white)',
      'Optimize for web display and mobile responsiveness',
      'Include proper contrast for accessibility'
    ];
  }
  
  private async createPlaceholder(request: ImageGenerationRequest): Promise<void> {
    const width = request.width || 1200;
    const height = request.height || 675;
    
    // Create SVG placeholder with enhanced design
    const svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#f0f9ff;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#e0f2fe;stop-opacity:1" />
        </linearGradient>
        <filter id="shadow">
          <feDropShadow dx="2" dy="2" stdDeviation="4" flood-color="#000" flood-opacity="0.1"/>
        </filter>
      </defs>
      
      <rect width="${width}" height="${height}" fill="url(#bgGradient)"/>
      
      <!-- Main content area -->
      <rect x="50" y="50" width="${width-100}" height="${height-100}" rx="12" fill="white" filter="url(#shadow)" stroke="#0070f3" stroke-width="2"/>
      
      <!-- Header -->
      <rect x="80" y="80" width="${width-160}" height="60" rx="8" fill="#0070f3"/>
      <text x="${width/2}" y="120" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" fill="white" font-weight="bold">
        ${request.filename.includes('hero') ? 'תמונת Hero' : 'אינפוגרפיק'}
      </text>
      
      <!-- Content placeholder -->
      <text x="${width/2}" y="${height/2 - 20}" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" fill="#0070f3">
        ${this.getPlaceholderText(request.prompt)}
      </text>
      
      <text x="${width/2}" y="${height/2 + 10}" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" fill="#666">
        ממתין ליצירה עם Gemini API
      </text>
      
      <!-- Instructions -->
      <text x="${width/2}" y="${height - 100}" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#888">
        השתמש ב-JSON prompt שנוצר לגנרציה עם Gemini/Midjourney/DALL-E
      </text>
      
      <!-- Tech elements -->
      <circle cx="150" cy="200" r="20" fill="#0070f3" opacity="0.3"/>
      <circle cx="${width-150}" cy="200" r="15" fill="#3b82f6" opacity="0.3"/>
      <rect x="120" y="${height-200}" width="60" height="40" rx="6" fill="#06b6d4" opacity="0.3"/>
      <rect x="${width-180}" y="${height-200}" width="60" height="40" rx="6" fill="#8b5cf6" opacity="0.3"/>
    </svg>`;
    
    const placeholderPath = path.join(request.outputPath, `${request.filename}.svg`);
    await fs.writeFile(placeholderPath, svg);
  }
  
  private getPlaceholderText(prompt: string): string {
    if (prompt.toLowerCase().includes('hero')) {
      return 'מערכות אבטחה חכמות 2026';
    }
    if (prompt.toLowerCase().includes('infographic')) {
      return 'התפתחות טכנולוגיית האבטחה';
    }
    return 'תוכן ויזואלי מקצועי';
  }
}

// Blog-specific image generation
export class BlogImageGenerator {
  private gemini: GeminiImageGenerator;
  
  constructor(apiKey: string) {
    this.gemini = new GeminiImageGenerator(apiKey);
  }
  
  async generateBlogImages(blogSlug: string): Promise<void> {
    console.log(`🎨 יוצר תמונות עבור בלוג: ${blogSlug}...`);
    
    const outputDir = path.join(process.cwd(), 'public', 'optimized-variants', 'blog', blogSlug);
    
    // Hero image - MORE IMPRESSIVE AND DETAILED
    const heroPrompt = `Cinematic ultra-realistic hero image for smart security AI system 2026:
    
    MAIN ELEMENTS:
    - Modern Israeli contemporary home interior, open living space with floor-to-ceiling windows
    - 4K security camera with blue LED indicator actively monitoring, mounted elegantly on white wall
    - Holographic AI display panel showing real-time analytics, facial recognition, threat detection
    - Multiple security feeds on sleek glass control panel with blue UI, showing different rooms
    - Smart lock on door illuminated with blue light, keyless entry system
    - Wireless router with smart home integration
    - Ambient lighting: cool blue and white LED accents throughout
    
    TECHNICAL DETAILS:
    - Professional cinematic lighting, volumetric lighting effects
    - Shallow depth of field, sharp focus on security system, blurred background
    - HDR imaging, ultra-high resolution, 8K quality
    - Modern minimalist Israeli tech aesthetic
    - Clean, sophisticated, trustworthy atmosphere
    - Hebrew text on displays (ניטור, אבטחה, AI)
    - Corporate professional photography style
    - High contrast, vibrant blues (#0070f3) and whites (#ffffff)`;
    
    await this.gemini.generateImage({
      prompt: heroPrompt,
      outputPath: outputDir,
      filename: 'hero-main',
      width: 1200,
      height: 675
    });
    
    // Infographic - MORE DATA AND INFORMATION RICH
    const infographicPrompt = `Professional data visualization infographic comparing traditional vs smart security (2020-2026):
    
    LEFT SIDE - TRADITIONAL SYSTEM (2020):
    - Basic motion detection sensor icon
    - Simple alarm bell
    - Manual monitoring symbol (person watching)
    - 90% false alarms statistic highlighted
    - No AI capability symbol
    - Limited smartphone access icon
    - Text: "זיהוי תנועה בסיסי | התראות לא מדויקות | ניטור ידני"
    
    MIDDLE - EVOLUTION ARROWS:
    - Progressive arrows showing 2021→2022→2023→2024→2025→2026
    - Upward trending line showing technology advancement
    
    RIGHT SIDE - SMART AI SYSTEM (2026):
    - Advanced AI chip icon with neural network visualization
    - Multiple security features: face recognition, object detection, anomaly detection
    - Smart integration icons: lights, locks, thermostats
    - <5% false alarms statistic with green checkmark
    - Real-time threat detection symbol with radar waves
    - Advanced mobile app interface preview
    - Text: "זיהוי AI מתקדם | ניתוח בזמן אמת | אוטומציה חכמה"
    
    STATISTICS DISPLAYED:
    - Cost savings: -30% insurance, +25% energy savings
    - Response time: 2 seconds vs manual hours
    - Accuracy: 95% vs 10%
    - Integration capability: 50+ smart devices
    
    DESIGN STYLE:
    - Blue (#0070f3) and white main colors
    - Green (#10b981) for improvements
    - Red (#ef4444) for problems
    - Professional financial infographic style
    - Israeli tech company aesthetic
    - All Hebrew labels and descriptions
    - Clear hierarchy and visual flow
    - High contrast, corporate modern design`;
    
    await this.gemini.generateImage({
      prompt: infographicPrompt,
      outputPath: outputDir,
      filename: 'infographic-timeline',
      width: 1200,
      height: 800
    });
    
    // Technology comparison chart - MORE DETAILED
    const comparisonPrompt = `Professional feature comparison infographic: Traditional Security vs Smart AI Security 2026
    
    TABLE LAYOUT - 6 KEY FEATURES:
    
    1. THREAT DETECTION:
       - Traditional: Basic motion sensor, high false alarms (image: simple sensor with error symbol)
       - Smart: AI object recognition, facial recognition, behavior analysis (image: neural network with checkmarks)
    
    2. FALSE ALARMS:
       - Traditional: 90% false alarms (red 90% circle chart)
       - Smart: <5% false alarms (green 5% circle chart)
    
    3. RESPONSE TIME:
       - Traditional: Hours to respond (slow clock icon)
       - Smart: 2-3 seconds automatic response (fast lightning bolt icon)
    
    4. INTEGRATION:
       - Traditional: Standalone system (isolated icon)
       - Smart: 50+ devices integration (network web diagram)
    
    5. MONITORING:
       - Traditional: Manual 24/7 watching (tired person icon)
       - Smart: Autonomous monitoring + instant alerts (robot with checkmark)
    
    6. LEARNING:
       - Traditional: Static rules (fixed gears)
       - Smart: Machine learning adapts (evolving neural network)
    
    DESIGN ELEMENTS:
    - Two-column layout: left vs right comparison
    - Blue (#0070f3) background with white cards
    - Green icons/text for smart advantages
    - Red icons/text for traditional limitations
    - Professional business presentation style
    - All text in Hebrew
    - Icons are clear, modern, flat design
    - Easy to scan and understand
    - Corporate tech company aesthetic
    - High quality, sharp, professional`;
    
    await this.gemini.generateImage({
      prompt: comparisonPrompt,
      outputPath: outputDir,
      filename: 'comparison-chart',
      width: 1000,
      height: 600
    });
    
    console.log(`✅ נוצרו prompt files ו-placeholders עבור ${blogSlug}`);
  }
  
  async generateInstructionsFile(blogSlug: string): Promise<void> {
    const outputDir = path.join(process.cwd(), 'public', 'optimized-variants', 'blog', blogSlug);
    
    const instructions = {
      blog: blogSlug,
      generatedAt: new Date().toISOString(),
      geminiAPI: 'https://ai.google.dev/gemini-api/docs/image-generation',
      instructions: [
        '1. נא להשתמש בקבצי ה-JSON שנוצרו עבור הפרומפטים המפורטים',
        '2. צור תמונות ב-Gemini API או כלי חלופי (Midjourney/DALL-E)',
        '3. שמור תמונות בפורמט WebP איכות גבוהה',
        '4. הרץ את מערכת האופטימיזציה אחרי יצירת התמונות',
        '5. בדוק שהתמונות מוצגות נכון באתר'
      ],
      nextSteps: [
        `npx ts-node automation/image-optimizer.ts ${blogSlug}`,
        'עדכן את נתיבי התמונות ברכיב הדף',
        'בדוק responsive design במכשירים שונים'
      ]
    };
    
    await fs.writeFile(
      path.join(outputDir, 'generation-instructions.json'),
      JSON.stringify(instructions, null, 2)
    );
  }
}

// Export for use in automation
export default GeminiImageGenerator;