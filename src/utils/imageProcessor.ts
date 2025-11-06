/**
 * Image processing utilities for NSP Forwarder
 * Handles image resizing and conversion to proper format
 */

export async function processImageForNSP(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      reject(new Error('Failed to get canvas context'));
      return;
    }
    
    img.onload = () => {
      canvas.width = 256;
      canvas.height = 256;
      
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      
      // Calculate scale to maintain aspect ratio while fitting within 256x256
      const scale = Math.min(256 / img.width, 256 / img.height);
      const x = (256 - img.width * scale) / 2;
      const y = (256 - img.height * scale) / 2;
      
      // Nintendo Switch requires black background for icons (specification requirement)
      // Icons are centered and scaled, with black filling any empty space
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, 256, 256);
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
      
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Failed to convert image to JPEG'));
          return;
        }
        resolve(blob);
      }, 'image/jpeg', 0.95);
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Process logo image (160x40)
 */
export async function processLogoForNSP(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      reject(new Error('Failed to get canvas context'));
      return;
    }
    
    img.onload = () => {
      canvas.width = 160;
      canvas.height = 40;
      
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      
      const scale = Math.min(160 / img.width, 40 / img.height);
      const x = (160 - img.width * scale) / 2;
      const y = (40 - img.height * scale) / 2;
      
      ctx.clearRect(0, 0, 160, 40);
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
      
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Failed to convert logo to PNG'));
          return;
        }
        resolve(blob);
      }, 'image/png', 1.0);
    };
    
    img.onerror = () => reject(new Error('Failed to load logo image'));
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Process startup animation (256x80 GIF)
 * Note: GIFs are returned as-is. For optimization, consider using gifsicle-wasm-browser
 */
export async function processAnimationForNSP(file: File): Promise<Blob> {
  return file;
}

