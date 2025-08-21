const fs = require('fs');

try {
  // Read the PowerPoint file as binary
  const data = fs.readFileSync('attention_exercises.pptx');
  console.log('File size:', data.length, 'bytes');
  
  // Check if it's a valid ZIP file (PowerPoint files are ZIP archives)
  const zipSignature = data.slice(0, 4);
  console.log('ZIP signature:', zipSignature.toString('hex'));
  
  // Try to find text content by searching for common PowerPoint XML patterns
  const content = data.toString('utf8', 0, Math.min(data.length, 50000));
  
  // Look for slide content markers
  const slideMatches = content.match(/<p:sp[^>]*>[\s\S]*?<\/p:sp>/g) || [];
  console.log('Found', slideMatches.length, 'shape elements');
  
  // Look for text content
  const textMatches = content.match(/<a:t[^>]*>([^<]+)<\/a:t>/g) || [];
  console.log('Found', textMatches.length, 'text elements');
  
  if (textMatches.length > 0) {
    console.log('\nExtracted text content:');
    textMatches.slice(0, 20).forEach((match, i) => {
      const text = match.replace(/<[^>]+>/g, '');
      if (text.trim()) {
        console.log(`${i + 1}: ${text.trim()}`);
      }
    });
  }
  
  // Look for Arabic text patterns
  const arabicMatches = content.match(/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]+/g) || [];
  if (arabicMatches.length > 0) {
    console.log('\nFound Arabic text:');
    arabicMatches.slice(0, 10).forEach((text, i) => {
      console.log(`${i + 1}: ${text}`);
    });
  }
  
} catch (error) {
  console.error('Error reading file:', error.message);
}
