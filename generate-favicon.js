import { promises as fs } from 'fs';
import sharp from 'sharp';

async function generateFavicon() {
  try {
    // Convert SVG to PNG with transparent background
    await sharp('./public/favicon.svg')
      .resize(32, 32)
      .png()
      .toFile('./public/favicon.png');
    
    // Convert PNG to ICO
    await sharp('./public/favicon.png')
      .toFile('./public/favicon.ico');

    console.log('✅ Favicon generated successfully!');
  } catch (error) {
    console.error('❌ Error generating favicon:', error);
  }
}

generateFavicon();
