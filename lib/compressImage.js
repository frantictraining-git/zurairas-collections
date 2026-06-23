import imageCompression from 'browser-image-compression';

export async function compressImage(file) {
  const options = {
    maxSizeMB: 1,            // Target max file size
    maxWidthOrHeight: 1920,  // Resize oversized images
    useWebWorker: true,      // Non-blocking — keeps UI responsive
    fileType: 'image/webp',  // WebP gives best compression with quality
  };

  try {
    const compressed = await imageCompression(file, options);
    console.log(`Original:   ${(file.size / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Compressed: ${(compressed.size / 1024 / 1024).toFixed(2)} MB`);
    return compressed;
  } catch (err) {
    console.error('Compression failed:', err);
    throw err;
  }
}
