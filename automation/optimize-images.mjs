import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

async function walk(dir, fileList = []) {
  const files = await fs.readdir(dir);
  for (const file of files) {
    const stat = await fs.stat(path.join(dir, file));
    if (stat.isDirectory()) {
      fileList = await walk(path.join(dir, file), fileList);
    } else {
      fileList.push(path.join(dir, file));
    }
  }
  return fileList;
}

async function optimizeImages() {
  console.log('Starting image optimization...');
  
  const publicDir = path.join(process.cwd(), 'public');
  const files = await walk(publicDir);
  
  const imageFiles = files.filter(f => f.match(/\.(png|jpg|jpeg)$/i));
  console.log(`Found ${imageFiles.length} images.`);
  
  let convertedCount = 0;
  
  for (const file of imageFiles) {
    const stats = await fs.stat(file);
    
    // If file is > 500KB
    if (stats.size > 500 * 1024) {
      console.log(`Optimizing: ${file} (${(stats.size / 1024).toFixed(2)} KB)`);
      
      const parsed = path.parse(file);
      const webpPath = path.join(parsed.dir, `${parsed.name}.webp`);
      
      try {
        await sharp(file)
          .resize(1200, null, { withoutEnlargement: true })
          .webp({ quality: 80 })
          .toFile(webpPath);
          
        console.log(`Created: ${webpPath}`);
        
        // Remove original file after successful conversion
        await fs.unlink(file);
        convertedCount++;
      } catch (err) {
        console.error(`Failed to optimize ${file}:`, err);
      }
    }
  }
  
  console.log(`Optimization complete. Converted ${convertedCount} images.`);
}

optimizeImages().catch(console.error);
