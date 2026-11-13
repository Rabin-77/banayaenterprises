import { getAdminSessionPasskey } from './adminAuth';

/**
 * Resize and optimize an image file on a canvas so uploads are crisp,
 * fast to transfer, and never blow past browser or server payload limits.
 */
async function optimizeImageToDataUrl(file: File, maxDimension = 1200): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.onload = () => {
      const rawDataUrl = reader.result as string;
      const img = new Image();
      img.onerror = () => resolve(rawDataUrl);
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDimension || height > maxDimension) {
          if (width >= height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(rawDataUrl);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        const mime =
          file.type === 'image/png'
            ? 'image/png'
            : file.type === 'image/webp'
              ? 'image/webp'
              : 'image/jpeg';

        // Prefer compact WebP if original PNG is huge, otherwise preserve crisp quality
        let output = canvas.toDataURL(mime, 0.88);
        if (output.length > 450_000) {
          output = canvas.toDataURL('image/webp', 0.84);
        }
        resolve(output);
      };
      img.src = rawDataUrl;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Optimizes and uploads an image file to the Express server (/api/upload),
 * returning a lightweight persistent /uploads/... URL (or optimized data URL fallback).
 */
export async function uploadProductImage(file: File): Promise<string> {
  const optimizedDataUrl = await optimizeImageToDataUrl(file);

  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-passkey': getAdminSessionPasskey()
      },
      body: JSON.stringify({
        dataUrl: optimizedDataUrl,
        filename: file.name
      })
    });

    if (response.ok) {
      const result = (await response.json()) as { url?: string };
      if (result.url) {
        return result.url;
      }
    }
  } catch (err) {
    console.warn('Server upload failed, using optimized inline image fallback:', err);
  }

  return optimizedDataUrl;
}
